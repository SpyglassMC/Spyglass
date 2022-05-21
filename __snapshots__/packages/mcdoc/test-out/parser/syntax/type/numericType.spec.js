exports['mcdoc numericType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “byte”, “short”, “int”, or “long” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc numericType Parse "byte" 1'] = {
  "node": {
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "byte",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    },
    "type": "mcdoc:type/numeric_type"
  },
  "errors": []
}

exports['mcdoc numericType Parse "double@4.2..5.5" 1'] = {
  "node": {
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "double",
        "colorTokenType": "type"
      },
      {
        "children": [
          {
            "type": "float",
            "range": {
              "start": 7,
              "end": 10
            },
            "value": 4.2
          },
          {
            "type": "float",
            "range": {
              "start": 12,
              "end": 15
            },
            "value": 5.5
          }
        ],
        "range": {
          "start": 7,
          "end": 15
        },
        "type": "mcdoc:float_range"
      }
    ],
    "range": {
      "start": 0,
      "end": 15
    },
    "type": "mcdoc:type/numeric_type"
  },
  "errors": []
}

exports['mcdoc numericType Parse "double[]" 1'] = {
  "node": {
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "double",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 6
    },
    "type": "mcdoc:type/numeric_type"
  },
  "errors": []
}

exports['mcdoc numericType Parse "int @ 4" 1'] = {
  "node": {
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "int",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    },
    "type": "mcdoc:type/numeric_type"
  },
  "errors": []
}

exports['mcdoc numericType Parse "other" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected “byte”, “short”, “int”, or “long” but got “other”",
      "severity": 3
    }
  ]
}
