exports['nbtdoc fallibleInteger() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['nbtdoc integer() Parse "" 1'] = {
  "node": {
    "type": "integer",
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
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['nbtdoc integer() Parse "-1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -1
  },
  "errors": []
}

exports['nbtdoc integer() Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 0
  },
  "errors": []
}

exports['nbtdoc integer() Parse "1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 1
  },
  "errors": []
}

exports['nbtdoc integer(unsigned = true) Parse "-1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -1
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Illegal integer that doesn't follow /^(?:0|[1-9][0-9]*)$/",
      "severity": 3
    }
  ]
}

exports['nbtdoc integer(unsigned = true) Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 0
  },
  "errors": []
}

exports['nbtdoc integer(unsigned = true) Parse "1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 1
  },
  "errors": []
}
