import path from 'path'
import { RenameFile, TextDocumentEdit, WorkspaceEdit } from 'vscode-languageserver'
import { IdentityNode } from '../nodes/IdentityNode'
import { CacheUnitPositionTypes, getCacheFromOffset, getSafeCategory, isCacheUnitPositionType, isFileType, isInternalType, isNamespacedType, removeCachePosition } from '../types/ClientCache'
import { DocNode, Uri } from '../types/handlers'
import { DatapackLanguageService } from './DatapackLanguageService'

export async function onRenameRequest({ node, offset, newName, service }: { node: DocNode, offset: number, newName: string, service: DatapackLanguageService }): Promise<WorkspaceEdit | null> {
	/* istanbul ignore next */
	const result = getCacheFromOffset(node.cache || {}, offset)
	if (result && !isInternalType(result.type)) {
		const documentChanges: (TextDocumentEdit | RenameFile)[] = []
		const category = getSafeCategory(service.cacheFile.cache, result.type)
		const unit = category[result.id]
		/* istanbul ignore else */
		if (unit) {
			try {
				const newID = isNamespacedType(result.type) ? IdentityNode.fromString(newName).toString() : newName

				// Change file contents.
				for (const key of Object.keys(unit)) {
					if (isCacheUnitPositionType(key)) {
						for (const pos of unit[key] ?? []) {
							if (pos.startLine !== pos.endLine || pos.endChar! - pos.startChar! === 0) {
								continue
							}
							const affectedUri = service.parseUri(pos.uri!)
							try {
								const { textDoc: affectedTextDoc } = await service.getDocuments(affectedUri)
								/* istanbul ignore else */
								if (affectedTextDoc) {
									documentChanges.push({
										textDocument: { uri: pos.uri!, version: affectedTextDoc.version },
										edits: [{
											newText: newName,
											range: {
												start: { line: pos.startLine!, character: pos.startChar! },
												end: { line: pos.startLine!, character: pos.endChar! },
											},
										}],
									})
								}
							} catch (e) {
								console.error('[onRenameRequest] ', e)
							}
						}
					}
				}

				// Rename file if necessary.
				if (isFileType(result.type)) {
					const oldID = IdentityNode.fromString(result.id)
					const oldUri = await service.getUriFromId(oldID, result.type)
					/* istanbul ignore next */
					if (!oldUri) {
						console.error(`[onRenameRequest] Failed to get the URI of “${result.type} ${oldID}”.`)
						return null
					}

					let preferredRoot: Uri | undefined
					const oldRel = oldID.toRel(result.type)
					for (const root of service.roots) {
						const abs = path.join(root.fsPath, oldRel)
						if (await service.pathAccessible(abs)) {
							preferredRoot = root
						}
					}
					/* istanbul ignore next */
					if (!preferredRoot) {
						console.error(`[onRenameRequest] Failed to get the preferred root for “${oldRel}” in ${service.roots.map(v => `“${v}”`).join(', ')}.`)
						return null
					}

					const newUri = service.getUriFromId(IdentityNode.fromString(newName), result.type, preferredRoot)
					documentChanges.push(RenameFile.create(oldUri.toString(), newUri.toString(), { ignoreIfExists: true }))

					// Update cache.
					const oldTimestamp = service.cacheFile.files[oldUri.toString()]
					/* istanbul ignore else */
					if (oldTimestamp !== undefined) {
						service.cacheFile.files[newUri.toString()] = oldTimestamp
						delete service.cacheFile.files[oldUri.toString()]
					}

					removeCachePosition(service.cacheFile.cache, oldUri)
					service.onDidCloseTextDocument(oldUri)
				}

				// Update cache.
				const targetUnit = category[newID]
				if (targetUnit) {
					for (const t of CacheUnitPositionTypes) {
						if (unit[t]?.length) {
							(targetUnit[t] = targetUnit[t] ?? []).push(...unit[t]!)
						}
					}
				} else {
					category[newID] = unit
				}
				delete category[result.id]
				service.cacheFile.cache[result.type] = category
			} catch (e) {
				/* istanbul ignore next */
				console.error('[onRenameRequest] ', e)
				return null
			}
		}

		return { documentChanges }
	}

	return null
}
