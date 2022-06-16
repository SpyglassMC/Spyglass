exports['mcdoc listType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc listType Parse "[" 1'] = {
  "node": {
    "type": "mcdoc:type/list",
    "children": [
      {
        "type": "mcdoc:type/reference",
        "children": [
          {
            "type": "mcdoc:path",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 1,
                  "end": 1
                },
                "value": ""
              }
            ],
            "range": {
              "start": 1,
              "end": 1
            }
          }
        ],
        "range": {
          "start": 1,
          "end": 1
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected “]” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc listType Parse "[[boolean]]" 1'] = {
  "node": {
    "type": "mcdoc:type/list",
    "children": [
      {
        "type": "mcdoc:type/list",
        "children": [
          {
            "type": "mcdoc:type/boolean",
            "children": [
              {
                "type": "mcdoc:literal",
                "range": {
                  "start": 2,
                  "end": 9
                },
                "value": "boolean",
                "colorTokenType": "type"
              }
            ],
            "range": {
              "start": 2,
              "end": 9
            }
          }
        ],
        "range": {
          "start": 1,
          "end": 10
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 11
    }
  },
  "errors": []
}

exports['mcdoc listType Parse "[]" 1'] = {
  "node": {
    "type": "mcdoc:type/list",
    "children": [
      {
        "type": "mcdoc:type/reference",
        "children": [
          {
            "type": "mcdoc:path",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 1,
                  "end": 1
                },
                "value": ""
              }
            ],
            "range": {
              "start": 1,
              "end": 1
            }
          }
        ],
        "range": {
          "start": 1,
          "end": 1
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 2
    }
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['mcdoc listType Parse "[boolean" 1'] = {
  "node": {
    "type": "mcdoc:type/list",
    "children": [
      {
        "type": "mcdoc:type/boolean",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 1,
              "end": 8
            },
            "value": "boolean",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 1,
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
      "message": "Expected “]” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc listType Parse "[boolean,]" 1'] = {
  "node": {
    "type": "mcdoc:type/list",
    "children": [
      {
        "type": "mcdoc:type/boolean",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 1,
              "end": 8
            },
            "value": "boolean",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 1,
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
      "message": "Expected “]” but got “,”",
      "severity": 3
    }
  ]
}

exports['mcdoc listType Parse "[boolean]" 1'] = {
  "node": {
    "type": "mcdoc:type/list",
    "children": [
      {
        "type": "mcdoc:type/boolean",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 1,
              "end": 8
            },
            "value": "boolean",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 1,
          "end": 8
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 9
    }
  },
  "errors": []
}
