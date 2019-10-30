export default interface Manager<T> {
    get(id: string, params?: any[]): T
}
