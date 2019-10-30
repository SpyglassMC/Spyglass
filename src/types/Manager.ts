export default interface Manager<T> {
    get(...params: any[]): T
}
