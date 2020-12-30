export interface Manager<T> {
	get(id: string, params?: any[]): T
}
