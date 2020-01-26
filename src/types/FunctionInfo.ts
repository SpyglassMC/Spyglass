import Line from './Line'
import Config from './Config'

export default interface FunctionInfo {
    config: Config,
    lineBreak: '\n' | '\r\n',
    lines: Line[],
    strings: string[],
    version: number | null
}
