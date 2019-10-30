import { DiagnosticSeverity, Diagnostic } from 'vscode-languageserver'
import { formatMessage } from '../utils/utils'
import TextRange from './TextRange'

/**
 * Represent an error occured while parsing.
 */
export default class ParsingError {
    constructor(
        /**
         * Range of the error.
         */
        public readonly range: TextRange,
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
     * Get the diagnostic form of the parsing error.
     */
    toDiagnostic(line: number): Diagnostic {
        return {
            range: { start: { line, character: this.range.start }, end: { line, character: this.range.end } },
            severity: this.severity,
            source: 'datapack',
            message: formatMessage(this.message)
        }
    }
}
