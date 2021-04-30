exports['nbt compound() Parse "" 1'] = {
  "node": {
    "type": "nbt:compound",
    "range": {
      "start": 0,
      "end": 0
    },
    "children": []
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “{”",
      "severity": 3
    }
  ]
}

exports['nbt compound() Parse ""string"" 1'] = {
  "node": {
    "type": "nbt:compound",
    "range": {
      "start": 0,
      "end": 0
    },
    "children": []
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “{”",
      "severity": 3
    }
  ]
}

exports['nbt compound() Parse "{ foo: true }" 1'] = {
  "node": {
    "type": "nbt:compound",
    "range": {
      "start": 0,
      "end": 13
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 12
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {},
              "quotes": [
                "\"",
                "'"
              ],
              "unquotable": {}
            },
            "value": "foo",
            "valueMap": {
              "outerRange": {
                "start": 2,
                "end": 5
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          },
          {
            "type": "nbt:byte",
            "range": {
              "start": 7,
              "end": 11
            },
            "value": 1
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {},
            "quotes": [
              "\"",
              "'"
            ],
            "unquotable": {}
          },
          "value": "foo",
          "valueMap": {
            "outerRange": {
              "start": 2,
              "end": 5
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "nbt:byte",
          "range": {
            "start": 7,
            "end": 11
          },
          "value": 1
        }
      }
    ]
  },
  "errors": []
}

exports['nbt compound() Parse "{}" 1'] = {
  "node": {
    "type": "nbt:compound",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": []
  },
  "errors": []
}
