exports['mcdoc stringType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “string” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc stringType Parse "other" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected “string” but got “other”",
      "severity": 3
    }
  ]
}

exports['mcdoc stringType Parse "string @" 1'] = {
  "node": {
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "string",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    },
    "type": "mcdoc:type/string"
  },
  "errors": []
}

exports['mcdoc stringType Parse "string" 1'] = {
  "node": {
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "string",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 6
    },
    "type": "mcdoc:type/string"
  },
  "errors": []
}

exports['mcdoc stringType Parse "string@42.." 1'] = {
  "node": {
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "string",
        "colorTokenType": "type"
      },
      {
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 7,
              "end": 9
            },
            "value": 42
          }
        ],
        "range": {
          "start": 7,
          "end": 11
        },
        "type": "mcdoc:int_range"
      }
    ],
    "range": {
      "start": 0,
      "end": 11
    },
    "type": "mcdoc:type/string"
  },
  "errors": []
}
