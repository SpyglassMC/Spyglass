import type { EventDispatcher, UriStore } from '../common/index.js'

export type FileWatcherEventMap = {
	ready: void
	add: string
	change: string
	unlink: string
	error: Error
}

/**
 * A file watcher that reports additions, changes, and deletions of files.
 * Changes to directories should not be reported.
 */
export interface FileWatcher extends EventDispatcher<FileWatcherEventMap> {
	get watchedFiles(): UriStore

	ready(): Promise<void>

	close(): Promise<void>
}
