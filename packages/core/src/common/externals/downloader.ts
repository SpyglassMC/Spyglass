type RemoteUriProtocol = 'http:' | 'https:'
export type RemoteUriString = `${RemoteUriProtocol}${string}`
export const RemoteUriString = Object.freeze({
	is(value: string): value is RemoteUriString {
		return value.startsWith('http:') || value.startsWith('https:')
	},
})

export interface ExternalDownloaderOptions {
	/**
	 * Use an string array to set multiple values to the header.
	 */
	headers?: Record<string, string | string[]>
	timeout?: number
}

export interface ExternalDownloader {
	/**
	 * @throws
	 */
	get(
		uri: RemoteUriString,
		options?: ExternalDownloaderOptions,
	): Promise<Uint8Array>
}
export const ExternalDownloader = Object.freeze({
	mock(options: ExternalDownloaderMockOptions): ExternalDownloader {
		return new ExternalDownloaderMock(options)
	},
})

interface ExternalDownloaderMockOptions {
	/**
	 * A record from URIs to fixture data. The {@link ExternalDownloader.get} only returns a {@link Uint8Array},
	 * therefore `string` fixtures will be turned into a `Uint8Array` and `object` fixtures will be transformed
	 * into JSON and then turned into a `Uint8Array`.
	 */
	fixtures: Record<RemoteUriString, string | Uint8Array | object>
}

class ExternalDownloaderMock implements ExternalDownloader {
	constructor(private readonly options: ExternalDownloaderMockOptions) {}

	async get(uri: RemoteUriString): Promise<Uint8Array> {
		if (!this.options.fixtures[uri]) {
			throw new Error(`404 not found: ${uri}`)
		}
		const fixture = this.options.fixtures[uri]
		if (fixture instanceof Uint8Array) {
			return fixture
		} else if (typeof fixture === 'string') {
			return new TextEncoder().encode(fixture)
		} else {
			return new TextEncoder().encode(JSON.stringify(fixture))
		}
	}
}
