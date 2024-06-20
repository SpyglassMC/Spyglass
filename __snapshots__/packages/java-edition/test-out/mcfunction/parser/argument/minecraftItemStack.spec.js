exports['mcfunction argument minecraft:item_stack Parse "apple[!food]" in version 1.20.5 1'] = {
  "node": {
    "type": "mcfunction:item_stack",
    "range": {
      "start": 0,
      "end": 12
    },
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "path": [
        "apple"
      ]
    },
    "components": {
      "type": "mcfunction:component_list",
      "range": {
        "start": 5,
        "end": 12
      },
      "children": [
        {
          "type": "pair",
          "range": {
            "start": 6,
            "end": 11
          },
          "children": [
            {
              "type": "resource_location",
              "range": {
                "start": 6,
                "end": 11
              },
              "path": [
                "!food"
              ]
            }
          ],
          "key": {
            "type": "resource_location",
            "range": {
              "start": 6,
              "end": 11
            },
            "path": [
              "!food"
            ]
          }
        }
      ]
    }
  },
  "errors": [
    {
      "range": {
        "start": 6,
        "end": 11
      },
      "message": "Illegal character(s): “!”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “=”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected a value",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:item_stack Parse "diamond_pickaxe[unbreakable={}]" in version 1.20.5 1'] = {
  "node": {
    "type": "mcfunction:item_stack",
    "range": {
      "start": 0,
      "end": 31
    },
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 15
      },
      "path": [
        "diamond_pickaxe"
      ]
    },
    "components": {
      "type": "mcfunction:component_list",
      "range": {
        "start": 15,
        "end": 31
      },
      "children": [
        {
          "type": "pair",
          "range": {
            "start": 16,
            "end": 30
          },
          "children": [
            {
              "type": "resource_location",
              "range": {
                "start": 16,
                "end": 27
              },
              "path": [
                "unbreakable"
              ]
            },
            {
              "type": "nbt:compound",
              "range": {
                "start": 28,
                "end": 30
              },
              "children": []
            }
          ],
          "key": {
            "type": "resource_location",
            "range": {
              "start": 16,
              "end": 27
            },
            "path": [
              "unbreakable"
            ]
          },
          "sep": {
            "start": 27,
            "end": 28
          },
          "value": {
            "type": "nbt:compound",
            "range": {
              "start": 28,
              "end": 30
            },
            "children": []
          }
        }
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:item_stack Parse "minecraft:stick" 1'] = {
  "node": {
    "type": "mcfunction:item_stack",
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

exports['mcfunction argument minecraft:item_stack Parse "stick" 1'] = {
  "node": {
    "type": "mcfunction:item_stack",
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

exports['mcfunction argument minecraft:item_stack Parse "stick" in version 1.20.5 1'] = {
  "node": {
    "type": "mcfunction:item_stack",
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

exports['mcfunction argument minecraft:item_stack Parse "stick{foo:bar}" 1'] = {
  "node": {
    "type": "mcfunction:item_stack",
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
              "type": "nbt:string",
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
              "type": "nbt:string",
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
            "type": "nbt:string",
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
            "type": "nbt:string",
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
