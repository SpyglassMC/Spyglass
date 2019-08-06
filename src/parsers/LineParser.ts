import Line from '../types/Line'
import Parser from '../types/Parser'
import StringReader from '../utils/StringReader'
import { CommandTree, CommandTreeNode, CommandTreeNodeChildren } from '../CommandTree'
import LocalCache, { combineLocalCache } from '../types/LocalCache'

export default class LineParser implements Parser<Line> {
    constructor(private readonly tree: CommandTree) { }

    parse(reader: StringReader): ParserResult {
        const line: Line = {
            nodes: []
        }



        return {
            data: line
        }
    }

    parseSingle(reader: StringReader, node: CommandTreeNode<any>, parsed: Line = { nodes: [] }): Line {
        if (node.redirect) {
            return this.parseChildren(reader, this.tree[node.redirect], parsed)
        } else if (node.parser) {
            const { cache, completions, data, errors } = node.parser.parse(reader, parsed.nodes)
            // const untolerableErrors = errors ? errors.filter(v => !v.tolerable) : []
            // if (untolerableErrors.length === 0) {
            const ans: Line = {
                nodes: [...parsed.nodes, data]
            }
            // Cache.
            if (parsed.cache || cache) {
                ans.cache = combineLocalCache(parsed.cache, cache)
            }
            // Completions.
            if (parsed.completions && parsed.completions.length !== 0) {
                ans.completions = parsed.completions
            } else if (completions && completions.length !== 0) {
                ans.completions = completions
            }
            // Errors.
            if ((parsed.errors && parsed.errors.length !== 0) && (errors && errors.length !== 0)) {
                ans.errors = [...parsed.errors, ...errors]
            } else if ((parsed.errors && parsed.errors.length !== 0) && !(errors && errors.length !== 0)) {
                ans.errors = [...parsed.errors]
            } else if (!(parsed.errors && parsed.errors.length !== 0) && (errors && errors.length !== 0)) {
                ans.errors = [...errors]
            }
            // } else {
            //     // Untolerable
            //     // Never mind!
            // }
        } else {
            throw new Error('Got neither `redirect` nor `parser` in node.')
        }
        throw 'Unimplemented'
    }

    parseChildren(reader: StringReader, node: CommandTreeNodeChildren, parsed: Line = { nodes: [] }): Line {
        throw ''
    }
}

type ParserResult = {
    data: Line
}
