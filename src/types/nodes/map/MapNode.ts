import { LintConfig } from '../../Config'
import { ToFormattedString } from '../../Formattable'
import { BracketSpacingConfig, SepSpacingConfig } from '../../StylisticConfig'
import { toFormattedString } from '../../../utils/utils'
import ArgumentNode, { NodeType } from '../ArgumentNode'

const enum BracketType { open, close }

export type ShouldInsertSpacesPredicate = (lint: LintConfig, data?: any) => boolean

export const IsMapNodeSorted = Symbol('IsMapNodeSorted')
export const SortMapNode = Symbol('SortMapNode')
export const ConfigKeys = Symbol('ConfigKeys')
export const Chars = Symbol('Chars')

export default abstract class MapNode<V> implements ArgumentNode {
    [key: string]: V

    readonly [NodeType] = 'map'
    
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
        const keys = Object.keys(this.content)
        return keys.slice(1).every((v, i) => v.toLowerCase() >= keys[i].toLowerCase())
    }

    [SortMapNode](): void {
        const tmp = this
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                delete this[key]
            }
        }

        const sortedKeys = Object.keys(tmp).sort((a, b) => a <= b ? -1 : 1)
        for (const key of sortedKeys) {
            if (tmp.hasOwnProperty(key)) {
                this[key] = tmp[key]
            }
        }
    }

    [ToFormattedString](lint: LintConfig) {
        const bracketSpacingConfig = lint[this[ConfigKeys].bracketSpacing] as BracketSpacingConfig
        const sepSpacingConfig = lint[this[ConfigKeys].sepSpacing] as SepSpacingConfig
        const pairSepSpacingConfig = lint[this[ConfigKeys].pairSepSpacing] as SepSpacingConfig
        const trailingPairSepConfig = lint[this[ConfigKeys].trailingPairSep] as boolean

        const open = MapNode.getFormattedBracket(this[Chars].openBracket, BracketType.open, bracketSpacingConfig)
        const close = MapNode.getFormattedBracket(this[Chars].closeBracket, BracketType.close, bracketSpacingConfig)
        const sep = MapNode.getFormattedSep(this[Chars].sep, sepSpacingConfig)
        const pairSep = MapNode.getFormattedSep(this[Chars].pairSep, pairSepSpacingConfig)

        const content: string[] = []
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const value = this[key]
                content.push(`${key}${sep}${toFormattedString(value, lint)}`)
            }
        }

        let contentString = content.join(pairSep)
        if (trailingPairSepConfig) {
            contentString += MapNode.getFormattedSep(this[Chars].pairSep, pairSepSpacingConfig, true)
        }

        return `${open}${contentString}${close}`
    }
}
