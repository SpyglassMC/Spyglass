exports['nbtdoc keyword() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['nbtdoc keyword() Parse "foo something else;" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['nbtdoc keyword() Parse "foo" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['nbtdoc keyword() Parse "foobar" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected a separation",
      "severity": 3
    }
  ]
}

exports['nbtdoc literal() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": ""
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “foo”",
      "severity": 3
    }
  ]
}

exports['nbtdoc literal() Parse "foo something else;" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['nbtdoc literal() Parse "foo" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['nbtdoc literal() Parse "foobar" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected a separation",
      "severity": 3
    }
  ]
}

exports['nbtdoc marker() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['nbtdoc marker() Parse ";" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": ";"
  },
  "errors": []
}

exports['nbtdoc marker() Parse ";foo" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": ";"
  },
  "errors": []
}

exports['nbtdoc marker() Parse ";↓something else;" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": ";"
  },
  "errors": []
}

exports['nbtdoc punctuation() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": ""
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['nbtdoc punctuation() Parse ";" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": ";"
  },
  "errors": []
}

exports['nbtdoc punctuation() Parse ";foo" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": ";"
  },
  "errors": []
}

exports['nbtdoc punctuation() Parse ";↓something else;" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": ";"
  },
  "errors": []
}
