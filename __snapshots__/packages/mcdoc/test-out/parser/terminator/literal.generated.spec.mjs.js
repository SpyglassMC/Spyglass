exports['mcdoc literal() Parse "" 1'] = {
  "node": {
    "type": "mcdoc:literal",
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
      "message": "Expected “foo” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc literal() Parse "foo something else;" 1'] = {
  "node": {
    "type": "mcdoc:literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['mcdoc literal() Parse "foo" 1'] = {
  "node": {
    "type": "mcdoc:literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['mcdoc literal() Parse "foobar" 1'] = {
  "node": {
    "type": "mcdoc:literal",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": "foobar"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 6
      },
      "message": "Expected “foo” but got “foobar”",
      "severity": 3
    }
  ]
}
