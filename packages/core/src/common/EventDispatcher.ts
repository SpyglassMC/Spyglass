import { Dev } from './Dev.js'

export class EventDispatcher<TEvents extends Record<string, unknown>> {
	readonly #target = new EventTarget()

	emit<K extends keyof TEvents & string>(name: K, data: TEvents[K]): void {
		this.#target.dispatchEvent(new CustomEvent(name, { detail: data }))
	}

	on<K extends keyof TEvents & string>(
		name: K,
		listener: (data: TEvents[K]) => unknown,
		options?: AddEventListenerOptions,
	): this {
		this.#target.addEventListener(name, (event) => {
			Dev.assertTrue(event instanceof CustomEvent, 'event must be an instance of CustomEvent')
			listener(event.detail)
		}, options)
		return this
	}
}
