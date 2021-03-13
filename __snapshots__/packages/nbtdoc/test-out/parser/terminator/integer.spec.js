exports['integer() Parse "-1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "-1"
  },
  "errors": []
}

exports['integer() Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() Parse "1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "1"
  },
  "errors": []
}

exports['integer(unsigned = true) Parse "-1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "-1"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Minus sign (“-”) disallowed",
      "severity": 3
    }
  ]
}

exports['integer(unsigned = true) Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": []
}

exports['integer(unsigned = true) Parse "1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "1"
  },
  "errors": []
}
