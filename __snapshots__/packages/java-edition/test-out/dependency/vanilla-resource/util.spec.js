exports['vanilla-resource util addBlockSymbols() Should add correctly 1'] = {
  "block": {
    "minecraft:stone": {
      "category": "block",
      "identifier": "minecraft:stone",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Stone",
          "fromDefaultLibrary": true
        }
      ]
    },
    "minecraft:grass_block": {
      "category": "block",
      "identifier": "minecraft:grass_block",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Grass_Block",
          "fromDefaultLibrary": true
        }
      ],
      "members": {
        "snowy": {
          "category": "block",
          "identifier": "snowy",
          "subcategory": "state",
          "declaration": [
            {
              "uri": "https://minecraft.fandom.com/wiki/Grass_Block#Block_states",
              "fromDefaultLibrary": true
            }
          ],
          "members": {
            "false": {
              "category": "block",
              "identifier": "false",
              "subcategory": "state_value",
              "declaration": [
                {
                  "uri": "https://minecraft.fandom.com/wiki/Grass_Block#Block_states",
                  "fromDefaultLibrary": true
                }
              ]
            },
            "true": {
              "category": "block",
              "identifier": "true",
              "subcategory": "state_value",
              "declaration": [
                {
                  "uri": "https://minecraft.fandom.com/wiki/Grass_Block#Block_states",
                  "fromDefaultLibrary": true
                }
              ]
            }
          },
          "relations": {
            "default": {
              "category": "block",
              "identifier": "false",
              "subcategory": "state_value",
              "declaration": [
                {
                  "uri": "https://minecraft.fandom.com/wiki/Grass_Block#Block_states",
                  "fromDefaultLibrary": true
                }
              ]
            }
          }
        }
      }
    }
  }
}

exports['vanilla-resource util addRegistriesSymbols() Should add correctly 1'] = {
  "attribute": {
    "minecraft:generic.max_health": {
      "category": "attribute",
      "identifier": "minecraft:generic.max_health",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Attribute#Attributes",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "activity": {
    "minecraft:core": {
      "category": "activity",
      "identifier": "minecraft:core",
      "declaration": [
        {
          "uri": "spyglassmc://vanilla-resource/registries.json",
          "fromDefaultLibrary": true
        }
      ]
    },
    "minecraft:idle": {
      "category": "activity",
      "identifier": "minecraft:idle",
      "declaration": [
        {
          "uri": "spyglassmc://vanilla-resource/registries.json",
          "fromDefaultLibrary": true
        }
      ]
    },
    "minecraft:work": {
      "category": "activity",
      "identifier": "minecraft:work",
      "declaration": [
        {
          "uri": "spyglassmc://vanilla-resource/registries.json",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "block_entity_type": {
    "minecraft:furnace": {
      "category": "block_entity_type",
      "identifier": "minecraft:furnace",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Furnace#Block_data",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "custom_stat": {
    "minecraft:leave_game": {
      "category": "custom_stat",
      "identifier": "minecraft:leave_game",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Statistics#List_of_custom_statistic_names",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "enchantment": {
    "minecraft:protection": {
      "category": "enchantment",
      "identifier": "minecraft:protection",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Protection",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "entity_type": {
    "minecraft:area_effect_cloud": {
      "category": "entity_type",
      "identifier": "minecraft:area_effect_cloud",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Area_Effect_Cloud",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "fluid": {
    "minecraft:empty": {
      "category": "fluid",
      "identifier": "minecraft:empty",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Air",
          "fromDefaultLibrary": true
        }
      ]
    },
    "minecraft:lava": {
      "category": "fluid",
      "identifier": "minecraft:lava",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Lava",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "item": {
    "minecraft:air": {
      "category": "item",
      "identifier": "minecraft:air",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Air",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "recipe_serializer": {
    "minecraft:crafting_shaped": {
      "category": "recipe_serializer",
      "identifier": "minecraft:crafting_shaped",
      "declaration": [
        {
          "uri": "https://minecraft.fandom.com/wiki/Recipe#crafting_shaped",
          "fromDefaultLibrary": true
        }
      ]
    }
  },
  "sound_event": {
    "minecraft:ambient.cave": {
      "category": "sound_event",
      "identifier": "minecraft:ambient.cave",
      "declaration": [
        {
          "uri": "https://misode.github.io/sounds/?sound=ambient.cave",
          "fromDefaultLibrary": true
        }
      ]
    }
  }
}

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "1.14" (1) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.14/generated/reports/blocks.json
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "1.16.2-pre1" (5) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.16.2-pre1/processed/reports/blocks/data.min.json
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "20w09a" (3) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/20w09a/processed/reports/blocks/blocks.min.json
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "21w03a" (13) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/21w03a/processed/reports/blocks/simplified/data.min.json
`

exports['vanilla-resource util getBlocksUrl() Should return the correct url for "21w13a" (29) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/blocks/simplified/data.min.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "1.14" (1) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.14/generated/reports/commands.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "1.16.2-pre1" (5) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.16.2-pre1/processed/reports/commands/data.min.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "20w09a" (3) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/20w09a/processed/reports/commands/commands.min.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "21w03a" (13) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/21w03a/processed/reports/commands/data.min.json
`

exports['vanilla-resource util getCommandsUrl() Should return the correct url for "21w13a" (29) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/commands/data.min.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "1.14" (1) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.14/generated/reports/registries.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "1.16.2-pre1" (5) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/1.16.2-pre1/processed/reports/registries/data.min.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "20w09a" (3) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/20w09a/processed/reports/registries/registries.min.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "21w03a" (13) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/21w03a/processed/reports/registries/data.min.json
`

exports['vanilla-resource util getRegistriesUrl() Should return the correct url for "21w13a" (29) 1'] = `
https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/registries/data.min.json
`

exports['vanilla-resource util transformBlocks() Should transform correctly 1'] = {
  "minecraft:stone": {
    "properties": {},
    "default": {}
  },
  "minecraft:grass_block": {
    "properties": {
      "snowy": [
        "false",
        "true"
      ]
    },
    "default": {
      "snowy": "false"
    }
  }
}

exports['vanilla-resource util transformRegistries() Should transform correctly 1'] = {
  "minecraft:item": [
    "minecraft:stone",
    "minecraft:grass_block"
  ],
  "minecraft:particle": [
    "minecraft:cloud",
    "minecraft:dust",
    "minecraft:item"
  ]
}
