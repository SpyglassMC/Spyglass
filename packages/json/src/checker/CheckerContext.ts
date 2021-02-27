import { ErrorReporter, ErrorSeverity } from '@spyglassmc/core'
import { JsonAstNode } from '../node'

export class CheckerContext {
	public readonly node: JsonAstNode
	public readonly context: string
	private readonly reporter: ErrorReporter

	constructor(node: JsonAstNode, context: string, reporter: ErrorReporter) {
		this.node = node
		this.context = context
		this.reporter = reporter
	}

	public clone() {
		return new CheckerContext({ ...this.node }, this.context, this.reporter)
	}

	public with(node: JsonAstNode, context?: string) {
		return new CheckerContext(node, context ?? this.context, this.reporter)
	}

	public report(message: string, severity?: ErrorSeverity) {
		this.reporter.report(message, this.node.range, severity)
	}
}
