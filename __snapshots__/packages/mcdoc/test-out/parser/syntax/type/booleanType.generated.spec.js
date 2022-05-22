exports['mcdoc booleanType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “boolean” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc booleanType Parse "boolean" 1'] = {
  "node": {
    "type": "mcdoc:type/boolean",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 7
        },
        "value": "boolean",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": []
}

exports['mcdoc booleanType Parse "other" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected “boolean” but got “other”",
      "severity": 3
    }
  ]
}
