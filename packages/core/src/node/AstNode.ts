import { Range } from '../type'

export interface AstNode {
	type: string,
	range: Range,
}
