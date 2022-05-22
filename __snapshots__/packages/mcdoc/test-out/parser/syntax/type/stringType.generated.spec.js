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
    "type": "mcdoc:type/string",
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
        "type": "mcdoc:int_range",
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": 0
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
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['mcdoc stringType Parse "string" 1'] = {
  "node": {
    "type": "mcdoc:type/string",
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
    }
  },
  "errors": []
}

exports['mcdoc stringType Parse "string@42.." 1'] = {
  "node": {
    "type": "mcdoc:type/string",
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
        "type": "mcdoc:int_range",
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 7,
              "end": 9
            },
            "value": 42
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 9,
              "end": 11
            },
            "value": ".."
          }
        ],
        "range": {
          "start": 7,
          "end": 11
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
