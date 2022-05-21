exports['mcdoc literalType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc literalType Parse ""a literal string"" 1'] = {
  "node": {
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
    },
    "type": "mcdoc:type/literal"
  },
  "errors": []
}

exports['mcdoc literalType Parse "1.23e4" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc literalType Parse "1b" 1'] = {
  "node": {
    "children": [
      {
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
        },
        "type": "mcdoc:typed_number"
      }
    ],
    "range": {
      "start": 0,
      "end": 2
    },
    "type": "mcdoc:type/literal"
  },
  "errors": []
}

exports['mcdoc literalType Parse "false" 1'] = {
  "node": {
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
    },
    "type": "mcdoc:type/literal"
  },
  "errors": []
}

exports['mcdoc literalType Parse "other" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc literalType Parse "true" 1'] = {
  "node": {
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
    },
    "type": "mcdoc:type/literal"
  },
  "errors": []
}
