import { CodeAction, CodeActionKind, Command, Diagnostic, Range } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { DatapackLanguageService, getCodeAction } from '..'
import { locale } from '../locales'
import { getSelectedNode } from '../nodes'
import { ArgumentNode, DiagnosticMap, GetCodeActions, NodeRange } from '../nodes/ArgumentNode'
import { CacheFile, CommandComponent, CommandComponentNode, ErrorCode, GetFormattedString, McfunctionDocument, ParsingContext, Uri } from '../types'
import { areOverlapped } from '../types/TextRange'
import { getDiagnosticMap } from './common'

export async function onCodeAction({ uri, doc, diagnostics, textDoc, range, service }: { uri: Uri, doc: McfunctionDocument, textDoc: TextDocument, diagnostics: Diagnostic[], range: Range, cacheFile: CacheFile, service: DatapackLanguageService }): Promise<CodeAction[] | null> {
	try {
		const ans: CodeAction[] = []

		const diagnosticMap = getDiagnosticMap(diagnostics)

		const start = textDoc.offsetAt(range.start)
		const end = textDoc.offsetAt(range.end)
		const selectedRange = { start, end }

		const { index: startNodeIndex } = getSelectedNode(doc.nodes, start)
		const { index: endNodeIndex } = getSelectedNode(doc.nodes, end)

		const ctx = await service.getParsingContext({ textDoc, uri })

		for (let i = startNodeIndex; i <= endNodeIndex; i++) {
			const node = doc.nodes[i]
			/* istanbul ignore else */
			if (node && node.data instanceof Array) {
				if (areOverlapped(selectedRange, node.range)) {
					for (const { data } of node.data) {
						/* istanbul ignore else */
						if (data instanceof ArgumentNode) {
							const nodeRange = data[NodeRange]
							if (areOverlapped(selectedRange, nodeRange)) {
								ans.push(...data[GetCodeActions](uri.toString(), ctx, selectedRange, diagnosticMap))
							}
						}
					}
					fixCommandComponent(ans, ctx, node as CommandComponent, diagnosticMap)
				}
			}
		}


		if (ans.length > 0) {
			addFixAllActions(ans, CodeActionKind.QuickFix, { uri })
		}
		addFixAllActions(ans, CodeActionKind.SourceFixAll, { uri })

		return ans
	} catch (e) {
		console.error('[onCodeAction]', e)
	}
	return null
}

function addFixAllActions(ans: CodeAction[], kind: CodeActionKind, args: { uri: Uri }) {
	ans.push(
		CodeAction.create(
			locale('code-action.fix-file'),
			Command.create(locale('code-action.fix-file'), 'datapack.fixFile', [args.uri.toString()]),
			kind
		),
		CodeAction.create(
			locale('code-action.fix-workspace'),
			Command.create(locale('code-action.fix-workspace'), 'datapack.fixWorkspace'),
			kind
		)
	)
}

export function fixCommandComponent(ans: CodeAction[], ctx: ParsingContext, node: CommandComponent, diagnosticMap: DiagnosticMap) {
	const commandReplaceitem = diagnosticMap[ErrorCode.CommandReplaceitem]
	if (commandReplaceitem?.length) {
		const startIndex = node.data.findIndex(({ data: d, parser: p }) => p === 'literal' && d === 'replaceitem')
		if (startIndex >= 0) {
			const startLiteral = node.data[startIndex]
			const target1 = node.data[startIndex + 1]
			const target2 = node.data[startIndex + 2]
			const slot = node.data[startIndex + 3]
			const item = node.data[startIndex + 4]
			const count: CommandComponentNode<any> | undefined = node.data[startIndex + 5]
			ans.push(getCodeAction(
				'command-replaceitem', commandReplaceitem,
				ctx.textDoc, { start: startLiteral.range.start, end: count ? count.range.end : item.range.end },
				`item ${target1.data} ${(target2.data as ArgumentNode)[GetFormattedString](ctx.config.lint)} ${slot.data} replace ${(item.data as ArgumentNode)[GetFormattedString](ctx.config.lint)}${count ? ` ${count.data}` : ''}`
			))
		}
	}
}
