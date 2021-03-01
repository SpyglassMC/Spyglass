import { ErrorReporter, Logger, MetaRegistry } from '@spyglassmc/core'

export interface CheckerContext {
	meta: MetaRegistry,
	logger: Logger,
	err: ErrorReporter,
	roots: string[],
}

export namespace CheckerContext {
	export function create(ctx: Partial<CheckerContext>): CheckerContext {
		return {
			meta: ctx.meta ?? MetaRegistry.getInstance(),
			logger: ctx.logger ?? Logger.create(),
			err: ctx.err ?? new ErrorReporter(),
			roots: ctx.roots ?? [],
		}
	}
}
