exports['keyword() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['keyword() Parse "f" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['keyword() Parse "foo something else;" 1'] = {
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

exports['keyword() Parse "foo" 1'] = {
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

exports['keyword() Parse "foobar" 1'] = {
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

exports['literal() Parse "" 1'] = {
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

exports['literal() Parse "f" 1'] = {
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

exports['literal() Parse "foo something else;" 1'] = {
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

exports['literal() Parse "foo" 1'] = {
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

exports['literal() Parse "foobar" 1'] = {
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

exports['marker() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['marker() Parse ";" 1'] = {
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

exports['marker() Parse ";foo" 1'] = {
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

exports['marker() Parse ";↓something else;" 1'] = {
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

exports['punctuation() Parse "" 1'] = {
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

exports['punctuation() Parse ";" 1'] = {
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

exports['punctuation() Parse ";foo" 1'] = {
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

exports['punctuation() Parse ";↓something else;" 1'] = {
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
