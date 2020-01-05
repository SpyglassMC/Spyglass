import TextRange from './TextRange'
import { TokenScope } from './TokenScope'

export default interface Token {
    range: TextRange,
    scope: TokenScope
}
