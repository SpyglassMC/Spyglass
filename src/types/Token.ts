import TextRange from './TextRange'

export default class Token {
    constructor(
        public range: TextRange,
        public type: string,
        public modifiers: string[]
    ) { }
}
