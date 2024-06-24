exports['dissectUri() Dissect Uri "file:///data/loot_tables/foo.json" 1'] = `
undefined
`

exports['dissectUri() Dissect Uri "file:///data/minecraft/advancements/data/foo/predicates/bar.json" 1'] = {
  "ok": true,
  "path": "advancements",
  "category": "advancement",
  "ext": ".json",
  "until": "1.21",
  "namespace": "minecraft",
  "identifier": "data/foo/predicates/bar"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/entities/foo.json" 1'] = `
undefined
`

exports['dissectUri() Dissect Uri "file:///data/minecraft/loot_table/foo.json" in 1.21 1'] = {
  "ok": true,
  "path": "loot_table",
  "category": "loot_table",
  "ext": ".json",
  "since": "1.21",
  "namespace": "minecraft",
  "identifier": "foo"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/loot_tables/foo.json" 1'] = {
  "ok": true,
  "path": "loot_tables",
  "category": "loot_table",
  "ext": ".json",
  "until": "1.21",
  "namespace": "minecraft",
  "identifier": "foo"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/tags/block/bar.json" 1'] = {
  "ok": false,
  "path": "tags/block",
  "category": "tag/block",
  "ext": ".json",
  "since": "1.21",
  "namespace": "minecraft",
  "identifier": "bar",
  "expected": "tags/blocks"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/tags/block/bar.json" in 1.21 1'] = {
  "ok": true,
  "path": "tags/block",
  "category": "tag/block",
  "ext": ".json",
  "since": "1.21",
  "namespace": "minecraft",
  "identifier": "bar"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/tags/blocks/bar.json" 1'] = {
  "ok": true,
  "path": "tags/blocks",
  "category": "tag/block",
  "ext": ".json",
  "until": "1.21",
  "namespace": "minecraft",
  "identifier": "bar"
}

exports['dissectUri() Dissect Uri "file:///data/minecraft/tags/blocks/bar.json" in 1.21 1'] = {
  "ok": false,
  "path": "tags/blocks",
  "category": "tag/block",
  "ext": ".json",
  "until": "1.21",
  "namespace": "minecraft",
  "identifier": "bar",
  "expected": "tags/block"
}

exports['dissectUri() Dissect Uri "file:///data/qux/dimension/foo/baz.json" in 1.16 1'] = {
  "ok": true,
  "path": "dimension",
  "category": "dimension",
  "ext": ".json",
  "since": "1.16",
  "namespace": "qux",
  "identifier": "foo/baz"
}

exports['dissectUri() Dissect Uri "file:///pack.mcmeta" 1'] = `
undefined
`

exports['dissectUri() with customResources Dissect Uri "file:///data/minecraft/advancement/foo.json" in 1.21 1'] = {
  "ok": true,
  "path": "advancement",
  "category": "advancement",
  "ext": ".json",
  "since": "1.21",
  "namespace": "minecraft",
  "identifier": "foo"
}

exports['dissectUri() with customResources Dissect Uri "file:///data/minecraft/loot_tables/foo.json" 1'] = {
  "ok": true,
  "path": "loot_tables",
  "category": "loot_table",
  "ext": ".json",
  "until": "1.21",
  "namespace": "minecraft",
  "identifier": "foo"
}

exports['dissectUri() with customResources Dissect Uri "file:///data/qux/biome_modifiers/snowy.json" 1'] = {
  "ok": true,
  "path": "biome_modifiers",
  "category": "fabric:biome_modifier",
  "ext": ".json",
  "namespace": "qux",
  "identifier": "snowy"
}

exports['dissectUri() with customResources Dissect Uri "file:///data/qux/tags/custom_registry/nested/bar.json" 1'] = {
  "ok": true,
  "path": "tags/custom_registry",
  "category": "tag/custom_registry",
  "ext": ".json",
  "namespace": "qux",
  "identifier": "nested/bar"
}
