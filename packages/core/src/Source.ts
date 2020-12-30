type Space =
	| ' '
	| '\t'
type Newline =
	| '\r\n'
	| '\r'
	| '\n'
type Whitespace =
	| Space
	| Newline

export class Source {
	public cursor = 0

	constructor(
		public string: string
	) { }

	clone() {
		const ans = new Source(this.string)
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

	read() {
		return this.string.charAt(this.cursor++)
	}

	/**
	 * Skips the current character.
	 * @param step The step to skip. @default 1
	 */
	skip(step = 1): this {
		this.cursor += step
		return this
	}

	readLine() {
		return this.readUntilOrEnd('\r', '\n')
	}
	skipLine(): this {
		this.readLine()
		return this
	}

	readSpace() {
		const start = this.cursor
		this.skipSpace()
		return this.string.slice(start, this.cursor)
	}
	skipSpace(): this {
		while (this.canRead() && Source.isSpace(this.peek())) {
			this.skip()
		}
		return this
	}

	skipWhitespace(): this {
		while (this.canRead() && Source.isWhitespace(this.peek())) {
			this.skip()
		}
		return this
	}

	/**
	 * @param terminators Endding character. Will not be included in the result.
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

	// lastLine(converter: OffsetPositionConverter) {
	// 	const pos = converter.toPosition(this.cursor)
	// 	this.cursor = converter.toOffset(Position.create(pos.line - 1, 0))
	// 	return this
	// }

	// nextLine(converter: OffsetPositionConverter) {
	// 	const pos = converter.toPosition(this.cursor)
	// 	this.cursor = converter.toOffset(Position.create(pos.line + 1, 0))
	// 	return this
	// }

	static isSpace(c: string): c is Space {
		return c === ' ' || c === '\t'
	}

	static isNewline(c: string): c is Newline {
		return c === '\r\n' || c === '\r' || c === '\n'
	}

	static isWhitespace(c: string): c is Whitespace {
		return Source.isSpace(c) || Source.isNewline(c)
	}
}
