import cors from 'cors'
import express, { type Request } from 'express'
import assert from 'node:assert/strict'
import pino from 'pino'
import pinoHttp from 'pino-http'
import {
	assertRootDir,
	errorHandler,
	getVersionValidator,
	initGitRepos,
	loadConfig,
	MemCache,
	purgeCdnCache,
	sendGitFile,
	sendGitTarball,
	systemdNotify,
	updateGitRepo,
	userAgentEnforcer,
	verifySignature,
} from './utils.js'

const { bunnyCdnApiKey, bunnyCdnPullZoneId, dir: rootDir, discordLogWebhook, port, webhookSecret } =
	loadConfig()

const logger = pino({
	level: 'debug',
	transport: {
		targets: [
			{
				level: 'debug',
				target: 'pino/file',
				options: { destination: 1 },
			},
			...discordLogWebhook
				? [{
					level: 'info',
					target: 'pino-discord-webhook',
					options: { webhookURL: discordLogWebhook },
				}]
				: [],
		],
	},
})

process
	.on('unhandledRejection', (r) => {
		logger.fatal(r, 'unhandledRejection')
		process.exit(1)
	})
	.on('uncaughtException', (e) => {
		logger.fatal(e, 'uncaughtException')
		process.exit(1)
	})
	.on('SIGABRT', (sig) => {
		logger.fatal(sig)
	})
	.on('SIGHUP', (sig) => {
		logger.fatal(sig)
	})
	.on('SIGQUIT', (sig) => {
		logger.fatal(sig)
	})
	.on('SIGTERM', (sig) => {
		logger.fatal(sig)
	})

await assertRootDir(rootDir)

const repoDirs = await initGitRepos(logger, rootDir)
const cache = new MemCache(repoDirs.mcmeta)

const DOC_URI = 'https://spyglassmc.com/developer/web-api.html'
const MAX_REQUST_BODY_SIZE = '2MB'
const WATCHDOG_INTERVAL_MS = 25_000

const versionRoute = express.Router({ mergeParams: true })
	.use(getVersionValidator(cache))
	.get('/block_states', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitFile(req, res, repoDirs.mcmeta, `${version}-summary`, 'blocks/data.json')
	})
	.get('/commands', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitFile(req, res, repoDirs.mcmeta, `${version}-summary`, 'commands/data.json')
	})
	.get('/registries', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitFile(req, res, repoDirs.mcmeta, `${version}-summary`, 'registries/data.json')
	})
	.get('/vanilla-assets-tiny/tarball', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitTarball(req, res, repoDirs.mcmeta, `${version}-assets-tiny`)
	})
	.get('/vanilla-data/tarball', async (req: Request<{ version: string }>, res) => {
		const { version } = req.params
		await sendGitTarball(req, res, repoDirs.mcmeta, `${version}-data`)
	})

const app = express()
	.set('trust proxy', 2)
	.use(pinoHttp({ logger, useLevel: 'debug' }))
	.use(cors({
		exposedHeaders: ['ETag'],
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
	.use(userAgentEnforcer)
	.get('/mcje/versions', async (req, res) => {
		await sendGitFile(req, res, repoDirs.mcmeta, 'summary', 'versions/data.json')
	})
	.use('/mcje/versions/:version', versionRoute)
	.get('/vanilla-mcdoc/symbols', async (req, res) => {
		await sendGitFile(req, res, repoDirs['vanilla-mcdoc'], `generated`, 'symbols.json')
	})
	.get('/vanilla-mcdoc/tarball', async (req, res) => {
		await sendGitTarball(req, res, repoDirs['vanilla-mcdoc'], 'main', 'vanilla-mcdoc')
	})
	.post(
		'/hooks/github',
		express.raw({ type: 'application/json', limit: MAX_REQUST_BODY_SIZE }),
		async (req, res) => {
			const signature = req.headers['x-hub-signature-256']
			if (typeof signature !== 'string') {
				return void res.status(400).send(JSON.stringify({ message: 'Missing signature' }))
			}
			if (!verifySignature(req.log, webhookSecret, req.body, signature)) {
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
			req.log.debug({ repo: name }, `Received GitHub push event`)
			await updateGitRepo(req.log, name, repoDirs[name])
			cache.invalidate()
			await purgeCdnCache(bunnyCdnApiKey, bunnyCdnPullZoneId)
			req.log.debug('Purged CDN cache')
		},
	)
	.get('/', (_req, res) => {
		res.redirect(DOC_URI)
	})
	.all('*catchall', (_req, res) => {
		res.status(404).send(JSON.stringify({ message: `Not Found. See ${DOC_URI}` }))
	})
	.use(errorHandler)

app.listen(port, () => {
	logger.info({ port, rootDir }, 'Spyglass API server started')
	if (process.env.NOTIFY_SOCKET) {
		systemdNotify('READY').catch((e) => logger.error(e, 'systemd-notify error'))
	}
})

if (process.env.NOTIFY_SOCKET) {
	setInterval(async () => {
		try {
			const data = await (await fetch(`http://localhost:${port}/mcje/versions`)).json()
			assert(data instanceof Array && data.length > 0 && typeof data[0].id === 'string')
			systemdNotify('WATCHDOG').catch((e) => logger.error(e, 'systemd-notify error'))
		} catch (e) {
			logger.error(e, 'Watchdog failure')
		}
	}, WATCHDOG_INTERVAL_MS)
}
