exports['mcfunction argument minecraft:item_stack Parse "minecraft:stick" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_stack",
    "range": {
      "start": 0,
      "end": 15
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 15
        },
        "options": {
          "category": "item",
          "allowTag": false
        },
        "namespace": "minecraft",
        "path": [
          "stick"
        ]
      }
    ],
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 15
      },
      "options": {
        "category": "item",
        "allowTag": false
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
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 5
        },
        "options": {
          "category": "item",
          "allowTag": false
        },
        "path": [
          "stick"
        ]
      }
    ],
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "options": {
        "category": "item",
        "allowTag": false
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
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 5
        },
        "options": {
          "category": "item",
          "allowTag": false
        },
        "path": [
          "stick"
        ]
      },
      {
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
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {}
                },
                "value": "foo",
                "valueMap": {
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
              },
              {
                "type": "string",
                "range": {
                  "start": 10,
                  "end": 13
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {}
                },
                "value": "bar",
                "valueMap": {
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
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 6,
                "end": 9
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {}
              },
              "value": "foo",
              "valueMap": {
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
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {}
              },
              "value": "bar",
              "valueMap": {
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
            }
          }
        ]
      }
    ],
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "options": {
        "category": "item",
        "allowTag": false
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
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {}
              },
              "value": "foo",
              "valueMap": {
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
            },
            {
              "type": "string",
              "range": {
                "start": 10,
                "end": 13
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {}
              },
              "value": "bar",
              "valueMap": {
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
            }
          ],
          "key": {
            "type": "string",
            "range": {
              "start": 6,
              "end": 9
            },
            "options": {
              "escapable": {},
              "quotes": [
                "\"",
                "'"
              ],
              "unquotable": {}
            },
            "value": "foo",
            "valueMap": {
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
            "options": {
              "escapable": {},
              "quotes": [
                "\"",
                "'"
              ],
              "unquotable": {}
            },
            "value": "bar",
            "valueMap": {
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
          }
        }
      ]
    },
    "hover": "<test: item_stack>"
  },
  "errors": []
}
