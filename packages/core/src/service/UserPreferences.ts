import { type Config, type ConfigChangeEvent, type ExternalEventEmitter, merge } from '../index.js'
import type { Project } from './Project.js'

export interface UserPreferences {
	/**
	 * Environment preferences
	 */
	env: EnvPreferences
	/**
	 * Basic feature toggles
	 */
	feature: FeaturePreferences
}

export interface EnvPreferences {
	/**
	 * Where to download data like `mcmeta` or `vanilla-mcdoc` from (case-insensitive).
	 *
	 * * `GitHub`: Recommended, unless you have trouble connecting to `raw.githubusercontent.com`.
	 * * `fastly`
	 * * `jsDelivr`
	 * * A custom URL, with placeholder variables: `${user}`, `${repo}`, `${tag}`, and `${path}`.
	 */
	dataSource: string
	/**
	 * Locale language for error messages and other texts provided by Spyglass.
	 */
	language: string
	/**
	 * Whether to enable caching of mcdoc simplified types.
	 *
	 * May become corrupt after changing game versions, so this is currently disabled by default.
	 */
	enableMcdocCaching: boolean
	/**
	 * Makes the file-watcher use polling to watch for file changes.
	 * Comes at a performance cost for very large datapacks.
	 *
	 * On Windows, enabling this can fix file-lock issues when Spyglass is running.
	 * See: https://github.com/SpyglassMC/Spyglass/issues/1414
	 *
	 * **You should only consider enabling this for Windows machines.**
	 */
	useFilePolling: boolean
}

export interface FeaturePreferences {
	codeActions: boolean
	colors: boolean
	completions: boolean
	documentHighlighting: boolean
	documentLinks: boolean // Request is not implemented
	foldingRanges: boolean // Request is not implemented
	formatting: boolean
	hover: boolean
	inlayHint: boolean | { enabledNodes: string[] }
	semanticColoring: boolean
	selectionRanges: boolean // Request is not implemented
	signatures: boolean
}

// These defaults are only used if the editor does not return any value for a setting.
// But usually an editor is going to at least return the default value that was separately defined for a setting.
export const DefaultPreferences: UserPreferences = {
	env: {
		dataSource: 'GitHub',
		language: 'Default',
		enableMcdocCaching: false,
		useFilePolling: false,
	},
	feature: {
		codeActions: true,
		colors: true,
		completions: true,
		documentHighlighting: true,
		documentLinks: true,
		foldingRanges: true,
		formatting: true,
		hover: true,
		inlayHint: {
			enabledNodes: [
				'boolean',
				'double',
				'float',
				'integer',
				'long',
				'mcfunction:coordinate',
				'mcfunction:vector',
				'mcfunction:command_child/unknown',
			],
		},
		semanticColoring: true,
		selectionRanges: true,
		signatures: true,
	},
}

export type PartialUserPreferences = {
	env: Partial<EnvPreferences>
	feature: Partial<FeaturePreferences>
}

export namespace PartialUserPreferences {
	export function buildPreferencesFromConfigurationSafe(
		spyglassmcConfiguration: any,
	): PartialUserPreferences {
		const result: PartialUserPreferences = { env: {}, feature: {} }
		if (!spyglassmcConfiguration || typeof spyglassmcConfiguration !== 'object') {
			return result
		}
		if (spyglassmcConfiguration.env && typeof spyglassmcConfiguration.env === 'object') {
			if (typeof spyglassmcConfiguration.env.dataSource === 'string') {
				result.env.dataSource = spyglassmcConfiguration.env.dataSource
			}
			if (typeof spyglassmcConfiguration.env.language === 'string') {
				result.env.language = spyglassmcConfiguration.env.language
			}
			if (typeof spyglassmcConfiguration.env.enableMcdocCaching === 'boolean') {
				result.env.enableMcdocCaching = spyglassmcConfiguration.env.enableMcdocCaching
			}
			if (typeof spyglassmcConfiguration.env.useFilePolling === 'boolean') {
				result.env.useFilePolling = spyglassmcConfiguration.env.useFilePolling
			}
		}
		if (spyglassmcConfiguration.feature && typeof spyglassmcConfiguration.feature === 'object') {
			if (typeof spyglassmcConfiguration.feature.codeActions === 'boolean') {
				result.feature.codeActions = spyglassmcConfiguration.feature.codeActions
			}
			if (typeof spyglassmcConfiguration.feature.colors === 'boolean') {
				result.feature.colors = spyglassmcConfiguration.feature.colors
			}
			if (typeof spyglassmcConfiguration.feature.completions === 'boolean') {
				result.feature.completions = spyglassmcConfiguration.feature.completions
			}
			if (typeof spyglassmcConfiguration.feature.documentHighlighting === 'boolean') {
				result.feature.documentHighlighting =
					spyglassmcConfiguration.feature.documentHighlighting
			}
			if (typeof spyglassmcConfiguration.feature.documentLinks === 'boolean') {
				result.feature.documentLinks = spyglassmcConfiguration.feature.documentLinks
			}
			if (typeof spyglassmcConfiguration.feature.foldingRanges === 'boolean') {
				result.feature.foldingRanges = spyglassmcConfiguration.feature.foldingRanges
			}
			if (typeof spyglassmcConfiguration.feature.formatting === 'boolean') {
				result.feature.formatting = spyglassmcConfiguration.feature.formatting
			}
			if (typeof spyglassmcConfiguration.feature.hover === 'boolean') {
				result.feature.hover = spyglassmcConfiguration.feature.hover
			}
			if (
				spyglassmcConfiguration.feature.inlayHint
				&& typeof spyglassmcConfiguration.feature.inlayHint === 'object'
				&& Array.isArray(spyglassmcConfiguration.feature.inlayHint.enabledNodes)
			) {
				result.feature.inlayHint = spyglassmcConfiguration.feature.inlayHint
			}
			if (typeof spyglassmcConfiguration.feature.semanticColoring === 'boolean') {
				result.feature.semanticColoring = spyglassmcConfiguration.feature.semanticColoring
			}
			if (typeof spyglassmcConfiguration.feature.selectionRanges === 'boolean') {
				result.feature.selectionRanges = spyglassmcConfiguration.feature.selectionRanges
			}
			if (typeof spyglassmcConfiguration.feature.signatures === 'boolean') {
				result.feature.signatures = spyglassmcConfiguration.feature.signatures
			}
		}
		return result
	}
}

type PreferencesEvent = { preferences: UserPreferences }
type ErrorEvent = { error: unknown }

export class UserPreferencesService implements ExternalEventEmitter {
	readonly #eventEmitter: ExternalEventEmitter
	private currentEditorConfiguration: PartialUserPreferences

	constructor(private readonly project: Project, private readonly defaults = DefaultPreferences) {
		this.#eventEmitter = new project.externals.event.EventEmitter()
		const configHandler = async ({ newConfig }: ConfigChangeEvent) => {
			this.emit('changed', { preferences: this.load(newConfig) })
		}
		project.on('configChanged', configHandler)

		this.currentEditorConfiguration = defaults
	}

	on(event: 'changed', callbackFn: (data: PreferencesEvent) => void): this
	on(event: 'error', callbackFn: (data: ErrorEvent) => void): this
	on(event: string, callbackFn: (...args: any[]) => unknown): this {
		this.#eventEmitter.on(event, callbackFn)
		return this
	}

	once(event: 'changed', callbackFn: (data: PreferencesEvent) => void): this
	once(event: 'error', callbackFn: (data: ErrorEvent) => void): this
	once(event: string, callbackFn: (...args: any[]) => unknown): this {
		this.#eventEmitter.once(event, callbackFn)
		return this
	}

	emit(event: 'changed', data: PreferencesEvent): boolean
	emit(event: 'error', data: ErrorEvent): boolean
	emit(event: string, ...args: unknown[]): boolean {
		return this.#eventEmitter.emit(event, ...args)
	}

	async onEditorConfigurationUpdate(userPreferences: PartialUserPreferences) {
		this.currentEditorConfiguration = userPreferences
		this.emit('changed', { preferences: this.load() })
	}

	load(config: Config = this.project.config): UserPreferences {
		// Use config to override editor settings, since changing user preferences in the config is deprecated but should still work
		return merge(
			merge(this.defaults, this.currentEditorConfiguration),
			this.buildPreferencesFromDeprecatedConfig(config),
		)
	}

	private buildPreferencesFromDeprecatedConfig(config: Config): PartialUserPreferences {
		const preferences: PartialUserPreferences = { env: {}, feature: {} }
		if (config.env.dataSource !== undefined) {
			preferences.env.dataSource = config.env.dataSource
		}
		if (config.env.language !== undefined) {
			preferences.env.language = config.env.language
		}
		if (config.env.enableMcdocCaching !== undefined) {
			preferences.env.enableMcdocCaching = config.env.enableMcdocCaching
		}
		if (config.env.useFilePolling !== undefined) {
			preferences.env.useFilePolling = config.env.useFilePolling
		}

		if (config.env.feature?.codeActions !== undefined) {
			preferences.feature.codeActions = config.env.feature.codeActions
		}
		if (config.env.feature?.colors !== undefined) {
			preferences.feature.colors = config.env.feature.colors
		}
		if (config.env.feature?.completions !== undefined) {
			preferences.feature.completions = config.env.feature.completions
		}
		if (config.env.feature?.documentHighlighting !== undefined) {
			preferences.feature.documentHighlighting = config.env.feature.documentHighlighting
		}
		if (config.env.feature?.documentLinks !== undefined) {
			preferences.feature.documentLinks = config.env.feature.documentLinks
		}
		if (config.env.feature?.foldingRanges !== undefined) {
			preferences.feature.foldingRanges = config.env.feature.foldingRanges
		}
		if (config.env.feature?.formatting !== undefined) {
			preferences.feature.formatting = config.env.feature.formatting
		}
		if (config.env.feature?.hover !== undefined) {
			preferences.feature.hover = config.env.feature.hover
		}
		if (config.env.feature?.inlayHint !== undefined) {
			preferences.feature.inlayHint = config.env.feature.inlayHint
		}
		if (config.env.feature?.semanticColoring !== undefined) {
			preferences.feature.semanticColoring = config.env.feature.semanticColoring
		}
		if (config.env.feature?.selectionRanges !== undefined) {
			preferences.feature.selectionRanges = config.env.feature.selectionRanges
		}
		if (config.env.feature?.signatures !== undefined) {
			preferences.feature.signatures = config.env.feature.signatures
		}
		return preferences
	}
}
