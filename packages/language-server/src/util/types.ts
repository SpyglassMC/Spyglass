import type { PartialUserPreferences } from '@spyglassmc/core'

export interface CustomInitializationOptions {
	inDevelopmentMode?: boolean
	gameVersion?: string
	userPreferences?: PartialUserPreferences
}

export interface CustomServerCapabilities {
	dataHackPubify?: boolean
	resetProjectCache?: boolean
	showCacheRoot?: boolean
}

export interface MyLspDataHackPubifyRequestParams {
	initialism: string
}
