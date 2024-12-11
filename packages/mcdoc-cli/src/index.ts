#!/usr/bin/env -S node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { locales } from './locales/index.js'

const CLI = yargs(hideBin(process.argv))

await CLI.scriptName('mcdoc')
	.command('locales [source]', 'Generate and upgrade locales.', () => {
		return CLI
			.positional('source', { describe: 'directory containing mcdoc sources', default: '.' })
			.option('output', { describe: 'file to write the default locale to', type: 'string' })
	}, locales)
	.strict()
	.demandCommand(1)
	.parse()
