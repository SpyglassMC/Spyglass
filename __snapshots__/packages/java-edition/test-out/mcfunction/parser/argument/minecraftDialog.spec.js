exports['mcfunction argument minecraft:dialog Parse "minecraft:custom_options" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 24
    },
    "namespace": "minecraft",
    "path": [
      "custom_options"
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:dialog Parse "{type:"notice",title:"Hello"}" 1'] = {
  "node": {
    "type": "mcfunction:nbt_resource",
    "range": {
      "start": 0,
      "end": 29
    },
    "children": [
      {
        "type": "nbt:compound",
        "range": {
          "start": 0,
          "end": 29
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 1,
              "end": 15
            },
            "children": [
              {
                "type": "nbt:string",
                "range": {
                  "start": 1,
                  "end": 5
                },
                "value": "type",
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
                  "start": 6,
                  "end": 14
                },
                "value": "notice",
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
                ],
                "quote": "\""
              }
            ],
            "key": {
              "type": "nbt:string",
              "range": {
                "start": 1,
                "end": 5
              },
              "value": "type",
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
              "start": 5,
              "end": 6
            },
            "value": {
              "type": "nbt:string",
              "range": {
                "start": 6,
                "end": 14
              },
              "value": "notice",
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
              ],
              "quote": "\""
            },
            "end": {
              "start": 14,
              "end": 15
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 15,
              "end": 28
            },
            "children": [
              {
                "type": "nbt:string",
                "range": {
                  "start": 15,
                  "end": 20
                },
                "value": "title",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 15,
                      "end": 15
                    }
                  }
                ]
              },
              {
                "type": "nbt:string",
                "range": {
                  "start": 21,
                  "end": 28
                },
                "value": "Hello",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 22,
                      "end": 22
                    }
                  }
                ],
                "quote": "\""
              }
            ],
            "key": {
              "type": "nbt:string",
              "range": {
                "start": 15,
                "end": 20
              },
              "value": "title",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 15,
                    "end": 15
                  }
                }
              ]
            },
            "sep": {
              "start": 20,
              "end": 21
            },
            "value": {
              "type": "nbt:string",
              "range": {
                "start": 21,
                "end": 28
              },
              "value": "Hello",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 22,
                    "end": 22
                  }
                }
              ],
              "quote": "\""
            }
          }
        ],
        "innerRange": {
          "start": 1,
          "end": 28
        }
      }
    ],
    "category": "dialog"
  },
  "errors": []
}
