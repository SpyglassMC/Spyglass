exports['mcfunction argument minecraft:item_predicate Parse "#stick" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:item_predicate",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 6
        },
        "options": {
          "category": "item",
          "allowTag": true
        },
        "isTag": true,
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
        "end": 6
      },
      "options": {
        "category": "item",
        "allowTag": true
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
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 6
        },
        "options": {
          "category": "item",
          "allowTag": true
        },
        "isTag": true,
        "path": [
          "stick"
        ]
      },
      {
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
                    "start": 7,
                    "end": 10
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
                  "start": 11,
                  "end": 14
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
                    "start": 11,
                    "end": 14
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
                "start": 7,
                "end": 10
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
                  "start": 7,
                  "end": 10
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
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
                  "start": 11,
                  "end": 14
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
        "end": 6
      },
      "options": {
        "category": "item",
        "allowTag": true
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
                  "start": 7,
                  "end": 10
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
                "start": 11,
                "end": 14
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
                  "start": 11,
                  "end": 14
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
              "start": 7,
              "end": 10
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
                "start": 7,
                "end": 10
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
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
                "start": 11,
                "end": 14
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
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 15
        },
        "options": {
          "category": "item",
          "allowTag": true
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
        "allowTag": true
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
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 5
        },
        "options": {
          "category": "item",
          "allowTag": true
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
        "allowTag": true
      },
      "path": [
        "stick"
      ]
    },
    "hover": "<test: item_predicate>"
  },
  "errors": []
}
