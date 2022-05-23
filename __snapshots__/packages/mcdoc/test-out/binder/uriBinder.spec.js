exports['uriBinder() Bind ["file:///a.mcdoc","minecraft/foo.mcdoc","minecraft/bar.mcdoc","minecraft/qux.mcfunction"] 1'] = `
CATEGORY mcdoc
+ SYMBOL ::minecraft::foo {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/minecraft/foo.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::minecraft::bar {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/minecraft/bar.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`

exports['uriBinder() Bind ["mcdoc/foo.mcdoc","mcdoc/minecraft/bar.mcdoc"] 1'] = `
CATEGORY mcdoc
+ SYMBOL ::foo {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mcdoc/foo.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::minecraft::bar {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mcdoc/minecraft/bar.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`

exports['uriBinder() Bind ["mcdoc/mod.mcdoc","mcdoc/foo.mcdoc","mcdoc/minecraft/bar.mcdoc"] 1'] = `
CATEGORY mcdoc
+ SYMBOL ::mcdoc {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mcdoc/mod.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::mcdoc::foo {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mcdoc/foo.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::mcdoc::minecraft::bar {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mcdoc/minecraft/bar.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`

exports['uriBinder() Bind ["mod.mcdoc","minecraft/mod.mcdoc","minecraft/foo/mod.mcdoc"] 1'] = `
CATEGORY mcdoc
+ SYMBOL :: {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mod.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::minecraft {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/minecraft/mod.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::minecraft::foo {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/minecraft/foo/mod.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`

exports['uriBinder() Bind ["qux.mcdoc","mcdoc/foo.mcdoc","mcdoc/minecraft/bar.mcdoc"] 1'] = `
CATEGORY mcdoc
+ SYMBOL ::qux {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/qux.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::mcdoc::foo {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mcdoc/foo.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::mcdoc::minecraft::bar {mcdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mcdoc/minecraft/bar.mcdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`
