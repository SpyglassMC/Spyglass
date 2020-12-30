import { SyntaxComponent, TextRange } from '.'
import { getEol, plugins } from '..'
import { DocCommentComponent } from '../plugins/builtin/DocCommentPlugin'
import { toFormattedString } from '../utils'
import { combineCache } from './ClientCache'
import { LintConfig } from './Config'

export type CommandComponentNode<T> = {
	data: T,
	parser: string,
	range: TextRange
}

export type CommandComponentData = CommandComponentNode<any>[]

export interface CommandComponent extends plugins.SyntaxComponent<CommandComponentData> {

}

export namespace CommandComponent {
	export function create(data: CommandComponentData = [], partial: Partial<CommandComponent> = {}): CommandComponent {
		return plugins.SyntaxComponent.create<CommandComponentData>('spgoding:mcfunction/command', data, partial)
	}
}

export function combineCommand(base: CommandComponent, override: CommandComponent): CommandComponent {
	// Args.
	base.data = [...base.data, ...override.data]
	// Hint.
	base.hint.fix = [...base.hint.fix, ...override.hint.fix]
	base.hint.options = [...base.hint.options, ...override.hint.options]
	// Cache.
	combineCache(base.cache, override.cache)
	// Completions.
	base.completions = [...base.completions, ...override.completions]
	// Errors.
	base.errors = [...base.errors, ...override.errors]
	// Tokens.
	base.tokens = [...base.tokens, ...override.tokens]
	return base
}

export function componentToLintedString(com: SyntaxComponent<unknown>, lint: LintConfig): string {
	if (com.type === 'spgoding:doc_comment/doc_comment') {
		const docCom = com as DocCommentComponent
		return toFormattedString(docCom.data.doc, lint) + getEol(lint) + docCom.data.commands?.map(v => v.indent + componentToLintedString(v.component, lint)).join(getEol(lint))
	}
	const cmdCom = com as CommandComponent
	return cmdCom.data.map(v => toFormattedString(v.data, lint)).join(' ')
}
