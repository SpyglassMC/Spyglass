exports['mcfunction argument minecraft:loot_table Parse "minecraft:blocks/crafting_table" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 31
    },
    "namespace": "minecraft",
    "path": [
      "blocks",
      "crafting_table"
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:loot_table Parse "{pools:[]}" 1'] = {
  "node": {
    "type": "nbt:compound",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 9
        },
        "children": [
          {
            "type": "nbt:string",
            "range": {
              "start": 1,
              "end": 6
            },
            "value": "pools",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 1,
                  "end": 1
                }
              }
            ]
          },
          {
            "type": "nbt:list",
            "range": {
              "start": 7,
              "end": 9
            },
            "children": []
          }
        ],
        "key": {
          "type": "nbt:string",
          "range": {
            "start": 1,
            "end": 6
          },
          "value": "pools",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 1,
                "end": 1
              }
            }
          ]
        },
        "sep": {
          "start": 6,
          "end": 7
        },
        "value": {
          "type": "nbt:list",
          "range": {
            "start": 7,
            "end": 9
          },
          "children": []
        }
      }
    ]
  },
  "errors": []
}
