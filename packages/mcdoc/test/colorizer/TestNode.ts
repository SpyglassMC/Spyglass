import type { SymbolTable } from '@spyglassmc/core'
import type { ModuleNode } from '../../lib'

export const TestContent = `
/// Doc comment.
compound Foo {
	Bar: byte,
	Baz: Qux
}

enum(int) Qux {
	One = 1
}

enum(float) Eww {
	One = 1.0
}

enum(string) Huh {
	One = "One"
}

Foo describes minecraft:block;

inject compound Foo {
	Injected: [Eww] @ 4
}
`

export const TestNode: ModuleNode = {} as any

export declare const TestSymbolTable: SymbolTable
