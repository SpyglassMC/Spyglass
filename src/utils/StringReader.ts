import BigNumber from 'bignumber.js'
import ParsingError from '../types/ParsingError'

export default class StringReader {
    public cursor = 0

    constructor(
        public readonly string: string
    ) { }

    get passedString() {
        return this.string.slice(0, this.cursor)
    }

    get remainingString() {
        return this.string.slice(this.cursor)
    }

    clone() {
        const ans = new StringReader(this.string)
        ans.cursor = this.cursor
        return ans
    }

    canRead(length = 1) {
        return this.cursor + length <= this.string.length
    }

    /**
     * Peeks a character at the current cursor.
     * @param offset The index to offset from cursor. @default 0
     */
    peek(offset = 0) {
        return this.string.charAt(this.cursor + offset)
    }

    /**
     * Skips the current character.
     * @param step The step to skip. @default 1
     */
    skip(step = 1) {
        this.cursor += step
        return this
    }

    read() {
        return this.string.charAt(this.cursor++)
    }

    skipWhiteSpace() {
        while (this.canRead() && StringReader.isWhiteSpace(this.peek())) {
            this.skip()
        }
        return this
    }

    /**
     * @throws {ParsingError} When the value is NaN or have non-number char at the beginning.
     */
    readNumber() {
        const start = this.cursor
        let str = ''
        while (this.canRead() && StringReader.canInNumber(this.peek())) {
            if (this.peek() === '.' && this.peek(1) === '.') {
                break
            }
            str += this.read()
        }
        if (str) {
            const num = Number(str)
            if (isNaN(num)) {
                const end = this.cursor
                this.cursor = start
                throw new ParsingError({ start, end }, `expected a number but got ‘${str}’`)
            }
            return str
        } else {
            const end = this.cursor + 1
            const value = this.peek()
            if (value) {
                throw new ParsingError({ start, end }, `expected a number but got ‘${this.peek()}’ at beginning`, false)
            } else {
                throw new ParsingError({ start, end }, 'expected a number but got nothing', false)
            }
        }
    }

    /**
     * @throws {ParsingError} When the value is float or exceeds the range.
     */
    readInt() {
        const start = this.cursor
        const str = this.readNumber()
        const num = parseInt(str)
        if (str.includes('.')) {
            // num is float.
            const end = this.cursor
            this.cursor = start
            throw new ParsingError({ start, end }, `expected an integer but got ${str}`)
        }
        if (num < -2147483648 || num > 2147483647) {
            const end = this.cursor
            this.cursor = start
            throw new ParsingError({ start, end }, `expected an integer between -2147483648..2147483647 but got ${str}`)
        }
        return num
    }

    /**
     * @throws When the value is float.
     */
    readLong() {
        const start = this.cursor
        const str = this.readNumber()
        if (str.includes('.')) {
            // num is float
            const end = this.cursor
            this.cursor = start
            throw new ParsingError({ start, end }, `expected a long but got ${str}`)
        }
        return new BigNumber(str)
    }

    readFloat() {
        const str = this.readNumber()
        return parseFloat(str)
    }

    readDouble() {
        const str = this.readNumber()
        return parseFloat(str)
    }

    readUnquotedString() {
        let ans = ''
        while (this.canRead() && StringReader.canInUnquotedString(this.peek())) {
            ans += this.read()
        }
        return ans
    }

    /**
     * @throws {ParsingError} If not an legal quoted string.
     */
    readQuotedString() {
        if (!this.canRead()) {
            return ''
        }
        const quote = this.peek()
        if (StringReader.isQuote(quote)) {
            this.skip()
            return this.readUntilQuote(quote)
        } else {
            const start = this.cursor
            const end = this.cursor + 1
            throw new ParsingError({ start, end }, `expected a quote (‘'’ or ‘"’) but got ‘${quote}’`, false)
        }
    }

    /**
     * @throws {ParsingError}
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
                    throw new ParsingError({ start: errStart, end: errStart + 1 }, `unexpected escape character ‘${c}’`)
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
        throw new ParsingError({ start: errStart, end: errStart + 1 }, `expected an ending quote ‘${terminator}’ but got nothing`)
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
     * @throws {ParsingError}
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
     * @throws {ParsingError}
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
            throw new ParsingError({ start, end }, `expected a boolean but got ‘${string}’`, toleratable)
        }
    }

    /**
     * @throws {ParsingError} (tolerable) When the next char can't match the expected one.
     */
    expect(c: string) {
        const start = this.cursor
        const end = this.cursor + 1
        if (!this.canRead()) {
            throw new ParsingError({ start, end }, `expected ‘${c}’ but got nothing`)
        } else if (this.peek() !== c) {
            throw new ParsingError({ start, end }, `expected ‘${c}’ but got ‘${this.peek()}’`)
        }
        return this
    }

    readRemaining() {
        const ans = this.remainingString
        this.cursor = this.string.length
        return ans
    }

    static canInNumber(c: string) {
        // '+' is illegal in number because Mojang wrote so...
        // https://github.com/Mojang/brigadier/blob/master/src/main/java/com/mojang/brigadier/StringReader.java#L88
        // But it IS legal in NBT numbers, because Mojang used `readUnquotedString` to parse primitive tags in NBT parser.
        return (
            c === '0' || c === '1' || c === '2' || c === '3' ||
            c === '4' || c === '5' || c === '6' || c === '7' ||
            c === '8' || c === '9' || c === '-' || c === '.'
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

    static isQuote(c: string): c is '"' | "'" {
        return c === '"' || c === "'"
    }
}
