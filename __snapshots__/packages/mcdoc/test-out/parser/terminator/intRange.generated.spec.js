exports['mcdoc intRange Parse "" 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 0
        },
        "value": 0
      }
    ],
    "range": {
      "start": 0,
      "end": 0
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['mcdoc intRange Parse "../2" 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "../"
      },
      {
        "type": "integer",
        "range": {
          "start": 3,
          "end": 4
        },
        "value": 2
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    }
  },
  "errors": []
}

exports['mcdoc intRange Parse "..2" 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 2
        },
        "value": ".."
      },
      {
        "type": "integer",
        "range": {
          "start": 2,
          "end": 3
        },
        "value": 2
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['mcdoc intRange Parse "1" 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 1
      }
    ],
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": []
}

exports['mcdoc intRange Parse "1.." 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 1
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 1,
          "end": 3
        },
        "value": ".."
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['mcdoc intRange Parse "1..1" 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 1
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 1,
          "end": 3
        },
        "value": ".."
      },
      {
        "type": "integer",
        "range": {
          "start": 3,
          "end": 4
        },
        "value": 1
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    }
  },
  "errors": []
}

exports['mcdoc intRange Parse "1..2" 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 1
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 1,
          "end": 3
        },
        "value": ".."
      },
      {
        "type": "integer",
        "range": {
          "start": 3,
          "end": 4
        },
        "value": 2
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    }
  },
  "errors": []
}

exports['mcdoc intRange Parse "1/.." 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 1
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 1,
          "end": 4
        },
        "value": "/.."
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    }
  },
  "errors": []
}

exports['mcdoc intRange Parse "1/../2" 1'] = {
  "node": {
    "type": "mcdoc:int_range",
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 1
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 1,
          "end": 5
        },
        "value": "/../"
      },
      {
        "type": "integer",
        "range": {
          "start": 5,
          "end": 6
        },
        "value": 2
      }
    ],
    "range": {
      "start": 0,
      "end": 6
    }
  },
  "errors": []
}
