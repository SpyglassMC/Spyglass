#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

await yargs(hideBin(process.argv))
	.scriptName('mcdoc')
	.command('generate-locale', 'Generate the default locale', () => {
		console.log('Generating locale...')
	})
	.strict()
	.demandCommand(1)
	.parse()
