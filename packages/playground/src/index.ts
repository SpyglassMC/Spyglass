/* eslint-disable no-restricted-syntax */
import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { autocompletion } from '@codemirror/autocomplete'
import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup'
import { indentWithTab } from '@codemirror/commands'
import { StateField } from '@codemirror/state'
import type { DecorationSet } from '@codemirror/view'
import { Decoration, keymap } from '@codemirror/view'
import type { ColorToken, LanguageError } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { FileNode } from '@spyglassmc/core'
import { BrowserExternals } from '@spyglassmc/core/lib/browser.js'
import * as je from '@spyglassmc/java-edition'
import * as mcdoc from '@spyglassmc/mcdoc'

const $language = document.getElementById('language') as HTMLSelectElement
const $editorContainer = document.getElementById('editor-container') as HTMLDivElement
const $uri = document.getElementById('uri') as HTMLInputElement

const initialContent = 'execute as @a run say hello world'
const getLanguage = () => $language.selectedOptions[0]?.dataset?.language ?? $language.value
const getContent = (state: EditorState) => view.state.sliceDoc(0)
let version = 0

const service = new core.Service({
	logger: console,
	profilers: new core.ProfilerFactory(console, [
		'cache#load',
		'cache#save',
		'project#init',
		'project#ready',
	]),
	project: {
		cacheRoot: 'file:///.cache/',
		defaultConfig: core.ConfigService.merge(core.VanillaConfig, { env: { dependencies: [] } }),
		externals: BrowserExternals,
		initializers: [mcdoc.initialize, je.initialize],
		projectRoot: 'file:///root/',
	},
})

await service.project.ready()

await service.project.onDidOpen($uri.value, getLanguage(), 0, initialContent)

const onChange = EditorView.updateListener.of((update) => {
	if (!update.docChanged) {
		return
	}
	const content = getContent(update.state)
	service.project.onDidChange($uri.value, [{ text: content }], ++version).catch((e) =>
		console.error('[onChange]', e)
	)
})

async function spyglassCompletions(ctx: CompletionContext): Promise<CompletionResult | null> {
	const docAndNodes = await service.project.ensureClientManagedChecked($uri.value)
	if (!docAndNodes) {
		return null
	}
	const items = service.complete(docAndNodes.node, docAndNodes.doc, ctx.pos)
	if (!items.length) {
		return null
	}
	return {
		from: items[0].range.start,
		to: items[0].range.end,
		options: items.map((v) => ({ label: v.label, detail: v.detail, info: v.documentation })),
	}
}

const diagnosticField = StateField.define<DecorationSet>({
	create() {
		return Decoration.none
	},
	update(underlines, tr) {
		const docAndNode = service.project.getClientManaged($uri.value)
		if (!docAndNode) {
			return underlines
		}
		const { node } = docAndNode
		underlines = Decoration.none
		for (const e of FileNode.getErrors(node)) {
			underlines = underlines.update({
				add: [
					getDiagnosticMark(e).range(
						e.range.start,
						e.range.end === e.range.start ? e.range.start + 1 : e.range.end,
					),
				],
			})
		}
		return underlines
	},
	provide: (f) => EditorView.decorations.from(f),
})

const getDiagnosticMark = (e: LanguageError): Decoration => {
	return Decoration.mark({
		attributes: { 'data-diagnostic-message': e.message },
		class: `spyglassmc-diagnostic spyglassmc-diagnostic-${e.severity}`,
	})
}

const diagnosticTheme = EditorView.baseTheme({
	'.spyglassmc-diagnostic::before': {
		content: 'attr(data-diagnostic-message)',
		display: 'none',
		position: 'absolute',
		transform: 'translateY(-100%)',
		border: '1px solid black',
		'background-color': 'wheat',
		opacity: '90%',
		'white-space': 'break-spaces',
		overflow: 'hidden',
		height: 'fit-content',
		width: 'fit-content',
		'max-height': '4em',
		'max-width': '60em',
	},
	'.spyglassmc-diagnostic:hover::before': { display: 'block' },
	'.spyglassmc-diagnostic-0': { textDecoration: 'underline 1.5px darkgray' },
	'.spyglassmc-diagnostic-1': { textDecoration: 'underline 1.5px lightblue' },
	'.spyglassmc-diagnostic-2': { textDecoration: 'underline 1.5px orange' },
	'.spyglassmc-diagnostic-3': { textDecoration: 'underline 1.5px red' },
})

const colorTokenField = StateField.define<DecorationSet>({
	create() {
		return Decoration.none
	},
	update(underlines, tr) {
		const docAndNode = service.project.getClientManaged($uri.value)
		if (!docAndNode) {
			return underlines
		}
		const { node, doc } = docAndNode
		const tokens = service.colorize(node, doc)
		underlines = Decoration.none
		for (const t of tokens) {
			if (t.range.start === t.range.end) {
				continue
			}
			underlines = underlines.update({
				add: [getColorTokenMark(t).range(t.range.start, t.range.end)],
			})
		}
		return underlines
	},
	provide: (f) => EditorView.decorations.from(f),
})

const getColorTokenMark = (t: ColorToken): Decoration => {
	return Decoration.mark({
		class: `spyglassmc-color-token-${t.type} ${
			t.modifiers?.map((m) => `spyglassmc-color-token-modifier-${m}`).join() ?? ''
		}`,
	})
}

const colorTokenTheme = EditorView.baseTheme({
	'.spyglassmc-color-token-comment': { color: '#008000' },
	'.spyglassmc-color-token-enum': { color: '#0070C1' },
	'.spyglassmc-color-token-enumMember': { color: '#0070C1' },
	'.spyglassmc-color-token-function': { color: '#795E26' },
	'.spyglassmc-color-token-keyword': { color: '#AF00DB' },
	'.spyglassmc-color-token-modifier': { color: '#001080' },
	'.spyglassmc-color-token-number': { color: '#098658' },
	'.spyglassmc-color-token-operator': { color: '#AF00DB' },
	'.spyglassmc-color-token-property': { color: '#001080' },
	'.spyglassmc-color-token-string': { color: '#A31515' },
	'.spyglassmc-color-token-struct': { color: '#001080' },
	'.spyglassmc-color-token-type': { color: '#267F99' },
	'.spyglassmc-color-token-variable': { color: '#001080' },
	'.spyglassmc-color-token-error': { color: '#FF0000' },
	'.spyglassmc-color-token-literal': { color: '#0000FF' },
	'.spyglassmc-color-token-resourceLocation': { color: '#795E26' },
	'.spyglassmc-color-token-vector': { color: '#098658' },
})

const sizeTheme = EditorView.theme({
	'&': { maxHeight: '40em' },
	'.cm-gutter,.cm-content': { height: '40em' },
	'.cm-scroller': { overflow: 'auto' },
})

const view = new EditorView({
	parent: $editorContainer,
	state: EditorState.create({
		doc: initialContent,
		extensions: [
			basicSetup,
			keymap.of([indentWithTab]),
			autocompletion({ override: [spyglassCompletions] }),
			onChange,
			diagnosticField,
			diagnosticTheme,
			colorTokenField,
			colorTokenTheme,
			sizeTheme,
		],
	}),
})

// service.project.onDidOpen($uri.value, getLanguage(), version, $text.value)

// $text.oninput = () => {
// 	service.project.onDidChange($uri.value, [{ text: $text.value }], ++version)
// }

$language.onchange = async () => {
	service.project.onDidClose($uri.value)
	$uri.value = `file:///root/foo.${$language.value}`
	version = 0
	await service.project.onDidOpen($uri.value, getLanguage(), version, getContent(view.state))
}
