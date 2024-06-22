import { Bench } from 'tinybench'

function loop(x: number) {
	let n = 0
	for (let i = 0; i < x; i += 1) {
		n += i
	}
	return n
}

async function run() {
	const bench = new Bench()

	bench.add('loop(1000000)', () => {
		loop(1000000)
	})
	bench.add('loop(10000000)', () => {
		loop(10000000)
	})

	await bench.run()

	console.table(bench.table())
}

run().catch(console.error)
