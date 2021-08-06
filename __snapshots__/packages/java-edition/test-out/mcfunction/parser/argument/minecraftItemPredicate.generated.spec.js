exports['mcfunction argument minecraft:item_predicate Parse "#stick" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_predicate",
    "range": {
      "start": 0,
      "end": 6
    },
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 6
      },
      "isTag": true,
      "path": [
        "stick"
      ]
    },
    "hover": "<test: item_predicate>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_predicate Parse "#stick{foo:bar}" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_predicate",
    "range": {
      "start": 0,
      "end": 15
    },
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 6
      },
      "isTag": true,
      "path": [
        "stick"
      ]
    },
    "nbt": {
      "type": "nbt:compound",
      "range": {
        "start": 6,
        "end": 15
      },
      "children": [
        {
          "type": "pair",
          "range": {
            "start": 7,
            "end": 14
          },
          "children": [
            {
              "type": "string",
              "range": {
                "start": 7,
                "end": 10
              },
              "value": "foo",
              "valueMap": [
                {
                  "outer": {
                    "start": 7,
                    "end": 7
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
                "start": 11,
                "end": 14
              },
              "value": "bar",
              "valueMap": [
                {
                  "outer": {
                    "start": 11,
                    "end": 11
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
              "start": 7,
              "end": 10
            },
            "value": "foo",
            "valueMap": [
              {
                "outer": {
                  "start": 7,
                  "end": 7
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          "sep": {
            "start": 10,
            "end": 11
          },
          "value": {
            "type": "string",
            "range": {
              "start": 11,
              "end": 14
            },
            "value": "bar",
            "valueMap": [
              {
                "outer": {
                  "start": 11,
                  "end": 11
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
    "hover": "<test: item_predicate>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_predicate Parse "minecraft:stick" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_predicate",
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
    "hover": "<test: item_predicate>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_predicate Parse "stick" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_predicate",
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
    "hover": "<test: item_predicate>"
  },
  "errors": []
}
