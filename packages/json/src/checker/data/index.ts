import { JsonAstNode } from '../../node'
import { Checker } from '../Checker'
import { loot_table } from './loot_table'
import { pack_mcmeta } from './pack_mcmeta'

export function checkerFromUri(uri: string): Checker<JsonAstNode> {
	if (uri.match(/data\/[^\/]+\/loot_tables\/.*\.json$/)) {
		return loot_table
	} else if (uri.match(/pack\.mcmeta$/)) {
		return pack_mcmeta
	} else {
		return () => {}
	}
}
