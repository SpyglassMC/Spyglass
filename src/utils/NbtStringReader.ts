import StringReader from './StringReader'

export default class NbtStringReader extends StringReader {
    public readonly string: string
    public cursor = 0

    constructor(base: string | StringReader | NbtStringReader) {
        super(base)
    }

    static canInNumber(c: string) {
        return super.canInNumber(c) || c === '+'
    }
}
