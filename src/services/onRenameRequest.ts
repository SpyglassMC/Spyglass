import path from 'path'
import { RenameFile, TextDocumentEdit, WorkspaceEdit } from 'vscode-languageserver'
import { getCommandTree } from '../data/CommandTree'
import { getJsonSchemas } from '../data/JsonSchema'
import { getVanillaData } from '../data/VanillaData'
import { IdentityNode } from '../nodes/IdentityNode'
import { Config } from '../types'
import { CacheFile, canBeRenamed, getCacheFromOffset, getSafeCategory, isFileType, isNamespacedType, removeCachePosition } from '../types/ClientCache'
import { DocNode, FetchConfigFunction, DocsOfUris, PathExistsFunction, ReadFileFunction, Uri, UrisOfIds, UrisOfStrings } from '../types/handlers'
import { VersionInformation } from '../types/VersionInformation'
import { getOrCreateInfo, getUri, getUriFromId } from './common'

export async function onRenameRequest({ roots, uris, urisOfIds, pathExists, node, offset, newName, cacheFile, infos, versionInformation, globalStoragePath, fetchConfig, readFile }: { node: DocNode, offset: number, cacheFile: CacheFile, infos: DocsOfUris, newName: string, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, versionInformation?: VersionInformation, globalStoragePath: string|undefined, pathExists: PathExistsFunction, fetchConfig: FetchConfigFunction, readFile: ReadFileFunction }): Promise<WorkspaceEdit | null> {
    // console.log(`BR: ${JSON.stringify(cacheFile)}`)

    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)
    if (result && canBeRenamed(result.type)) {
        const documentChanges: (TextDocumentEdit | RenameFile)[] = []
        const category = getSafeCategory(cacheFile.cache, result.type)
        const unit = category[result.id]
        /* istanbul ignore else */
        if (unit) {
            try {
                const newID = isNamespacedType(result.type) ? IdentityNode.fromString(newName).toString() : newName

                // Change function contents.
                for (const key in unit) {
                    /* istanbul ignore else */
                    if (key === 'def' || key === 'ref') {
                        for (const pos of unit[key]) {
                            const affectedUri = getUri(pos.uri!, uris)
                            const getAffectedConfig = async () => await fetchConfig(affectedUri)
                            const getAffectedCommandTree = async (config: Config) => await getCommandTree(config.env.cmdVersion)
                            const getAffectedVanillaData = async (config: Config) => await getVanillaData(config.env.dataVersion, config.env.dataSource, versionInformation, globalStoragePath)
                            const getAffectedJsonSchemas = async (config: Config) => await getJsonSchemas(config.env.jsonVersion)
                            const getText = async () => readFile(affectedUri.fsPath, 'utf8')
                            const affectedInfo = await getOrCreateInfo(affectedUri, roots, infos, cacheFile, getAffectedConfig, getText, getAffectedCommandTree, getAffectedVanillaData, getAffectedJsonSchemas)
                            /* istanbul ignore else */
                            if (affectedInfo) {
                                documentChanges.push({
                                    textDocument: { uri: pos.uri!, version: affectedInfo.document.version },
                                    edits: [{
                                        newText: newName,
                                        range: {
                                            start: { line: pos.startLine!, character: pos.startChar! },
                                            end: { line: pos.startLine!, character: pos.endChar! }
                                        }
                                    }]
                                })
                            }
                        }
                    }
                }

                // Rename file if necessary.
                if (isFileType(result.type)) {
                    const oldID = IdentityNode.fromString(result.id)
                    const oldUri = await getUriFromId(pathExists, roots, uris, urisOfIds, oldID, result.type)
                    /* istanbul ignore next */
                    if (!oldUri) {
                        return null
                    }

                    let preferredRoot: Uri | undefined
                    const oldRel = oldID.toRel(result.type)
                    for (const root of roots) {
                        const abs = path.join(root.fsPath, oldRel)
                        if (await pathExists(abs)) {
                            preferredRoot = root
                        }
                    }
                    /* istanbul ignore next */
                    if (!preferredRoot) {
                        return null
                    }

                    const newUri = (await getUriFromId(pathExists, roots, uris, urisOfIds, IdentityNode.fromString(newName), result.type, preferredRoot))!
                    documentChanges.push(RenameFile.create(oldUri.toString(), newUri.toString(), { ignoreIfExists: true }))

                    // Update cache.
                    const oldTimestamp = cacheFile.files[oldUri.toString()]
                    /* istanbul ignore else */
                    if (oldTimestamp !== undefined) {
                        cacheFile.files[newUri.toString()] = oldTimestamp
                        delete cacheFile.files[oldUri.toString()]
                    }

                    /* istanbul ignore else */
                    if (result.type === 'function') {
                        removeCachePosition(cacheFile.cache, oldUri)
                    }
                }

                // Update cache.
                const targetUnit = category[newID]
                if (targetUnit) {
                    targetUnit.def.push(...unit.def)
                    targetUnit.ref.push(...unit.ref)
                } else {
                    category[newID] = unit
                    cacheFile.cache[result.type] = category
                }
                delete category[result.id]
            } catch (ignored) {
                /* istanbul ignore next */
                return null
            }
        }

        // console.log(`DC: ${JSON.stringify(documentChanges)}`)
        // console.log(`AR: ${JSON.stringify(cacheFile)}`)
        return { documentChanges }
    }

    return null
}
