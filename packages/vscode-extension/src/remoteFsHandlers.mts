import type { RemoteFs } from '@spyglassmc/language-server'

/*
 * Request names. They can't be imported from the language server package (that would start the
 * server), so they are repeated here. The `satisfies` clauses make the compiler complain if they
 * ever drift apart from `RemoteFs` in `packages/language-server/src/util/types.ts`.
 */
const ReadFile = 'spyglassmc/fs/readFile' satisfies typeof RemoteFs.ReadFile
const WriteFile = 'spyglassmc/fs/writeFile' satisfies typeof RemoteFs.WriteFile
const ReadDirectory = 'spyglassmc/fs/readDirectory' satisfies typeof RemoteFs.ReadDirectory
const Stat = 'spyglassmc/fs/stat' satisfies typeof RemoteFs.Stat
const CreateDirectory = 'spyglassmc/fs/createDirectory' satisfies typeof RemoteFs.CreateDirectory
const Delete = 'spyglassmc/fs/delete' satisfies typeof RemoteFs.Delete

/**
 * What `await` needs. `vscode.Thenable` is not a `PromiseLike` (its `then` doesn't accept `null`).
 */
interface Awaitable<T> {
	then(onfulfilled: (value: T) => unknown, onrejected?: (reason: any) => unknown): unknown
}

/**
 * The parts of `vscode.workspace.fs` that are used. Describing them here keeps this module free of
 * any dependency on the `vscode` module, which makes it testable outside of VS Code.
 */
export interface FileSystemLike<Uri> {
	readFile(uri: Uri): Awaitable<Uint8Array>
	writeFile(uri: Uri, content: Uint8Array): Awaitable<void>
	readDirectory(uri: Uri): Awaitable<readonly (readonly [name: string, type: number])[]>
	stat(uri: Uri): Awaitable<{ readonly type: number }>
	createDirectory(uri: Uri): Awaitable<void>
	delete(uri: Uri, options?: { recursive?: boolean; useTrash?: boolean }): Awaitable<void>
}

/**
 * An error that carries a Node.js-style error kind, which is what the server's core checks for.
 */
export class RemoteFsError extends Error {
	readonly kind: RemoteFs.ErrorData['kind']

	constructor(kind: RemoteFs.ErrorData['kind'], message: string) {
		super(message)
		this.name = 'RemoteFsError'
		this.kind = kind
	}
}

/**
 * Handles a request of the language server and returns the result, or returns `undefined` if the
 * request isn't a file system request.
 */
export type RemoteFsHandler = (method: string, params: unknown) => Promise<unknown> | undefined

/**
 * Creates the handler that answers the file system requests of the language server, which runs in a
 * Web Worker and therefore has no file system of its own.
 *
 * @param resolve Turns the URI that the server uses into one that `fs` understands.
 */
export function createRemoteFsHandler<Uri>(
	fs: FileSystemLike<Uri>,
	resolve: (uri: string) => Uri,
): RemoteFsHandler {
	async function exists(uri: Uri): Promise<boolean> {
		try {
			await fs.stat(uri)
			return true
		} catch {
			return false
		}
	}

	const handlers = new Map<string, (params: any) => Awaitable<unknown> | unknown>([
		[ReadFile, ({ uri }: RemoteFs.UriParams) => fs.readFile(resolve(uri))],
		[WriteFile, ({ uri, data }: RemoteFs.WriteFileParams) => fs.writeFile(resolve(uri), data)],
		[
			ReadDirectory,
			async ({ uri }: RemoteFs.UriParams): Promise<RemoteFs.ReadDirectoryResult> => {
				return (await fs.readDirectory(resolve(uri))).map(([name, type]) => [name, type])
			},
		],
		[
			Stat,
			async ({ uri }: RemoteFs.UriParams): Promise<RemoteFs.StatResult> => {
				return { type: (await fs.stat(resolve(uri))).type }
			},
		],
		[
			CreateDirectory,
			async ({ uri, recursive }: RemoteFs.CreateDirectoryParams) => {
				const target = resolve(uri)
				if (!recursive && await exists(target)) {
					throw new RemoteFsError('EEXIST', `${uri} already exists`)
				}
				try {
					// `workspace.fs` creates missing parent directories, like `mkdir -p`.
					await fs.createDirectory(target)
				} catch (e) {
					// `mkdir -p` doesn't fail for existing directories, but not every provider agrees.
					if (!(recursive && classify(e) === 'EEXIST')) {
						throw e
					}
				}
			},
		],
		[
			Delete,
			({ uri, recursive }: RemoteFs.DeleteParams) =>
				fs.delete(resolve(uri), { recursive, useTrash: false }),
		],
	])

	return (method, params) => {
		const handler = handlers.get(method)
		return handler && guard(async () => handler(params))
	}
}

/**
 * Runs `fn`, and turns whatever it throws into a {@link RemoteFsError}.
 */
async function guard<T>(fn: () => Promise<T>): Promise<T> {
	try {
		return await fn()
	} catch (e) {
		if (e instanceof RemoteFsError) {
			throw e
		}
		throw new RemoteFsError(classify(e), e instanceof Error ? e.message : String(e))
	}
}

/**
 * Providers report errors as `vscode.FileSystemError`s, whose `code` is e.g. `FileNotFound`, but
 * remote providers don't always get that right, so the name is checked as well.
 */
function classify(e: unknown): RemoteFs.ErrorData['kind'] {
	if (e instanceof RemoteFsError) {
		return e.kind
	}
	const { code, name } = (e ?? {}) as { code?: unknown; name?: unknown }
	const text = `${typeof code === 'string' ? code : ''} ${typeof name === 'string' ? name : ''}`
	if (/FileNotFound|EntryNotFound|ENOENT/.test(text)) {
		return 'ENOENT'
	} else if (/FileExists|EntryExists|EEXIST/.test(text)) {
		return 'EEXIST'
	} else if (/FileIsADirectory|EntryIsADirectory|EISDIR/.test(text)) {
		return 'EISDIR'
	}
	return 'OTHER'
}
