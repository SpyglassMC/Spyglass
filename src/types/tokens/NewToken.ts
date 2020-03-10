import TextRange from './../TextRange'
import Formattable, { ToFormattedString } from '../Formattable'
import { LintConfig } from '../Config'

export enum NewTokenType {
    annotation,
    boolean,
    comment,
    entity,
    keyword,
    literal,
    namespacedID,
    number,
    operator,
    property,
    string,
    type,
    variable,
    vector,
    _
}

export enum NewTokenModifier {
    declaration,
    deprecated,
    documentation,
    firstArgument,
    _
}

export interface TokenSemanticInfo {
    range: TextRange,
    type: NewTokenType,
    modifiers: Set<NewTokenModifier>
}

export default abstract class NewToken<O extends object = {}, A extends object = {}> implements Formattable {
    public actual: A | undefined
    public semantic: TokenSemanticInfo

    constructor(public options: O) { }

    abstract [ToFormattedString](lint: LintConfig): string

    /**
     * Get the array form of the semantic token(s). The result should be pushed into the
     * semantic tokens builder separately.
     * @returns `[ line, char, length, tokenType, tokenModifiers ][]`
     */
    toArrays(line: number): [number, number, number, number, number][] {
        let tokenModifiers = 0
        for (const modifier of this.semantic.modifiers) {
            tokenModifiers = tokenModifiers | (1 << modifier)
        }
        return [
            [
                line,
                this.semantic.range.start,
                this.semantic.range.end - this.semantic.range.start,
                this.semantic.type,
                tokenModifiers
            ]
        ]
    }
}
