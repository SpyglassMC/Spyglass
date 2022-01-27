exports['JSON boolean boolean Check ""true"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 6
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
    "value": "true",
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
        "type": "json:boolean",
        "typedoc": "Boolean"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 6
      },
      "message": "Expected a boolean",
      "severity": 3
    }
  ]
}

exports['JSON boolean boolean Check "1" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 1,
    "expectation": [
      {
        "type": "json:boolean",
        "typedoc": "Boolean"
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
      "message": "Expected a boolean",
      "severity": 3
    }
  ]
}

exports['JSON boolean boolean Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:boolean",
        "typedoc": "Boolean"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON boolean boolean Check "tru" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 0
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
    "value": "",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 0,
          "end": 0
        }
      }
    ],
    "expectation": [
      {
        "type": "json:boolean",
        "typedoc": "Boolean"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a boolean",
      "severity": 3
    }
  ]
}

exports['JSON boolean boolean Check "true" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": true,
    "expectation": [
      {
        "type": "json:boolean",
        "typedoc": "Boolean"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON boolean boolean Check "trues" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": true,
    "expectation": [
      {
        "type": "json:boolean",
        "typedoc": "Boolean"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}
