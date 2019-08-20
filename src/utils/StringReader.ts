import ParsingError from '../types/ParsingError'

export default class StringReader {
    public readonly string: string
    public cursor = 0

    constructor(base: string | StringReader) {
        if (typeof base === 'string') {
            this.string = base
        } else {
            this.cursor = base.cursor
            this.string = base.string
        }
    }

    get passedString() {
        return this.string.slice(0, this.cursor)
    }

    get remainingString() {
        return this.string.slice(this.cursor)
    }

    canRead(length = 1) {
        return this.cursor + length <= this.string.length
    }

    peek() {
        return this.string[this.cursor]
    }

    skip() {
        this.cursor += 1
    }

    read() {
        return this.string.charAt(this.cursor++)
    }

    skipWhiteSpace(max?: number) {
        let count = 0
        while (this.canRead() && StringReader.isWhiteSpace(this.peek()) &&
            (max === undefined || count < max)) {
            this.skip()
            count++
        }
    }

    /**
     * @throws 
     */
    private readNumber() {
        const start = this.cursor
        let str = ''
        while (this.canRead() && StringReader.canInNumber(this.peek())) {
            str += this.read()
        }
        if (str) {
            const num = Number(str)
            if (isNaN(num)) {
                const end = this.cursor
                this.cursor = start
                throw new ParsingError({ start, end }, `expected a number but got \`${str}\``)
            }
            return num
        } else {
            const end = this.cursor + 1
            const value = this.peek()
            if (value) {
                throw new ParsingError({ start, end }, `expected a number but got \`${this.peek()}\` at beginning`, false)
            } else {
                throw new ParsingError({ start, end }, 'expected a number but got nothing')
            }
        }
    }

    /**
     * @throws 
     */
    readInt() {
        const start = this.cursor
        const num = this.readNumber()
        if (parseInt(num.toString()) !== num) {
            // num is not int
            const end = this.cursor
            this.cursor = start
            throw new ParsingError({ start, end }, `expected an integer but got ${num}`)
        }
        if (num < -2147483648 || num > 2147483647) {
            const end = this.cursor
            this.cursor = start
            throw new ParsingError({ start, end }, `expected an integer between -2147483648..2147483647 but got ${num}`)
        }
        return num
    }

    /**
     * @throws 
     */
    readLong() {
        const start = this.cursor
        const num = this.readNumber()
        if (parseInt(num.toString()) !== num) {
            // num is float
            const end = this.cursor
            this.cursor = start
            throw new ParsingError({ start, end }, `expected a long but got ${num}`)
        }
        return num
    }

    readFloat() {
        const num = this.readNumber()
        return num
    }

    readDouble() {
        const num = this.readNumber()
        return num
    }

    readUnquotedString() {
        let ans = ''
        while (this.canRead() && StringReader.canInUnquotedString(this.peek())) {
            ans += this.read()
        }
        return ans
    }

    /**
     * @throws If not an legal quoted string.
     */
    readQuotedString() {
        if (!this.canRead()) {
            return ''
        }
        const quote = this.peek()
        if (StringReader.isQuote(quote)) {
            this.skip()
            return this.readUntilQuote(<'"' | "'">quote)
        } else {
            const start = this.cursor
            const end = this.cursor + 1
            throw new ParsingError({ start, end }, `expected a quote (\`'\` or \`"\`) but got \`${quote}\``, false)
        }
    }

    /**
     * @throws
     * @param terminator Endding quote. Will not be included in the result.
     */
    private readUntilQuote(terminator: '"' | "'") {
        const start = this.cursor
        const escapeChar = '\\'
        let ans = ''
        let escaped = false
        while (this.canRead()) {
            const c = this.read()
            if (escaped) {
                if (c === escapeChar || c === terminator) {
                    ans += c
                    escaped = false
                } else {
                    const errStart = this.cursor - 1
                    this.cursor = start
                    throw new ParsingError({ start: errStart, end: errStart + 1 }, `unexpected escape character \`${c}\``)
                }
            } else {
                if (c === escapeChar) {
                    escaped = true
                } else if (c === terminator) {
                    return ans
                } else {
                    ans += c
                }
            }
        }
        const errStart = this.cursor
        this.cursor = start
        throw new ParsingError({ start: errStart, end: errStart + 1 }, `expected ending quote \`${terminator}\` but got nothing`)
    }

    /**
     * @param terminator Endding character. Will not be included in the result.
     */
    readUntilOrEnd(terminator: string) {
        let ans = ''
        while (this.canRead()) {
            const c = this.peek()
            if (terminator === c) {
                return ans
            } else {
                ans += c
            }
            this.skip()
        }
        return ans
    }

    /**
     * @throws
     */
    readString() {
        if (!this.canRead()) {
            return ''
        }
        const c = this.peek()
        if (StringReader.isQuote(c)) {
            return this.readQuotedString()
        } else {
            return this.readUnquotedString()
        }
    }

    /**
     * @throws
     */
    readBoolean() {
        const start = this.cursor
        const string = this.readString()
        if (string === 'true') {
            return true
        } else if (string === 'false') {
            return false
        } else {
            const end = this.cursor
            this.cursor = start
            const toleratable = 'true'.startsWith(string.toLowerCase()) || 'false'.startsWith(string.toLowerCase())
            throw new ParsingError({ start, end }, `expected a boolean but got \`${string}\``, toleratable)
        }
    }

    /**
     * @throws
     */
    expect(c: string) {
        const start = this.cursor
        const end = this.cursor + 1
        if (!this.canRead()) {
            throw new ParsingError({ start, end }, `expected \`${c}\` but got nothing`)
        } else if (this.peek() !== c) {
            throw new ParsingError({ start, end }, `expected \`${c}\` but got \`${this.peek()}\``, false)
        }
    }

    readRemaining() {
        const ans = this.remainingString
        this.cursor = this.string.length
        return ans
    }

    static canInNumber(c: string) {
        // '+' is illegal in number because Mojang wrote so...
        // https://github.com/Mojang/brigadier/blob/master/src/main/java/com/mojang/brigadier/StringReader.java#L88
        // But it IS legal in NBT numbers, so I wrote a `NbtStringReader` and overrided this function.
        return (
            c === '0' || c === '1' || c === '2' || c === '3' ||
            c === '4' || c === '5' || c === '6' || c === '7' ||
            c === '8' || c === '9' || c === '.' || c === '-'
        )
    }

    static isWhiteSpace(c: string) {
        return c === ' ' || c === '\t' || c === '\r' || c === '\n' || c === '\r\n'
    }

    /**
     * Whether the string can be used in unquoted string or not.
     * @param string A string.
     */
    static canInUnquotedString(string: string) {
        return /^[0-9a-zA-Z\_\-\.\+]+$/.test(string)
    }

    static isQuote(c: string) {
        return c === '"' || c === "'"
    }
}
