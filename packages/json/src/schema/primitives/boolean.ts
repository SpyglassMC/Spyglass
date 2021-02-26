import { JsonBooleanAstNode } from '../../node';
import { SchemaContext } from '../SchemaContext';

export function boolean(ctx: SchemaContext) {
	if (!JsonBooleanAstNode.is(ctx.node)) {
		return ctx.error('expected.boolean');
	}
	return true;
}
