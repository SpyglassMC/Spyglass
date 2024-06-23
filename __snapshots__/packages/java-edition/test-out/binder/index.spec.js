exports['dissectUri() Dissect Uri "file:///data/loot_tables/foo.json" 1'] = `
undefined
`

exports['dissectUri() Dissect Uri "file:///data/minecraft/advancements/data/foo/predicates/bar.json" 1'] = {
  "category": "advancement",
  "namespace": "minecraft",
  "identifier": "data/foo/predicates/bar"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/entities/foo.json" 1'] = `
undefined
`

exports['dissectUri() Dissect Uri "file:///data/minecraft/loot_table/foo.json" in 1.21 1'] = {
  "category": "loot_table",
  "namespace": "minecraft",
  "identifier": "foo"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/loot_tables/foo.json" 1'] = {
  "category": "loot_table",
  "namespace": "minecraft",
  "identifier": "foo"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/tags/block/bar.json" 1'] = `
undefined
`

exports['dissectUri() Dissect Uri "file:///data/minecraft/tags/block/bar.json" in 1.21 1'] = {
  "category": "tag/block",
  "namespace": "minecraft",
  "identifier": "bar"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/tags/blocks/bar.json" 1'] = {
  "category": "tag/block",
  "namespace": "minecraft",
  "identifier": "bar"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/tags/blocks/bar.json" in 1.21 1'] = `
undefined
`

exports['dissectUri() Dissect Uri "file:///data/qux/dimension/foo/baz.json" in 1.16 1'] = {
  "category": "dimension",
  "namespace": "qux",
  "identifier": "foo/baz"
}

exports['dissectUri() Dissect Uri "file:///pack.mcmeta" 1'] = `
undefined
`
