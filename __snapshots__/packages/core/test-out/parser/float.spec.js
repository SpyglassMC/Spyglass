exports['float() float() Parse "" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}

exports['float() float() Parse ".E" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Illegal float numeral that doesn't follow /[-+]?(?:[0-9]+\\.|[0-9]*\\.[0-9]+)(?:e[-+]?[0-9]+)?/i",
      "severity": 3
    }
  ]
}

exports['float() float() Parse "1.0045" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": 1.0045
  },
  "errors": []
}

exports['float() float() Parse "123" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 123
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Illegal float numeral that doesn't follow /[-+]?(?:[0-9]+\\.|[0-9]*\\.[0-9]+)(?:e[-+]?[0-9]+)?/i",
      "severity": 3
    }
  ]
}

exports['float() float() Parse "7e+3" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": 7000
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 4
      },
      "message": "Illegal float numeral that doesn't follow /[-+]?(?:[0-9]+\\.|[0-9]*\\.[0-9]+)(?:e[-+]?[0-9]+)?/i",
      "severity": 3
    }
  ]
}

exports['float() float() Parse "foo" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}

exports['float() float(failsOnEmpty = true) Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['float() float(failsOnEmpty = true) Parse "7e+3" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": 7000
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 4
      },
      "message": "Illegal float numeral that doesn't follow /[-+]?(?:[0-9]+\\.|[0-9]*\\.[0-9]+)(?:e[-+]?[0-9]+)?/i",
      "severity": 3
    }
  ]
}

exports['float() float(min, max, onOutOfRange) float(1, 6, true) Parse "0.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Testing MESSAGE",
      "severity": 3
    }
  ]
}

exports['float() float(min, max, onOutOfRange) float(1, 6, true) Parse "3.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 3
  },
  "errors": []
}

exports['float() float(min, max, onOutOfRange) float(1, 6, true) Parse "9.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 9
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Testing MESSAGE",
      "severity": 3
    }
  ]
}

exports['float() float(min, max, onOutOfRange) float(1, undefined, false) Parse "0.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float between 1 and +∞",
      "severity": 3
    }
  ]
}

exports['float() float(min, max, onOutOfRange) float(1, undefined, false) Parse "3.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 3
  },
  "errors": []
}

exports['float() float(min, max, onOutOfRange) float(1, undefined, false) Parse "9.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 9
  },
  "errors": []
}

exports['float() float(min, max, onOutOfRange) float(undefined, 6, false) Parse "0.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 0
  },
  "errors": []
}

exports['float() float(min, max, onOutOfRange) float(undefined, 6, false) Parse "3.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 3
  },
  "errors": []
}

exports['float() float(min, max, onOutOfRange) float(undefined, 6, false) Parse "9.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 9
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float between -∞ and 6",
      "severity": 3
    }
  ]
}
