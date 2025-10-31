import { Dev } from '../common/index.js'
import type { Externals, Logger } from '../common/index.js'

const FETCH_TIMEOUT_MS = 30_000

export async function fetchWithCache(
	{ web }: Externals,
	logger: Logger,
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	const cache = await web.getCache()
	const request = new Request(input, init)
	const cachedResponse = await cache.match(request)
	const cachedEtag = cachedResponse?.headers.get('ETag')
	if (cachedEtag) {
		request.headers.set('If-None-Match', cachedEtag)
	}
	request.headers.set('User-Agent', 'SpyglassMC (+https://spyglassmc.com)')
	try {
		const response = await web.fetch(request, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
		if (response.status === 304) {
			Dev.assertDefined(cachedResponse)
			logger.info(`[fetchWithCache] reusing cache for ${request.url}`)
			return cachedResponse
		} else if (!response.ok) {
			let message = response.statusText
			try {
				message = (await response.json()).message
			} catch {}
			throw new TypeError(`${response.status} ${message}`)
		} else {
			try {
				await cache.put(request, response.clone())
				logger.info(`[fetchWithCache] updated cache for ${request.url}`)
			} catch (e) {
				logger.warn('[fetchWithCache] put cache', e)
			}
			return response
		}
	} catch (e) {
		logger.warn('[fetchWithCache] fetch', e)
		if (cachedResponse) {
			logger.info(`[fetchWithCache] falling back to cache for ${request.url}`)
			return cachedResponse
		}
		throw e
	}
}

// Fetchr? I hardly know her: https://github.com/NeunEinser/bingo
