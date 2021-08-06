exports['mcfunction argument minecraft:block_predicate Parse "#stone" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_predicate",
    "range": {
      "start": 0,
      "end": 6
    },
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 6
      },
      "isTag": true,
      "path": [
        "stone"
      ]
    },
    "hover": "<test: block_predicate>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_predicate Parse "#stone[foo=bar]{baz:nbt}" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_predicate",
    "range": {
      "start": 0,
      "end": 24
    },
    "name": "test",
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 6
      },
      "isTag": true,
      "path": [
        "stone"
      ]
    },
    "states": {
      "type": "mcfunction:block/states",
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
                  "outer": {
                    "start": 7,
                    "end": 7
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
                "start": 11,
                "end": 14
              },
              "value": "bar",
              "valueMap": [
                {
                  "outer": {
                    "start": 11,
                    "end": 11
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
              "start": 7,
              "end": 10
            },
            "value": "foo",
            "valueMap": [
              {
                "outer": {
                  "start": 7,
                  "end": 7
                },
                "inner": {
                  "start": 0,
                  "end": 0
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
                "outer": {
                  "start": 11,
                  "end": 11
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
    "nbt": {
      "type": "nbt:compound",
      "range": {
        "start": 15,
        "end": 24
      },
      "children": [
        {
          "type": "pair",
          "range": {
            "start": 16,
            "end": 23
          },
          "children": [
            {
              "type": "string",
              "range": {
                "start": 16,
                "end": 19
              },
              "value": "baz",
              "valueMap": [
                {
                  "outer": {
                    "start": 16,
                    "end": 16
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
                "start": 20,
                "end": 23
              },
              "value": "nbt",
              "valueMap": [
                {
                  "outer": {
                    "start": 20,
                    "end": 20
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
              "start": 16,
              "end": 19
            },
            "value": "baz",
            "valueMap": [
              {
                "outer": {
                  "start": 16,
                  "end": 16
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          "sep": {
            "start": 19,
            "end": 20
          },
          "value": {
            "type": "string",
            "range": {
              "start": 20,
              "end": 23
            },
            "value": "nbt",
            "valueMap": [
              {
                "outer": {
                  "start": 20,
                  "end": 20
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
    "hover": "<test: block_predicate>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_predicate Parse "minecraft:stone" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_predicate",
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
    "hover": "<test: block_predicate>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_predicate Parse "stone" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_predicate",
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
    "hover": "<test: block_predicate>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_predicate Parse "stone[foo=bar]" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:block_predicate",
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
    "hover": "<test: block_predicate>"
  },
  "errors": []
}
