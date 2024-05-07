import { IndexMap } from './IndexMap.js'
import type { RangeContainer } from './Range.js'
import { Range } from './Range.js'

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Space = ' ' | '\t'
type Newline = '\r\n' | '\r' | '\n'
type Whitespace = Space | Newline

export const CRLF = '\r\n'
export const CR = '\r'
export const LF = '\n'

export const Whitespaces = Object.freeze([' ', '\n', '\r', '\t'] as const)

export class ReadonlySource {
	public innerCursor = 0

	constructor(
		public readonly string: string,
		public readonly indexMap: IndexMap = [],
	) {}

	get cursor() {
		return IndexMap.toOuterOffset(this.indexMap, this.innerCursor)
	}

	/**
	 * @param offset The index to offset from cursor. Defaults to 0.
	 *
	 * @returns The range of the specified character.
	 *
	 * @example
	 * getCharRange(-1) // Returns the range of the character before cursor.
	 * getCharRange()   // Returns the range of the character at cursor.
	 * getCharRange(1)  // Returns the range of the character after cursor.
	 */
	getCharRange(offset = 0): Range {
		return IndexMap.toOuterRange(
			this.indexMap,
			Range.create(this.innerCursor + offset, this.innerCursor + offset + 1),
		)
	}

	/**
	 * Peeks a substring from the current cursor.
	 * @param length The length of the substring. Defaults to 1
	 * @param offset The index to offset from cursor. Defaults to 0
	 */
	peek(length = 1, offset = 0) {
		return this.string.slice(
			this.innerCursor + offset,
			this.innerCursor + offset + length,
		)
	}

	/**
	 * If the `expectedValue` is right after the cursor, returns `true`. Otherwise returns `false`.
	 *
	 * @param offset Defaults to 0.
	 *
	 * @see {@link Source.trySkip}
	 */
	tryPeek(expectedValue: string, offset = 0): boolean {
		return this.peek(expectedValue.length, offset) === expectedValue
	}

	tryPeekAfterWhitespace(expectedValue: string): boolean {
		const maxOffset = this.string.length - this.innerCursor
		let offset = 0
		while (offset < maxOffset && Source.isWhitespace(this.peek(1, offset))) {
			offset++
		}
		return this.tryPeek(expectedValue, offset)
	}

	peekUntil(...terminators: string[]): string {
		let ans = ''
		for (
			let cursor = this.innerCursor;
			cursor < this.string.length;
			cursor++
		) {
			const c = this.string.charAt(cursor)
			if (terminators.includes(c)) {
				return ans
			} else {
				ans += c
			}
		}
		return ans
	}

	peekLine(): string {
		return this.peekUntil(CR, LF)
	}

	peekRemaining(): string {
		return this.string.slice(this.innerCursor)
	}

	matchPattern(regex: RegExp): boolean {
		return regex.test(this.peekRemaining())
	}

	hasNonSpaceAheadInLine(): boolean {
		for (
			let cursor = this.innerCursor;
			cursor < this.string.length;
			cursor++
		) {
			const c = this.string.charAt(cursor)
			if (Source.isNewline(c)) {
				break
			}
			if (!Source.isSpace(c)) {
				return true
			}
		}
		return false
	}

	slice(start: number, end?: number): string
	slice(rangeLike: Range | RangeContainer): string
	slice(param0: Range | RangeContainer | number, end?: number): string {
		if (typeof param0 === 'number') {
			const innerStart = IndexMap.toInnerOffset(this.indexMap, param0)
			const innerEnd = end !== undefined
				? IndexMap.toInnerOffset(this.indexMap, end)
				: undefined
			return this.string.slice(innerStart, innerEnd)
		}
		const range = IndexMap.toInnerRange(this.indexMap, Range.get(param0))
		return this.string.slice(range.start, range.end)
	}

	sliceToCursor(start: number) {
		const innerStart = IndexMap.toInnerOffset(this.indexMap, start)
		return this.string.slice(innerStart, this.innerCursor)
	}
}

export class Source extends ReadonlySource {
	constructor(
		public override string: string,
		public override indexMap: IndexMap = [],
	) {
		super(string, indexMap)
	}

	override get cursor() {
		return super.cursor
	}

	override set cursor(cursor: number) {
		this.innerCursor = IndexMap.toInnerOffset(this.indexMap, cursor)
	}

	clone(): Source {
		const ans = new Source(this.string, this.indexMap)
		ans.innerCursor = this.innerCursor
		return ans
	}

	canRead(length = 1) {
		return this.innerCursor + length <= this.string.length
	}

	canReadInLine() {
		return this.canRead() && this.peek() !== CR && this.peek() !== LF
	}

	read() {
		return this.string.charAt(this.innerCursor++)
	}

	/**
	 * Skips the current character.
	 * @param step The step to skip. @default 1
	 */
	skip(step = 1): this {
		this.innerCursor += step
		return this
	}

	/**
	 * If the `expectedValue` is right after the cursor, skips it and returns `true`. Otherwise returns `false`.
	 *
	 * This is a shortcut for the following piece of code:
	 * ```typescript
	 * declare const src: Source
	 * if (src.peek(expectedValue.length) === expectedValue) {
	 * 	src.skip(expectedValue.length)
	 * 	// Do something here.
	 * }
	 * ```
	 *
	 * @see {@link Source.tryPeek}
	 */
	trySkip(expectedValue: string): boolean {
		if (this.peek(expectedValue.length) === expectedValue) {
			this.skip(expectedValue.length)
			return true
		}
		return false
	}

	/**
	 * Reads until the end of this line.
	 */
	readLine() {
		return this.readUntil(CR, LF)
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
		const start = this.innerCursor
		this.skipSpace()
		return this.string.slice(start, this.innerCursor)
	}
	skipSpace(): this {
		while (this.canRead() && Source.isSpace(this.peek())) {
			this.skip()
		}
		return this
	}

	readWhitespace() {
		const start = this.innerCursor
		this.skipWhitespace()
		return this.string.slice(start, this.innerCursor)
	}
	skipWhitespace(): this {
		while (this.canRead() && Source.isWhitespace(this.peek())) {
			this.skip()
		}
		return this
	}

	readIf(predicate: (this: void, char: string) => boolean): string {
		let ans = ''
		while (this.canRead()) {
			const c = this.peek()
			if (predicate(c)) {
				this.skip()
				ans += c
			} else {
				break
			}
		}
		return ans
	}
	skipIf(predicate: (this: void, char: string) => boolean): this {
		this.readIf(predicate)
		return this
	}

	/**
	 * @param terminators Ending character. Will not be skipped or included in the result.
	 */
	readUntil(...terminators: string[]) {
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
	/**
	 * @param terminators Ending character. Will not be skipped.
	 */
	skipUntilOrEnd(...terminators: string[]): this {
		this.readUntil(...terminators)
		return this
	}

	readUntilLineEnd() {
		return this.readUntil(CR, LF)
	}
	skipUntilLineEnd() {
		return this.skipUntilOrEnd(CR, LF)
	}

	readRemaining(): string {
		const start = this.innerCursor
		this.innerCursor = this.string.length
		return this.string.slice(start)
	}
	skipRemaining(): this {
		this.readRemaining()
		return this
	}
}

export namespace Source {
	export function isDigit(c: string): c is Digit {
		return c >= '0' && c <= '9'
	}

	export function isBrigadierQuote(c: string): c is '"' | "'" {
		return c === '"' || c === "'"
	}

	export function isNewline(c: string): c is Newline {
		return c === '\r\n' || c === '\r' || c === '\n'
	}

	export function isSpace(c: string): c is Space {
		return c === ' ' || c === '\t'
	}

	export function isWhitespace(c: string): c is Whitespace {
		return Source.isSpace(c) || Source.isNewline(c)
	}
}
