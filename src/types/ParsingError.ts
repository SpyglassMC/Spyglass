import { Diagnostic, DiagnosticSeverity, Position } from 'vscode-languageserver'
import { locale } from '../locales'
import { IndexMapping } from './IndexMapping'
import { remapTextRange, TextRange } from './TextRange'
import { TextDocument } from 'vscode-languageserver-textdocument'

export const enum ErrorCode {
    BlockStateSortKeys,
    IdentityCompleteDefaultNamespace,
    IdentityOmitDefaultNamespace,
    NbtByteToLiteral,
    NbtByteToNumber,
    NbtCompoundSortKeys,
    //#region Attribute name datafix: #381
    NbtStringAttributeDatafix,
    //#endregion
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
    //#region UUID datafix: #377
    NbtUuidDatafixCompound,
    NbtUuidDatafixString,
    NbtUuidDatafixUnknownKey,
    //#endregion
    SelectorSortKeys,
    StringSingleQuote,
    StringDoubleQuote,
    StringUnquote,
    VectorCenterCorrect,
}

/**
 * Represent an error occured while parsing.
 */
export class ParsingError {
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
        public code?: ErrorCode
    ) { }

    /**
     * Get the diagnostic form of the parsing error.
     */
    toDiagnostic(content: TextDocument): Diagnostic {
        return {
            range: { start: content.positionAt(this.range.start), end: content.positionAt(this.range.end) },
            severity: this.severity,
            source: 'datapack',
            message: this.message + locale('punc.period'),
            ...this.code !== undefined ? { code: this.code } : {}
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
 * Remap specific errors according to the mapping, and remove the action code.
 * @param errors Input errors.
 */
export function remapParsingErrors(errors: ParsingError[], mapping: IndexMapping) {
    for (const err of errors) {
        err.range = remapTextRange(err.range, mapping)
        err.code = undefined
    }
}
