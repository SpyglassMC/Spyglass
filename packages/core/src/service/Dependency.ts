export type Dependency =
	| { type: 'directory'; uri: string }
	| { type: 'tarball-file'; uri: string; stripLevel?: number }
	| { type: 'tarball-ram'; name: string; data: Uint8Array<ArrayBuffer>; stripLevel?: number }

export type DependencyKey = `@${string}`
export namespace DependencyKey {
	export function is(value: string): value is DependencyKey {
		return value.startsWith('@')
	}
}

export type DependencyProvider = () => PromiseLike<Dependency> | Dependency
