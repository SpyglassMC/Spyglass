import { INode, SchemaRegistry } from '@mcschema/core'
import * as fs from 'fs'
import { promises as fsp } from 'fs'
import path from 'path'
import { Diagnostic, Position, Proposed, Range } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { URI as Uri } from 'vscode-uri'
import { JsonSchemaType } from '../data/JsonSchema'
import { VanillaData } from '../data/VanillaData'
import { DiagnosticMap, getSelectedNode, JsonDocument, JsonNode, NodeRange } from '../nodes'
import { IdentityNode } from '../nodes/IdentityNode'
import { LineParser } from '../parsers/LineParser'
import { ErrorCode, isMcfunctionDocument, LineNode, TextRange } from '../types'
import { CacheFile, ClientCache, FileType, getCacheForUri } from '../types/ClientCache'
import { CommandTree } from '../types/CommandTree'
import { Config } from '../types/Config'
import { DatapackDocument } from '../types/DatapackDocument'
import { DocNode, PathAccessibleFunction, UrisOfIds, UrisOfStrings } from '../types/handlers'
import { constructContext } from '../types/ParsingContext'
import { TokenModifier, TokenType } from '../types/Token'
import { JsonSchemaHelper } from '../utils/JsonSchemaHelper'
import { StringReader } from '../utils/StringReader'
import { DatapackLanguageService } from './DatapackLanguageService'

export function getUri(str: string, uris: UrisOfStrings) {
    const value = uris.get(str)
    if (value) {
        return value
    } else {
        const ans = Uri.parse(str)
        uris.set(str, ans)
        return ans
    }
}

export function getRootUri(str: string, uris: UrisOfStrings) {
    if (str[str.length - 1] !== '/') {
        str = `${str}/`
    }
    return getUri(str, uris)
}

/**
 * @returns Never be `null` if `preferredRoot` exists.
 */
export async function getUriFromId(pathExists: PathAccessibleFunction, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, id: IdentityNode, category: FileType, preferredRoot?: Uri): Promise<Uri | null> {
    const idString = id.toString()
    const key = `${category}|${idString}`

    if (preferredRoot) {
        const rel = id.toRel(category, 'data')
        const uri = getUri(Uri.file(path.join(preferredRoot.fsPath, rel)).toString(), uris)
        return uri
    }

    const value = urisOfIds.get(key)
    if (value !== undefined) {
        return value
    }

    const rel = id.toRel(category, 'data')
    for (const root of roots) {
        const abs = path.join(root.fsPath, rel)
        if (await pathExists(abs)) {
            const uri = getUri(Uri.file(abs).toString(), uris)
            urisOfIds.set(key, uri)
            return uri
        }
    }
    // console.warn(`Namespaced ID “${key}” cannot be resolved in any root`)

    urisOfIds.set(key, null)
    return null
}

export function parseJsonNode({ service, document, config, cache, uri, roots, schema, vanillaData, jsonSchemas, schemaType }: { service: DatapackLanguageService, document: TextDocument, config: Config, cache: ClientCache, uri: Uri, roots: Uri[], schema: INode, jsonSchemas: SchemaRegistry, schemaType: JsonSchemaType, vanillaData: VanillaData }): JsonNode {
    const ans: JsonNode = {
        json: service.jsonService.parseJSONDocument(document) as JsonDocument,
        cache: {}, errors: [], tokens: [], schemaType
    }
    const ctx = constructContext({
        cache: getCacheForUri(cache, uri),
        id: getId(uri, roots),
        rootIndex: getRootIndex(uri, roots),
        blockDefinition: vanillaData.BlockDefinition,
        namespaceSummary: vanillaData.NamespaceSummary,
        nbtdoc: vanillaData.Nbtdoc,
        registry: vanillaData.Registry,
        config, textDoc: document, roots, service
    }, undefined, vanillaData, jsonSchemas)
    JsonSchemaHelper.validate(ans, ans.json.root, schema, ctx)
    return ans
}

export function parseFunctionNodes(service: DatapackLanguageService, document: TextDocument, start: number = 0, end: number = document.getText().length, nodes: DocNode[], config: Config, cacheFile: CacheFile, uri: Uri, roots: Uri[], cursor = -1, commandTree?: CommandTree, vanillaData?: VanillaData, jsonSchemas?: SchemaRegistry) {
    const startPos = document.positionAt(start)
    const lines = getStringLines(
        document.getText(Range.create(startPos, document.positionAt(end)))
    )
    for (let i = 0; i < lines.length; i++) {
        parseFunctionNode({
            document: document,
            start: document.offsetAt(Position.create(startPos.line + i, 0)),
            end: document.offsetAt(Position.create(startPos.line + i, Infinity)),
            id: getId(uri, roots),
            rootIndex: getRootIndex(uri, roots),
            nodes, config, cacheFile, uri, roots, cursor, commandTree, vanillaData, service, jsonSchemas
        })
    }
}

export function parseFunctionNode({ service, document, start, end, nodes, config, cacheFile, uri, roots, cursor = -1, commandTree, vanillaData, jsonSchemas, id, rootIndex }: { service: DatapackLanguageService, document: TextDocument, start: number, end: number, nodes: DocNode[], config: Config, cacheFile: CacheFile, uri: Uri, roots: Uri[], id: IdentityNode | undefined, rootIndex: number | null, cursor?: number, commandTree?: CommandTree, vanillaData?: VanillaData, jsonSchemas?: SchemaRegistry }) {
    const parser = new LineParser(false, 'line')
    const string = document.getText()
    const reader = new StringReader(string, start, end)
    let lineEnd = end
    reader.skipWhiteSpace()
    while (true) {
        const char = string.charAt(reader.end - 1)
        if (StringReader.isWhiteSpace(char) && reader.end > start) {
            // Remove the whitespaces at the end of this line
            reader.end--
            if (char === '\r' || char === '\n') {
                // Remove the line breaks after the end of this line
                lineEnd--
            }
        } else {
            break
        }
    }
    if (reader.remainingString.length === 0) {
        // This empty node will be selected in methods like `onCompletion`.
        nodes.push({
            [NodeRange]: { start, end: lineEnd },
            args: [], hint: { fix: [], options: [] }, tokens: []
        })
    } else {
        const { data } = parser.parse(reader, constructContext({
            cache: getCacheForUri(cacheFile.cache, uri),
            config,
            cursor,
            textDoc: document,
            id,
            rootIndex,
            roots,
            service
        }, commandTree, vanillaData, jsonSchemas))
        nodes.push(data)
    }
}

export function getRel(uri: Uri, roots: Uri[]) {
    for (const root of roots) {
        if (uri.fsPath.startsWith(root.fsPath)) {
            return path.relative(root.fsPath, uri.fsPath)
        }
    }
    // console.warn(`Path “${uri.fsPath}” does not belong to any datapack roots (${roots})`)
    return undefined
}

export function getId(uri: Uri, roots: Uri[]) {
    return IdentityNode.fromRel(getRel(uri, roots))?.id
}

export function getRootIndex(uri: Uri, roots: Uri[]): number | null {
    for (const [i, root] of roots.entries()) {
        if (uri.toString().startsWith(root.toString())) {
            return i
        }
    }
    return null
}

/* istanbul ignore next */
// export async function getInfo(uri: Uri, infos: DocsOfUris): Promise<DatapackDocument | undefined> {
//     const result = infos.get(uri)
//     if (result instanceof Promise) {
//         const ans = await result
//         if (ans) {
//             infos.set(uri, ans)
//             return ans
//         }
//     } else {
//         return result
//     }
//     return undefined
// }

export async function getTextDocument({ uri, langId, getText, version }: { uri: Uri, langId?: string, getText: () => Promise<string>, version: number | null }) {
    langId = langId ?? (uri.fsPath.endsWith('json') || uri.fsPath.endsWith('.mcmeta') ? 'json' : 'mcfunction')
    return TextDocument.create(uri.toString(), langId, version as number, await getText())
}

/* istanbul ignore next */
// export async function createInfo({ roots, uri, version, cacheFile, langId, getText, getConfig, getCommandTree, getVanillaData, getJsonSchemas }: { uri: Uri, roots: Uri[], version: number | null, langId?: string, getText: () => Promise<string>, getConfig: () => Promise<Config>, cacheFile: CacheFile, getCommandTree: (config: Config) => Promise<CommandTree>, getVanillaData: (config: Config) => Promise<VanillaData>, getJsonSchemas: (config: Config) => Promise<SchemaRegistry> }): Promise<DatapackDocument | undefined> {
//     try {
//         const rel = getRel(uri, roots)
//         const config = await getConfig()
//         if (rel && isRelIncluded(rel, config)) {
//             const text = await getText()
//             const vanillaData = await getVanillaData(config)
//             langId = langId ?? (rel.endsWith('json') || rel.endsWith('.mcmeta') ? 'json' : 'mcfunction')
//             const document: TextDocument = TextDocument.create(uri.toString(), langId, version as number, text)
//             if (langId === 'json') {
//                 const schemaType = getJsonSchemaType(rel)
//                 if (schemaType) {
//                     const schemas = await getJsonSchemas(config)
//                     const schema = schemas.get(schemaType)
//                     const node = parseJsonNode({ uri, roots, document, config, cacheFile, schema, schemas, schemaType, vanillaData })
//                     return { config, document, node }
//                 }
//             } else {
//                 const commandTree = await getCommandTree(config)
//                 const nodes: LineNode[] = []
//                 parseFunctionNodes(document, undefined, undefined, nodes, config, cacheFile, uri, roots, undefined, commandTree, vanillaData)
//                 return { config, document, nodes }
//             }
//         }
//     } catch (e) {
//         console.error('[createInfo]', e)
//     }
//     return undefined
// }

// export async function getOrCreateInfo(uri: Uri, roots: Uri[], infos: DocsOfUris, cacheFile: CacheFile, getConfig: () => Promise<Config>, getText: () => Promise<string>, getCommandTree: (config: Config) => Promise<CommandTree>, getVanillaData: (config: Config) => Promise<VanillaData>, getJsonSchemas: (config: Config) => Promise<SchemaRegistry>, version: number | null = null): Promise<DatapackDocument | undefined> {
//     let info = infos.get(uri)

//     if (!info) {
//         info = await createInfo({ uri, roots, cacheFile, version, getConfig, getText, getCommandTree, getVanillaData, getJsonSchemas })
//     }

//     return info
// }

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

export function getLspRange(content: TextDocument, { start, end }: TextRange) {
    return Range.create(content.positionAt(start), content.positionAt(end))
}

export function getStringLines(string: string) {
    return string.split(/\r\n|\r|\n/)
}

export function getSelectedNodeFromInfo(info: DatapackDocument, offset: number): { index: number, node: JsonNode | LineNode | null } {
    return isMcfunctionDocument(info) ? getSelectedNode(info.nodes, offset) : { index: 0, node: info.nodes[0] }
}

/* istanbul ignore next */
export async function walkFile(
    workspaceRootPath: string,
    abs: string,
    cb: (abs: string, rel: string, stat: fs.Stats) => any
): Promise<any> {
    const names = (await fsp.readdir(abs)).values()
    return new Promise((resolve, reject) => {
        try {
            const help = async () => {
                const { done, value: name } = names.next()
                if (!done) {
                    const newAbs = path.join(abs, name)
                    const stat = await fsp.stat(newAbs)
                    if (stat.isDirectory()) {
                        await walkFile(workspaceRootPath, newAbs, cb)
                    } else {
                        const rel = path.relative(workspaceRootPath, newAbs)
                        await cb(newAbs, rel, stat)
                    }
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
