import { arrayToMessage } from './utils'

export default class StringReader {
    public cursor = 0

    constructor(public readonly string: string) { }

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

    skipWhiteSpace() {
        while (this.canRead() && StringReader.isWhiteSpace(this.peek())) {
            this.skip()
        }
    }

    /**
     * @throws 
     */
    private readNumber() {
        let str = ''
        while (this.canRead() && StringReader.canInNumber(this.peek())) {
            str += this.read()
        }
        try {
            if (str) {
                const num = Number(str)
                if (isNaN(num)) {
                    throw new Error()
                }
                return num
            } else {
                // num is empty string
                throw new Error()
            }
        } catch  {
            throw `expected a number but got '${str}'`
        }
    }

    /**
     * @throws 
     */
    readInt() {
        const num = this.readNumber()
        if (parseInt(num.toString()) !== num) {
            // num is not int
            throw `expected an integer but got ${num}`
        }
        if (num < -2147483648 || num > 2147483647) {
            throw `expected an integer between -2147483648..2147483647 but got ${num}`
        }
        return num
    }

    /**
     * @throws 
     */
    readLong() {
        const num = this.readNumber()
        if (parseInt(num.toString()) !== num) {
            // num is not int
            throw `expected a long but got ${num}`
        }
        if (num < -9223372036854775808 || num > 9223372036854775807) {
            throw `expected a long between -9223372036854775808..9223372036854775807 but got ${num}`
        }
        return num
    }

    /**
     * @throws 
     */
    readFloat() {
        const num = this.readNumber()
        if (num < -3.40282347E+38 || num > +3.40282347E+38) {
            throw `expected a float between but got ${num}`
        }
        return num
    }

    /**
     * @throws 
     */
    readDouble() {
        const num = this.readNumber()
        if (num < -1.79769313486231570E+308 || num > 1.79769313486231570E+308) {
            throw `expected a double between but got ${num}`
        }
        return num
    }

    readUnquotedString() {
        let ans = ''
        while (this.canRead(), StringReader.canInUnquotedString(this.peek())) {
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
            return this.readUntilQuote(quote)
        } else {
            throw `expected a beginning of quoted string but got '${quote}'`
        }
    }

    /**
     * @throws
     * @param terminator Endding character. Will not be included in the result.
     */
    private readUntilQuote(terminator: string) {
        const escapeChar = '\\'
        let ans = ''
        let escaped = false
        while (this.canRead()) {
            const c = this.read()
            if (escaped) {
                if (c === terminator || c === '"' || c === "'") {
                    ans += c
                    escaped = false
                } else {
                    throw `unexpected escape character '${c}'`
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
        throw `expected ending character \`${terminator}\` but got nothing`
    }



    /**
     * @param terminator Endding character. Will not be included in the result.
     */
    readUntilOrEnd(terminator: string) {
        let ans = ''
        while (this.canRead()) {
            const c = this.read()
            if (terminator === c) {
                return ans
            } else {
                ans += c
            }
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
            this.cursor = start
            throw `expected a boolean but got '${string}'`
        }
    }

    /**
     * @throws
     */
    expect(c: string) {
        if (!this.canRead()) {
            throw `expected '${c}' but got nothing`
        } else if (this.peek() !== c) {
            throw `expected '${c}' but got '${this.peek()}'`
        }
    }

    static canInNumber(c: string) {
        // '+' is illegal in number because Mojang wrote so...
        // https://github.com/Mojang/brigadier/blob/master/src/main/java/com/mojang/brigadier/StringReader.java#L88
        return (
            c === '0' || c === '1' || c === '2' || c === '3' ||
            c === '4' || c === '5' || c === '6' || c === '7' ||
            c === '8' || c === '9' || c === '.' || c === '-'
        )
    }

    static isWhiteSpace(c: string) {
        return c === ' ' || c === '\t' || c === '\r' || c === '\n' || c === '\r\n'
    }

    static canInUnquotedString(c: string) {
        return /^[0-9a-zA-Z\_\-\.\+]$/.test(c)
    }

    static isQuote(c: string) {
        return c === '"' || c === "'"
    }
}
