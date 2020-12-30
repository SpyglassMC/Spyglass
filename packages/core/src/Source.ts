import { OffsetPositionConverter, Position } from '.'

export class Source {
	constructor(
		public string: string,
		public cursor: number = 0,
		public end: number = string.length
	) { }

	get passedString() {
		return this.string.slice(0, this.cursor)
	}

	get remainingString() {
		return this.string.slice(this.cursor, this.end)
	}

	clone() {
		const ans = new StringReader(this.string, this.cursor, this.end)
		return ans
	}

	canRead(length = 1) {
		return this.cursor + length <= this.end
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

	skipLine() {
		this.readUntilOrEnd('\r', '\n')
		return this
	}

	read() {
		return this.string.charAt(this.cursor++)
	}

	readSpace() {
		const start = this.cursor
		while (this.canRead() && StringReader.isSpace(this.peek())) {
			this.skip()
		}
		return this.string.slice(start, this.cursor)
	}

	skipSpace() {
		while (this.canRead() && StringReader.isSpace(this.peek())) {
			this.skip()
		}
		return this
	}

	skipWhiteSpace() {
		while (this.canRead() && StringReader.isWhiteSpace(this.peek())) {
			this.skip()
		}
		return this
	}

	/**
	 * @param terminator Endding character. Will not be included in the result.
	 */
	readUntilOrEnd(...terminators: string[]) {
		let ans = ''
		while (this.canRead()) {
			const c = this.peek()
			if (terminators.includes(c)) {
				return ans
			} else {
				ans += c
			}
			this.skip()
		}
		return ans
	}

	readLine() {
		return this.readUntilOrEnd('\r', '\n')
	}

	readRemaining() {
		const ans = this.remainingString
		this.cursor = this.end
		return ans
	}

	lastLine(converter: OffsetPositionConverter) {
		const pos = converter.toPosition(this.cursor)
		this.cursor = converter.toOffset(Position.create(pos.line - 1, 0))
		return this
	}

	nextLine(converter: OffsetPositionConverter) {
		const pos = textDoc.positionAt(this.cursor)
		this.cursor = textDoc.offsetAt({ line: pos.line + 1, character: 0 })
		return this
	}

	static isSpace(c: string) {
		return c === ' ' || c === '\t'
	}

	static isWhiteSpace(c: string) {
		return c === ' ' || c === '\t' || c === '\r' || c === '\n' || c === '\r\n'
	}

	static isLineSeparator(c: string) {
		return c === '\r\n' || c === '\r' || c === '\n'
	}
}
