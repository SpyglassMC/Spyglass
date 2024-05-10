exports['utils for JSON checkers any(boolean, string) Check ""foo"" 1'] = {
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
        "type": "json:boolean",
        "typedoc": "Boolean"
      },
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
        "end": 5
      },
      "message": "Expected a boolean or a boolean",
      "severity": 3
    }
  ]
}

exports['utils for JSON checkers any(boolean, string) Check "true" 1'] = {
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
      },
      {
        "type": "json:boolean",
        "typedoc": "Boolean"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['utils for JSON checkers any(string) Check ""foo"" 1'] = {
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

exports['utils for JSON checkers any(string) Check "true" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": true,
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
        "end": 4
      },
      "message": "Expected a string",
      "severity": 3
    }
  ]
}

exports['utils for JSON checkers any(string, boolean) Check ""foo"" 1'] = {
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
      },
      {
        "type": "json:string",
        "typedoc": "String"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['utils for JSON checkers any(string, boolean) Check "true" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": true,
    "expectation": [
      {
        "type": "json:string",
        "typedoc": "String"
      },
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
        "end": 4
      },
      "message": "Expected a string or a string",
      "severity": 3
    }
  ]
}
