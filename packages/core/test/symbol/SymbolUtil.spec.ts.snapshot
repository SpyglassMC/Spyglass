exports[`SymbolUtil > clear() > Should clear all 1`] = `
CATEGORY mcdoc
+ SYMBOL ShouldBeKept1 {mcdoc} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
+ + members:
+ + + SYMBOL ShouldBeKept1.ShouldBeRemoved1 {mcdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + ------------
+ + + SYMBOL ShouldBeKept1.ShouldBeKept2 {mcdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + + + ------------
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ ------------
+ SYMBOL ShouldBeKept3 {mcdoc} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://another_test_file"}
+ + members:
+ + + SYMBOL ShouldBeKept3.ShouldBeKept4 {mcdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ + + ------------
+ + + SYMBOL ShouldBeKept3.ShouldBeKept5 {mcdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ + + + + ------------
+ + + + + {"uri":"spyglassmc://test_file"}
+ + + ------------
+ + + SYMBOL ShouldBeKept3.ShouldBeRemoved3 {mcdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://test_file"}
`;

exports[`SymbolUtil > clear() > Should clear all 2`] = `
CATEGORY mcdoc
+ SYMBOL ShouldBeKept1 {mcdoc} [Public]
+ + definition:

+ + members:
+ + + SYMBOL ShouldBeKept1.ShouldBeKept2 {mcdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ ------------
+ SYMBOL ShouldBeKept3 {mcdoc} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://another_test_file"}
+ + members:
+ + + SYMBOL ShouldBeKept3.ShouldBeKept4 {mcdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
+ + + ------------
+ + + SYMBOL ShouldBeKept3.ShouldBeKept5 {mcdoc} [Public]
+ + + + definition:
+ + + + + {"uri":"spyglassmc://another_test_file"}
`;

exports[`SymbolUtil > contributeAs > Should execute correctly 1`] = `
CATEGORY test
+ SYMBOL Bound {test} [Public]
+ + description: This symbol is URI bound.
+ + reference:
+ + + {"uri":"spyglassmc://test_file","contributor":"uri_binder"}
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Foo.Bar.Qux.Xer” 1`] = `
parentSymbol:
+ SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + definition:
+ + + {"uri":"spyglassmc://test_file"}
parentMap:
undefined
symbol:
undefined
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Foo.Bar.Qux” 1`] = `
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
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Foo.Bar.Unknown” 1`] = `
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
undefined
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Foo.Bar” 1`] = `
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
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Foo.Baz.Xer” 1`] = `
parentSymbol:
undefined
parentMap:
undefined
symbol:
undefined
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Foo.Baz” 1`] = `
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
undefined
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Foo.Unknown” 1`] = `
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
undefined
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Foo” 1`] = `
parentSymbol:
undefined
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
`;

exports[`SymbolUtil > lookup() > Should return correctly for “Unknown” 1`] = `
parentSymbol:
undefined
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
undefined
`;

exports[`SymbolUtil > lookup() > Should return correctly for “” 1`] = `
parentSymbol:
undefined
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
undefined
`;

exports[`SymbolUtil > lookup() > Should return correctly when URI is not specified 1`] = `
parentSymbol:
undefined
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Qux.Xer” 1`] = `
undefined
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Qux.Xer” 2`] = `
SYMBOL Foo.Bar.Qux.Xer {advancement} [Public]
+ description: Entered.
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Qux.Xer” 3`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Qux” 1`] = `
SYMBOL Foo.Bar.Qux {advancement} [Public]
+ definition:
+ + {"uri":"spyglassmc://test_file"}
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Qux” 2`] = `
SYMBOL Foo.Bar.Qux {advancement} [Public]
+ description: Entered.
+ definition:
+ + {"uri":"spyglassmc://test_file"}
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Qux” 3`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Unknown” 1`] = `
undefined
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Unknown” 2`] = `
SYMBOL Foo.Bar.Unknown {advancement} [Public]
+ description: Entered.
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar.Unknown” 3`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar” 1`] = `
SYMBOL Foo.Bar {advancement} [Public]
+ definition:
+ + {"uri":"spyglassmc://test_file"}
+ members:
+ + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + definition:
+ + + + {"uri":"spyglassmc://test_file"}
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar” 2`] = `
SYMBOL Foo.Bar {advancement} [Public]
+ description: Entered.
+ definition:
+ + {"uri":"spyglassmc://test_file"}
+ members:
+ + SYMBOL Foo.Bar.Qux {advancement} [Public]
+ + + definition:
+ + + + {"uri":"spyglassmc://test_file"}
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Bar” 3`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Baz.Xer” 1`] = `
undefined
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Baz.Xer” 2`] = `
Error: Cannot create the symbol map for “advancement.Foo/Baz/Xer”
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Baz.Xer” 3`] = `
undefined
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Baz.Xer” 4`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Baz” 1`] = `
undefined
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Baz” 2`] = `
SYMBOL Foo.Baz {advancement} [Public]
+ description: Entered.
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Baz” 3`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Unknown” 1`] = `
undefined
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Unknown” 2`] = `
SYMBOL Foo.Unknown {advancement} [Public]
+ description: Entered.
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo.Unknown” 3`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo” 1`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo” 2`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Foo” 3`] = `
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
`;

exports[`SymbolUtil > query() > Should return correctly for “Unknown” 1`] = `
undefined
`;

exports[`SymbolUtil > query() > Should return correctly for “Unknown” 2`] = `
SYMBOL Unknown {advancement} [Public]
+ description: Entered.
`;

exports[`SymbolUtil > query() > Should return correctly for “Unknown” 3`] = `
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
`;
