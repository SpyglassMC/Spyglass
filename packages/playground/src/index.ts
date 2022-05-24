import * as core from '@spyglassmc/core'
import { BrowserExternals } from '@spyglassmc/core/lib/browser.js'
import * as je from '@spyglassmc/java-edition'
import * as mcdoc from '@spyglassmc/mcdoc'

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
		initializers: [
			mcdoc.initialize,
			je.initialize,
		],
		projectRoot: 'file:///root/',
	},
})

await service.project.ready()

service.project.on('documentErrorred', ({ errors }) => {
	$errors.innerHTML = errors.map(e => `${e.message}`).join('<br>')
})

const $errors = document.getElementById('errors') as HTMLParagraphElement
const $language = document.getElementById('language') as HTMLSelectElement
const $text = document.getElementById('text') as HTMLTextAreaElement
const $uri = document.getElementById('uri') as HTMLInputElement

let version = 0

service.project.onDidOpen($uri.value, $language.value, version, $text.value)

$text.oninput = () => {
	service.project.onDidChange($uri.value, [{ text: $text.value }], ++version)
}

$language.onchange = () => {
	service.project.onDidClose($uri.value)
	$uri.value = `file:///root/foo.${$language.value}`
	service.project.onDidOpen($uri.value, $language.value, version, $text.value)
}
