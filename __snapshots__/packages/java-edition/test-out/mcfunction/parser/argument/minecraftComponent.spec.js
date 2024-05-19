exports['mcfunction argument minecraft:component Parse """" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "",
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
  "errors": []
}

exports['mcfunction argument minecraft:component Parse ""hello world"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 13
    },
    "value": "hello world",
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
  "errors": []
}

exports['mcfunction argument minecraft:component Parse "[""]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 3
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 3
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 3
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            }
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse "["hello ⧵ ↓world"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 18
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 17
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 17
            },
            "value": "hello world",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 17
          },
          "value": "hello world",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            }
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse "["⧵u12⧵  ↓  34"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 15
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 15
            },
            "value": "ሴ",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              },
              {
                "inner": {
                  "start": 0,
                  "end": 1
                },
                "outer": {
                  "start": 2,
                  "end": 14
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 15
          },
          "value": "ሴ",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            },
            {
              "inner": {
                "start": 0,
                "end": 1
              },
              "outer": {
                "start": 2,
                "end": 14
              }
            }
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse "["⧵uab⧵  ↓  nd"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 15
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 15
            },
            "value": "uabnd",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              },
              {
                "inner": {
                  "start": 0,
                  "end": 1
                },
                "outer": {
                  "start": 2,
                  "end": 4
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 15
          },
          "value": "uabnd",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            },
            {
              "inner": {
                "start": 0,
                "end": 1
              },
              "outer": {
                "start": 2,
                "end": 4
              }
            }
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 14
      },
      "message": "Hexadecimal digit expected",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:component Parse "{"text":"hello world"}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 21
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 7
            },
            "value": "text",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              }
            ]
          },
          {
            "type": "json:string",
            "range": {
              "start": 8,
              "end": 21
            },
            "value": "hello world",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 9,
                  "end": 9
                }
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 7
          },
          "value": "text",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            }
          ]
        },
        "sep": {
          "start": 7,
          "end": 8
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 8,
            "end": 21
          },
          "value": "hello world",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 9,
                "end": 9
              }
            }
          ]
        }
      }
    ]
  },
  "errors": []
}
