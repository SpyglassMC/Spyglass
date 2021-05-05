import type { ChildBaseNode } from './command'

export interface SpyglassmcTrailingArgumentNode extends ChildBaseNode {
	type: 'mcfunction:argument/spyglassmc:trailing',
	value: string,
}
export interface SpyglassmcUnknownArgumentNode extends ChildBaseNode {
	type: 'mcfunction:argument/spyglassmc:unknown',
	value: string,
}

export type SpecialArgumentNode =
	| SpyglassmcTrailingArgumentNode
	| SpyglassmcUnknownArgumentNode
