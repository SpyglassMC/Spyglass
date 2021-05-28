export interface EventListenable {
	/**
	 * Subscribe to an event.
	 * 
	 * @param event The event name.
	 * @param callbackFn The callback function.
	 */
	on(event: string, callbackFn?: (this: void, ...params: any[]) => unknown): void
}

export interface EventPublisher extends EventListenable {
	/**
	 * Trigger an event.
	 */
	trigger(event: string, ...params: any[]): void

	clone(): EventPublisher

	/**
	 * Start delaying the publish of events. Once this method is called, events are no longer immediately sent
	 * to subscribers right after they are triggered. You need to manually call {@link EventPublisher.dropDelayedEvents}
	 * or {@link EventPublisher.publishDelayedEvents} to end the delay.
	 * 
	 * @throws If `startDelay` has already been called.
	 */
	startDelay(): void
	/**
	 * Publish all events reported after the last {@link startDelay} was called, and reset the delay status.
	 * 
	 * @throws If `startDelay` has never been called.
	 */
	publishDelayedEvents(): void
}
export namespace EventPublisher {
	export function create(): EventPublisher {
		return new EventPublisherImpl()
	}
}

class EventPublisherImpl implements EventPublisher {
	#delayedEvents: { event: string, params: any[] }[] | undefined = undefined

	constructor(
		private readonly subscribers: Record<string, ((this: void, ...params: any[]) => unknown)[]> = {},
	) { }

	on(event: string, callbackFn: (this: void, ...params: any[]) => unknown): void {
		(this.subscribers[event] ??= []).push(callbackFn)
	}

	trigger(event: string, ...params: any[]): void {
		if (this.#delayedEvents) {
			this.#delayedEvents.push({ event, params })
		} else {
			this.publish(event, params)
		}
	}

	private publish(event: string, params: any[]): void {
		this.subscribers[event]?.forEach(fn => fn(...params))
	}

	/**
	 * @returns A new instance of {@link EventPublisher} with the same subscribers.
	 */
	clone(): EventPublisher {
		return new EventPublisherImpl(this.subscribers)
	}

	startDelay(): void {
		// if (this.#delayedEvents) {
		// 	throw new Error('startDelay has already been called.')
		// }
		this.#delayedEvents = []
	}
	publishDelayedEvents(): void {
		// if (!this.#delayedEvents) {
		// 	throw new Error('startDelay has never been called.')
		// }
		for (const { event, params } of this.#delayedEvents ?? []) {
			this.publish(event, params)
		}
		this.#delayedEvents = undefined
	}
}
