exports['string() Parse "" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "",
    "childrenMaps": [
      {
        "outerRange": {
          "start": 0,
          "end": 0
        },
        "innerRange": {
          "start": 0,
          "end": 0
        },
        "pairs": []
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['string() Parse ""foo" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "foo",
    "childrenMaps": [
      {
        "outerRange": {
          "start": 1,
          "end": 4
        },
        "innerRange": {
          "start": 0,
          "end": 3
        },
        "pairs": []
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['string() Parse ""foo"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "foo",
    "childrenMaps": [
      {
        "outerRange": {
          "start": 1,
          "end": 4
        },
        "innerRange": {
          "start": 0,
          "end": 3
        },
        "pairs": []
      }
    ]
  },
  "errors": []
}

exports['string() Parse ""fo↓o"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "fo",
    "childrenMaps": [
      {
        "outerRange": {
          "start": 1,
          "end": 3
        },
        "innerRange": {
          "start": 0,
          "end": 2
        },
        "pairs": []
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['string() Parse ""fo⧵Ao"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 7
    },
    "value": "foAo",
    "childrenMaps": [
      {
        "outerRange": {
          "start": 1,
          "end": 6
        },
        "innerRange": {
          "start": 0,
          "end": 4
        },
        "pairs": [
          {
            "inner": {
              "start": 2,
              "end": 3
            },
            "outer": {
              "start": 3,
              "end": 5
            }
          }
        ]
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 5,
        "end": 6
      },
      "message": "Unexpected escape character “A”",
      "severity": 3
    }
  ]
}

exports['string() Parse ""fo⧵no"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 7
    },
    "value": "fo\no",
    "childrenMaps": [
      {
        "outerRange": {
          "start": 1,
          "end": 6
        },
        "innerRange": {
          "start": 0,
          "end": 4
        },
        "pairs": [
          {
            "inner": {
              "start": 2,
              "end": 3
            },
            "outer": {
              "start": 3,
              "end": 5
            }
          }
        ]
      }
    ]
  },
  "errors": []
}

exports['string() Parse "foo" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "",
    "childrenMaps": [
      {
        "outerRange": {
          "start": 0,
          "end": 0
        },
        "innerRange": {
          "start": 0,
          "end": 0
        },
        "pairs": []
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}
