import http from 'http'
import https from 'https'
import { promisifyAsyncIterable } from '../common'

type RemoteProtocol = 'http:' | 'https:'
export type RemoteUriString = `${RemoteProtocol}${string}`
export namespace RemoteUriString {
	export function getProtocol(uri: RemoteUriString): RemoteProtocol {
		return uri.slice(0, uri.indexOf(':') + 1) as RemoteProtocol
	}
}

export class Downloader {
	constructor(
		private readonly lld: LowLevelDownloader,
	) { }

	download(job: Job) {
		throw new Error()
	}
}

interface Job {
	options: LowLevelDownloadOptions,
}

interface LowLevelDownloadOptions {
	/**
	 * Use an string array to set multiple values to the header.
	 */
	headers?: Record<string, string | string[]>
	timeout?: number,
}

export interface LowLevelDownloader {
	/**
	 * @throws
	 */
	get(uri: RemoteUriString, options?: LowLevelDownloadOptions): Promise<Buffer>
}

export namespace LowLevelDownloader {
	export function create(): LowLevelDownloader {
		return new LowLevelDownloaderImpl()
	}
	export function mock(options: LowLevelDownloaderMockOptions): LowLevelDownloader {
		return new LowLevelDownloaderMock(options)
	}
}

class LowLevelDownloaderImpl implements LowLevelDownloader {
	get(uri: RemoteUriString, options: LowLevelDownloadOptions = {}): Promise<Buffer> {
		const protocol = RemoteUriString.getProtocol(uri)
		const backend = protocol === 'http:' ? http : https
		return new Promise((resolve, reject) => {
			backend.get(uri, options, res => {
				if (res.statusCode !== 200) {
					reject(new Error(`Status code ${res.statusCode}: ${res.statusMessage}`))
				} else {
					resolve(promisifyAsyncIterable(res, chunks => Buffer.concat(chunks)))
				}
			})
		})
	}
}

interface LowLevelDownloaderMockOptions {
	/**
	 * A record from URIs to fixture data. The {@link LowLevelDownloader.get} only returns a {@link Buffer},
	 * therefore `string` fixtures will be turned into a `Buffer` and `object` fixtures will be transformed
	 * into JSON and then turned into a `Buffer`.
	 */
	fixtures: Record<RemoteUriString, string | Buffer | object>,
}

class LowLevelDownloaderMock implements LowLevelDownloader {
	constructor(private readonly options: LowLevelDownloaderMockOptions) { }

	async get(uri: RemoteUriString): Promise<Buffer> {
		if (!this.options.fixtures[uri]) {
			throw new Error(`404 not found: ${uri}`)
		}
		const fixture = this.options.fixtures[uri]
		if (Buffer.isBuffer(fixture)) {
			return fixture
		} else if (typeof fixture === 'string') {
			return Buffer.from(fixture, 'utf-8')
		} else {
			return Buffer.from(JSON.stringify(fixture), 'utf-8')
		}
	}
}
