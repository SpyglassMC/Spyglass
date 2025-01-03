import chalk from 'chalk'
import cors from 'cors'
import express from 'express'
import { slowDown } from 'express-slow-down'
import { fileURLToPath } from 'url'
import {
	assertRootDir,
	cheapRateLimiter,
	errorHandler,
	expensiveRateLimiter,
	getVersionValidator,
	initGitRepos,
	loadConfig,
	loggerMiddleware as logger,
	sendGitFile,
	sendGitTarball,
	userAgentEnforcer,
	verifySignature,
} from './utils.js'

const { hookSecret, port, rootDir } = loadConfig()
await assertRootDir(rootDir)
const repos = await initGitRepos(rootDir)

const versionRoute = express.Router({ mergeParams: true })
	.use(getVersionValidator(repos.summary.git))
	.get('/block_states', cheapRateLimiter, async (req, res) => {
		const { version } = req.params
		const { git } = repos.summary
		await sendGitFile(req, res, git, `${version}-summary`, 'blocks/data.json')
	})
	.get('/commands', cheapRateLimiter, async (req, res) => {
		const { version } = req.params
		const { git } = repos.summary
		await sendGitFile(req, res, git, `${version}-summary`, 'commands/data.json')
	})
	.get('/registries', cheapRateLimiter, async (req, res) => {
		const { version } = req.params
		const { git } = repos.summary
		await sendGitFile(req, res, git, `${version}-summary`, 'registries/data.json')
	})
	.get('/vanilla-assets-tiny/tarball', expensiveRateLimiter, async (req, res) => {
		const { version } = req.params
		const { git, mutex, repoDir } = repos.assets
		await sendGitTarball(req, res, git, mutex, repoDir, `${version}-assets-tiny`)
	})
	.get('/vanilla-data/tarball', expensiveRateLimiter, async (req, res) => {
		const { version } = req.params
		const { git, mutex, repoDir } = repos.data
		await sendGitTarball(req, res, git, mutex, repoDir, `${version}-data`)
	})

const app = express()
	.set('trust proxy', 1)
	.set('etag', 'strong')
	.use(cors({
		exposedHeaders: [
			'ETag',
			'RateLimit-Limit',
			'RateLimit-Remaining',
			'Retry-After',
		],
	}))
	.use(logger)
	.use(userAgentEnforcer)
	.use(slowDown({
		windowMs: 15 * 60 * 1000,
		delayAfter: 20,
		delayMs: (hits) => (1.03 ** (hits - 20) - 1) * 1000,
		keyGenerator: (req) => req.ip!.replace(/:\d+[^:]*$/, ''),
	}))
	.get('/mcje/versions', cheapRateLimiter, async (req, res) => {
		const { git } = repos.summary
		await sendGitFile(req, res, git, 'summary', 'versions/data.json')
	})
	.use('/mcje/versions/:version', versionRoute)
	.get('/vanilla-mcdoc/symbols', cheapRateLimiter, async (req, res) => {
		const { git } = repos.mcdoc
		await sendGitFile(req, res, git, `generated`, 'symbols.json')
	})
	.get('/vanilla-mcdoc/tarball', expensiveRateLimiter, async (req, res) => {
		const { git, mutex, repoDir } = repos.mcdoc
		await sendGitTarball(req, res, git, mutex, repoDir, 'main', 'vanilla-mcdoc')
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

			// if (req.headers['x-github-event'] !== 'push') {
			// 	return
			// }

			const { repository: { name } } = JSON.parse(req.body.toString()) as {
				repository: { name: string }
			}
			const reposToUpdate = name === 'mcmeta'
				? [repos.assets, repos.data, repos.summary]
				: name === 'vanilla-mcdoc'
				? [repos.mcdoc]
				: []
			for (const { git, mutex, repoDir } of reposToUpdate) {
				await mutex.runExclusive(async () => {
					console.info(chalk.yellow(`Pulling into ${repoDir}...`))
					await git.pull()
					console.info(chalk.green(`Pulled into ${repoDir}`))
				})
			}
		},
	)
	.get('/favicon.ico', cheapRateLimiter, (_req, res) => {
		res.contentType('image/x-icon')
		res.appendHeader('Cache-Control', 'public, max-age=604800')
		res.sendFile(fileURLToPath(new URL('../favicon.ico', import.meta.url)))
	})
	.all('*catchall', cheapRateLimiter, (_req, res) => {
		res.status(404).send(
			JSON.stringify({ message: 'Not Found. See https://spyglassmc.com/developer/api.html.' }),
		)
	})
	.use(errorHandler)

app.listen(port, () => {
	console.info(chalk.blue(`Spyglass API server listening on ${port}...`))
})
