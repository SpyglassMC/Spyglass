exports['mcdoc dispatchStatement Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “dispatch” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc dispatchStatement Parse "#[since=1.17]↓⮀⮀⮀⮀dispatch minecraft:entity[↓⮀⮀⮀⮀⮀cow,↓⮀⮀⮀⮀⮀sheep,↓⮀⮀⮀⮀] to boolean" 1'] = {
  "node": {
    "type": "mcdoc:dispatch_statement",
    "children": [
      {
        "type": "mcdoc:attribute",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "since"
          },
          {
            "type": "mcdoc:type/literal",
            "children": [
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 8,
                      "end": 12
                    },
                    "value": 1.17
                  }
                ],
                "range": {
                  "start": 8,
                  "end": 12
                }
              }
            ],
            "range": {
              "start": 8,
              "end": 12
            }
          }
        ],
        "range": {
          "start": 0,
          "end": 18
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 18,
          "end": 26
        },
        "value": "dispatch",
        "colorTokenType": "keyword"
      },
      {
        "type": "resource_location",
        "range": {
          "start": 27,
          "end": 43
        },
        "namespace": "minecraft",
        "path": [
          "entity"
        ]
      },
      {
        "type": "mcdoc:index_body",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 50,
              "end": 53
            },
            "value": "cow"
          },
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 60,
              "end": 65
            },
            "value": "sheep"
          }
        ],
        "range": {
          "start": 43,
          "end": 72
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 73,
          "end": 75
        },
        "value": "to"
      },
      {
        "type": "mcdoc:type/boolean",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 76,
              "end": 83
            },
            "value": "boolean",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 76,
          "end": 83
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 83
    }
  },
  "errors": []
}

exports['mcdoc dispatchStatement Parse "dispatch :entity[cow] to boolean" 1'] = {
  "node": {
    "type": "mcdoc:dispatch_statement",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "dispatch",
        "colorTokenType": "keyword"
      },
      {
        "type": "resource_location",
        "range": {
          "start": 9,
          "end": 16
        },
        "namespace": "",
        "path": [
          "entity"
        ]
      },
      {
        "type": "mcdoc:index_body",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 17,
              "end": 20
            },
            "value": "cow"
          }
        ],
        "range": {
          "start": 16,
          "end": 21
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 22,
          "end": 24
        },
        "value": "to"
      },
      {
        "type": "mcdoc:type/boolean",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 25,
              "end": 32
            },
            "value": "boolean",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 25,
          "end": 32
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 32
    }
  },
  "errors": []
}

exports['mcdoc dispatchStatement Parse "dispatch minecraft:entity[] to any" 1'] = {
  "node": {
    "type": "mcdoc:dispatch_statement",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "dispatch",
        "colorTokenType": "keyword"
      },
      {
        "type": "resource_location",
        "range": {
          "start": 9,
          "end": 25
        },
        "namespace": "minecraft",
        "path": [
          "entity"
        ]
      },
      {
        "type": "mcdoc:index_body",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 26,
              "end": 26
            },
            "value": ""
          }
        ],
        "range": {
          "start": 25,
          "end": 27
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 28,
          "end": 30
        },
        "value": "to"
      },
      {
        "type": "mcdoc:type/any",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 31,
              "end": 34
            },
            "value": "any",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 31,
          "end": 34
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 34
    }
  },
  "errors": [
    {
      "range": {
        "start": 26,
        "end": 26
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['mcdoc dispatchStatement Parse "dispatch" 1'] = {
  "node": {
    "type": "mcdoc:dispatch_statement",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "dispatch",
        "colorTokenType": "keyword"
      },
      {
        "type": "resource_location",
        "range": {
          "start": 8,
          "end": 8
        }
      },
      {
        "type": "mcdoc:index_body",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": ""
          }
        ],
        "range": {
          "start": 8,
          "end": 8
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 8,
          "end": 8
        },
        "value": ""
      },
      {
        "type": "mcdoc:type/reference",
        "children": [
          {
            "type": "mcdoc:path",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 8,
                  "end": 8
                },
                "value": ""
              }
            ],
            "range": {
              "start": 8,
              "end": 8
            }
          }
        ],
        "range": {
          "start": 8,
          "end": 8
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 8
    }
  },
  "errors": [
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected a resource location",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected the colon (“:”) of resource locations",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “[” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “]” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “to” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}
