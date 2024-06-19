exports['mcfunction argument minecraft:block_predicate Parse "#stone" 1'] = {
  "node": {
    "type": "mcfunction:block",
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
        "stone"
      ]
    },
    "isPredicate": true
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_predicate Parse "#stone[foo=bar]{baz:nbt}" 1'] = {
  "node": {
    "type": "mcfunction:block",
    "range": {
      "start": 0,
      "end": 24
    },
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
              "type": "string",
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
            "type": "string",
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
            "type": "string",
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
              "type": "nbt:string",
              "range": {
                "start": 16,
                "end": 19
              },
              "value": "baz",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 16,
                    "end": 16
                  }
                }
              ]
            },
            {
              "type": "nbt:string",
              "range": {
                "start": 20,
                "end": 23
              },
              "value": "nbt",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 20,
                    "end": 20
                  }
                }
              ]
            }
          ],
          "key": {
            "type": "nbt:string",
            "range": {
              "start": 16,
              "end": 19
            },
            "value": "baz",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 16,
                  "end": 16
                }
              }
            ]
          },
          "sep": {
            "start": 19,
            "end": 20
          },
          "value": {
            "type": "nbt:string",
            "range": {
              "start": 20,
              "end": 23
            },
            "value": "nbt",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 20,
                  "end": 20
                }
              }
            ]
          }
        }
      ]
    },
    "isPredicate": true
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_predicate Parse "minecraft:stone" 1'] = {
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
      ]
    },
    "isPredicate": true
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_predicate Parse "stone" 1'] = {
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
      ]
    },
    "isPredicate": true
  },
  "errors": []
}

exports['mcfunction argument minecraft:block_predicate Parse "stone[foo=bar]" 1'] = {
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
    },
    "isPredicate": true
  },
  "errors": []
}
