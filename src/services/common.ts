import { INode, SchemaRegistry } from '@mcschema/core'
import * as fs from 'fs'
import { promises as fsp } from 'fs'
import path from 'path'
import { Diagnostic, Proposed, Range } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { URI as Uri } from 'vscode-uri'
import { JsonSchemaType } from '../data/JsonSchema'
import { VanillaData } from '../data/VanillaData'
import { DiagnosticMap, getSelectedNode, JsonDocument, JsonNode } from '../nodes'
import { IdentityNode } from '../nodes/IdentityNode'
import { LanguageConfig } from '../plugins/LanguageConfigImpl'
import { ErrorCode, isMcfunctionDocument, SyntaxComponent, TextRange, ValidateResult } from '../types'
import { FileType } from '../types/ClientCache'
import { CommandTree } from '../types/CommandTree'
import { Config } from '../types/Config'
import { DatapackDocument } from '../types/DatapackDocument'
import { PathAccessibleFunction, UrisOfIds } from '../types/handlers'
import { TokenModifier, TokenType } from '../types/Token'
import { JsonSchemaHelper } from '../utils/JsonSchemaHelper'
import { StringReader } from '../utils/StringReader'
import { DatapackLanguageService } from './DatapackLanguageService'

export function getUri(str: string) {
    return Uri.parse(str)
}

export function getRootUri(str: string) {
    if (str[str.length - 1] !== '/') {
        str = `${str}/`
    }
    return getUri(str)
}

export function getUriFromId(pathExists: PathAccessibleFunction, roots: Uri[], urisOfIds: UrisOfIds, id: IdentityNode, category: FileType, preferredRoot: Uri): Uri
export async function getUriFromId(pathExists: PathAccessibleFunction, roots: Uri[], urisOfIds: UrisOfIds, id: IdentityNode, category: FileType, preferredRoot?: undefined): Promise<Uri | null>
export function getUriFromId(pathExists: PathAccessibleFunction, roots: Uri[], urisOfIds: UrisOfIds, id: IdentityNode, category: FileType, preferredRoot?: Uri): Uri | Promise<Uri | null> {
    const idString = id.toString()
    const key = `${category}|${idString}`

    if (preferredRoot) {
        const rel = id.toRel(category, 'data')
        const uri = getUri(Uri.file(path.join(preferredRoot.fsPath, rel)).toString())
        return uri
    }

    const value = urisOfIds.get(key)
    if (value !== undefined) {
        return Promise.resolve(value)
    }

    return new Promise(async resolve => {
        const rel = id.toRel(category, 'data')
        for (const root of roots) {
            const abs = path.join(root.fsPath, rel)
            if (await pathExists(abs)) {
                const uri = getUri(Uri.file(abs).toString())
                urisOfIds.set(key, uri)
                resolve(uri)
            }
        }

        resolve(null)
    })
}

export function parseJsonNode({ service, textDoc, config, uri, schema, commandTree, vanillaData, jsonSchemas, schemaType }: { service: DatapackLanguageService, textDoc: TextDocument, config: Config, uri: Uri, schema: INode, commandTree: CommandTree, jsonSchemas: SchemaRegistry, schemaType: JsonSchemaType, vanillaData: VanillaData }): JsonNode {
    const ans: JsonNode = {
        json: service.jsonService.parseJSONDocument(textDoc) as JsonDocument,
        schemaType,
        ...ValidateResult.create()
    }
    const ctx = service.getParsingContextSync({ textDoc, uri, commandTree, config, jsonSchemas, vanillaData })
    JsonSchemaHelper.validate(ans, ans.json.root, schema, ctx)
    return ans
}

export function parseSyntaxComponents(service: DatapackLanguageService, textDoc: TextDocument, start: number = 0, end: number = textDoc.getText().length, config: Config, uri: Uri, cursor = -1, commandTree: CommandTree, vanillaData: VanillaData, jsonSchemas: SchemaRegistry, languageConfigs: Map<string, LanguageConfig>) {
    const ans: SyntaxComponent[] = []
    const string = textDoc.getText()
    const reader = new StringReader(string, start, end)
    const ctx = service.getParsingContextSync({ textDoc, uri, cursor, commandTree, config, jsonSchemas, vanillaData })
    const componentParsers = languageConfigs?.get(textDoc.languageId)?.syntaxComponentParsers ?? []
    const currentLine = () => textDoc.positionAt(reader.cursor).line
    const finalLine = textDoc.positionAt(end).line
    let lastLine = -1
    while (lastLine < currentLine() && currentLine() <= finalLine) {
        const matchedParsers = componentParsers
            .map(v => ({ parser: v, testResult: v.test(reader.clone(), ctx) }))
            .filter(v => v.testResult[0])
            .sort((a, b) => b.testResult[1] - a.testResult[1])
        if (matchedParsers.length > 0) {
            // TODO: Handle correctly when there are multiple matched components.
            const result = matchedParsers[0].parser.parse(reader, ctx)
            ans.push(result)
        } else {
            console.error(`[parseSyntaxComponents] No matched parser at [${reader.cursor}] with “${reader.remainingString}”.`)
            break
        }
        lastLine = currentLine()
        reader.nextLine(textDoc)
    }
    return ans
}

export function getRelAndRootIndex(uri: Uri, roots: Uri[]): { rel: string, index: number } | null {
    for (const [i, root] of roots.entries()) {
        if (uri.toString().startsWith(root.toString())) {
            return {
                rel: path.relative(root.fsPath, uri.fsPath),
                index: i
            }
        }
    }
    return null
}

export function getRel(uri: Uri, roots: Uri[]): string | undefined {
    return getRelAndRootIndex(uri, roots)?.rel

}

export function getId(uri: Uri, roots: Uri[]) {
    return IdentityNode.fromRel(getRel(uri, roots))
}

export function getRootIndex(uri: Uri, roots: Uri[]): number | null {
    return getRelAndRootIndex(uri, roots)?.index ?? null
}

export async function getTextDocument({ uri, langID, getText, version }: { uri: Uri, langID: 'mcfunction' | 'json', getText: () => Promise<string>, version: number | null }) {
    return TextDocument.create(uri.toString(), langID, version as number, await getText())
}

export function getDiagnosticMap(diagnostics: Diagnostic[]) {
    const diagnosticsMap: DiagnosticMap = {}
    for (const diag of diagnostics) {
        if (diag.code !== undefined) {
            const code = diag.code as ErrorCode
            diagnosticsMap[code] = diagnosticsMap[code] || []
            diagnosticsMap[code]!.push(diag)
        }
    }
    return diagnosticsMap
}

/* istanbul ignore next */
export function getSemanticTokensLegend(): Proposed.SemanticTokensLegend {
    const tokenTypes: string[] = []
    for (let i = 0; i < TokenType._; i++) {
        const str = TokenType[i]
        tokenTypes.push(str)
    }

    const tokenModifiers: string[] = []
    for (let i = 0; i < TokenModifier._; i++) {
        const str = TokenModifier[i]
        tokenModifiers.push(str)
    }

    return { tokenTypes, tokenModifiers }
}

export function getLspRange(textDoc: TextDocument, { start, end }: TextRange) {
    return Range.create(textDoc.positionAt(start), textDoc.positionAt(end))
}

export function getStringLines(string: string) {
    return string.split(/\r\n|\r|\n/)
}

export function getSelectedNodeFromInfo(info: DatapackDocument, offset: number): { index: number, node: JsonNode | SyntaxComponent | null } {
    return isMcfunctionDocument(info) ? getSelectedNode(info.nodes, offset) : { index: 0, node: info.nodes[0] }
}

export function partitionedIteration<T>(iterator: IterableIterator<T>, onEachItem: (item: T) => any) {
    return new Promise<void>((resolve, reject) => {
        try {
            const help = async () => {
                const { done, value: item } = iterator.next()
                if (!done) {
                    await onEachItem(item)
                    setImmediate(help)
                } else {
                    resolve()
                }
            }
            help()
        } catch (e) {
            reject(e)
        }
    })
}

/* istanbul ignore next */
export async function walkFile(
    workspaceRootPath: string,
    abs: string,
    onFile: (abs: string, rel: string, stat: fs.Stats) => any,
    pathFilter: (abs: string, rel: string, stat: fs.Stats) => Promise<boolean> = () => Promise.resolve(true)
): Promise<any> {
    const names = (await fsp.readdir(abs)).values()
    return partitionedIteration(names, async name => {
        const newAbs = path.join(abs, name)
        const stat = await fsp.stat(newAbs)
        const rel = path.relative(workspaceRootPath, newAbs)
        if (!await pathFilter(newAbs, rel, stat)) {
            return
        }
        if (stat.isDirectory()) {
            return walkFile(workspaceRootPath, newAbs, onFile)
        } else {
            return onFile(newAbs, rel, stat)
        }
    })
}

/* istanbul ignore next */
export async function walkRoot(
    workspaceRoot: Uri,
    abs: string,
    cb: (xabs: string, stat: fs.Stats) => any,
    depth = Infinity
): Promise<any> {
    if (depth <= 0) {
        return
    }
    const names = await fsp.readdir(abs)
    const promises: Promise<any>[] = []
    for (const name of names) {
        const newAbs = path.join(abs, name)
        const stat = await fsp.stat(newAbs)
        if (stat.isDirectory()) {
            cb(newAbs, stat)
            promises.push(walkRoot(workspaceRoot, newAbs, cb, depth - 1))
        }
    }
    return Promise.all(promises)
}
