exports['SymbolUtil clear() Should clear all 1'] = `
CATEGORY nbtdoc
+ SYMBOL ShouldBeRemoved1 {nbtdoc} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL ShouldBeRemoved1.ShouldBeRemoved2 {nbtdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + ------------
+ + + SYMBOL ShouldBeRemoved1.ShouldBeRemoved3 {nbtdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + + ------------
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ ------------
+ SYMBOL ShouldBeKept1 {nbtdoc} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://another_test_file"}
+ + members:
+ + + SYMBOL ShouldBeKept1.ShouldBeKept2 {nbtdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ + + ------------
+ + + SYMBOL ShouldBeKept1.ShouldBeKept3 {nbtdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ + + + + ------------
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + ------------
+ + + SYMBOL ShouldBeKept1.ShouldBeRemoved4 {nbtdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil clear() Should clear all 2'] = `
CATEGORY nbtdoc
+ SYMBOL ShouldBeKept1 {nbtdoc} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://another_test_file"}
+ + members:
+ + + SYMBOL ShouldBeKept1.ShouldBeKept2 {nbtdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ + + ------------
+ + + SYMBOL ShouldBeKept1.ShouldBeKept3 {nbtdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
`

exports['SymbolUtil getStack() Should create a new stack 1'] = `
EMPTY TABLE
`

exports['SymbolUtil getStack() Should get the existing stack 1'] = `
EMPTY TABLE
------------
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil lookup() Should return correctly for “Foo.Bar.Qux.Xer” 1'] = `
parentSymbol:
+ SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
parentMap:
null
symbol:
null
`

exports['SymbolUtil lookup() Should return correctly for “Foo.Bar.Qux” 1'] = `
parentSymbol:
+ SYMBOL Foo.Bar {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
parentMap:
+ SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
symbol:
+ SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil lookup() Should return correctly for “Foo.Bar.Unknown” 1'] = `
parentSymbol:
+ SYMBOL Foo.Bar {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
parentMap:
+ SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
symbol:
null
`

exports['SymbolUtil lookup() Should return correctly for “Foo.Bar” 1'] = `
parentSymbol:
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
parentMap:
+ SYMBOL Foo.Bar {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
symbol:
+ SYMBOL Foo.Bar {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil lookup() Should return correctly for “Foo.Baz.Xer” 1'] = `
parentSymbol:
+ SYMBOL Foo.Baz {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
parentMap:
null
symbol:
null
`

exports['SymbolUtil lookup() Should return correctly for “Foo.Baz” 1'] = `
parentSymbol:
+ SYMBOL Foo {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Baz {advancement} [Public]
+ + + + description: STACK
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
parentMap:
+ SYMBOL Foo.Baz {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
symbol:
+ SYMBOL Foo.Baz {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil lookup() Should return correctly for “Foo.Unknown” 1'] = `
parentSymbol:
+ SYMBOL Foo {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Baz {advancement} [Public]
+ + + + description: STACK
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
parentMap:
+ SYMBOL Foo.Baz {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
symbol:
null
`

exports['SymbolUtil lookup() Should return correctly for “Foo” 1'] = `
parentSymbol:
null
parentMap:
+ SYMBOL Foo {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Baz {advancement} [Public]
+ + + + description: STACK
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
symbol:
+ SYMBOL Foo {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Baz {advancement} [Public]
+ + + + description: STACK
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil lookup() Should return correctly for “Unknown” 1'] = `
parentSymbol:
null
parentMap:
+ SYMBOL Foo {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Baz {advancement} [Public]
+ + + + description: STACK
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
symbol:
null
`

exports['SymbolUtil lookup() Should return correctly for “” 1'] = `
parentSymbol:
null
parentMap:
+ SYMBOL Foo {advancement} [Public]
+ + description: STACK
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Baz {advancement} [Public]
+ + + + description: STACK
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
symbol:
null
`

exports['SymbolUtil lookup() Should return correctly when URI is not specified 1'] = `
parentSymbol:
null
parentMap:
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
symbol:
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Qux.Xer” 1'] = `
null
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Qux.Xer” 2'] = `
SYMBOL Foo.Bar.Qux.Xer {advancement} [Public]
+ description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Qux.Xer” 3'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
+ + + + + + members:
+ + + + + + + SYMBOL Foo.Bar.Qux.Xer {advancement} [Public]
+ + + + + + + + description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Qux” 1'] = `
SYMBOL Foo.Bar.Qux {advancement} [Public]
+ definition:
+ + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Qux” 2'] = `
SYMBOL Foo.Bar.Qux {advancement} [Public]
+ description: Entered.
+ definition:
+ + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Qux” 3'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + description: Entered.
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Unknown” 1'] = `
null
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Unknown” 2'] = `
SYMBOL Foo.Bar.Unknown {advancement} [Public]
+ description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar.Unknown” 3'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
+ + + + + ------------
+ + + + + SYMBOL Foo.Bar.Unknown {advancement} [Public]
+ + + + + + description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar” 1'] = `
SYMBOL Foo.Bar {advancement} [Public]
+ definition:
+ + {"uri":"spyglassmc://test_file"}
+ members:
+ + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + definition:
+ + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar” 2'] = `
SYMBOL Foo.Bar {advancement} [Public]
+ description: Entered.
+ definition:
+ + {"uri":"spyglassmc://test_file"}
+ members:
+ + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + definition:
+ + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo.Bar” 3'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + description: Entered.
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo.Baz.Xer” 1'] = `
null
`

exports['SymbolUtil query() Should return correctly for “Foo.Baz.Xer” 2'] = `
Error: Cannot enter the symbol at path “Foo.Baz.Xer” as its parent doesn't exist
`

exports['SymbolUtil query() Should return correctly for “Foo.Baz.Xer” 3'] = `
null
`

exports['SymbolUtil query() Should return correctly for “Foo.Baz.Xer” 4'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo.Baz” 1'] = `
null
`

exports['SymbolUtil query() Should return correctly for “Foo.Baz” 2'] = `
SYMBOL Foo.Baz {advancement} [Public]
+ description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Foo.Baz” 3'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
+ + + ------------
+ + + SYMBOL Foo.Baz {advancement} [Public]
+ + + + description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Foo.Unknown” 1'] = `
null
`

exports['SymbolUtil query() Should return correctly for “Foo.Unknown” 2'] = `
SYMBOL Foo.Unknown {advancement} [Public]
+ description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Foo.Unknown” 3'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
+ + + ------------
+ + + SYMBOL Foo.Unknown {advancement} [Public]
+ + + + description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Foo” 1'] = `
SYMBOL Foo {advancement} [Public]
+ definition:
+ + {"uri":"spyglassmc://test_file"}
+ members:
+ + SYMBOL Foo.Bar {advancement} [Public]
+ + + definition:
+ + + + {"uri":"spyglassmc://test_file"}
+ + + members:
+ + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + definition:
+ + + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo” 2'] = `
SYMBOL Foo {advancement} [Public]
+ description: Entered.
+ definition:
+ + {"uri":"spyglassmc://test_file"}
+ members:
+ + SYMBOL Foo.Bar {advancement} [Public]
+ + + definition:
+ + + + {"uri":"spyglassmc://test_file"}
+ + + members:
+ + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + definition:
+ + + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Foo” 3'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + description: Entered.
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
`

exports['SymbolUtil query() Should return correctly for “Unknown” 1'] = `
null
`

exports['SymbolUtil query() Should return correctly for “Unknown” 2'] = `
SYMBOL Unknown {advancement} [Public]
+ description: Entered.
`

exports['SymbolUtil query() Should return correctly for “Unknown” 3'] = `
CATEGORY advancement
+ SYMBOL Foo {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL Foo.Bar {advancement} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + members:
+ + + + + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + + + + definition:
+ + + + + + + {"uri":"spyglassmc://test_file"}
+ ------------
+ SYMBOL Unknown {advancement} [Public]
+ + description: Entered.
`

exports['SymbolUtil uriBinding Should execute correctly 1'] = `
CATEGORY test
+ SYMBOL BeforeBinding2 {test} [Public]
+ + description: Entered before URI binding w/ references.
+ + reference:
+ + + {"uri":"spyglassmc://test_file"}
+ ------------
+ SYMBOL Bound {test} [Public]
+ + description: This symbol is URI bound.
+ + reference:
+ + + {"uri":"spyglassmc://test_file","isUriBound":true}
+ ------------
+ SYMBOL AfterBinding {test} [Public]
+ + description: Entered after URI binding w/ references.
+ + reference:
+ + + {"uri":"spyglassmc://test_file"}
`
