import { LintConfig } from '../../Config'
import { ToFormattedString } from '../../Formattable'
import { BracketSpacingConfig, SepSpacingConfig } from '../../StylisticConfig'
import { toFormattedString } from '../../../utils/utils'
import ArgumentNode, { NodeType } from '../ArgumentNode'
import TextRange from '../../TextRange'

export const enum BracketType { open, close }

export type ShouldInsertSpacesPredicate = (lint: LintConfig, data?: any) => boolean

export const IsMapNodeSorted = Symbol('IsMapNodeSorted')
export const ConfigKeys = Symbol('ConfigKeys')
export const Chars = Symbol('Chars')
export const Keys = Symbol('KeysData')

export default abstract class MapNode<KI, V> extends ArgumentNode {
    [key: string]: V

    readonly [NodeType]: string = 'Map'

    readonly [Keys]: { [key: string]: KI } = {}

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

    static getBracketSpacingAmount(config: BracketSpacingConfig) {
        const num = Object.keys(this).length
        if (num === 0 && config.zeroValue !== undefined) {
            return config.zeroValue
        } else if (num === 1 && config.oneValue !== undefined) {
            return config.oneValue
        } else {
            return config.inside
        }
    }

    static getFormattedBracket(char: string, type: BracketType, config: BracketSpacingConfig) {
        const amount = MapNode.getBracketSpacingAmount(config)
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

    [IsMapNodeSorted](): boolean {
        const keys = Object.keys(this)
        return keys.slice(1).every((v, i) => v.toLowerCase() >= keys[i].toLowerCase())
    }

    [ToFormattedString](lint: LintConfig, sort = false) {
        const bracketSpacingConfig = lint[this[ConfigKeys].bracketSpacing] as BracketSpacingConfig
        const sepSpacingConfig = lint[this[ConfigKeys].sepSpacing] as SepSpacingConfig
        const pairSepSpacingConfig = lint[this[ConfigKeys].pairSepSpacing] as SepSpacingConfig
        const trailingPairSepConfig = lint[this[ConfigKeys].trailingPairSep] as boolean

        const open = MapNode.getFormattedBracket(this[Chars].openBracket, BracketType.open, bracketSpacingConfig)
        const close = MapNode.getFormattedBracket(this[Chars].closeBracket, BracketType.close, bracketSpacingConfig)
        const sep = MapNode.getFormattedSep(this[Chars].sep, sepSpacingConfig)
        const pairSep = MapNode.getFormattedSep(this[Chars].pairSep, pairSepSpacingConfig)

        const content: string[] = []
        const keys = sort ? Object.keys(this).sort((a, b) => a <= b ? -1 : 1) : Object.keys(this)
        for (const key of keys) {
            if (this.hasOwnProperty(key)) {
                const value = this[key]
                content.push(`${toFormattedString(key, lint)}${sep}${toFormattedString(value, lint)}`)
            }
        }

        let contentString = content.join(pairSep)
        if (trailingPairSepConfig) {
            contentString += MapNode.getFormattedSep(this[Chars].pairSep, pairSepSpacingConfig, true)
        }

        return `${open}${contentString}${close}`
    }
}
