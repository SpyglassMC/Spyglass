import { FileType } from '.'

/**
 * A summary data for a certain namespace in the datapack.
 */
export interface NamespaceSummary extends Record<FileType, string[]> {}
