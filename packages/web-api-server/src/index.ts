import cors from 'cors'
import express, { type Request } from 'express'
import assert from 'node:assert'
import {
	assertRootDir,
	errorHandler,
	getVersionValidator,
	initGitRepos,
	loadConfig,
	loggerMiddleware as logger,
	MemCache,
	purgeCdnCache,
	sendGitFile,
	sendGitTarball,
	updateGitRepo,
	userAgentEnforcer,
	verifySignature,
} from './utils.js'

const { bunnyCdnApiKey, bunnyCdnPullZoneId, dir: rootDir, port,  webhookSecret } = loadConfig()
await assertRootDir(rootDir)
const gits = await initGitRepos(rootDir)
const cache = new MemCache(gits.mcmeta)

const DocUri = 'https://spyglassmc.com/developer/web-api.html'

const versionRoute = express.Router({ mergeParams: true })
	.use(getVersionValidator(cache))
	.get('/block_states', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitFile(req, res, gits.mcmeta, `${version}-summary`, 'blocks/data.json')
	})
	.get('/commands', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitFile(req, res, gits.mcmeta, `${version}-summary`, 'commands/data.json')
	})
	.get('/registries', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitFile(req, res, gits.mcmeta, `${version}-summary`, 'registries/data.json')
	})
	.get('/vanilla-assets-tiny/tarball', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitTarball(req, res, gits.mcmeta, `${version}-assets-tiny`)
	})
	.get('/vanilla-data/tarball', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitTarball(req, res, gits.mcmeta, `${version}-data`)
	})

const app = express()
	.set('trust proxy', 1)
	.use(cors({
		exposedHeaders: [
			'ETag',
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
	.get('/mcje/versions', async (req, res) => {
		await sendGitFile(req, res, gits.mcmeta, 'summary', 'versions/data.json')
	})
	.use('/mcje/versions/:version', versionRoute)
	.get('/vanilla-mcdoc/symbols', async (req, res) => {
		await sendGitFile(req, res, gits['vanilla-mcdoc'], `generated`, 'symbols.json')
	})
	.get('/vanilla-mcdoc/tarball', async (req, res) => {
		await sendGitTarball(req, res, gits['vanilla-mcdoc'], 'main', 'vanilla-mcdoc')
	})
	.post(
		'/hooks/github',
		express.raw({ type: 'application/json' }),
		async (req, res) => {
			const signature = req.headers['x-hub-signature-256']
			if (typeof signature !== 'string') {
				return void res.status(400).send(JSON.stringify({ message: 'Missing signature' }))
			}
			if (!verifySignature(webhookSecret, req.body, signature)) {
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
			await purgeCdnCache(bunnyCdnApiKey, bunnyCdnPullZoneId)
		},
	)
	.get('/', (_req, res) => {
		res.redirect(DocUri)
	})
	.all('*catchall', (_req, res) => {
		res.status(404).send(JSON.stringify({ message: `Not Found. See ${DocUri}` }))
	})
	.use(errorHandler)

app.listen(port, () => {
	console.info(`Spyglass API server listening on ${port}...`)
})
