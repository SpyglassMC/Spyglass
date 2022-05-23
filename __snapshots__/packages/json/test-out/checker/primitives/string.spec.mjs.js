exports['JSON string string Check ""foo"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 5
    },
    "options": {
      "escapable": {
        "characters": [
          "b",
          "f",
          "n",
          "r",
          "t"
        ],
        "unicode": true
      },
      "quotes": [
        "\""
      ]
    },
    "value": "foo",
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
    ],
    "expectation": [
      {
        "type": "json:string",
        "typedoc": "String"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON string string Check ""foo"bar"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 5
    },
    "options": {
      "escapable": {
        "characters": [
          "b",
          "f",
          "n",
          "r",
          "t"
        ],
        "unicode": true
      },
      "quotes": [
        "\""
      ]
    },
    "value": "foo",
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
    ],
    "expectation": [
      {
        "type": "json:string",
        "typedoc": "String"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON string string Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:string",
        "typedoc": "String"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a string",
      "severity": 3
    }
  ]
}
