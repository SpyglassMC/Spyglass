import { Position, Range, TextDocumentContentChangeEvent } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { VanillaData } from '../data/VanillaData'
import { getSelectedNode, NodeRange } from '../nodes'
import { LineNode, Uri } from '../types'
import { CommandTree } from '../types/CommandTree'
import { Config } from '../types/Config'
import { McfunctionDocument } from '../types/DatapackDocument'
import { getStringLines, parseFunctionNodes } from './common'
import { DatapackLanguageService } from './DatapackLanguageService'
import { SchemaRegistry } from '@mcschema/core'

function isIncrementalChange(val: TextDocumentContentChangeEvent): val is { range: Range, text: string } {
    return !!(val as any).range
}

export async function onDidChangeTextDocument({ textDoc, uri, doc, version, contentChanges, config, service, commandTree, vanillaData, jsonSchemas }: { uri: Uri, doc: McfunctionDocument, textDoc: TextDocument, version: number, contentChanges: TextDocumentContentChangeEvent[], config: Config, service: DatapackLanguageService, commandTree?: CommandTree, vanillaData?: VanillaData, jsonSchemas?: SchemaRegistry }) {
    const lineAmount = getStringLines(textDoc.getText()).length
    let lineDelta = 0
    let nodeChange: { nodeStart: number, nodeStop: number, lineStart: number, lineStop: number } | undefined
    for (const change of contentChanges) {
        if (isIncrementalChange(change)) {
            const { index: nodeStart, node: startNode } = getSelectedNode(doc.nodes, textDoc.offsetAt(change.range.start))
            const { index: nodeStop, node: stopNode } = getSelectedNode(doc.nodes, textDoc.offsetAt(change.range.end))
            if (nodeStart !== -1 && nodeStop !== -1 && startNode && stopNode) {
                const lineStart = textDoc.positionAt(startNode[NodeRange].start).line
                const lineStop = textDoc.positionAt(stopNode[NodeRange].end).line
                nodeChange = nodeChange ?? { nodeStart, nodeStop, lineStart, lineStop }
                nodeChange.nodeStart = Math.min(nodeChange.nodeStart, nodeStart)
                nodeChange.nodeStop = Math.max(nodeChange.nodeStop, nodeStop)
                nodeChange.lineStart = Math.min(nodeChange.lineStart, lineStart)
                nodeChange.lineStop = Math.max(nodeChange.lineStop, lineStop)
                lineDelta += getStringLines(change.text).length - (change.range.end.line + 1 - change.range.start.line)
                continue
            }
        }
        lineDelta = 0
        nodeChange = { nodeStart: 0, nodeStop: doc.nodes.length - 1, lineStart: 0, lineStop: lineAmount - 1 }
        break
    }
    nodeChange = nodeChange ?? { nodeStart: 0, nodeStop: doc.nodes.length - 1, lineStart: 0, lineStop: lineAmount - 1 }

    // Update `document`.
    TextDocument.update(textDoc, contentChanges, version)

    // FIXME: only parse the changed node in the future, instead of all nodes following the changed node.
    nodeChange.nodeStop = doc.nodes.length - 1
    nodeChange.lineStop = lineAmount - 1

    // Update `lines`.
    const changedNodes: LineNode[] = []
    await parseFunctionNodes(
        service,
        textDoc,
        textDoc.offsetAt(Position.create(nodeChange.lineStart, 0)),
        textDoc.offsetAt(Position.create(nodeChange.lineStop + lineDelta, Infinity)),
        changedNodes, config, service.cacheFile, uri, service.roots, undefined, commandTree, vanillaData, jsonSchemas
    )
    doc.nodes.splice(nodeChange.nodeStart, nodeChange.nodeStop - nodeChange.nodeStart + 1, ...changedNodes)
}
