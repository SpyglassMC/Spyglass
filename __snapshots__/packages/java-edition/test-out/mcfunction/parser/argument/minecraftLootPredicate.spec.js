exports[`mcfunction argument parser > minecraft:loot_predicate > Parse \"custom:maybe\" 1`] = `
{
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 12
    },
    "namespace": "custom",
    "path": [
      "maybe"
    ]
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:loot_predicate > Parse \"{condition:\"random_chance\",chance:0.2}\" 1`] = `
{
  "node": {
    "type": "mcfunction:nbt_resource",
    "range": {
      "start": 0,
      "end": 38
    },
    "children": [
      {
        "type": "nbt:compound",
        "range": {
          "start": 0,
          "end": 38
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 1,
              "end": 27
            },
            "children": [
              {
                "type": "nbt:string",
                "range": {
                  "start": 1,
                  "end": 10
                },
                "value": "condition",
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
                "type": "nbt:string",
                "range": {
                  "start": 11,
                  "end": 26
                },
                "value": "random_chance",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 12,
                      "end": 12
                    }
                  }
                ],
                "quote": "\\""
              }
            ],
            "key": {
              "type": "nbt:string",
              "range": {
                "start": 1,
                "end": 10
              },
              "value": "condition",
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
              "start": 10,
              "end": 11
            },
            "value": {
              "type": "nbt:string",
              "range": {
                "start": 11,
                "end": 26
              },
              "value": "random_chance",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 12,
                    "end": 12
                  }
                }
              ],
              "quote": "\\""
            },
            "end": {
              "start": 26,
              "end": 27
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 27,
              "end": 37
            },
            "children": [
              {
                "type": "nbt:string",
                "range": {
                  "start": 27,
                  "end": 33
                },
                "value": "chance",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 27,
                      "end": 27
                    }
                  }
                ]
              },
              {
                "type": "nbt:double",
                "range": {
                  "start": 34,
                  "end": 37
                },
                "value": 0.2
              }
            ],
            "key": {
              "type": "nbt:string",
              "range": {
                "start": 27,
                "end": 33
              },
              "value": "chance",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 27,
                    "end": 27
                  }
                }
              ]
            },
            "sep": {
              "start": 33,
              "end": 34
            },
            "value": {
              "type": "nbt:double",
              "range": {
                "start": 34,
                "end": 37
              },
              "value": 0.2
            }
          }
        ],
        "innerRange": {
          "start": 1,
          "end": 37
        }
      }
    ],
    "category": "predicate"
  },
  "errors": []
}
`;
