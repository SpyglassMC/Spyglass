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
    "children": [
      {
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
        },
        "type": "mcdoc:attribute"
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
    },
    "type": "mcdoc:type/any"
  },
  "errors": []
}

exports['mcdoc anyType Parse "any" 1'] = {
  "node": {
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
    },
    "type": "mcdoc:type/any"
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
