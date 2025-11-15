import crypto from 'node:crypto'
import fsp from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import pino from 'pino'

const OUTPUT_URL = new URL('./output/', import.meta.url)
const HOST = 'http://localhost:3003'
/** Requests per second */
const RPS = 100
const DURATION_MS = 5_000
const PATH = '/mcje/versions/1.21.10/vanilla-data/tarball'

const log = pino()

interface RequestResult {
	latencyMs: number
	buffer: Uint8Array<ArrayBuffer>
	hash: string
}

interface Metrics {
	latencyList: number[]
	hashes: Record<string, number>
}

async function main(): Promise<void> {
	log.info({ OUTPUT_URL, PATH }, 'Starting load test')

	const { hashes, latencyList } = await runLoadTest(PATH)

	const minLatency = Math.min(...latencyList)
	const maxLatency = Math.max(...latencyList)
	const avgLatency = latencyList.reduce((p, c) => p + c, 0) / latencyList.length

	log.info({
		path: PATH,
		minLatency: minLatency.toFixed(2),
		avgLatency: avgLatency.toFixed(2),
		maxLatency: maxLatency.toFixed(2),
		requestCount: latencyList.length,
		uniqueResponses: Object.keys(hashes).length,
		responses: hashes,
	}, 'Load test finished')
}

async function runLoadTest(path: string): Promise<Metrics> {
	const ans: Metrics = {
		latencyList: [],
		hashes: Object.create(null),
	}

	const url = `${HOST}${path}`
	const intervalMs = 1000 / RPS
	const startTime = performance.now()

	const promises: Promise<RequestResult | undefined>[] = []

	while (performance.now() - startTime < DURATION_MS) {
		promises.push(sendRequest(url))

		await new Promise(resolve => setTimeout(resolve, intervalMs))
	}

	for (const result of await Promise.all(promises)) {
		if (!result) {
			continue
		}

		const { buffer, hash, latencyMs } = result
		ans.latencyList.push(latencyMs)
		if (!Object.hasOwn(ans.hashes, hash)) {
			ans.hashes[hash] = 0
			await fsp.writeFile(new URL(hash, OUTPUT_URL), buffer)
		}
		ans.hashes[hash] += 1
	}

	return ans
}

async function sendRequest(url: string): Promise<RequestResult | undefined> {
	try {
		const startTime = performance.now()

		const response = await fetch(url)
		const buffer = new Uint8Array(await response.arrayBuffer())
		const latencyMs = performance.now() - startTime
		const hash = crypto
			.createHash('md5')
			.update(buffer)
			.digest('hex')

		return { buffer, hash, latencyMs }
	} catch (e) {
		log.error(e, '[sendRequest]')
		return undefined
	}
}

try {
	await main()
} catch (e) {
	log.error(e, 'Load test failure')
}
