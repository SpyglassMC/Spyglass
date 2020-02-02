import * as fs from 'fs-extra'
import * as path from 'path'
import clone from 'clone'
import { URI as Uri } from 'vscode-uri'
import { createConnection, ProposedFeatures, TextDocumentSyncKind, ColorInformation, ColorPresentation, TextDocumentEdit, FileChangeType, RenameFile, DocumentLink, DocumentHighlight, InitializeResult, DiagnosticSeverity, Proposed, SelectionRange } from 'vscode-languageserver'
import { getSafeCategory, CacheUnit, CacheFile, ClientCache, combineCache, CacheKey, removeCacheUnit, removeCachePosition, trimCache, getCacheFromChar, isFileType, CachePosition, isNamespacedType, LatestCacheFileVersion, DefaultCacheFile, CacheCategory } from './types/ClientCache'
import Config, { VanillaConfig } from './types/Config'
import { lineToLintedString } from './types/Line'
import LineParser from './parsers/LineParser'
import StringReader from './utils/StringReader'
import Identity from './types/Identity'
import { constructContext } from './types/ParsingContext'
import { loadLocale, locale } from './locales/Locales'
import onDidOpenTextDocument from './utils/handlers/onDidOpenTextDocument'
import { getUri, parseString, getRel, getSemanticTokensLegend, getId } from './utils/handlers/common'
import FunctionInfo from './types/FunctionInfo'
import onDidCloseTextDocument from './utils/handlers/onDidCloseTextDocument'
import onDidChangeTextDocument from './utils/handlers/onDidChangeTextDocument'
import onSemanticTokens from './utils/handlers/onSemanticTokens'
import onSemanticTokensEdits from './utils/handlers/onSemanticTokensEdits'
import onCompletion from './utils/handlers/onCompletion'
import { getCallHierarchyItem } from './utils/handlers/onCallHierarchy'
import TagInfo from './types/TagInfo'
import onSignatureHelp from './utils/handlers/onSignatureHelp'
import onFoldingRanges from './utils/handlers/onFoldingRanges'
import { WorkDoneProgress } from 'vscode-languageserver/lib/progress'

const connection = createConnection(ProposedFeatures.all)
// const isInitialized = false
const uris = new Map<string, Uri>()
const infos = new Map<Uri, FunctionInfo>()
/**
 * A map of namespaced IDs (in form of `type|ID`) and URIs.
 * TODO(#251): This map will be cleared when the workspace folders are changed.
 */
const urisOfIds = new Map<string, Uri | null>()
/**
 * Sorted by priority. If you want to read something in which Minecraft does,
 * iterate from the last element of this array to the first element.
 */
const roots: Uri[] = []

let cachePath: string | undefined
let cacheFile: CacheFile = clone(DefaultCacheFile)

connection.onInitialize(async ({ workspaceFolders, initializationOptions: { storagePath } }, _, progress) => {
    await loadLocale()

    progress.begin(locale('server.initializing'))

    if (workspaceFolders) {
        // The later the root folder is, the later it will be loaded, the higher the priority it has.
        // So the roots stored in `roots` is sorted by priority DESC.
        for (let i = workspaceFolders.length - 1; i >= 0; i--) {
            let { uri: uriString } = workspaceFolders[i]
            if (uriString[uriString.length - 1] !== '/') {
                uriString = `${uriString}/`
            }
            const uri = getUri(uriString, uris)
            // if (
            //     await fs.pathExists(path.join(uri.fsPath, 'pack.mcmeta')) &&
            //     await fs.pathExists(path.join(uri.fsPath, 'data'))
            // ) {
            roots.push(uri)
            connection.console.info(`root${roots.length}Uri = ${uri.toString()}`)
            // Show messages for legacy cache file which was saved in the root of your workspace. 
            const legacyDotPath = path.join(uri.fsPath, '.datapack')
            if (await fs.pathExists(legacyDotPath)) {
                connection.window.showInformationMessage(locale('server.remove-cache-file'))
            }
            // } else {
            //     connection.console.info(`invalidDatapackRoot - ${uri.toString()}`)
            // }
        }

        cachePath = path.join(storagePath, './cache.json')

        connection.console.info(`storagePath = ${storagePath}`)
        connection.console.info(`cachePath = ${cachePath}`)
        if (!await fs.pathExists(storagePath)) {
            await fs.mkdirp(storagePath)
        }
        if (fs.existsSync(cachePath)) {
            cacheFile = await fs.readJson(cachePath, { encoding: 'utf8' })
            if (cacheFile.version !== LatestCacheFileVersion) {
                cacheFile = clone(DefaultCacheFile)
            }
        }
        await updateCacheFile(cacheFile, roots)
        saveCacheFile()
    }

    const result: InitializeResult & { capabilities: Proposed.CallHierarchyServerCapabilities & Proposed.SemanticTokensServerCapabilities } = {
        capabilities: {
            callHierarchyProvider: true,
            colorProvider: true,
            completionProvider: {
                triggerCharacters: [' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.', '@'],
                allCommitCharacters: [' ', ',', '{', '[', '=', ':', '/', "'", '"', '.', '}', ']']
            },
            definitionProvider: true,
            // didChangeWatchedFiles: true,
            documentFormattingProvider: true,
            documentHighlightProvider: true,
            documentLinkProvider: {},
            executeCommandProvider: {
                commands: ['datapackLanguageServer.regenerageCache']
            },
            foldingRangeProvider: true,
            // hoverProvider: true,
            referencesProvider: true,
            renameProvider: {
                prepareProvider: true
            },
            semanticTokensProvider: {
                legend: getSemanticTokensLegend(),
                documentProvider: {
                    edits: true,
                }
            },
            signatureHelpProvider: {
                triggerCharacters: [' ']
            },
            textDocumentSync: {
                change: TextDocumentSyncKind.Incremental,
                openClose: true
            },
            workspace: {
                workspaceFolders: {
                    supported: true,
                    changeNotifications: true
                }
            }
        }
    }

    return result
})

connection.onInitialized(() => {
    connection.onDidOpenTextDocument(async ({ textDocument: { text, uri: uriString, version } }) => {
        const uri = getUri(uriString, uris)
        const config = await fetchConfig(uri)

        await onDidOpenTextDocument({ text, uri, version, infos, config, cacheFile })

        updateDiagnostics(uri)
    })
    connection.onDidChangeTextDocument(async ({ contentChanges, textDocument: { uri: uriString, version } }) => {
        // connection.console.info(`BC: ${JSON.stringify(cacheFile)}`)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return
        }
        const config = info.config

        await onDidChangeTextDocument({ info, version, contentChanges, config, cacheFile })

        cacheFileOperations.fileModified(uri, 'functions')
        trimCache(cacheFile.cache)

        updateDiagnostics(uri)
        // connection.console.info(`AC: ${JSON.stringify(cacheFile)}`)
    })
    connection.onDidCloseTextDocument(({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)

        onDidCloseTextDocument({ uri, infos })
    })

    connection.onDidChangeWatchedFiles(async ({ changes }) => {
        // connection.console.info(`BW: ${JSON.stringify(cacheFile)}`)
        // connection.console.info(`WC: ${JSON.stringify(changes)}`)
        for (const { uri: uriString, type } of changes) {
            const uri = getUri(uriString, uris)

            // connection.console.info(JSON.stringify({ uri, type }))
            // connection.console.info(rel)

            switch (type) {
                case FileChangeType.Created: {
                    const stat = await fs.stat(uri.fsPath)
                    if (stat.isDirectory()) {
                        for (const root of roots) {
                            if (uri.fsPath.startsWith(root.fsPath)) {
                                await walk(
                                    root.fsPath,
                                    uri.fsPath,
                                    async (abs, rel, stat) => {
                                        const result = Identity.fromRel(rel)
                                        if (result) {
                                            const { category, id, ext } = result
                                            const uri = getUri(abs, uris)
                                            const uriString = uri.toString()
                                            if (Identity.isExtValid(ext, category)) {
                                                await cacheFileOperations.fileAdded(category, id)
                                                cacheFile.files[uriString] = stat.mtimeMs
                                            }
                                        }
                                    }
                                )
                            }
                        }
                    } else {
                        const result = Identity.fromRel(getRel(uri, roots) as string)
                        if (result) {
                            const { category, id, ext } = result
                            if (Identity.isExtValid(ext, category)) {
                                await cacheFileOperations.fileAdded(category, id)
                                cacheFile.files[uriString] = stat.mtimeMs
                            }
                        }
                    }
                    break
                }
                case FileChangeType.Changed: {
                    // TODO(#252): Check if external changes or workspace edits will trigger
                    // onDidChangeTextDocument for opened ocuments.
                    // TODO(#252): Only trigger update for non-opened documents.

                    // TODO(#252): ALTERNATIVELY, check onWillSaveDocument to see if this Changed should be handled.

                    const stat = await fs.stat(uri.fsPath)
                    if (stat.isFile()) {
                        const result = Identity.fromRel(getRel(uri, roots) as string)
                        if (result && result.category === 'tags/functions') {
                            const { category, ext } = result
                            if (Identity.isExtValid(ext, category)) {
                                await cacheFileOperations.fileModified(uri, category)
                                cacheFile.files[uriString] = stat.mtimeMs
                            }
                        }
                    }
                    break
                }
                case FileChangeType.Deleted:
                default: {
                    // connection.console.info(`FileChangeType.Deleted ${rel}`)
                    for (const fileUriString in cacheFile.files) {
                        if (cacheFile.files.hasOwnProperty(fileUriString)) {
                            if (fileUriString === uriString || fileUriString.startsWith(`${uriString}/`)) {
                                const fileUri = getUri(fileUriString, uris)
                                const result = Identity.fromRel(getRel(fileUri, roots) as string)
                                // connection.console.info(`result = ${JSON.stringify(result)}`)
                                if (result) {
                                    const { category, id, ext } = result
                                    if (Identity.isExtValid(ext, category)) {
                                        cacheFileOperations.fileDeleted(fileUri, category, id)
                                        delete cacheFile.files[fileUriString]
                                    }
                                }
                            }
                        }
                    }
                    break
                }
            }
        }

        trimCache(cacheFile.cache)
        // connection.console.info(`AW: ${JSON.stringify(cacheFile)}`)
    })

    connection.onCompletion(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        return onCompletion({ cacheFile, lineNumber, char, info })
    })

    connection.onSignatureHelp(async ({ textDocument: { uri: uriString }, position: { character: char, line: lineNumber } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        return onSignatureHelp({ cacheFile, lineNumber, char, info })
    })

    connection.onFoldingRanges(({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        return onFoldingRanges({ info })
    })

    connection.onDocumentFormatting(async ({ textDocument: { uri: uriString } }) => {
        // TODO(#230)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const config = info.config
        if (config.lint.enableFormatting) {
            const lines = info.lines
            const strings = info.strings
            const ansStrings = []
            for (let i = 0; i < lines.length; i++) {
                const string = strings[i]
                const line = lines[i]
                if (line.errors && line.errors.filter(v => v.severity === DiagnosticSeverity.Error).length > 0) {
                    return null
                }
                const prefix = string.match(/^[\s\t]*/) ? (string.match(/^[\s\t]*/) as Array<string>)[0] : ''
                ansStrings.push(prefix + lineToLintedString(line, config.lint))
            }
            return [{
                range: { start: { line: 0, character: 0 }, end: { line: Number.MAX_VALUE, character: Number.MAX_VALUE } },
                newText: ansStrings.join(info.lineBreak)
            }]
        }
        return null
    })

    connection.onDefinition(async ({ textDocument: { uri }, position: { character: char, line: number } }) => {
        // TODO(#230)
        return await getReferencesOrDefinition(uri, number, char, 'def')
    })
    connection.onReferences(async ({ textDocument: { uri }, position: { character: char, line: number } }) => {
        // TODO(#230)
        return await getReferencesOrDefinition(uri, number, char, 'ref')
    })

    connection.onDocumentHighlight(async ({ textDocument: { uri: uriString }, position: { character: char, line: number } }) => {
        // TODO(#230)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const lines = info.lines
        const line = lines[number]
        const result = getCacheFromChar(line.cache || {}, char)
        if (result) {
            const ans: DocumentHighlight[] = []
            let i = 0
            for (const line of lines) {
                const unit = getSafeCategory(line.cache, result.type)[result.id]
                if (unit) {
                    const ref = [...unit.def, ...unit.ref]
                    if (ref.length > 0) {
                        ans.push(...ref.map(v => ({
                            range: {
                                start: { line: i, character: v.start },
                                end: { line: i, character: v.end }
                            }
                        })))
                    }
                }
                i++
            }
            return ans
        }
        return null
    })

    connection.languages.callHierarchy.onPrepare(async ({ position: { character: char, line: lineNumber }, textDocument: { uri: uriString } }) => {
        // TODO(#230)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }

        const line = info.lines[lineNumber]
        const result = getCacheFromChar(line.cache || {}, char)
        if (result) {
            if (result.type === 'functions') {
                const uri = await getUriFromId(Identity.fromString(result.id), result.type)
                if (!uri) {
                    return null
                }
                return [
                    getCallHierarchyItem(result.id, uri.toString(), lineNumber, result.start, result.end)
                ]
            } else if (result.type === 'tags/functions') {
                const uri = await getUriFromId(Identity.fromString(result.id), result.type)
                if (!uri) {
                    return null
                }
                return [
                    getCallHierarchyItem(Identity.TagSymbol + result.id, uri.toString(), lineNumber, result.start, result.end)
                ]
            }
        }
        return null
    })

    /**
     * A function can be called from:
     * - A function. We can get this from the said function's `ref`.
     * - A function tag. We can get this from `cacheFile.tags.functions`.
     * 
     * A function tag can be called from:
     * - A function. We can get this from the said function tag's `ref`.
     * - Another function tag. We can get this from `cacheFile.tags.functions`.
     * 
     * See also #298.
     */
    connection.languages.callHierarchy.onIncomingCalls(async ({ item }) => {
        // TODO(#230)
        const ans: Proposed.CallHierarchyIncomingCall[] = []
        let unit: CacheUnit | undefined
        if (item.name[0] === Identity.TagSymbol) {
            unit = getSafeCategory(cacheFile.cache, 'tags/functions')[item.name.slice(1)]
        } else {
            unit = getSafeCategory(cacheFile.cache, 'functions')[item.name]
        }

        if (unit && unit.ref.length > 0) {
            for (const ref of unit.ref) {
                try {
                    ans.push(
                        {
                            from: getCallHierarchyItem(
                                getId(getUri(ref.uri!, uris), roots),
                                ref.uri!, ref.line!, ref.start, ref.end
                            ),
                            fromRanges: [{
                                start: { line: ref.line!, character: ref.start },
                                end: { line: ref.line!, character: ref.end }
                            }]
                        }
                    )
                } catch (ignored) {
                    unit.ref.splice(unit.ref.indexOf(ref), 1)
                }
            }
        }

        for (const tagIdString in cacheFile.tags.functions) {
            /* istanbul ignore next */
            if (cacheFile.tags.functions.hasOwnProperty(tagIdString)) {
                const { values } = cacheFile.tags.functions[tagIdString]
                if (values.includes(item.name)) {
                    const tagId = Identity.fromString(tagIdString)
                    const tagUri = await getUriFromId(tagId, 'tags/functions')
                    if (tagUri) {
                        ans.push(
                            {
                                from: getCallHierarchyItem(
                                    tagId.toTagString(), tagUri.toString(),
                                    0, 0, 0
                                ),
                                fromRanges: [{
                                    start: { line: 0, character: 0 },
                                    end: { line: 0, character: 0 }
                                }]
                            }
                        )
                    }
                }
            }
        }

        return ans
    })

    /**
     * A function can call:
     * - A function. We can get this from all functions' `ref` and compare if the `uri` of that cache position is the expected one.
     * - A function tag. We can get this from all function tags' `ref` and compare if the `uri` of that cache position is the expected one.
     * 
     * A function tag can call:
     * - A function. We can get this from `cacheFile.tags.functions`.
     * - Another function tag. We can get this from `cacheFile.tags.functions`.
     * 
     * See also #298.
     */
    connection.languages.callHierarchy.onOutgoingCalls(async ({ item }) => {
        // TODO(#230)
        const ans: Proposed.CallHierarchyOutgoingCall[] = []
        if (item.name[0] === Identity.TagSymbol) {
            const tagInfo = cacheFile.tags.functions[item.name.slice(1)]
            if (!tagInfo) {
                return null
            }
            for (const idString of tagInfo.values) {
                const id = Identity.fromString(idString)
                const uri = await getUriFromId(id, id.isTag ? 'tags/functions' : 'functions')
                if (uri) {
                    ans.push(
                        {
                            to: getCallHierarchyItem(idString, uri.toString(), 0, 0, 0),
                            fromRanges: [{
                                start: { line: 0, character: 0 },
                                end: { line: 0, character: 0 }
                            }]
                        }
                    )
                }
            }
        } else {
            const pushItems = async (category: CacheCategory) => {
                for (const outgoingIdString in category) {
                    /* istanbul ignore next */
                    if (category.hasOwnProperty(outgoingIdString)) {
                        const unit = category[outgoingIdString]
                        for (const ref of unit!.ref) {
                            const refId = getId(getUri(ref.uri!, uris), roots)
                            if (item.name === refId) {
                                const outgoingId = Identity.fromString(outgoingIdString)
                                const outgoingUri = await getUriFromId(outgoingId, outgoingId.isTag ? 'tags/functions' : 'functions')
                                if (outgoingUri) {
                                    ans.push(
                                        {
                                            to: getCallHierarchyItem(outgoingIdString, outgoingUri.toString(), 0, 0, 0),
                                            fromRanges: [{
                                                start: { line: 0, character: 0 },
                                                end: { line: 0, character: 0 }
                                            }]
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
            await pushItems(getSafeCategory(cacheFile.cache, 'functions'))
            await pushItems(getSafeCategory(cacheFile.cache, 'tags/functions'))
        }

        return ans
    })

    connection.onPrepareRename(async ({ textDocument: { uri: uriString }, position: { character: char, line: number } }) => {
        // TODO(#230)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const line = info.lines[number]
        const result = getCacheFromChar(line.cache || {}, char)
        if (result) {
            return {
                start: { line: number, character: result.start },
                end: { line: number, character: result.end }
            }
        }
        return null
    })
    connection.onRenameRequest(async ({ textDocument: { uri: uriString }, position: { line: number, character: char }, newName }) => {
        // TODO(#230)
        // Inject getUriFromId
        // connection.console.info(`BR: ${JSON.stringify(cacheFile)}`)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const line = info.lines[number]
        const result = getCacheFromChar(line.cache || {}, char)
        if (result && !result.type.startsWith('colors/')) {
            const documentChanges: (TextDocumentEdit | RenameFile)[] = []
            const category = getSafeCategory(cacheFile.cache, result.type)
            const unit = category[result.id]
            if (unit) {
                try {
                    const newID = isNamespacedType(result.type) ? Identity.fromString(newName).toString() : newName

                    // Change file content.
                    for (const key in unit) {
                        if (key === 'def' || key === 'ref') {
                            for (const pos of unit[key]) {
                                documentChanges.push({
                                    textDocument: { uri: uri.toString(), version: info.version || null },
                                    edits: [{
                                        newText: newName,
                                        range: {
                                            start: { line: pos.line as number, character: pos.start },
                                            end: { line: pos.line as number, character: pos.end }
                                        }
                                    }]
                                })
                            }
                        }
                    }

                    // Rename file if necessary.
                    if (isFileType(result.type)) {
                        const oldID = Identity.fromString(result.id)
                        const oldUri = await getUriFromId(oldID, result.type)
                        if (!oldUri) {
                            return null
                        }
                        const newUri = getUriFromId(Identity.fromString(newName), result.type)
                        documentChanges.push(RenameFile.create(oldUri.toString(), newUri.toString(), { ignoreIfExists: true }))
                        // // Update cache.
                        // const oldTimestamp = getFromCachedFileTree(cacheFile.files, oldRel) as number
                        // if (oldTimestamp !== undefined) {
                        //     setForCachedFileTree(cacheFile.files, newRel, oldTimestamp)
                        //     delFromCachedFileTree(cacheFile.files, oldRel)
                        // }
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
                    return null
                }
            }

            // connection.console.info(`DC: ${JSON.stringify(documentChanges)}`)
            // connection.console.info(`AR: ${JSON.stringify(cacheFile)}`)
            return { documentChanges }
        } else {
            return null
        }
    })

    connection.onDocumentLinks(async ({ textDocument: { uri: uriString } }) => {
        // TODO(#230)
        // Inject getUriFromId
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const lines = info.lines
        const ans: DocumentLink[] = []
        let i = 0
        for (const { cache } of lines) {
            for (const type in cache) {
                if (isFileType(type)) {
                    const category = cache[type]
                    for (const id in category) {
                        if (category.hasOwnProperty(id)) {
                            const toLink = async (v: CachePosition) => ({
                                range: {
                                    start: { line: i, character: v.start },
                                    end: { line: i, character: v.end }
                                },
                                target: await getUriFromId(Identity.fromString(id), type)
                            })
                            const unit = category[id] as CacheUnit
                            for (const def of unit.def) {
                                const link = await toLink(def)
                                if (link.target) {
                                    ans.push({ range: link.range, target: link.target.toString() })
                                }
                            }
                            for (const ref of unit.ref) {
                                const link = await toLink(ref)
                                if (link.target) {
                                    ans.push({ range: link.range, target: link.target.toString() })
                                }
                            }
                        }
                    }
                }
            }
            i++
        }
        return ans
    })

    connection.onDocumentColor(async ({ textDocument: { uri: uriString } }) => {
        // TODO(#230)
        const ans: ColorInformation[] = []
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const lines = info.lines
        let i = 0
        for (const line of lines) {
            const dustColors = getSafeCategory(line.cache, 'colors')
            for (const key in dustColors) {
                if (dustColors.hasOwnProperty(key)) {
                    const numbers = key.split(' ').map(v => parseFloat(v))
                    const color = {
                        red: numbers[0],
                        green: numbers[1],
                        blue: numbers[2],
                        alpha: numbers[3]
                    }
                    const unit = dustColors[key] as CacheUnit
                    for (const { start, end } of unit.ref) {
                        ans.push({
                            range: { start: { character: start, line: i }, end: { character: end, line: i } },
                            color
                        })
                    }
                }
            }
            i++
        }
        return ans
    })

    connection.onColorPresentation(({
        color: { red: r, green: g, blue: b, alpha: a },
        range: { start: { character: startChar, line }, end: { character: endChar } },
        textDocument: { uri: uriString }
    }) => {
        // TODO(#230)
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return null
        }
        const ans: ColorPresentation[] = []
        const strings = info.strings
        const string = strings[line].slice(startChar, endChar)
        if (string.startsWith('dust')) {
            ans.push({ label: `dust ${r} ${g} ${b} ${a}` })
        } else if (string.startsWith('minecraft:dust')) {
            ans.push({ label: `minecraft:dust ${r} ${g} ${b} ${a}` })
        } else {
            ans.push({ label: `${(Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255)}` })
        }

        return ans
    })

    connection.languages.semanticTokens.on(({ textDocument: { uri: uriString } }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return { data: [] }
        }

        return onSemanticTokens({ info })
    })

    connection.languages.semanticTokens.onEdits(({ textDocument: { uri: uriString }, previousResultId }) => {
        const uri = getUri(uriString, uris)
        const info = infos.get(uri)
        if (!info) {
            return { edits: [] }
        }

        return onSemanticTokensEdits({ info, previousResultId })
    })

    connection.onExecuteCommand(async ({ command }) => {
        switch (command) {
            case 'datapackLanguageServer.regenerageCache':
                const progress = await connection.window.createWorkDoneProgress()
                progress.begin(locale('server.regenerating-cache'))

                cacheFile = clone(DefaultCacheFile)
                await updateCacheFile(cacheFile, roots, progress)

                progress.done()
                break
            default:
                connection.console.error(`Unknown ‘workspace/executeCommand’ request for ‘${command}’.`)
                break
        }
    })
})

async function getReferencesOrDefinition(uriString: string, number: number, char: number, key: 'def' | 'ref') {
    const uri = getUri(uriString, uris)
    const info = infos.get(uri)
    if (!info) {
        return null
    }
    const line = info.lines[number]
    const result = getCacheFromChar(line.cache || {}, char)
    if (result) {
        const unit = getSafeCategory(cacheFile.cache, result.type)[result.id]
        if (unit && unit[key].length > 0) {
            return unit[key].map(v => ({
                uri: uri.toString(),
                range: {
                    start: { line: v.line as number, character: v.start },
                    end: { line: v.line as number, character: v.end }
                }
            }))
        }
    }
    return null
}

async function getUriFromId(id: Identity, category: CacheKey): Promise<Uri | null> {
    const rel = id.toRel(category, 'data')
    const idString = id.toString()
    const key = `${category}|${idString}`
    const value = urisOfIds.get(key)
    if (value !== undefined) {
        return value
    }
    for (const root of roots) {
        const abs = path.join(root.fsPath, rel)
        if (await fs.pathExists(abs)) {
            const uri = getUri(Uri.file(abs).toString(), uris)
            urisOfIds.set(key, uri)
            return uri
        }
    }
    connection.console.warn(`Namespaced ID ‘${key}’ cannot be resolved in any root`)
    urisOfIds.set(key, null)
    return null
}

async function updateDiagnostics(uri: Uri) {
    const info = infos.get(uri)
    if (!info) {
        return
    }
    const lines = info.lines
    const diagnostics = []
    let lineNumber = 0
    for (const line of lines) {
        if (line.errors) {
            diagnostics.push(...line.errors.map(v => v.toDiagnostic(lineNumber)))
        }
        lineNumber++
    }
    connection.sendDiagnostics({ uri: uri.toString(), diagnostics })
}

async function fetchConfig(uri: Uri): Promise<Config> {
    try {
        return await connection.workspace.getConfiguration({
            scopeUri: uri.toString(),
            section: 'datapackLanguageServer'
        }) as Config
    } catch (e) {
        connection.console.error(`Error occurred while fetching config for ‘${uri.toString()}’: ${e}`)
        return VanillaConfig
    }
}

async function saveCacheFile() {
    if (cachePath) {
        await fs.writeFile(cachePath, JSON.stringify(cacheFile), { encoding: 'utf8' })
    }
}

setInterval(saveCacheFile, 30_000)

const cacheFileOperations = {
    //#region functions
    // MODIFIED & DELETED: Remove all cache positions with the specific rel.
    // MODIFIED: Combine all caches of all lines.
    // DELETED: Remove from functions cache category.
    removeCachePositionsWith: (uri: Uri) => {
        removeCachePosition(cacheFile.cache, uri)
    },
    combineCacheOfLines: async (uri: Uri) => {
        const info = infos.get(uri)
        let lines = info ? info.lines : undefined
        if (!lines) {
            lines = []
            const strings = (await fs.readFile(uri.fsPath, { encoding: 'utf8' })).split(/\r?\n/)
            for (const string of strings) {
                await parseString(string, lines, VanillaConfig, cacheFile)
            }
        }
        const cacheOfLines: ClientCache = {}
        let i = 0
        for (const line of lines) {
            combineCache(cacheOfLines, line.cache, { uri, line: i })
            i++
        }
        combineCache(cacheFile.cache, cacheOfLines)
    },
    //#endregion

    //#region tags/functions
    // ADDED/MODIFIED?DELETED: update the corresponding tagInfo.
    isStringArray(obj: any) {
        return obj &&
            obj instanceof Array &&
            obj.map((v: any) => typeof v === 'string').indexOf(false) === -1
    },
    updateTagInfo: async (id: Identity, pathExists = fs.pathExists, readJson = fs.readJson) => {
        const idString = id.toString()
        delete cacheFile.tags.functions[idString]

        const rel = id.toRel('tags/functions')
        const ans: TagInfo = { values: [] }
        for (let i = roots.length - 1; i >= 0; i--) {
            // We should use the order in which Minecraft loads datapacks to load tags.
            // So that we can treat `replace` correctly.
            const root = roots[i]
            const p = path.join(root.fsPath, rel)
            if (await pathExists(p)) {
                try {
                    const content = await readJson(p)
                    if (!(content && cacheFileOperations.isStringArray(content.values))) {
                        throw new Error(`Function tag ‘${id}’ has a bad format: ‘${JSON.stringify(content)}’`)
                    }
                    const validValues: string[] = []
                    for (const value of content.values) {
                        try {
                            const id = Identity.fromString(value)
                            if (await getUriFromId(id, id.isTag ? 'tags/functions' : 'functions')) {
                                validValues.push(id.toTagString())
                            }
                        } catch (ignored) {
                            // Ignore this bad value.
                        }
                    }
                    if (content.replace) {
                        ans.values = validValues
                    } else {
                        ans.values.push(...validValues)
                    }
                } catch (e) {
                    connection.console.info(`updateTagInfo - ${e.message}`)
                }
            }
        }

        cacheFile.tags.functions[idString] = ans
    },
    //#endregion

    //#region advancements, functions, lootTables, predicates, tags/*, recipes:
    // ADDED: Add to respective cache category.
    // DELETED: Remove from respective cache category.
    addDefault: (id: string, type: CacheKey) => {
        const category = getSafeCategory(cacheFile.cache, type)
        category[id] = category[id] || { def: [], ref: [] }
        cacheFile.cache[type] = category
    },
    deleteDefault: (id: string, type: CacheKey) => {
        removeCacheUnit(cacheFile.cache, type, id)
    },
    //#endregion

    // Hooks.
    fileAdded: async (type: CacheKey, id: Identity) => {
        // connection.console.info(`Added ${type} ${id}`)
        cacheFileOperations.addDefault(id.toString(), type)
        if (type === 'tags/functions') {
            await cacheFileOperations.updateTagInfo(id)
        }
    },
    fileModified: async (uri: Uri, type: CacheKey) => {
        // connection.console.info(`Modified ${rel} ${type}`)
        if (!uri.toString().startsWith('untitled:') && type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
            await cacheFileOperations.combineCacheOfLines(uri)
        } else if (type === 'tags/functions') {
            await cacheFileOperations.updateTagInfo(Identity.fromString(getId(uri, roots)))
        }
    },
    fileDeleted: (uri: Uri, type: CacheKey, id: Identity) => {
        // connection.console.info(`#fileDeleted ${rel} ${type} ${id}`)
        if (type === 'functions') {
            cacheFileOperations.removeCachePositionsWith(uri)
        } else if (type === 'tags/functions') {
            cacheFileOperations.updateTagInfo(id)
        }
        cacheFileOperations.deleteDefault(id.toString(), type)
    }
}

async function walk(workspaceRootPath: string, abs: string, cb: (abs: string, rel: string, stat: fs.Stats) => any) {
    const names = await fs.readdir(abs)
    await Promise.all(
        names.map(async name => {
            const newAbs = path.join(abs, name)
            const stat = await fs.stat(newAbs)
            if (stat.isDirectory()) {
                await walk(workspaceRootPath, newAbs, cb)
            } else {
                const rel = path.relative(workspaceRootPath, newAbs)
                await cb(newAbs, rel, stat)
            }
        })
    )
}

async function updateCacheFile(cacheFile: CacheFile, roots: Uri[], progress: WorkDoneProgress) {
    // Check the files saved in the cache file.
    for (const uriString in cacheFile.files) {
        /* istanbul ignore next */
        if (cacheFile.files.hasOwnProperty(uriString)) {
            progress.report(locale('server.checking-file', uriString))
            // connection.console.info(`Walked ${ uriString }`)
            const uri = getUri(uriString, uris)
            const rel = getRel(uri, roots)
            if (!rel) {
                delete cacheFile.files[uriString]
                continue
            }
            const result = Identity.fromRel(rel)
            if (result) {
                const { id, category: key } = result
                if (!(await fs.pathExists(uri.fsPath))) {
                    cacheFileOperations.fileDeleted(uri, key, id)
                    delete cacheFile.files[uriString]
                } else {
                    const stat = await fs.stat(uri.fsPath)
                    const lastModified = stat.mtimeMs
                    const lastUpdated = cacheFile.files[uriString]
                    if (lastModified > lastUpdated) {
                        await cacheFileOperations.fileModified(uri, key)
                        cacheFile.files[uriString] = lastModified
                    }
                }
            }
        }
    }

    const promises: Promise<void>[] = []
    const addedFiles: [Uri, CacheKey][] = []
    for (const root of roots) {
        const dataPath = path.join(root.fsPath, 'data')
        const namespaces = fs.pathExistsSync(dataPath) ? await fs.readdir(dataPath) : []
        for (const namespace of namespaces) {
            const namespacePath = path.join(dataPath, namespace)
            const advancementsPath = path.join(namespacePath, 'advancements')
            const functionsPath = path.join(namespacePath, 'functions')
            const lootTablesPath = path.join(namespacePath, 'loot_tables')
            const predicatesPath = path.join(namespacePath, 'predicates')
            const recipesPath = path.join(namespacePath, 'recipes')
            const tagsPath = path.join(namespacePath, 'tags')
            const blockTagsPath = path.join(tagsPath, 'blocks')
            const entityTypeTagsPath = path.join(tagsPath, 'entity_types')
            const fluidTagsPath = path.join(tagsPath, 'fluids')
            const functionTagsPath = path.join(tagsPath, 'functions')
            const itemTagsPath = path.join(tagsPath, 'items')
            const datapackCategoryPaths = [
                advancementsPath, functionsPath, lootTablesPath, predicatesPath, recipesPath,
                blockTagsPath, entityTypeTagsPath, fluidTagsPath, functionTagsPath, itemTagsPath
            ]
            for (const datapackCategoryPath of datapackCategoryPaths) {
                if (await fs.pathExists(datapackCategoryPath)) {
                    promises.push(
                        walk(
                            root.fsPath,
                            datapackCategoryPath,
                            (abs, rel, stat) => {
                                const result = Identity.fromRel(rel)
                                const uri = getUri(Uri.file(abs).toString(), uris)
                                const uriString = uri.toString()
                                if (result && Identity.isExtValid(result.ext, result.category)) {
                                    const { id, category: key } = result
                                    if (cacheFile.files[uriString] === undefined) {
                                        cacheFileOperations.fileAdded(key, id)
                                        cacheFile.files[uriString] = stat.mtimeMs
                                        addedFiles.push([uri, key])
                                    }
                                }
                            }
                        )
                    )
                }
            }
        }
    }
    await Promise.all(promises)
    await Promise.all(
        addedFiles.map(
            ([uri, key]) => cacheFileOperations.fileModified(uri, key)
        )
    )

    trimCache(cacheFile.cache)
}

connection.listen()
