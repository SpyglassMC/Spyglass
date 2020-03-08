import { DiagnosticSeverity } from 'vscode-languageserver'

type StyleConfig<T> = [
    /**
     * Whether the style check is enabled or not.
     */
    boolean, 
    /**
     * The diagnostic severity of this style check,
     */
    0 | DiagnosticSeverity, 
    /**
     * The settings for this style check.
     */
    T
]

export default StyleConfig
