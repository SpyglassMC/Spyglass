import type * as core from '@spyglassmc/core'
import type { Connection } from 'vscode-languageserver'
import { RemoteFs } from './types.js'

const { FileTypeBit } = RemoteFs

/**
 * A file system that forwards every operation to the language client (see {@link RemoteFs}).
 *
 * The web build of the language server runs in a Web Worker, which can't touch any files by
 * itself. The client (the VS Code extension) answers these requests using `vscode.workspace.fs`,
 * which also makes virtual workspaces such as `vscode-vfs://github/...` work.
 */
export class RemoteFileSystem implements core.ExternalFileSystem {
	constructor(private readonly connection: Pick<Connection, 'sendRequest'>) {}

	async chmod(_location: core.FsLocation, _mode: number): Promise<void> {
		// File modes don't exist in VS Code's file system API.
	}

	async mkdir(
		location: core.FsLocation,
		options?: { mode?: number; recursive?: boolean },
	): Promise<void> {
		const params: RemoteFs.CreateDirectoryParams = {
			uri: location.toString(),
			recursive: options?.recursive ?? false,
		}
		await this.#request(RemoteFs.CreateDirectory, params)
	}

	async readdir(
		location: core.FsLocation,
	): ReturnType<core.ExternalFileSystem['readdir']> {
		const entries: RemoteFs.ReadDirectoryResult = await this.#request(
			RemoteFs.ReadDirectory,
			{ uri: location.toString() } satisfies RemoteFs.UriParams,
		)
		return entries.map(([name, type]) => ({ name, ...toStats(type) }))
	}

	async readFile(location: core.FsLocation): Promise<Uint8Array<ArrayBuffer>> {
		const data: Uint8Array = await this.#request(
			RemoteFs.ReadFile,
			{ uri: location.toString() } satisfies RemoteFs.UriParams,
		)
		// Always hand out a view over a buffer we own (and not e.g. a pooled or shared one).
		return new Uint8Array(data)
	}

	async rm(location: core.FsLocation, options?: { recursive?: boolean }): Promise<void> {
		const params: RemoteFs.DeleteParams = {
			uri: location.toString(),
			recursive: options?.recursive ?? false,
		}
		await this.#request(RemoteFs.Delete, params)
	}

	async showFile(_location: core.FsLocation): Promise<void> {
		throw new Error('Revealing files in the file explorer is not supported on the web.')
	}

	async stat(location: core.FsLocation): Promise<core.ExternalStats> {
		const { type }: RemoteFs.StatResult = await this.#request(
			RemoteFs.Stat,
			{ uri: location.toString() } satisfies RemoteFs.UriParams,
		)
		return toStats(type)
	}

	async unlink(location: core.FsLocation): Promise<void> {
		return this.rm(location)
	}

	async writeFile(
		location: core.FsLocation,
		data: string | Uint8Array<ArrayBuffer>,
		_options?: { mode: number },
	): Promise<void> {
		const params: RemoteFs.WriteFileParams = {
			uri: location.toString(),
			data: typeof data === 'string' ? new TextEncoder().encode(data) : data,
		}
		await this.#request(RemoteFs.WriteFile, params)
	}

	async #request<R>(method: string, params: object): Promise<R> {
		try {
			return await this.connection.sendRequest<R>(method, params)
		} catch (e) {
			// Recreate the Node.js-style error code that the core inspects with `externals.error.isKind`.
			const kind = (e as { data?: Partial<RemoteFs.ErrorData> } | undefined)?.data?.kind
			if (kind && kind !== 'OTHER') {
				throw Object.assign(new Error((e as Error).message), { code: kind })
			}
			throw e
		}
	}
}

/**
 * Follows the semantics of Node.js's `Dirent`: a symbolic link is *only* a symbolic link, even if it
 * points to a file or a directory.
 */
function toStats(type: RemoteFs.FileType): core.ExternalStats {
	const isLink = (type & FileTypeBit.SymbolicLink) !== 0
	return {
		isDirectory: () => !isLink && (type & FileTypeBit.Directory) !== 0,
		isFile: () => !isLink && (type & FileTypeBit.File) !== 0,
		isSymbolicLink: () => isLink,
	}
}
