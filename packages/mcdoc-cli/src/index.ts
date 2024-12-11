#!/usr/bin/env -S node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { exportCommand } from './commands/export.js'
import { localeCommand } from './commands/locale.js'

const CLI = yargs(hideBin(process.argv))

await CLI.scriptName('mcdoc')
	.command('export <output>', 'Generate export dump of mcdoc types.', () => {
		return CLI
			.positional('output', {
				describe: 'file to write the export to',
				type: 'string',
				demandOption: true,
			})
			.option('source', { describe: 'directory containing mcdoc sources', default: '.' })
			.option('verbose', { alias: 'v', type: 'boolean', default: false })
	}, exportCommand)
	.command('locale <output>', 'Generate and upgrade locales.', () => {
		return CLI
			.positional('output', {
				describe: 'file to write the default locale to',
				type: 'string',
				demandOption: true,
			})
			.option('source', { describe: 'directory containing mcdoc sources', default: '.' })
			.option('verbose', { alias: 'v', type: 'boolean', default: false })
	}, localeCommand)
	.strict()
	.demandCommand(1)
	.parse()
