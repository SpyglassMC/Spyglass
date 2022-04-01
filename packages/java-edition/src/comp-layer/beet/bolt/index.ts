import cp from 'child_process'
import { promisify } from 'util'

async function getBoltAst() {
	const execFile = promisify(cp.execFile)
}
