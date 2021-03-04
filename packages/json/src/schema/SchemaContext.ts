import { ContextBase } from '@spyglassmc/core'

export interface SchemaContext extends ContextBase {
}
interface SchemaContextLike extends Partial<ContextBase> {
}
export namespace SchemaContext {
	export function create(ctx: SchemaContextLike): SchemaContext {
		return {
			...ContextBase.create(ctx),
		}
	}
}
