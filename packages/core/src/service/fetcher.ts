import { Dev, Externals, Logger } from "../common/index.js"

export async function fetchWithCache({ web }: Externals, logger: Logger, input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
	const cache = await web.getCache()
	const request = new Request(input, init)
	const cachedResponse = await cache.match(request)
	const cachedEtag = cachedResponse?.headers.get('ETag')
	if (cachedEtag) {
		request.headers.set('If-None-Match', cachedEtag)
	}
	try {
		const response = await web.fetch(request)
		if (response.status === 304) {
			Dev.assertDefined(cachedResponse)
			return cachedResponse
		} else {
			try {
				await cache.put(request, response)
			} catch (e) {
				logger.warn('[fetchWithCache] put cache', e)
			}
			return response
		}
	} catch (e) {
		logger.warn('[fetchWithCache] fetch', e)
		if (cachedResponse) {
			return cachedResponse
		}
		throw e
	}
}
