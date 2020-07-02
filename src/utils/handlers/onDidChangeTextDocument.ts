import { Position, Range, TextDocumentContentChangeEvent } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { getSelectedNode, getStringLines, parseStrings } from '.'
import { VanillaData } from '../../data/VanillaData'
import { NodeRange } from '../../nodes'
import { LineNode, Uri } from '../../types'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config } from '../../types/Config'
import { FunctionInfo } from '../../types/FunctionInfo'

function isIncrementalChange(val: TextDocumentContentChangeEvent): val is { range: Range, text: string } {
    return !!(val as any).range
}

export function onDidChangeTextDocument({ uri, info, roots, version, contentChanges, config, cacheFile, commandTree, vanillaData }: { uri: Uri, info: FunctionInfo, version: number, contentChanges: TextDocumentContentChangeEvent[], config: Config, cacheFile: CacheFile, roots: Uri[], commandTree?: CommandTree, vanillaData?: VanillaData }) {
    const lineAmount = getStringLines(info.document.getText()).length
    let lineDelta = 0
    let nodeChange: { nodeStart: number, nodeStop: number, lineStart: number, lineStop: number } | undefined
    for (const change of contentChanges) {
        if (isIncrementalChange(change)) {
            const { index: nodeStart, node: startNode } = getSelectedNode(info.nodes, info.document.offsetAt(change.range.start))
            const { index: nodeStop, node: stopNode } = getSelectedNode(info.nodes, info.document.offsetAt(change.range.end))
            if (nodeStart !== -1 && nodeStop !== -1 && startNode && stopNode) {
                const lineStart = info.document.positionAt(startNode[NodeRange].start).line
                const lineStop = info.document.positionAt(stopNode[NodeRange].end).line
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
        nodeChange = { nodeStart: 0, nodeStop: info.nodes.length - 1, lineStart: 0, lineStop: lineAmount - 1 }
        break
    }
    nodeChange = nodeChange ?? { nodeStart: 0, nodeStop: info.nodes.length - 1, lineStart: 0, lineStop: lineAmount - 1 }

    // Update `document`.
    TextDocument.update(info.document, contentChanges, version)

    // FIXME: only parse the changed node in the future, instead of all nodes following the changed node.
    nodeChange.nodeStop = info.nodes.length - 1
    nodeChange.lineStop = lineAmount - 1

    // Update `lines`.
    const changedNodes: LineNode[] = []
    parseStrings(
        info.document,
        info.document.offsetAt(Position.create(nodeChange.lineStart, 0)),
        info.document.offsetAt(Position.create(nodeChange.lineStop + lineDelta, Infinity)),
        changedNodes, config, cacheFile, uri, roots, undefined, commandTree, vanillaData
    )
    info.nodes.splice(nodeChange.nodeStart, nodeChange.nodeStop - nodeChange.nodeStart + 1, ...changedNodes)
}
