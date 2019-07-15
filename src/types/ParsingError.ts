import { CompletionItem, Range, DiagnosticSeverity, Diagnostic } from 'vscode-languageserver'

/**
 * Represent an error occured while parsing.
 */
export default class ParsingError {
    constructor(
        /**
         * Range of the error.
         */
        public readonly range: Range,
        /**
         * Human-readable error message.
         */
        public readonly message: string,
        /**
         * Completions which may resolve this error.
         */
        public readonly completions?: CompletionItem[],
        /**
         * `warning`: The command can be executed.
         * `error`: The command has syntax error.
         */
        public readonly severity: DiagnosticSeverity = 1,
        /**
         * Whether the error doesn't affect the process of parsing.
         */
        public readonly tolerable: boolean = true
    ) { }

    /**
     * Get diagnostic of the parsing error.
     */
    getDiagnostic: () => Diagnostic = () => ({
        range: this.range,
        severity: this.severity,
        source: 'dhp',
        message: this.message
    })
}
