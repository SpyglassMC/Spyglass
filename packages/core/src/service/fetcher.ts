import { Dev, sleep } from '../common/index.js'
import type { Externals, Logger } from '../common/index.js'

const FETCH_RETRY_BASE_MS = 1_000
const FETCH_RETRY_MAX_ATTEMPTS = 3
const FETCH_PER_TRY_TIMEOUT_MS = 10_000
const FETCH_TOTAL_TIMEOUT_MS = 15_000

const STALE_HEADER = 'spyglassmc-is-stale'

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
		const response = await fetchWithRetries(request)
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
			// Set the stale header when fallback is used
			const newHeaders = new Headers(cachedResponse.headers)
			newHeaders.set(STALE_HEADER, '1')
			return new Response(cachedResponse.body, {
				status: cachedResponse.status,
				statusText: cachedResponse.statusText,
				headers: newHeaders,
			})
		}
		throw e
	}
}

export function isStaleFetcherResponse(response: Response) {
	return response.headers.has(STALE_HEADER)
}

async function fetchWithRetries(request: Request) {
	let lastResult: Response | Error | undefined
	const totalSignal = AbortSignal.timeout(FETCH_TOTAL_TIMEOUT_MS)

	Dev.assertTrue(FETCH_RETRY_MAX_ATTEMPTS > 0, 'Number of attempts must be greater than 0')
	for (let i = 0; i < FETCH_RETRY_MAX_ATTEMPTS; i++) {
		const isLastAttempt = i === FETCH_RETRY_MAX_ATTEMPTS - 1
		try {
			lastResult = await fetch(request.clone(), {
				signal: AbortSignal.any([
					totalSignal,
					AbortSignal.timeout(FETCH_PER_TRY_TIMEOUT_MS),
				]),
			})
			if (lastResult.status < 500) {
				return lastResult
			}
		} catch (e) {
			lastResult = e as Error
		}
		if (!isLastAttempt) {
			await sleep(Math.round(Math.random() * (2 ** i) * FETCH_RETRY_BASE_MS))
		}
	}

	if (lastResult instanceof Response) {
		return lastResult
	}
	throw lastResult!
}

// Fetchr? I hardly know her: https://github.com/NeunEinser/bingo
