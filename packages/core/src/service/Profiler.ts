import { Dev, Logger } from '../common/index.js'

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

class TopNImpl implements Profiler {
	#finalized = false
	readonly #startTime: number
	#lastTime: number
	#taskCount = 0
	#topTasks: [string, number][] = []
	#minTime = Infinity
	#maxTime = 0

	constructor(
		private readonly id: string,
		private readonly logger: Logger,
		private readonly n: number,
	) {
		this.#startTime = this.#lastTime = performance.now()
	}

	task(name: string): this {
		if (this.#finalized) {
			throw new Error('The profiler has already been finalized')
		}
		this.#taskCount++
		const time = performance.now()
		const duration = time - this.#lastTime
		this.#lastTime = time
		this.#minTime = Math.min(this.#minTime, duration)
		this.#maxTime = Math.max(this.#maxTime, duration)
		this.#topTasks.push([name, duration])
		this.#topTasks.sort((a, b) => b[1] - a[1])
		if (this.#topTasks.length > this.n) {
			this.#topTasks = this.#topTasks.slice(0, -1)
		}
		return this
	}

	finalize(): void {
		this.#finalized = true
		const longestTaskNameLength = this.#topTasks.reduce(
			(length, [name]) => Math.max(length, name.length),
			0,
		)
		const totalDuration = this.#lastTime - this.#startTime
		this.logger.info(`[Profiler: ${this.id}] == Summary ==`)
		this.logger.info(
			`[Profiler: ${this.id}] Total tasks: ${this.#taskCount} done in ${totalDuration} ms`,
		)
		this.logger.info(
			`[Profiler: ${this.id}] Min/Avg/Max: ${this.#minTime} / ${
				totalDuration / this.#taskCount
			} / ${this.#maxTime} ms`,
		)
		this.logger.info(
			`[Profiler: ${this.id}] Top ${Math.min(this.n, this.#topTasks.length)} task(s):`,
		)
		for (const [name, time] of this.#topTasks) {
			this.logger.info(
				`[Profiler: ${this.id}] ${name}${
					' '.repeat(longestTaskNameLength - name.length)
				} - ${time} ms (${(time / totalDuration) * 100}%)`,
			)
		}
	}
}

const TotalTaskName = 'Total'

class TotalImpl implements Profiler {
	#finalized = false
	readonly #startTime: number
	#lastTime: number
	readonly #tasks: [string, number][] = []
	#longestTaskNameLength = 0

	constructor(private readonly id: string, private readonly logger: Logger) {
		this.#startTime = this.#lastTime = performance.now()
	}

	task(name: string): this {
		if (this.#finalized) {
			throw new Error('The profiler is finalized.')
		}
		const time = performance.now()
		const duration = time - this.#lastTime
		this.#lastTime = time
		this.#tasks.push([name, duration])
		this.#longestTaskNameLength = Math.max(this.#longestTaskNameLength, name.length)
		this.logger.info(`[Profiler: ${this.id}] Done: ${name} in ${duration} ms`)
		return this
	}

	finalize(): void {
		this.#finalized = true
		this.#tasks.push([TotalTaskName, this.#lastTime - this.#startTime])
		this.#longestTaskNameLength = Math.max(this.#longestTaskNameLength, TotalTaskName.length)
		this.logger.info(`[Profiler: ${this.id}] == Summary ==`)
		for (const [name, time] of this.#tasks) {
			this.logger.info(
				`[Profiler: ${this.id}] ${name}${
					' '.repeat(this.#longestTaskNameLength - name.length)
				} - ${time} ms`,
			)
		}
	}
}

class NoopImpl implements Profiler {
	task(): this {
		return this
	}
	finalize(): void {}
}

type SummaryStyle = 'top-n' | 'total'

export class ProfilerFactory {
	readonly #enabledProfilers: Set<string>

	constructor(private readonly logger: Logger, enabledProfilers: string[]) {
		this.#enabledProfilers = new Set(enabledProfilers)
	}

	get(id: string, style: 'top-n', n: number): Profiler
	get(id: string, style?: 'total'): Profiler
	get(id: string, style: SummaryStyle = 'total', n?: number): Profiler {
		if (this.#enabledProfilers.has(id)) {
			switch (style) {
				case 'top-n':
					return new TopNImpl(id, this.logger, n!)
				case 'total':
					return new TotalImpl(id, this.logger)
				default:
					return Dev.assertNever(style)
			}
		} else {
			return new NoopImpl()
		}
	}

	static noop(): ProfilerFactory {
		return new ProfilerFactory(Logger.noop(), [])
	}
}
