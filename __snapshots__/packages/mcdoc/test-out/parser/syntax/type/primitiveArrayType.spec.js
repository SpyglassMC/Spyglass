exports['mcdoc primitiveArrayType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “byte”, “int”, or “long” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “[]” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc primitiveArrayType Parse "byte @ 0..1 [] @ 0.." 1'] = {
  "node": {
    "type": "mcdoc:type/primitive_array",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "byte"
      },
      {
        "type": "mcdoc:int_range",
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 0
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 8,
              "end": 10
            },
            "value": ".."
          },
          {
            "type": "integer",
            "range": {
              "start": 10,
              "end": 11
            },
            "value": 1
          }
        ],
        "range": {
          "start": 7,
          "end": 11
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 12,
          "end": 14
        },
        "value": "[]",
        "colorTokenType": "type"
      },
      {
        "type": "mcdoc:int_range",
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 17,
              "end": 18
            },
            "value": 0
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 18,
              "end": 20
            },
            "value": ".."
          }
        ],
        "range": {
          "start": 17,
          "end": 20
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 20
    }
  },
  "errors": []
}

exports['mcdoc primitiveArrayType Parse "byte" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “[]” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc primitiveArrayType Parse "byte@0..1[]" 1'] = {
  "node": {
    "type": "mcdoc:type/primitive_array",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "byte"
      },
      {
        "type": "mcdoc:int_range",
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 5,
              "end": 6
            },
            "value": 0
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 6,
              "end": 8
            },
            "value": ".."
          },
          {
            "type": "integer",
            "range": {
              "start": 8,
              "end": 9
            },
            "value": 1
          }
        ],
        "range": {
          "start": 5,
          "end": 9
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 9,
          "end": 11
        },
        "value": "[]",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 11
    }
  },
  "errors": []
}

exports['mcdoc primitiveArrayType Parse "byte[]" 1'] = {
  "node": {
    "type": "mcdoc:type/primitive_array",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "byte"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 4,
          "end": 6
        },
        "value": "[]",
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

exports['mcdoc primitiveArrayType Parse "int[] @ 4" 1'] = {
  "node": {
    "type": "mcdoc:type/primitive_array",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "int"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 3,
          "end": 5
        },
        "value": "[]",
        "colorTokenType": "type"
      },
      {
        "type": "mcdoc:int_range",
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 8,
              "end": 9
            },
            "value": 4
          }
        ],
        "range": {
          "start": 8,
          "end": 9
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 9
    }
  },
  "errors": []
}

exports['mcdoc primitiveArrayType Parse "long @ 10000000000000001.. [] @ 0.." 1'] = {
  "node": {
    "type": "mcdoc:type/primitive_array",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "long"
      },
      {
        "type": "mcdoc:long_range",
        "children": [
          {
            "type": "long",
            "range": {
              "start": 7,
              "end": 24
            },
            "value": "10000000000000001"
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 24,
              "end": 26
            },
            "value": ".."
          }
        ],
        "range": {
          "start": 7,
          "end": 26
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 27,
          "end": 29
        },
        "value": "[]",
        "colorTokenType": "type"
      },
      {
        "type": "mcdoc:int_range",
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 32,
              "end": 33
            },
            "value": 0
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 33,
              "end": 35
            },
            "value": ".."
          }
        ],
        "range": {
          "start": 32,
          "end": 35
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 35
    }
  },
  "errors": []
}

exports['mcdoc primitiveArrayType Parse "other[]" 1'] = {
  "node": {
    "type": "mcdoc:type/primitive_array",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 5
        },
        "value": "other"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 5,
          "end": 7
        },
        "value": "[]",
        "colorTokenType": "type"
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected “byte”, “int”, or “long” but got “other”",
      "severity": 3
    }
  ]
}
