#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
//import * as mcdoc from '@spyglassmc/mcdoc'

const CLI = yargs(hideBin(process.argv));

await CLI.scriptName('mcdoc')
	.command(
		'generate <test>', 
		'Generate JSON files', 
		() => CLI.options({
			'locale': {
				alias: 'l',
				description: 'en-us language key-value store of all doc comments',
				default: false
			},
			'modules': {
				alias: 'm',
				description: 'file tree mirroring definitions; to optimize for web',
				default: false
			},
			'verbose': {
				alias: 'v',
				default: false
			},
			'dry': {
				alias: 'd',
				description: 'will not write to disk',
				default: false
			}
		}),
		(args) => {
			const include = [];

			if (args.locale) include.push('locales');
			if (args.modules) include.push('modules');

			console.log(`Generating JSON files${args.locale || args.modules ? `, including ${include.join(', ')}` : ''}`);

			const log = (key: string) => args.verbose ?? console.log(key);


		}
	)
	.strict()
	.demandCommand(1)
	.parse()
	