import type { RangeLike } from './Range'
import { Range } from './Range'

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

export const CRLF = '\r\n'
export const CR = '\r'
export const LF = '\n'

export class Source {
	public cursor = 0

	constructor(
		public string: string
	) { }

	clone(): Source {
		const ans = new Source(this.string)
		ans.cursor = this.cursor
		return ans
	}

	canRead(length = 1) {
		return this.cursor + length <= this.string.length
	}

	/**
	 * Peeks a substring from the current cursor.
	 * @param length The length of the substring. @default 1
	 * @param offset The index to offset from cursor. @default 0
	 */
	peek(length = 1, offset = 0) {
		return this.string.substr(this.cursor + offset, length)
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

	slice(rangeLike: RangeLike): string {
		const range = Range.get(rangeLike)
		return this.string.slice(range.start, range.end)
	}

	/**
	 * Reads until the end of this line.
	 */
	readLine() {
		return this.readUntilOrEnd(CR, LF)
	}
	/**
	 * Skips until the end of this line.
	 */
	skipLine(): this {
		this.readLine()
		return this
	}
	/**
	 * Jumps to the beginning of the next line.
	 */
	nextLine(): this {
		this.skipLine()
		if (this.peek(2) === CRLF) {
			this.skip(2)
		} else if (this.peek() === CR || this.peek() === LF) {
			this.skip()
		}
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
	 * @param terminators Ending character. Will not be skipped or included in the result.
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

	skipRemaining(): this {
		this.cursor = this.string.length
		return this
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
