import path from 'path'
import FunctionInfo from '../../types/FunctionInfo'
import { TextDocumentEdit, RenameFile, WorkspaceEdit } from 'vscode-languageserver'
import { isFileType, getCacheFromChar, getSafeCategory, isNamespacedType, CacheFile, removeCachePosition } from '../../types/ClientCache'
import { UrisOfStrings, UrisOfIds, PathExistsFunction, Uri, InfosOfUris, FetchConfigFunction, ReadFileFunction } from '../../types/handlers'
import IdentityNode from '../../types/nodes/IdentityNode'
import { getUriFromId, getUri, getInfo } from './common'
import { VanillaReportOptions } from '../../types/ParsingContext'

export default async function onRenameRequest({ info, roots, uris, urisOfIds, pathExists, lineNumber, char, newName, cacheFile, infos, reportOptions, fetchConfig, readFile }: { info: FunctionInfo, lineNumber: number, char: number, cacheFile: CacheFile, infos: InfosOfUris, newName: string, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, reportOptions?: VanillaReportOptions, pathExists: PathExistsFunction, fetchConfig: FetchConfigFunction, readFile: ReadFileFunction }): Promise<WorkspaceEdit | null> {
    // console.log(`BR: ${JSON.stringify(cacheFile)}`)
    const line = info.lines[lineNumber]

    /* istanbul ignore next */
    const result = getCacheFromChar(line.cache || {}, char)
    if (result && result.type !== 'colors') {
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
                            // CHECKME
                            // const info = infos.get(getUri(pos.uri!, uris))
                            const info = await getInfo(getUri(pos.uri!, uris), infos, cacheFile, fetchConfig, readFile, reportOptions)
                            /* istanbul ignore else */
                            if (info) {
                                documentChanges.push({
                                    textDocument: { uri: pos.uri!, version: info.version },
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
