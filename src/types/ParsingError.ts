import { DiagnosticSeverity, Diagnostic } from 'vscode-languageserver'
import TextRange, { remapTextRange } from './TextRange'
import { locale } from '../locales/Locales'
import IndexMapping from './IndexMapping'

export const enum ActionCode {
    IdCompleteDefaultNamespace,
    IdOmitDefaultNamespace,
    NbtTypeToByte,
    NbtTypeToByteArray,
    NbtTypeToShort,
    NbtTypeToInt,
    NbtTypeToIntArray,
    NbtTypeToList,
    NbtTypeToLong,
    NbtTypeToLongArray,
    NbtTypeToFloat,
    NbtTypeToDouble,
    NbtByteToLiteral,
    NbtByteToNumber,
    /**
     * Fix UUIDs in NBT compounds: #377
     */
    NbtUuidDatafix,
    SelectorSortKeys,
    StringSingleQuote,
    StringDoubleQuote,
    StringUnquote,
}

/**
 * Represent an error occured while parsing.
 */
export default class ParsingError {
    constructor(
        /**
         * Range of the error.
         */
        public range: TextRange,
        /**
         * Human-readable error message.
         */
        public message: string,
        /**
         * Whether the error doesn't affect the process of parsing.
         * Default to `true`
         */
        public tolerable: boolean = true,
        /**
         * The severity of the error.
         */
        public severity: DiagnosticSeverity = DiagnosticSeverity.Error,
        /**
         * The code of the error.
         */
        public code?: ActionCode
    ) { }

    /**
     * Get the diagnostic form of the parsing error.
     */
    toDiagnostic(line: number): Diagnostic {
        return {
            range: { start: { line, character: this.range.start }, end: { line, character: this.range.end } },
            severity: this.severity,
            source: 'datapack',
            message: this.message + locale('punc.period'),
            ...this.code ? { code: this.code } : {}
        }
    }
}

/**
 * Downgrade specific errors to tolerable ones.
 * @param errors Input errors.
 */
export function downgradeParsingError(errors: ParsingError[]) {
    return errors.map(v => new ParsingError(v.range, v.message, true, v.severity, v.code))
}

/**
 * Remap specific errors according to the mapping.
 * @param errors Input errors.
 */
export function remapParsingErrors(errors: ParsingError[], mapping: IndexMapping) {
    for (const err of errors) {
        err.range = remapTextRange(err.range, mapping)
    }
}
