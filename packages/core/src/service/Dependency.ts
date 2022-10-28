export type Dependency = { uri: string; info?: Record<string, any> }

export type DependencyKey = `@${string}`
export namespace DependencyKey {
	export function is(value: string): value is DependencyKey {
		return value.startsWith('@')
	}
}

export type DependencyProvider = () => PromiseLike<Dependency> | Dependency
