exports['float() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 0
    },
    "raw": "",
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

exports['float() Parse "+1" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 0
    },
    "raw": "",
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

exports['float() Parse "-1" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 2
    },
    "raw": "-1",
    "value": -1
  },
  "errors": []
}

exports['float() Parse ".23" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 3
    },
    "raw": ".23",
    "value": 0.23
  },
  "errors": []
}

exports['float() Parse "0" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 1
    },
    "raw": "0",
    "value": 0
  },
  "errors": []
}

exports['float() Parse "0123" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 4
    },
    "raw": "0123",
    "value": 123
  },
  "errors": []
}

exports['float() Parse "1" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 1
    },
    "raw": "1",
    "value": 1
  },
  "errors": []
}

exports['float() Parse "1." 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 2
    },
    "raw": "1.",
    "value": 1
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Encountered illegal float number",
      "severity": 3
    }
  ]
}

exports['float() Parse "1.23" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 4
    },
    "raw": "1.23",
    "value": 1.23
  },
  "errors": []
}

exports['float() Parse "1.23E+3" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 7
    },
    "raw": "1.23E+3",
    "value": 1230
  },
  "errors": []
}

exports['float() Parse "1.23E-3" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 7
    },
    "raw": "1.23E-3",
    "value": 0.00123
  },
  "errors": []
}

exports['float() Parse "1.23e" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 5
    },
    "raw": "1.23e",
    "value": 1.23
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Encountered illegal float number",
      "severity": 3
    }
  ]
}

exports['float() Parse "1.23e1" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 6
    },
    "raw": "1.23e1",
    "value": 12.3
  },
  "errors": []
}

exports['float() Parse "123" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 3
    },
    "raw": "123",
    "value": 123
  },
  "errors": []
}

exports['float() Parse "foo" 1'] = {
  "node": {
    "type": "nbtdoc:float",
    "range": {
      "start": 0,
      "end": 0
    },
    "raw": "",
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
