import chalk from 'chalk'
import cors from 'cors'
import express from 'express'
import { slowDown } from 'express-slow-down'
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'
import {
	assertRootDir,
	cheapRateLimiter,
	errorHandler,
	expensiveRateLimiter,
	getVersionValidator,
	initGitRepos,
	loadConfig,
	loggerMiddleware as logger,
	MemCache,
	sendGitFile,
	sendGitTarball,
	updateGitRepo,
	userAgentEnforcer,
	verifySignature,
} from './utils.js'

const { hookSecret, port, rootDir } = loadConfig()
await assertRootDir(rootDir)
const gits = await initGitRepos(rootDir)
const cache = new MemCache(gits.mcmeta)

const versionRoute = express.Router({ mergeParams: true })
	.use(getVersionValidator(cache))
	.get('/block_states', cheapRateLimiter, async (req, res) => {
		const { version } = req.params
		await sendGitFile(req, res, gits.mcmeta, `${version}-summary`, 'blocks/data.json')
	})
	.get('/commands', cheapRateLimiter, async (req, res) => {
		const { version } = req.params
		await sendGitFile(req, res, gits.mcmeta, `${version}-summary`, 'commands/data.json')
	})
	.get('/registries', cheapRateLimiter, async (req, res) => {
		const { version } = req.params
		await sendGitFile(req, res, gits.mcmeta, `${version}-summary`, 'registries/data.json')
	})
	.get('/vanilla-assets-tiny/tarball', expensiveRateLimiter, async (req, res) => {
		const { version } = req.params
		await sendGitTarball(req, res, gits.mcmeta, `${version}-assets-tiny`)
	})
	.get('/vanilla-data/tarball', expensiveRateLimiter, async (req, res) => {
		const { version } = req.params
		await sendGitTarball(req, res, gits.mcmeta, `${version}-data`)
	})

const DELAY_AFTER = 150

const app = express()
	.set('trust proxy', 1)
	.use(cors({
		exposedHeaders: [
			'ETag',
			'RateLimit-Limit',
			'RateLimit-Remaining',
			'RateLimit-Reset',
			'Retry-After',
		],
	}))
	.use((_req, res, next) => {
		// 'max-age=0' instead of 'no-cache' is used, as 'no-cache' disallows the use of stale
		// response in cases where the origin server is unreachable.
		res.setHeader('Cache-Control', 'max-age=0')

		res.contentType('application/json')
		res.appendHeader('X-Content-Type-Options', 'nosniff')
		res.appendHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

		next()
	})
	.use(logger)
	.use(userAgentEnforcer)
	.use(slowDown({
		windowMs: 15 * 60 * 1000,
		delayAfter: DELAY_AFTER,
		delayMs: (hits) => (1.03 ** (hits - DELAY_AFTER) - 1) * 1000,
		keyGenerator: (req) => req.ip!.replace(/:\d+[^:]*$/, ''),
	}))
	.get('/mcje/versions', cheapRateLimiter, async (req, res) => {
		await sendGitFile(req, res, gits.mcmeta, 'summary', 'versions/data.json')
	})
	.use('/mcje/versions/:version', versionRoute)
	.get('/vanilla-mcdoc/symbols', cheapRateLimiter, async (req, res) => {
		await sendGitFile(req, res, gits['vanilla-mcdoc'], `generated`, 'symbols.json')
	})
	.get('/vanilla-mcdoc/tarball', expensiveRateLimiter, async (req, res) => {
		await sendGitTarball(req, res, gits['vanilla-mcdoc'], 'main', 'vanilla-mcdoc')
	})
	.post(
		'/hooks/github',
		expensiveRateLimiter,
		express.raw({ type: 'application/json' }),
		async (req, res) => {
			const signature = req.headers['x-hub-signature-256']
			if (typeof signature !== 'string') {
				return void res.status(400).send(JSON.stringify({ message: 'Missing signature' }))
			}
			if (!verifySignature(hookSecret, req.body, signature)) {
				return void res.status(401).send(JSON.stringify({ message: 'Invalid signature' }))
			}
			res.status(202).send(JSON.stringify({ message: 'Accepted' }))

			if (req.headers['x-github-event'] !== 'push') {
				return
			}

			const { repository: { name } } = JSON.parse(req.body.toString()) as {
				repository: { name: string }
			}
			assert(name === 'vanilla-mcdoc' || name === 'mcmeta')
			await updateGitRepo(name, gits[name])
			cache.invalidate()
		},
	)
	.get('/favicon.ico', cheapRateLimiter, (_req, res) => {
		res.contentType('image/x-icon')
		res.setHeader('Cache-Control', 'max-age=604800, public')
		res.sendFile(fileURLToPath(new URL('../favicon.ico', import.meta.url)))
	})
	.all('*catchall', cheapRateLimiter, (_req, res) => {
		res.status(404).send(
			JSON.stringify({
				message: 'Not Found. See https://spyglassmc.com/developer/web-api.html',
			}),
		)
	})
	.use(errorHandler)

app.listen(port, () => {
	console.info(chalk.blue(`Spyglass API server listening on ${port}...`))
})
