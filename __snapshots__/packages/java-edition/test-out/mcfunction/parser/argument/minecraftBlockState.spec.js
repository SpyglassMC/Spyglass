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
              "childrenMaps": [
                {
                  "outerRange": {
                    "start": 4,
                    "end": 7
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 3
                  },
                  "pairs": []
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
              "childrenMaps": [
                {
                  "outerRange": {
                    "start": 8,
                    "end": 11
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 3
                  },
                  "pairs": []
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 4,
                  "end": 7
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 8,
                  "end": 11
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
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
              "childrenMaps": [
                {
                  "outerRange": {
                    "start": 6,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 3
                  },
                  "pairs": []
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
              "childrenMaps": [
                {
                  "outerRange": {
                    "start": 10,
                    "end": 13
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 3
                  },
                  "pairs": []
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 6,
                  "end": 9
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 10,
                  "end": 13
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
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
