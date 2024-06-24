import { Bench } from 'tinybench'
import * as mcdoc from './mcdoc.js'
import * as uri from './uri.js'

export interface BenchContext {
	add(name: string, fn: () => void): void
}

async function run(arg: string) {
	const bench = new Bench()

	const ctx: BenchContext = {
		add(name, fn) {
			if (name.includes(arg)) {
				bench.add(name, fn)
			}
		},
	}

	await uri.register(ctx)
	await mcdoc.register(ctx)

	await bench.warmup()
	await bench.run()

	console.table(bench.table())
}

run(process.argv.slice(2).join(' '))
	.catch(console.error)
