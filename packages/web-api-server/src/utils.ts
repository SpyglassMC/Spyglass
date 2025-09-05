import { Mutex } from 'async-mutex'
import { createHmac, timingSafeEqual } from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import type { Logger } from 'pino'
import simpleGit from 'simple-git'
import type { SimpleGit } from 'simple-git'
import { Transform } from 'stream'

const gitMutex = new Mutex()

interface Config {
	bunnyCdnApiKey: string
	bunnyCdnPullZoneId: string
	discordLogWebhook?: string
	dir: string
	webhookSecret: string
	port?: number
	[key: string]: string | number | undefined
}

export function loadConfig() {
	const PREFIX = 'SPYGLASSMC_API_SERVER_'
	const REQUIRED = ['bunnyCdnApiKey', 'bunnyCdnPullZoneId', 'dir', 'webhookSecret'] as const

	const config = Object.create(null) as Config

	for (const [k, v] of Object.entries(process.env)) {
		if (k.startsWith(PREFIX)) {
			const camelKey = k
				.slice(PREFIX.length)
				.toLowerCase()
				.replace(/(_)(\w)/g, ([_, c]) => c.toUpperCase())
			config[camelKey] = v
		}
	}

	const missing = REQUIRED.filter(k => !(k in config))
	if (missing.length) {
		throw new Error(
			`Expected environmental variables: ${
				missing
					.map(camelKey => PREFIX + camelKey.replace(/([A-Z])/g, '_$1').toUpperCase())
					.join(', ')
			}`,
		)
	}

	config.port = Number(config.port ?? 3003)

	return config
}

export async function assertRootDir(rootDir: string) {
	try {
		const result = await fs.stat(rootDir)
		if (!result.isDirectory()) {
			throw new Error('Not a directory')
		}
	} catch (e) {
		throw new Error('Root dir error', { cause: e })
	}
}

async function doesPathExist(path: string) {
	try {
		await fs.stat(path)
		return true
	} catch {
		return false
	}
}

function createErrorStream(logger: Logger) {
	return new Transform({
		transform(chunk, _encoding, callback) {
			logger.error(chunk.toString().trimEnd())
			callback()
		},
	})
}

const defaultOutputHandler = (
	_command: string,
	_stdout: NodeJS.ReadableStream,
	stderr: NodeJS.ReadableStream,
) => {
	stderr.pipe(process.stderr)
}

/**
 * Ensures the local git repositories exist and returns a simple-git instance, a mutex, and the
 * directory path for each of the local repos.
 */
export async function initGitRepos(logger: Logger, rootDir: string) {
	const gitCloner = simpleGit({})
		.outputHandler((_command, stdout, stderr) => {
			stdout.pipe(process.stdout)
			stderr.pipe(process.stderr)
		})

	async function initGitRepo(owner: string, repo: string) {
		const repoDir = path.join(rootDir, repo)
		const repoGit = simpleGit({ baseDir: repoDir }).outputHandler(defaultOutputHandler)
		if (await doesPathExist(repoDir)) {
			logger.debug({ owner, repo }, 'Already cloned')
			await updateGitRepo(logger, repo, repoGit)
		} else {
			logger.debug({ owner, repo }, 'Cloning...')
			await gitCloner.clone(
				`git@github.com:${owner}/${repo}.git`,
				path.join(rootDir, repo),
				['--mirror', '--progress'],
			)
			logger.debug({ owner, repo }, 'Cloned')
		}
		return repoGit
	}

	return {
		mcmeta: await initGitRepo('misode', 'mcmeta'),
		'vanilla-mcdoc': await initGitRepo('SpyglassMC', 'vanilla-mcdoc'),
	}
}

export async function updateGitRepo(logger: Logger, name: string, git: SimpleGit) {
	await gitMutex.runExclusive(async () => {
		logger.debug({ repo: name }, 'Updating...')
		await git.remote(['update', '--prune'])
		logger.debug({ repo: name }, 'Updated')
	})
}

export async function sendGitFile(
	req: Request,
	res: Response,
	git: SimpleGit,
	branch: string,
	path: string,
) {
	const hash = (await git.log(['--format=%H', '-1', branch, '--', path])).latest!.hash
	// Git commit sha is a [weak validator](https://datatracker.ietf.org/doc/html/rfc2616#section-3.11),
	// since the same value is used for different representations of the same resource (e.g. gzip
	// compressed v.s. no compression). It can only guarantee semantic equivalence, not byte-for-byte
	// equivalence.
	const etag = `W/"${hash}"`
	res.setHeader('ETag', etag)
	if (req.headers['if-none-match'] === etag) {
		res.status(304).end()
	} else {
		git.outputHandler((_command, stdout, stderr) => {
			stdout.pipe(res)
			stderr.pipe(createErrorStream(req.log))
		})
		try {
			await git.show(`${branch}:${path}`)
		} finally {
			git.outputHandler(defaultOutputHandler)
		}
	}
}

export async function sendGitTarball(
	req: Request,
	res: Response,
	git: SimpleGit,
	branch: string,
	fileName = branch,
) {
	const hash = (await git.log(['--format=%H', '-1', branch])).latest!.hash
	// See comments in sendGitFile() for why this is a weak validator.
	const etag = `W/"${hash}"`
	res.setHeader('ETag', etag)
	if (req.headers['if-none-match'] === etag) {
		res.status(304).end()
	} else {
		res.contentType('application/gzip')
		res.appendHeader('Content-Disposition', `attachment; filename="${fileName}.tar.gz"`)
		git.outputHandler((_command, stdout, stderr) => {
			stdout.pipe(res)
			stderr.pipe(createErrorStream(req.log))
		})
		try {
			await git.raw(['archive', '--format=tar.gz', branch])
		} finally {
			git.outputHandler(defaultOutputHandler)
		}
	}
}

export function verifySignature(
	logger: Logger,
	secret: string,
	payload: Buffer,
	signature: string,
) {
	try {
		const actualSignature = createHmac('sha256', secret).update(payload).digest()
		const givenSignature = Buffer.from(signature.replace(/^sha256=/, ''), 'hex')
		return timingSafeEqual(actualSignature, givenSignature)
	} catch (e: any) {
		logger.warn('Failed signature verification')
		return false
	}
}

export const userAgentEnforcer = (req: Request, res: Response, next: NextFunction) => {
	if (req.headers['user-agent']) {
		return next()
	}

	res.status(400).send(JSON.stringify({
		message: 'All requests must have a User-Agent header identifying the client',
	}))
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	req.log.error(err)
	if (res.headersSent) {
		return next(err)
	}
	res.status(500).send(JSON.stringify({ message: err.message }))
}

export async function purgeCdnCache(apiKey: string, pullZoneId: string) {
	const uri = `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`
	const response = await fetch(uri, {
		method: 'POST',
		headers: {
			'AccessKey': apiKey,
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
	if (!response.ok) {
		throw new Error(`Error status: ${response.status} ${response.statusText}`)
	}
}

export const getVersionValidator =
	(cache: MemCache) => async (req: Request, res: Response, next: NextFunction) => {
		const { version } = req.params
		const versions = await cache.getVersions()
		const entry = versions.find((v: any) => v.id === req.params.version)
		if (entry) {
			next()
		} else {
			res.status(404).send(JSON.stringify({ message: `Unknown version '${version}'` }))
		}
	}

export class MemCache {
	#versions: { id: string }[] | undefined

	constructor(private readonly mcmetaGit: SimpleGit) {}

	async getVersions() {
		if (!this.#versions) {
			this.#versions = JSON.parse(await this.mcmetaGit.show('summary:versions/data.json')) as {
				id: string
			}[]
		}
		return this.#versions
	}

	invalidate() {
		this.#versions = undefined
	}
}
