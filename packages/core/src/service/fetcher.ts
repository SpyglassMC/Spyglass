import { Dev, sleep } from '../common/index.js'
import type { Externals, Logger } from '../common/index.js'

const FETCH_RETRY_BASE_MS = 1_000
const FETCH_RETRY_MAX_ATTEMPTS = 3
const FETCH_PER_TRY_TIMEOUT_MS = 10_000
const FETCH_TOTAL_TIMEOUT_MS = 15_000

const STALE_HEADER = 'spyglassmc-is-stale'

export interface FetcherOptions {
	retryBaseMs?: number
	retryMaxAttempts?: number
	perTryTimeoutMs?: number
	totalTimeoutMs?: number
}

export async function fetchWithCache(
	{ web }: Externals,
	logger: Logger,
	input: RequestInfo | URL,
	init?: RequestInit,
	options?: FetcherOptions,
): Promise<Response> {
	const cache = await web.getCache()
	const request = new Request(input, init)
	const cachedResponse = await cache.match(request)
	const cachedEtag = cachedResponse?.headers.get('etag')
	const cachedLastModified = cachedResponse?.headers.get('last-modified')
	if (cachedEtag) {
		request.headers.set('if-none-match', cachedEtag)
	} else if (cachedLastModified) {
		request.headers.set('if-modified-since', cachedLastModified)
	}
	request.headers.set('user-agent', 'SpyglassMC (+https://spyglassmc.com)')
	try {
		const response = await fetchWithRetries(request, options)
		if (response.status === 304) {
			Dev.assertDefined(cachedResponse)
			logger.info(`[fetchWithCache] reusing cache for ${request.url}`)
			return cachedResponse
		} else if (!response.ok) {
			let message = response.statusText
			try {
				message = await response.text()
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

async function fetchWithRetries(
	request: Request,
	{
		perTryTimeoutMs = FETCH_PER_TRY_TIMEOUT_MS,
		retryBaseMs = FETCH_RETRY_BASE_MS,
		retryMaxAttempts = FETCH_RETRY_MAX_ATTEMPTS,
		totalTimeoutMs = FETCH_TOTAL_TIMEOUT_MS,
	}: FetcherOptions = {},
) {
	let lastResult: Response | Error | undefined
	const totalSignal = AbortSignal.timeout(totalTimeoutMs)

	Dev.assertTrue(retryMaxAttempts > 0, 'Number of attempts must be greater than 0')
	for (let i = 0; i < retryMaxAttempts; i++) {
		const isLastAttempt = i === retryMaxAttempts - 1
		try {
			lastResult = await fetch(request.clone(), {
				signal: AbortSignal.any([
					totalSignal,
					AbortSignal.timeout(perTryTimeoutMs),
				]),
			})
			if (lastResult.status < 500) {
				return lastResult
			}
		} catch (e) {
			lastResult = e as Error
		}
		if (!isLastAttempt) {
			await sleep(Math.round(Math.random() * (2 ** i) * retryBaseMs))
		}
	}

	if (lastResult instanceof Response) {
		return lastResult
	}
	throw lastResult!
}

// Fetchr? I hardly know her: https://github.com/NeunEinser/bingo
