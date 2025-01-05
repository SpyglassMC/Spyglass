import chalk from 'chalk'
import { createHmac, timingSafeEqual } from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'
import simpleGit from 'simple-git'
import type { SimpleGit } from 'simple-git'

export function loadConfig() {
	if (
		!(process.env.SPYGLASSMC_API_SERVER_DIR && process.env.SPYGLASSMC_API_SERVER_WEBHOOK_SECRET)
	) {
		throw new Error(
			'Expected environmental variable SPYGLASSMC_API_SERVER_DIR, SPYGLASSMC_API_SERVER_WEBHOOK_SECRET',
		)
	}
	const hookSecret = process.env.SPYGLASSMC_API_SERVER_WEBHOOK_SECRET
	const rootDir = path.resolve(process.env.SPYGLASSMC_API_SERVER_DIR)
	const port = parseInt(process.env.SPYGLASSMC_API_SERVER_PORT ?? '3003')
	return { hookSecret, port, rootDir }
}

export async function assertRootDir(rootDir: string) {
	try {
		console.info(chalk.blue(`Root dir: ${rootDir}`))
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
export async function initGitRepos(rootDir: string) {
	const gitCloner = simpleGit({})
		.outputHandler((_command, stdout, stderr) => {
			stdout.pipe(process.stdout)
			stderr.pipe(process.stderr)
		})

	async function initGitRepo(owner: string, repo: string) {
		const repoDir = path.join(rootDir, repo)
		if (await doesPathExist(repoDir)) {
			console.info(chalk.green(`Repo ${owner}/${repo} already cloned.`))
		} else {
			console.info(chalk.yellow(`Cloning ${owner}/${repo}...`))
			await gitCloner.clone(
				`git@github.com:${owner}/${repo}.git`,
				path.join(rootDir, repo),
				['--mirror', '--progress'],
			)
			console.info(chalk.green(`Repo ${owner}/${repo} cloned.`))
		}

		return simpleGit({ baseDir: repoDir }).outputHandler(defaultOutputHandler)
	}

	return {
		mcmeta: await initGitRepo('misode', 'mcmeta'),
		mcdoc: await initGitRepo('SpyglassMC', 'vanilla-mcdoc'),
	}
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
		await rateLimiter.reward(req.ip!, CHEAP_REQUEST_POINTS)
	} else {
		git.outputHandler((_command, stdout, stderr) => {
			stdout.pipe(res)
			stderr.pipe(process.stderr)
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
		await rateLimiter.reward(req.ip!, EXPENSIVE_REQUEST_POINTS)
	} else {
		res.contentType('application/gzip')
		res.appendHeader('Content-Disposition', `attachment; filename="${fileName}.tar.gz"`)
		git.outputHandler((_command, stdout, stderr) => {
			stdout.pipe(res)
			stderr.pipe(process.stderr)
		})
		try {
			await git.raw(['archive', '--format=tar.gz', branch])
		} finally {
			git.outputHandler(defaultOutputHandler)
		}
	}
}

export function verifySignature(secret: string, payload: Buffer, signature: string) {
	try {
		const actualSignature = createHmac('sha256', secret).update(payload).digest()
		const givenSignature = Buffer.from(signature.replace(/^sha256=/, ''), 'hex')
		return timingSafeEqual(actualSignature, givenSignature)
	} catch (e: any) {
		console.error(chalk.red('verifySignature', e.stack))
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

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const start = new Date()
	console.info(
		chalk.yellow(
			`[${start.toISOString()}] ${req.method} ${req.path} by ${req.ip} - ${
				req.headers['user-agent']
			}...`,
		),
	)
	res.contentType('application/json')
	res.on('finish', () => {
		const end = new Date()
		const message =
			`[${end.toISOString()}] ${req.method} ${req.path} by ${req.ip} - ${res.statusCode} - ${
				end.getTime() - start.getTime()
			}ms`
		console.info(res.statusCode < 400 ? chalk.green(message) : chalk.red(message))
	})
	next()
}

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) {
		return next(err)
	}
	console.error(chalk.red(err.stack))
	res.status(500).send(JSON.stringify({ message: err.message }))
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

const rateLimiter = new RateLimiterMemory({
	duration: 3600,
	points: 100,
})

const getRateLimiter =
	(points: number) => async (req: Request, res: Response, next: NextFunction) => {
		res.appendHeader('RateLimit-Limit', '100')
		try {
			const result = await rateLimiter.consume(req.ip!, points)
			res.appendHeader('RateLimit-Remaining', `${result.remainingPoints}`)
			next()
		} catch (e) {
			if (e instanceof RateLimiterRes) {
				res.appendHeader('RateLimit-Remaining', `${e.remainingPoints}`)
				res.appendHeader('Retry-After', `${Math.round(e.msBeforeNext / 1000)}`)
			}
			res.status(429).send(
				JSON.stringify({
					message: 'Too Many Requests. Check the RateLimit headers for details.',
				}),
			)
		}
	}

const CHEAP_REQUEST_POINTS = 1
const EXPENSIVE_REQUEST_POINTS = 5

export const cheapRateLimiter = getRateLimiter(CHEAP_REQUEST_POINTS)
export const expensiveRateLimiter = getRateLimiter(EXPENSIVE_REQUEST_POINTS)

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
