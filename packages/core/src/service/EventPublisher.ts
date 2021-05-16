export interface EventPublisher {
	/**
	 * Subscribe to an event.
	 * 
	 * @param event The event name.
	 * @param callbackFn The callback function.
	 */
	on(event: string, callbackFn?: (this: void, ...params: any[]) => unknown): void
}

export class EventPublisherImpl implements EventPublisher {
	#subscribers: Record<string, ((this: void, ...params: any[]) => unknown)[]> = {}

	on(event: string, callbackFn: (this: void, ...params: any[]) => unknown): void {
		(this.#subscribers[event] ??= []).push(callbackFn)
	}

	trigger(event: string, ...params: any[]): void {
		this.#subscribers[event]?.forEach(fn => fn(...params))
	}
}
