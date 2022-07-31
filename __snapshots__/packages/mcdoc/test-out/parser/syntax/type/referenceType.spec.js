exports['mcdoc referenceType Parse "" 1'] = {
  "node": {
    "type": "mcdoc:type/reference",
    "children": [
      {
        "type": "mcdoc:path",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 0,
              "end": 0
            },
            "value": ""
          }
        ],
        "range": {
          "start": 0,
          "end": 0
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 0
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['mcdoc referenceType Parse "#[uuid] UuidMostLeast" 1'] = {
  "node": {
    "type": "mcdoc:type/reference",
    "children": [
      {
        "type": "mcdoc:attribute",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 2,
              "end": 6
            },
            "value": "uuid"
          }
        ],
        "range": {
          "start": 0,
          "end": 7
        }
      },
      {
        "type": "mcdoc:path",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 8,
              "end": 21
            },
            "value": "UuidMostLeast"
          }
        ],
        "range": {
          "start": 8,
          "end": 21
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 21
    }
  },
  "errors": []
}

exports['mcdoc referenceType Parse "MinMaxBounds<float @ 1..2>" 1'] = {
  "node": {
    "type": "mcdoc:type/reference",
    "children": [
      {
        "type": "mcdoc:path",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 0,
              "end": 12
            },
            "value": "MinMaxBounds"
          }
        ],
        "range": {
          "start": 0,
          "end": 12
        }
      },
      {
        "type": "mcdoc:type_arg_block",
        "children": [
          {
            "type": "mcdoc:type/numeric_type",
            "children": [
              {
                "type": "mcdoc:literal",
                "range": {
                  "start": 13,
                  "end": 18
                },
                "value": "float",
                "colorTokenType": "type"
              },
              {
                "type": "mcdoc:float_range",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 21,
                      "end": 22
                    },
                    "value": 1
                  },
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 22,
                      "end": 24
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 24,
                      "end": 25
                    },
                    "value": 2
                  }
                ],
                "range": {
                  "start": 21,
                  "end": 25
                }
              }
            ],
            "range": {
              "start": 13,
              "end": 25
            }
          }
        ],
        "range": {
          "start": 12,
          "end": 26
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 26
    }
  },
  "errors": []
}
