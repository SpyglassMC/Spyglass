exports['mcfunction argument minecraft:block_state Parse "foo{bar:baz}" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_state",
    "range": {
      "start": 0,
      "end": 12
    },
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 3
      },
      "path": [
        "foo"
      ]
    },
    "nbt": {
      "type": "nbt:compound",
      "range": {
        "start": 3,
        "end": 12
      },
      "children": [
        {
          "type": "pair",
          "range": {
            "start": 4,
            "end": 11
          },
          "children": [
            {
              "type": "string",
              "range": {
                "start": 4,
                "end": 7
              },
              "value": "bar",
              "valueMap": [
                {
                  "outer": {
                    "start": 4,
                    "end": 4
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
                "start": 8,
                "end": 11
              },
              "value": "baz",
              "valueMap": [
                {
                  "outer": {
                    "start": 8,
                    "end": 8
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
              "start": 4,
              "end": 7
            },
            "value": "bar",
            "valueMap": [
              {
                "outer": {
                  "start": 4,
                  "end": 4
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          "sep": {
            "start": 7,
            "end": 8
          },
          "value": {
            "type": "string",
            "range": {
              "start": 8,
              "end": 11
            },
            "value": "baz",
            "valueMap": [
              {
                "outer": {
                  "start": 8,
                  "end": 8
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
    "hover": "<test: block_state>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_state Parse "minecraft:stone" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_state",
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
        "stone"
      ]
    },
    "hover": "<test: block_state>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_state Parse "stone" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_state",
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
        "stone"
      ]
    },
    "hover": "<test: block_state>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_state Parse "stone[foo=bar]" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_state",
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
        "stone"
      ]
    },
    "states": {
      "type": "mcfunction:block/states",
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
    "hover": "<test: block_state>"
  },
  "errors": []
}
