exports['string() Parse "" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 0
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
    ]
  },
  "errors": []
}

exports['string() Parse ""fo↓o"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": "fo\no",
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
    ]
  },
  "errors": []
}

exports['string() Parse ""fo⧵Ao"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 7
    },
    "value": "foAo",
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
      },
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
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 5
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
      },
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
