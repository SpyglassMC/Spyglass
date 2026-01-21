import type { PartialConfig } from '@spyglassmc/core'

export interface CustomInitializationOptions {
	inDevelopmentMode?: boolean
	defaultConfig?: PartialConfig
}

export interface CustomServerCapabilities {
	dataHackPubify?: boolean
	resetProjectCache?: boolean
	showCacheRoot?: boolean
}

export interface MyLspDataHackPubifyRequestParams {
	initialism: string
}
