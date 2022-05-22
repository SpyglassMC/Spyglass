exports['mcdoc literalType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc literalType Parse ""a literal string"" 1'] = {
  "node": {
    "type": "mcdoc:type/literal",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 18
        },
        "value": "a literal string",
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
      }
    ],
    "range": {
      "start": 0,
      "end": 18
    }
  },
  "errors": []
}

exports['mcdoc literalType Parse "1.23e4" 1'] = {
  "node": {
    "type": "mcdoc:type/literal",
    "children": [
      {
        "type": "mcdoc:typed_number",
        "children": [
          {
            "type": "float",
            "range": {
              "start": 0,
              "end": 6
            },
            "value": 12300
          }
        ],
        "range": {
          "start": 0,
          "end": 6
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 6
    }
  },
  "errors": []
}

exports['mcdoc literalType Parse "1b" 1'] = {
  "node": {
    "type": "mcdoc:type/literal",
    "children": [
      {
        "type": "mcdoc:typed_number",
        "children": [
          {
            "type": "float",
            "range": {
              "start": 0,
              "end": 1
            },
            "value": 1
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": "b",
            "colorTokenType": "keyword"
          }
        ],
        "range": {
          "start": 0,
          "end": 2
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 2
    }
  },
  "errors": []
}

exports['mcdoc literalType Parse "42" 1'] = {
  "node": {
    "type": "mcdoc:type/literal",
    "children": [
      {
        "type": "mcdoc:typed_number",
        "children": [
          {
            "type": "float",
            "range": {
              "start": 0,
              "end": 2
            },
            "value": 42
          }
        ],
        "range": {
          "start": 0,
          "end": 2
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 2
    }
  },
  "errors": []
}

exports['mcdoc literalType Parse "9.1f" 1'] = {
  "node": {
    "type": "mcdoc:type/literal",
    "children": [
      {
        "type": "mcdoc:typed_number",
        "children": [
          {
            "type": "float",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": 9.1
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 3,
              "end": 4
            },
            "value": "f",
            "colorTokenType": "keyword"
          }
        ],
        "range": {
          "start": 0,
          "end": 4
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    }
  },
  "errors": []
}

exports['mcdoc literalType Parse "false" 1'] = {
  "node": {
    "type": "mcdoc:type/literal",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 5
        },
        "value": "false",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 5
    }
  },
  "errors": []
}

exports['mcdoc literalType Parse "other" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc literalType Parse "true" 1'] = {
  "node": {
    "type": "mcdoc:type/literal",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "true",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    }
  },
  "errors": []
}
