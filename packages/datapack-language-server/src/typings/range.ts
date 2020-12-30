declare module 'python-range' {
	export class PythonRange implements Iterable<number> {
		public start: number
		public stop: number
		public step: number

		constructor(start: number, stop: number, step?: number)
		constructor(stop: number)

		get(index: number): number
		forEach(cb: CallableFunction, thisArg?: object): void
		includes(value: number): boolean
		min(): number
		max(): number
		reverse(): PythonRange
		[Symbol.iterator](): Iterator<number>

		static areEqual(a: PythonRange, b: PythonRange):boolean
	}
    
	function range(start: number, stop: number, step?: number): PythonRange
	function range(stop: number): PythonRange
	export default range
}
