import { Contributor } from './Contributor'

export class ContributorImpl<T> implements Contributor<T> {
	readonly values = new Map<string, T> ()

	add(id: string, value: T): void {
		if (this.values.has(id)) {
			throw new Error(`Value with ID “${id}” already exists.`)
		}
		this.values.set(id, value)
	}
}
