exports['mcdoc anyType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “any” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc anyType Parse "#[id] any" 1'] = {
  "node": {
    "type": "mcdoc:type/any",
    "children": [
      {
        "type": "mcdoc:attribute",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 2,
              "end": 4
            },
            "value": "id"
          }
        ],
        "range": {
          "start": 0,
          "end": 5
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 6,
          "end": 9
        },
        "value": "any",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 9
    }
  },
  "errors": []
}

exports['mcdoc anyType Parse "any" 1'] = {
  "node": {
    "type": "mcdoc:type/any",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "any",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['mcdoc anyType Parse "other" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected “any” but got “other”",
      "severity": 3
    }
  ]
}
