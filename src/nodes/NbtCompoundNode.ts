import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { McfunctionDocument } from '../types/DatapackDocument'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { getCodeAction } from '../utils'
import { bufferFromNbtLongs, nbtIntArrayFromBuffer } from '../utils/datafixers/nbtUuid'
import { DiagnosticMap, GetCodeActions, NodeRange, NodeType } from './ArgumentNode'
import { Chars, ConfigKeys, MapNode, UnsortedKeys } from './MapNode'
import { NbtCompoundKeyNode } from './NbtCompoundKeyNode'
import { NbtNode, NbtNodeType, SuperNode } from './NbtNode'
import { ParsingContext } from '../types'

export const NbtCompoundNodeChars = {
    openBracket: '{', sep: ':', pairSep: ',', closeBracket: '}'
}

export class NbtCompoundNode extends MapNode<NbtCompoundKeyNode, NbtNode> implements NbtNode {
    readonly [NodeType] = 'NbtCompound'
    readonly [NbtNodeType] = 'Compound';

    [SuperNode]: NbtCompoundNode | null

    constructor(superNbt: NbtCompoundNode | null) {
        super()
        this[SuperNode] = superNbt
    }

    protected [ConfigKeys] = {
        bracketSpacing: 'nbtCompoundBracketSpacing' as keyof LintConfig,
        pairSepSpacing: 'nbtCompoundCommaSpacing' as keyof LintConfig,
        sepSpacing: 'nbtCompoundColonSpacing' as keyof LintConfig,
        trailingPairSep: 'nbtCompoundTrailingComma' as keyof LintConfig
    }

    protected [Chars] = NbtCompoundNodeChars;

    [GetCodeActions](uri: string, ctx: ParsingContext, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, ctx, range, diagnostics)
        const sortKeysDiagnostics = diagnostics[ErrorCode.NbtCompoundSortKeys]
        if (sortKeysDiagnostics && ctx.config.lint.nbtCompoundSortKeys) {
            /* istanbul ignore next */
            const keys = ctx.config.lint.nbtCompoundSortKeys[1] === 'alphabetically' ?
                this[UnsortedKeys].sort() : this[UnsortedKeys]
            ans.push(getCodeAction(
                'nbt-compound-sort-keys', sortKeysDiagnostics,
                ctx.document, this[NodeRange],
                this[GetFormattedString](ctx.config.lint, keys)
            ))
        }
        //#region UUID datafix: #377
        const uuidDiagnostics = diagnostics[ErrorCode.NbtUuidDatafixCompound]
        if (uuidDiagnostics) {
            try {
                const newArrayNode = nbtIntArrayFromBuffer(bufferFromNbtLongs(this,
                    this[UnsortedKeys].includes('OwnerUUIDMost') ? 'OwnerUUIDMost' : 'M',
                    this[UnsortedKeys].includes('OwnerUUIDLeast') ? 'OwnerUUIDLeast' : 'L'
                ))
                ans.push(getCodeAction(
                    'nbt-uuid-datafix', uuidDiagnostics,
                    ctx.document, this[NodeRange],
                    newArrayNode[GetFormattedString](ctx.config.lint)
                ))
            } catch (ignored) {
                // Ignored.
            }
        }
        //#endregion
        return ans
    }
}
