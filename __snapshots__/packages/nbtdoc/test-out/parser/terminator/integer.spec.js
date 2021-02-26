exports['integer() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
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

exports['integer() Parse "+1" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
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

exports['integer() Parse "-" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Leading zeros are not allowed",
      "severity": 3
    }
  ]
}

exports['integer() Parse "-0123" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "-123"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Leading zeros are not allowed",
      "severity": 3
    }
  ]
}

exports['integer() Parse "-1" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "-1"
  },
  "errors": []
}

exports['integer() Parse "-123" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "-123"
  },
  "errors": []
}

exports['integer() Parse "0" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() Parse "0123" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "123"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 4
      },
      "message": "Leading zeros are not allowed",
      "severity": 3
    }
  ]
}

exports['integer() Parse "1" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "1"
  },
  "errors": []
}

exports['integer() Parse "123" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "123"
  },
  "errors": []
}

exports['integer() Parse "foo" 1'] = {
  "node": {
    "type": "nbtdoc:integer",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
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
