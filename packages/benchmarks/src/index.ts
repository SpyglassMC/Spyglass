import { Bench } from 'tinybench'
import * as mcdoc from './mcdoc.js'

async function run() {
	const bench = new Bench()

	await mcdoc.register(bench)

	await bench.warmup()
	await bench.run()

	console.table(bench.table())
}

run().catch(console.error)
