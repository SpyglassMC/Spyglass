exports['mcfunction argument minecraft:item_predicate Parse "#stick" 1'] = {
  "node": {
    "type": "mcfunction:item_predicate",
    "range": {
      "start": 0,
      "end": 6
    },
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
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_predicate Parse "#stick{foo:bar}" 1'] = {
  "node": {
    "type": "mcfunction:item_predicate",
    "range": {
      "start": 0,
      "end": 15
    },
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 7,
                    "end": 7
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 11,
                    "end": 11
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
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 7,
                  "end": 7
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
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ]
          }
        }
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_predicate Parse "minecraft:stick" 1'] = {
  "node": {
    "type": "mcfunction:item_predicate",
    "range": {
      "start": 0,
      "end": 15
    },
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
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_predicate Parse "stick" 1'] = {
  "node": {
    "type": "mcfunction:item_predicate",
    "range": {
      "start": 0,
      "end": 5
    },
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "path": [
        "stick"
      ]
    }
  },
  "errors": []
}
