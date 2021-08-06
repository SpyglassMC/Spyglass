exports['mcfunction argument minecraft:item_stack Parse "minecraft:stick" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_stack",
    "range": {
      "start": 0,
      "end": 15
    },
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 15
      },
      "namespace": "minecraft",
      "path": [
        "stick"
      ]
    },
    "hover": "<test: item_stack>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_stack Parse "stick" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_stack",
    "range": {
      "start": 0,
      "end": 5
    },
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "path": [
        "stick"
      ]
    },
    "hover": "<test: item_stack>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_stack Parse "stick{foo:bar}" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_stack",
    "range": {
      "start": 0,
      "end": 14
    },
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "path": [
        "stick"
      ]
    },
    "nbt": {
      "type": "nbt:compound",
      "range": {
        "start": 5,
        "end": 14
      },
      "children": [
        {
          "type": "pair",
          "range": {
            "start": 6,
            "end": 13
          },
          "children": [
            {
              "type": "string",
              "range": {
                "start": 6,
                "end": 9
              },
              "value": "foo",
              "valueMap": [
                {
                  "outer": {
                    "start": 6,
                    "end": 6
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            },
            {
              "type": "string",
              "range": {
                "start": 10,
                "end": 13
              },
              "value": "bar",
              "valueMap": [
                {
                  "outer": {
                    "start": 10,
                    "end": 10
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          ],
          "key": {
            "type": "string",
            "range": {
              "start": 6,
              "end": 9
            },
            "value": "foo",
            "valueMap": [
              {
                "outer": {
                  "start": 6,
                  "end": 6
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          "sep": {
            "start": 9,
            "end": 10
          },
          "value": {
            "type": "string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "bar",
            "valueMap": [
              {
                "outer": {
                  "start": 10,
                  "end": 10
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        }
      ]
    },
    "hover": "<test: item_stack>"
  },
  "errors": []
}
