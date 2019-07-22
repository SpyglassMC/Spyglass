import { CompletionItem, Range, DiagnosticSeverity, Diagnostic } from 'vscode-languageserver'
import { formatMessage } from '../utils/utils';

/**
 * Represent an error occured while parsing.
 */
export default class ParsingError {
    constructor(
        /**
         * Range of the error.
         */
        public readonly range: { start: number, end: number },
        /**
         * Human-readable error message.
         */
        public readonly message: string,
        /**
         * Whether the error doesn't affect the process of parsing.
         * Default to `true`
         */
        public readonly tolerable: boolean = true,
        /**
         * The severity of the error.
         */
        public readonly severity: DiagnosticSeverity = DiagnosticSeverity.Error
    ) { }

    /**
     * Get diagnostic of the parsing error.
     */
    getDiagnostic(line: number) {
        return {
            range: { start: { line, character: this.range.start }, end: { line, character: this.range.end } },
            severity: this.severity,
            source: 'datapack',
            message: this.message
        }
    }

    toString() {
        return `[${this.range.start}, ${this.range.end}) ${formatMessage(this.message)}`
    }
}
