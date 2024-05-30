export interface CustomInitializationOptions {
	inDevelopmentMode?: boolean
}

export interface CustomServerCapabilities {
	dataHackPubify?: boolean
	resetProjectCache?: boolean
	showCacheRoot?: boolean
}

export interface MyLspDataHackPubifyRequestParams {
	initialism: string
}
