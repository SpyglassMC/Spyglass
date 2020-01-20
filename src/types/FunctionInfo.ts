import Line from './Line'
import Config from './Config'

export default interface FunctionInfo {
    lines: Line[],
    strings: string[],
    lineBreak: '\n' | '\r\n',
    version: number | null,
    config: Config | undefined
}
