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
  "isLatest": false
}

exports['mcmeta resolveConfiguredVersion() Should resolve "20w06a" 1'] = {
  "id": "20w06a",
  "name": "Snapshot 20w06a",
  "release": "1.16",
  "isLatest": false
}

exports['mcmeta resolveConfiguredVersion() Should resolve "22w03a" 1'] = {
  "id": "22w03a",
  "name": "22w03a",
  "release": "1.18.2",
  "isLatest": true
}

exports['mcmeta resolveConfiguredVersion() Should resolve "Auto" 1'] = {
  "id": "1.16.5",
  "name": "1.16.5",
  "release": "1.16.5",
  "isLatest": false
}

exports['mcmeta resolveConfiguredVersion() Should resolve "Latest Release" 1'] = {
  "id": "1.18.1",
  "name": "1.18.1",
  "release": "1.18.1",
  "isLatest": false
}

exports['mcmeta resolveConfiguredVersion() Should resolve "Latest Snapshot" 1'] = {
  "id": "22w03a",
  "name": "22w03a",
  "release": "1.18.2",
  "isLatest": true
}

exports['mcmeta resolveConfiguredVersion() Should resolve "unknown" 1'] = {
  "id": "22w03a",
  "name": "22w03a",
  "release": "1.18.2",
  "isLatest": true
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
`
