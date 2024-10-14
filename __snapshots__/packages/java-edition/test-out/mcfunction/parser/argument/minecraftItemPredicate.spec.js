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
              "type": "nbt:string",
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
              "type": "nbt:string",
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
            "type": "nbt:string",
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
            "type": "nbt:string",
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
      ],
      "innerRange": {
        "start": 7,
        "end": 14
      }
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_predicate Parse "*[food]" in version 1.20.5 1'] = {
  "node": {
    "type": "mcfunction:item_predicate",
    "range": {
      "start": 0,
      "end": 7
    },
    "id": {
      "type": "literal",
      "range": {
        "start": 0,
        "end": 1
      },
      "value": "*"
    },
    "tests": {
      "type": "mcfunction:component_tests",
      "range": {
        "start": 1,
        "end": 7
      },
      "children": [
        {
          "type": "mcfunction:component_tests_any_of",
          "range": {
            "start": 2,
            "end": 6
          },
          "children": [
            {
              "type": "mcfunction:component_tests_all_of",
              "range": {
                "start": 2,
                "end": 6
              },
              "children": [
                {
                  "type": "mcfunction:component_test_exists",
                  "range": {
                    "start": 2,
                    "end": 6
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 2,
                        "end": 6
                      },
                      "path": [
                        "food"
                      ]
                    }
                  ],
                  "key": {
                    "type": "resource_location",
                    "range": {
                      "start": 2,
                      "end": 6
                    },
                    "path": [
                      "food"
                    ]
                  },
                  "negated": false
                }
              ]
            }
          ]
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

exports['mcfunction argument minecraft:item_predicate Parse "stick" in version 1.20.5 1'] = {
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

exports['mcfunction argument minecraft:item_predicate Parse "stone[]" in version 1.20.5 1'] = {
  "node": {
    "type": "mcfunction:item_predicate",
    "range": {
      "start": 0,
      "end": 7
    },
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
    "tests": {
      "type": "mcfunction:component_tests",
      "range": {
        "start": 5,
        "end": 7
      }
    }
  },
  "errors": []
}
