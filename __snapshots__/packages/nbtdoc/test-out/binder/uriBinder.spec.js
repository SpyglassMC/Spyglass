exports['uriBinder() Bind ["file:///a.nbtdoc","minecraft/foo.nbtdoc","minecraft/bar.nbtdoc","minecraft/qux.mcfunction"] 1'] = `
CATEGORY nbtdoc
+ SYMBOL ::minecraft::foo {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/minecraft/foo.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::minecraft::bar {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/minecraft/bar.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`

exports['uriBinder() Bind ["mod.nbtdoc","minecraft/mod.nbtdoc","minecraft/foo/mod.nbtdoc"] 1'] = `
CATEGORY nbtdoc
+ SYMBOL :: {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/mod.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::minecraft {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/minecraft/mod.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::minecraft::foo {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/minecraft/foo/mod.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`

exports['uriBinder() Bind ["nbtdoc/foo.nbtdoc","nbtdoc/minecraft/bar.nbtdoc"] 1'] = `
CATEGORY nbtdoc
+ SYMBOL ::foo {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/nbtdoc/foo.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::minecraft::bar {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/nbtdoc/minecraft/bar.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`

exports['uriBinder() Bind ["nbtdoc/mod.nbtdoc","nbtdoc/foo.nbtdoc","nbtdoc/minecraft/bar.nbtdoc"] 1'] = `
CATEGORY nbtdoc
+ SYMBOL ::nbtdoc {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/nbtdoc/mod.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::nbtdoc::foo {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/nbtdoc/foo.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::nbtdoc::minecraft::bar {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/nbtdoc/minecraft/bar.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`

exports['uriBinder() Bind ["qux.nbtdoc","nbtdoc/foo.nbtdoc","nbtdoc/minecraft/bar.nbtdoc"] 1'] = `
CATEGORY nbtdoc
+ SYMBOL ::qux {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/qux.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::nbtdoc::foo {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/nbtdoc/foo.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
+ ------------
+ SYMBOL ::nbtdoc::minecraft::bar {nbtdoc (module)} [Public]
+ + implementation:
+ + + {"uri":"file:///root/nbtdoc/minecraft/bar.nbtdoc","range":{"start":0,"end":0},"posRange":{"start":{"line":0,"character":0},"end":{"line":0,"character":0}}}
`
