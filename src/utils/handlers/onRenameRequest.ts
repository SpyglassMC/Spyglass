import path from 'path'
import { RenameFile, TextDocumentEdit, WorkspaceEdit } from 'vscode-languageserver'
import { CacheFile, canBeRenamed, getCacheFromChar, getSafeCategory, isFileType, isNamespacedType, removeCachePosition } from '../../types/ClientCache'
import FunctionInfo from '../../types/FunctionInfo'
import { FetchConfigFunction, InfosOfUris, PathExistsFunction, ReadFileFunction, Uri, UrisOfIds, UrisOfStrings } from '../../types/handlers'
import IdentityNode from '../../types/nodes/IdentityNode'
import { getInfo, getUri, getUriFromId } from './common'
import { getCommandTree } from '../../data/CommandTree'
import { getVanillaData } from '../../data/VanillaData'
import VersionInformation from '../../types/VersionInformation'

export default async function onRenameRequest({ info, roots, uris, urisOfIds, pathExists, lineNumber, char, newName, cacheFile, infos, versionInformation, globalStoragePath, fetchConfig, readFile }: { info: FunctionInfo, lineNumber: number, char: number, cacheFile: CacheFile, infos: InfosOfUris, newName: string, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, versionInformation?: VersionInformation, globalStoragePath: string, pathExists: PathExistsFunction, fetchConfig: FetchConfigFunction, readFile: ReadFileFunction }): Promise<WorkspaceEdit | null> {
    // console.log(`BR: ${JSON.stringify(cacheFile)}`)
    const line = info.lines[lineNumber]

    /* istanbul ignore next */
    const result = getCacheFromChar(line.cache || {}, char)
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
                            const affectedConfig = await fetchConfig(affectedUri)
                            const commandTree = await getCommandTree(affectedConfig.env.cmdVersion)
                            const vanillaData = await getVanillaData(affectedConfig.env.dataVersion, affectedConfig.env.dataSource, versionInformation, globalStoragePath)
                            const affectedInfo = await getInfo(affectedUri, roots, infos, cacheFile, affectedConfig, readFile, commandTree, vanillaData)
                            /* istanbul ignore else */
                            if (affectedInfo) {
                                documentChanges.push({
                                    textDocument: { uri: pos.uri!, version: affectedInfo.version },
                                    edits: [{
                                        newText: newName,
                                        range: {
                                            start: { line: pos.line!, character: pos.start },
                                            end: { line: pos.line!, character: pos.end }
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
                    if (result.type === 'functions') {
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
