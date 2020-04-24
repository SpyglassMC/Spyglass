import { toFormattedString } from '../../../utils/utils'
import { LintConfig } from '../../Config'
import { GetFormattedString } from '../../Formattable'
import FunctionInfo from '../../FunctionInfo'
import { BracketSpacingConfig, SepSpacingConfig } from '../../StylisticConfig'
import TextRange, { areOverlapped } from '../../TextRange'
import ArgumentNode, { DiagnosticMap, GetCodeActions, GetHoverInformation, NodeRange, NodeType, GetPlainKeys } from '../ArgumentNode'

export const enum BracketType { open, close }

export type ShouldInsertSpacesPredicate = (lint: LintConfig, data?: any) => boolean

export const IsMapSorted = Symbol('IsMapSorted')
export const ConfigKeys = Symbol('ConfigKeys')
export const Chars = Symbol('Chars')
export const Keys = Symbol('KeysData')
export const UnsortedKeys = Symbol('UnsortedKeys')
export const GetFormattedOpen = Symbol('GetFormattedOpen')
export const GetFormattedClose = Symbol('GetFormattedClose')

export default abstract class MapNode<KI, V> extends ArgumentNode {
    [key: string]: V

    readonly [NodeType]: string = 'Map'

    readonly [Keys]: { [key: string]: KI } = {}

    readonly [UnsortedKeys]: string[] = []

    protected abstract [ConfigKeys]: {
        bracketSpacing: keyof LintConfig,
        pairSepSpacing: keyof LintConfig,
        sepSpacing: keyof LintConfig,
        trailingPairSep: keyof LintConfig
    }

    protected abstract [Chars]: {
        closeBracket: string,
        openBracket: string,
        pairSep: string,
        sep: string
    }

    static getBracketSpacingAmount(length: number, config: BracketSpacingConfig) {
        if (length === 0 && config.zeroValue !== undefined) {
            return config.zeroValue
        } else if (length === 1 && config.oneValue !== undefined) {
            return config.oneValue
        } else {
            return config.inside
        }
    }

    static getFormattedBracket(length: number, char: string, type: BracketType, config: BracketSpacingConfig) {
        const amount = MapNode.getBracketSpacingAmount(length, config)
        const spacing = ' '.repeat(amount)
        if (type === BracketType.open) {
            return `${char}${spacing}`
        } else {
            return `${spacing}${char}`
        }
    }

    static getFormattedSep(char: string, config: SepSpacingConfig, trimmingEnd = false) {
        const before = ' '.repeat(config.before)
        const after = trimmingEnd ? '' : ' '.repeat(config.after)
        return `${before}${char}${after}`
    }

    [GetPlainKeys](): string[] {
        return this[UnsortedKeys].length > 0 ? this[UnsortedKeys] : super[GetPlainKeys]()
    }

    [IsMapSorted](..._params: any[]): boolean {
        const keys = this[GetPlainKeys]()
        return keys.slice(1).every((v, i) => v.toLowerCase() >= keys[i].toLowerCase())
    }

    [GetFormattedOpen](lint: LintConfig) {
        const bracketSpacingConfig = lint[this[ConfigKeys].bracketSpacing] as BracketSpacingConfig
        return MapNode.getFormattedBracket(this[GetPlainKeys]().length, this[Chars].openBracket, BracketType.open, bracketSpacingConfig)
    }

    [GetFormattedClose](lint: LintConfig) {
        const bracketSpacingConfig = lint[this[ConfigKeys].bracketSpacing] as BracketSpacingConfig
        return MapNode.getFormattedBracket(this[GetPlainKeys]().length, this[Chars].closeBracket, BracketType.close, bracketSpacingConfig)
    }

    [GetFormattedString](lint: LintConfig, keys = this[GetPlainKeys](), kvPair = (lint: LintConfig, key: string, sep: string, value: V) => `${key}${sep}${toFormattedString(value, lint)}`) {
        const sepSpacingConfig = lint[this[ConfigKeys].sepSpacing] as SepSpacingConfig
        const pairSepSpacingConfig = lint[this[ConfigKeys].pairSepSpacing] as SepSpacingConfig
        const trailingPairSepConfig = lint[this[ConfigKeys].trailingPairSep] as boolean

        const open = this[GetFormattedOpen](lint)
        const close = this[GetFormattedClose](lint)
        const sep = MapNode.getFormattedSep(this[Chars].sep, sepSpacingConfig)
        const pairSep = MapNode.getFormattedSep(this[Chars].pairSep, pairSepSpacingConfig)

        const content: string[] = []
        const arrayValueCursor: { [key: string]: number | undefined } = {}
        for (const key of keys) {
            /* istanbul ignore else */
            if (this.hasOwnProperty(key)) {
                let value = this[key]
                if (value instanceof Array) {
                    if (arrayValueCursor[key] === undefined) {
                        arrayValueCursor[key] = 0
                    }
                    value = value[arrayValueCursor[key]!++]
                }
                content.push(kvPair(lint, key, sep, value))
            }
        }

        let contentString = content.join(pairSep)
        if (trailingPairSepConfig) {
            contentString += MapNode.getFormattedSep(this[Chars].pairSep, pairSepSpacingConfig, true)
        }

        return `${open}${contentString}${close}`
    }

    /* istanbul ignore next: simple triage */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)
        for (const key in this[GetPlainKeys]) {
            if (this[Keys] && this[Keys]!.hasOwnProperty(key)) {
                const keyInfo = this[Keys]![key]
                if (keyInfo instanceof ArgumentNode) {
                    if (areOverlapped(keyInfo[NodeRange], range)) {
                        ans.push(...keyInfo[GetCodeActions](uri, info, lineNumber, range, diagnostics))
                    }
                }
            }
        }
        return ans
    }

    /* istanbul ignore next: simple triage */
    [GetHoverInformation](lineNumber: number, char: number) {
        for (const key in this[Keys]) {
            /* istanbul ignore else */
            if (this[Keys] && this[Keys]!.hasOwnProperty(key)) {
                const keyInfo = this[Keys]![key]
                if (keyInfo instanceof ArgumentNode) {
                    if (keyInfo[NodeRange].start <= char && char <= keyInfo[NodeRange].end) {
                        return keyInfo[GetHoverInformation](lineNumber, char)
                    }
                }
            }
        }
        return null
    }
}
