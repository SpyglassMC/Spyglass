import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { LanguageError } from '../source'

/**
 * When only a string is parsed in as the `target`, the errors for the URI `target` should be cleared.
 */
export type ErrorPublisher = (this: void, target: string | TextDocument, errors?: readonly LanguageError[]) => unknown
