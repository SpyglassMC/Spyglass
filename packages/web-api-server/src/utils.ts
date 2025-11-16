import { Mutex } from 'async-mutex'
import type { NextFunction, Request, Response } from 'express'
import { type ChildProcess, execFile as execFileCallback, spawn } from 'node:child_process'
import { createHmac, timingSafeEqual } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { Writable } from 'node:stream'
import { promisify } from 'node:util'
import type { Logger } from 'pino'

const execFile = promisify(execFileCallback)
const gitMutexes = new Map<string, Mutex>()

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

function createLoggerStream(
	repo: string,
	fd: 'stdout' | 'stderr',
	logger: Logger,
	level: 'debug' | 'error' | 'info',
) {
	return new Writable({
		write(chunk, _encoding, callback) {
			logger[level]({ repo, fd }, chunk.toString().trimEnd())
			callback()
		},
	})
}

function pipeChildStdioToLogger(repo: string, child: ChildProcess, logger: Logger) {
	child.stdout?.pipe(createLoggerStream(repo, 'stdout', logger, 'debug'))
	child.stderr?.pipe(createLoggerStream(repo, 'stderr', logger, 'debug'))
}

function pipeChildStdioToResponse(repo: string, child: ChildProcess, res: Response) {
	child.stdout?.pipe(res)
	child.stderr?.pipe(createLoggerStream(repo, 'stderr', res.log, 'error'))
}

function childProcessExits(child: ChildProcess) {
	return new Promise((resolve) => child.on('exit', resolve))
}

/**
 * Ensures the local git repositories exist and returns a simple-git instance, a mutex, and the
 * directory path for each of the local repos.
 */
export async function initGitRepos(logger: Logger, rootDir: string) {
	async function initGitRepo(owner: string, repo: string) {
		const repoDir = path.join(rootDir, repo)
		try {
			await fs.access(repoDir)
			logger.info({ owner, repo }, 'Already cloned')
			await updateGitRepo(logger, repo, repoDir)
		} catch (e) {
			if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
				logger.info({ owner, repo }, 'Cloning...')
				const clonerChild = spawn(
					'git',
					['clone', `git@github.com:${owner}/${repo}.git`, repoDir, '--mirror', '--progress'],
				)
				pipeChildStdioToLogger(repo, clonerChild, logger)
				await childProcessExits(clonerChild)

				// Make sure 'git repack' doesn't take up all RAM for mcmeta.
				// https://stackoverflow.com/a/4829883
				let configChild = spawn(
					'git',
					['config', 'pack.windowMemory', '10m'],
					{ cwd: repoDir },
				)
				pipeChildStdioToLogger(repo, configChild, logger)
				await childProcessExits(configChild)

				configChild = spawn(
					'git',
					['config', 'pack.packSizeLimit', '20m'],
					{ cwd: repoDir },
				)
				pipeChildStdioToLogger(repo, configChild, logger)
				await childProcessExits(configChild)

				logger.info({ owner, repo }, 'Cloned')
			} else {
				throw e
			}
		}
		return repoDir
	}

	const [mcmeta, vanillaMcdoc] = await Promise.all([
		initGitRepo('misode', 'mcmeta'),
		initGitRepo('SpyglassMC', 'vanilla-mcdoc'),
	])

	return {
		mcmeta,
		'vanilla-mcdoc': vanillaMcdoc,
	}
}

export async function updateGitRepo(logger: Logger, repo: string, repoDir: string) {
	await getGitMutex(repo).runExclusive(async () => {
		logger.debug({ repo }, 'Updating...')
		const child = spawn('git', ['remote', 'update', '--prune'], {
			cwd: repoDir,
		})
		pipeChildStdioToLogger(repo, child, logger)
		await childProcessExits(child)
		logger.debug({ repo }, 'Updated')
	})
}

function getGitMutex(repo: string): Mutex {
	if (gitMutexes.has(repo)) {
		return gitMutexes.get(repo)!
	}

	const mutex = new Mutex()
	gitMutexes.set(repo, mutex)
	return mutex
}

export async function sendGitFile(
	req: Request,
	res: Response,
	repoDir: string,
	branch: string,
	filePath: string,
) {
	const hash = (await execFile(
		'git',
		['log', '--format=%H', '-1', branch, '--', filePath],
		{ cwd: repoDir },
	)).stdout.trim()
	// Git commit sha is a [weak validator](https://datatracker.ietf.org/doc/html/rfc2616#section-3.11),
	// since the same value is used for different representations of the same resource (e.g. gzip
	// compressed v.s. no compression). It can only guarantee semantic equivalence, not byte-for-byte
	// equivalence.
	const etag = `W/"${hash}"`
	res.setHeader('ETag', etag)
	if (req.headers['if-none-match'] === etag) {
		res.status(304).end()
		return
	}

	const child = spawn(
		'git',
		['show', `${branch}:${filePath}`],
		{ cwd: repoDir },
	)
	pipeChildStdioToResponse(repoDir, child, res)
	await childProcessExits(child)
}

export async function sendGitTarball(
	req: Request,
	res: Response,
	repoDir: string,
	branch: string,
	fileName = branch,
) {
	const hash = (await execFile(
		'git',
		['log', '--format=%H', '-1', branch],
		{ cwd: repoDir },
	)).stdout.trim()
	// See comments in sendGitFile() for why this is a weak validator.
	const etag = `W/"${hash}"`
	res.setHeader('ETag', etag)
	if (req.headers['if-none-match'] === etag) {
		res.status(304).end()
		return
	}

	res
		.type('application/gzip')
		.attachment(`${fileName}.tar.gz`)

	const child = spawn(
		'git',
		['archive', '--format=tar.gz', branch],
		{ cwd: repoDir },
	)
	pipeChildStdioToResponse(repoDir, child, res)
	await childProcessExits(child)
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

export function systemdNotify(variable: string) {
	return execFile('systemd-notify', [`${variable}=1`])
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

	constructor(private readonly mcmetaDir: string) {}

	async getVersions() {
		if (!this.#versions) {
			const content = (await execFile(
				'git',
				['show', 'summary:versions/data.json'],
				{ cwd: this.mcmetaDir, maxBuffer: 10_000_000 },
			)).stdout
			this.#versions = JSON.parse(content) as { id: string }[]
		}
		return this.#versions
	}

	invalidate() {
		this.#versions = undefined
	}
}
