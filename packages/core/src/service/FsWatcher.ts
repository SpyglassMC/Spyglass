import type { UriStore } from '../common/index.js'

/**
 * A file system watcher that reports additions, changes, and deletions of files.
 * Changes to directories should not be reported.
 */
export interface FsWatcher {
	get isReady(): boolean
	get watchedFiles(): UriStore

	on(eventName: 'ready', listener: () => unknown): this
	once(eventName: 'ready', listener: () => unknown): this

	on(eventName: 'add', listener: (uri: string) => unknown): this
	once(eventName: 'add', listener: (uri: string) => unknown): this

	on(eventName: 'change', listener: (uri: string) => unknown): this
	once(eventName: 'change', listener: (uri: string) => unknown): this

	on(eventName: 'unlink', listener: (uri: string) => unknown): this
	once(eventName: 'unlink', listener: (uri: string) => unknown): this

	on(eventName: 'error', listener: (error: Error) => unknown): this
	once(eventName: 'error', listener: (error: Error) => unknown): this

	close(): Promise<void>
}
