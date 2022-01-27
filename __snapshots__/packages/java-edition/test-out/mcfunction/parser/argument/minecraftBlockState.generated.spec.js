exports['mcfunction argument minecraft:block_state Parse "foo{bar:baz}" 1'] = {
  "node": {
    "type": "mcfunction:block",
    "range": {
      "start": 0,
      "end": 12
    },
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 3
      },
      "path": [
        "foo"
      ],
      "symbol": {
        "category": "block",
        "identifier": "minecraft:foo",
        "path": [
          "minecraft:foo"
        ],
        "reference": [
          {
            "uri": ""
          }
        ]
      }
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 8,
                    "end": 8
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
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 4,
                  "end": 4
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
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 8,
                  "end": 8
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

exports['mcfunction argument minecraft:block_state Parse "minecraft:stone" 1'] = {
  "node": {
    "type": "mcfunction:block",
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
        "stone"
      ],
      "symbol": {
        "category": "block",
        "identifier": "minecraft:stone",
        "path": [
          "minecraft:stone"
        ],
        "reference": [
          {
            "uri": ""
          }
        ]
      }
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_state Parse "stone" 1'] = {
  "node": {
    "type": "mcfunction:block",
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
        "stone"
      ],
      "symbol": {
        "category": "block",
        "identifier": "minecraft:stone",
        "path": [
          "minecraft:stone"
        ],
        "reference": [
          {
            "uri": ""
          }
        ]
      }
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_state Parse "stone[foo=bar]" 1'] = {
  "node": {
    "type": "mcfunction:block",
    "range": {
      "start": 0,
      "end": 14
    },
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "path": [
        "stone"
      ],
      "symbol": {
        "category": "block",
        "identifier": "minecraft:stone",
        "path": [
          "minecraft:stone"
        ],
        "reference": [
          {
            "uri": ""
          }
        ]
      }
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 6,
                    "end": 6
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 10,
                    "end": 10
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
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 6,
                  "end": 6
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
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 10,
                  "end": 10
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
