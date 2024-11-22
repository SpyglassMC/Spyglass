exports['mcmeta getMcmetaSummaryUris() Should return correctly for "1.17" (false) from "GitHub" 1'] = {
  "blocks": "https://raw.githubusercontent.com/misode/mcmeta/1.17-summary/blocks/data.json.gz",
  "commands": "https://raw.githubusercontent.com/misode/mcmeta/1.17-summary/commands/data.json.gz",
  "registries": "https://raw.githubusercontent.com/misode/mcmeta/1.17-summary/registries/data.json.gz"
}

exports['mcmeta getMcmetaSummaryUris() Should return correctly for "1.17" (false) from "jsDelivr" 1'] = {
  "blocks": "https://cdn.jsdelivr.net/gh/misode/mcmeta@1.17-summary/blocks/data.json.gz",
  "commands": "https://cdn.jsdelivr.net/gh/misode/mcmeta@1.17-summary/commands/data.json.gz",
  "registries": "https://cdn.jsdelivr.net/gh/misode/mcmeta@1.17-summary/registries/data.json.gz"
}

exports['mcmeta getMcmetaSummaryUris() Should return correctly for "22w03a" (true) from "GitHub" 1'] = {
  "blocks": "https://raw.githubusercontent.com/misode/mcmeta/summary/blocks/data.json.gz",
  "commands": "https://raw.githubusercontent.com/misode/mcmeta/summary/commands/data.json.gz",
  "registries": "https://raw.githubusercontent.com/misode/mcmeta/summary/registries/data.json.gz"
}

exports['mcmeta getMcmetaSummaryUris() Should return correctly for "22w03a" (true) from "jsDelivr" 1'] = {
  "blocks": "https://cdn.jsdelivr.net/gh/misode/mcmeta@summary/blocks/data.json.gz",
  "commands": "https://cdn.jsdelivr.net/gh/misode/mcmeta@summary/commands/data.json.gz",
  "registries": "https://cdn.jsdelivr.net/gh/misode/mcmeta@summary/registries/data.json.gz"
}

exports['mcmeta resolveConfiguredVersion() Should resolve "1.16.5" 1'] = {
  "id": "1.16.5",
  "name": "1.16.5",
  "release": "1.16.5",
  "isLatest": false,
  "reason": "config"
}

exports['mcmeta resolveConfiguredVersion() Should resolve "20w06a" 1'] = {
  "id": "20w06a",
  "name": "Snapshot 20w06a",
  "release": "1.16",
  "isLatest": false,
  "reason": "config"
}

exports['mcmeta resolveConfiguredVersion() Should resolve "22w03a" 1'] = {
  "id": "22w03a",
  "name": "22w03a",
  "release": "1.18.2",
  "isLatest": true,
  "reason": "config"
}

exports['mcmeta resolveConfiguredVersion() Should resolve "Auto" 1'] = {
  "id": "1.16.5",
  "name": "1.16.5",
  "release": "1.16.5",
  "isLatest": false,
  "reason": "auto"
}

exports['mcmeta resolveConfiguredVersion() Should resolve "Latest Release" 1'] = {
  "id": "1.18.1",
  "name": "1.18.1",
  "release": "1.18.1",
  "isLatest": false,
  "reason": "config"
}

exports['mcmeta resolveConfiguredVersion() Should resolve "Latest Snapshot" 1'] = {
  "id": "22w03a",
  "name": "22w03a",
  "release": "1.18.2",
  "isLatest": true,
  "reason": "config"
}

exports['mcmeta resolveConfiguredVersion() Should resolve "unknown" 1'] = {
  "id": "22w03a",
  "name": "22w03a",
  "release": "1.18.2",
  "isLatest": true,
  "reason": "config"
}

exports['mcmeta symbolRegistrar() Should register correctly 1'] = `
CATEGORY activity
+ SYMBOL minecraft:admire_item {activity} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:avoid {activity} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:celebrate {activity} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
------------
CATEGORY advancement
+ SYMBOL minecraft:adventure/adventuring_time {advancement} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:adventure/arbalistic {advancement} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:adventure/bullseye {advancement} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:adventure/fall_from_world_height {advancement} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
------------
CATEGORY attribute
+ SYMBOL minecraft:generic.armor {attribute} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:generic.armor_toughness {attribute} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:generic.attack_damage {attribute} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
------------
CATEGORY block
+ SYMBOL minecraft:acacia_button {block} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL minecraft:acacia_button.face {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_button","face","wall"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_button.face.floor {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_button.face.wall {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_button.face.ceiling {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_button.facing {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_button","facing","north"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_button.facing.north {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_button.facing.south {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_button.facing.west {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_button.facing.east {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_button.powered {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_button","powered","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_button.powered.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_button.powered.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ ------------
+ SYMBOL minecraft:acacia_door {block} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL minecraft:acacia_door.facing {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_door","facing","north"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_door.facing.north {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_door.facing.south {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_door.facing.west {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_door.facing.east {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_door.half {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_door","half","lower"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_door.half.upper {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_door.half.lower {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_door.hinge {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_door","hinge","left"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_door.hinge.left {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_door.hinge.right {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_door.open {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_door","open","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_door.open.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_door.open.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_door.powered {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_door","powered","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_door.powered.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_door.powered.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ ------------
+ SYMBOL minecraft:acacia_fence {block} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL minecraft:acacia_fence.east {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_fence","east","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_fence.east.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_fence.east.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_fence.north {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_fence","north","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_fence.north.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_fence.north.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_fence.south {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_fence","south","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_fence.south.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_fence.south.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_fence.waterlogged {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_fence","waterlogged","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_fence.waterlogged.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_fence.waterlogged.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + ------------
+ + + SYMBOL minecraft:acacia_fence.west {block (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + relations: {"default":{"category":"block","path":["minecraft:acacia_fence","west","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:acacia_fence.west.true {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:acacia_fence.west.false {block (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Block_states"}
+ ------------
+ SYMBOL minecraft:acacia_fence_gate {block} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
------------
CATEGORY fluid
+ SYMBOL minecraft:empty {fluid} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:flowing_lava {fluid} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL minecraft:flowing_lava.falling {fluid (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + relations: {"default":{"category":"fluid","path":["minecraft:flowing_lava","falling","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:flowing_lava.falling.false {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_lava.falling.true {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + ------------
+ + + SYMBOL minecraft:flowing_lava.level {fluid (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + relations: {"default":{"category":"fluid","path":["minecraft:flowing_lava","level","1"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:flowing_lava.level.1 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_lava.level.2 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_lava.level.3 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_lava.level.4 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_lava.level.5 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_lava.level.6 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_lava.level.7 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_lava.level.8 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ ------------
+ SYMBOL minecraft:flowing_water {fluid} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL minecraft:flowing_water.falling {fluid (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + relations: {"default":{"category":"fluid","path":["minecraft:flowing_water","falling","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:flowing_water.falling.false {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_water.falling.true {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + ------------
+ + + SYMBOL minecraft:flowing_water.level {fluid (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + relations: {"default":{"category":"fluid","path":["minecraft:flowing_water","level","1"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:flowing_water.level.1 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_water.level.2 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_water.level.3 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_water.level.4 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_water.level.5 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_water.level.6 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_water.level.7 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:flowing_water.level.8 {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ ------------
+ SYMBOL minecraft:lava {fluid} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL minecraft:lava.falling {fluid (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + relations: {"default":{"category":"fluid","path":["minecraft:lava","falling","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:lava.falling.false {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:lava.falling.true {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ ------------
+ SYMBOL minecraft:water {fluid} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL minecraft:water.falling {fluid (state)} [Public]
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + relations: {"default":{"category":"fluid","path":["minecraft:water","falling","false"]}}
+ + + + members:
+ + + + + SYMBOL minecraft:water.falling.false {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
+ + + + + ------------
+ + + + + SYMBOL minecraft:water.falling.true {fluid (state_value)} [Public]
+ + + + + + declaration:
+ + + + + + + {"uri":"mcmeta://summary/registries.json#Fluid_states"}
------------
CATEGORY worldgen/tree_decorator_type
+ SYMBOL minecraft:alter_ground {worldgen/tree_decorator_type} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:beehive {worldgen/tree_decorator_type} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:cocoa {worldgen/tree_decorator_type} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:leave_vine {worldgen/tree_decorator_type} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL minecraft:trunk_vine {worldgen/tree_decorator_type} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
------------
CATEGORY mcdoc/dispatcher
+ SYMBOL mcdoc:block_states {mcdoc/dispatcher} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + + ------------
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL mcdoc:block_states.acacia_button {mcdoc/dispatcher} [Public]
+ + + + data: {"typeDef":{"kind":"struct","fields":[{"kind":"pair","key":"face","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"floor"}},{"kind":"literal","value":{"kind":"string","value":"wall"}},{"kind":"literal","value":{"kind":"string","value":"ceiling"}}]}},{"kind":"pair","key":"facing","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"north"}},{"kind":"literal","value":{"kind":"string","value":"south"}},{"kind":"literal","value":{"kind":"string","value":"west"}},{"kind":"literal","value":{"kind":"string","value":"east"}}]}},{"kind":"pair","key":"powered","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"true"}},{"kind":"literal","value":{"kind":"string","value":"false"}}]}}]}}
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + + + ------------
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + ------------
+ + + SYMBOL mcdoc:block_states.acacia_door {mcdoc/dispatcher} [Public]
+ + + + data: {"typeDef":{"kind":"struct","fields":[{"kind":"pair","key":"facing","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"north"}},{"kind":"literal","value":{"kind":"string","value":"south"}},{"kind":"literal","value":{"kind":"string","value":"west"}},{"kind":"literal","value":{"kind":"string","value":"east"}}]}},{"kind":"pair","key":"half","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"upper"}},{"kind":"literal","value":{"kind":"string","value":"lower"}}]}},{"kind":"pair","key":"hinge","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"left"}},{"kind":"literal","value":{"kind":"string","value":"right"}}]}},{"kind":"pair","key":"open","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"true"}},{"kind":"literal","value":{"kind":"string","value":"false"}}]}},{"kind":"pair","key":"powered","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"true"}},{"kind":"literal","value":{"kind":"string","value":"false"}}]}}]}}
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + + + ------------
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + ------------
+ + + SYMBOL mcdoc:block_states.acacia_fence {mcdoc/dispatcher} [Public]
+ + + + data: {"typeDef":{"kind":"struct","fields":[{"kind":"pair","key":"east","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"true"}},{"kind":"literal","value":{"kind":"string","value":"false"}}]}},{"kind":"pair","key":"north","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"true"}},{"kind":"literal","value":{"kind":"string","value":"false"}}]}},{"kind":"pair","key":"south","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"true"}},{"kind":"literal","value":{"kind":"string","value":"false"}}]}},{"kind":"pair","key":"waterlogged","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"true"}},{"kind":"literal","value":{"kind":"string","value":"false"}}]}},{"kind":"pair","key":"west","optional":true,"type":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"true"}},{"kind":"literal","value":{"kind":"string","value":"false"}}]}}]}}
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + + + ------------
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ ------------
+ SYMBOL mcdoc:block_state_keys {mcdoc/dispatcher} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + + ------------
+ + + {"uri":"mcmeta://summary/registries.json"}
+ + members:
+ + + SYMBOL mcdoc:block_state_keys.acacia_button {mcdoc/dispatcher} [Public]
+ + + + data: {"typeDef":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"face"}},{"kind":"literal","value":{"kind":"string","value":"facing"}},{"kind":"literal","value":{"kind":"string","value":"powered"}}]}}
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + + + ------------
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + ------------
+ + + SYMBOL mcdoc:block_state_keys.acacia_door {mcdoc/dispatcher} [Public]
+ + + + data: {"typeDef":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"facing"}},{"kind":"literal","value":{"kind":"string","value":"half"}},{"kind":"literal","value":{"kind":"string","value":"hinge"}},{"kind":"literal","value":{"kind":"string","value":"open"}},{"kind":"literal","value":{"kind":"string","value":"powered"}}]}}
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + + + ------------
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + ------------
+ + + SYMBOL mcdoc:block_state_keys.acacia_fence {mcdoc/dispatcher} [Public]
+ + + + data: {"typeDef":{"kind":"union","members":[{"kind":"literal","value":{"kind":"string","value":"east"}},{"kind":"literal","value":{"kind":"string","value":"north"}},{"kind":"literal","value":{"kind":"string","value":"south"}},{"kind":"literal","value":{"kind":"string","value":"waterlogged"}},{"kind":"literal","value":{"kind":"string","value":"west"}}]}}
+ + + + declaration:
+ + + + + {"uri":"mcmeta://summary/registries.json"}
+ + + + + ------------
+ + + + + {"uri":"mcmeta://summary/registries.json"}
------------
CATEGORY loot_table
+ SYMBOL minecraft:empty {loot_table} [Public]
+ + declaration:
+ + + {"uri":"mcmeta://summary/registries.json"}
`
