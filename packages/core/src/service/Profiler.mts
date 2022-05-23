import { Logger } from './Logger.mjs'

/**
 * @example
 * ```typescript
 * const __profiler = profilerFactory.get('id')
 * 
 * // Do Task 1 here
 * // ...
 * __profiler.task('Task 1')
 * 
 * // Do Task 2 here
 * // ...
 * __profiler.task('Task 2').finalize()
 * ```
 */
export interface Profiler {
	/**
	 * Call after a task has been finished.
	 */
	task(name: string): this
	/**
	 * Call after the whole procedure that is being profiled is done.
	 */
	finalize(): void
}

const TotalTaskName = 'Total'

class ProfilerImpl implements Profiler {
	#finalized = false
	#startTime: number
	#lastTime: number
	#tasks: [string, number][] = []
	#longestTaskNameLength = 0

	constructor(
		private readonly id: string,
		private readonly logger: Logger
	) {
		this.#startTime = this.#lastTime = performance.now()
	}

	task(name: string): this {
		if (this.#finalized) {
			throw new Error('The profiler is finalized.')
		}
		const time = performance.now()
		this.#tasks.push([name, time - this.#lastTime])
		this.#lastTime = time
		this.#longestTaskNameLength = Math.max(this.#longestTaskNameLength, name.length)
		this.logger.info(`[Profiler: ${this.id}] Done: ${name}`)
		return this
	}

	finalize(): void {
		this.#finalized = true
		this.#tasks.push([TotalTaskName, this.#lastTime - this.#startTime])
		this.#longestTaskNameLength = Math.max(this.#longestTaskNameLength, TotalTaskName.length)
		this.logger.info(`[Profiler: ${this.id}] == Summary ==`)
		for (const [name, time] of this.#tasks) {
			this.logger.info(`[Profiler: ${this.id}] ${name}${' '.repeat(this.#longestTaskNameLength - name.length)} - ${time} ms`)
		}
	}
}

class NoopImpl implements Profiler {
	task(): this { return this }
	finalize(): void { }
}

export class ProfilerFactory {
	readonly #enabledProfilers: Set<string>

	constructor(
		private readonly logger: Logger,
		enabledProfilers: string[]
	) {
		this.#enabledProfilers = new Set(enabledProfilers)
	}

	get(id: string): Profiler {
		if (this.#enabledProfilers.has(id)) {
			return new ProfilerImpl(id, this.logger)
		} else {
			return new NoopImpl()
		}
	}

	static noop(): ProfilerFactory {
		return new ProfilerFactory(Logger.noop(), [])
	}
}
