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
    "text": "foo"
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
    "text": "foo"
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
    "text": "foo"
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

exports['punctuation() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "text": "",
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
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['punctuation() Parse ";" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "text": ";",
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": []
}

exports['punctuation() Parse ";foo" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "text": ";",
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": []
}

exports['punctuation() Parse ";↓something else;" 1'] = {
  "node": {
    "type": "nbtdoc:literal",
    "text": ";",
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": []
}
