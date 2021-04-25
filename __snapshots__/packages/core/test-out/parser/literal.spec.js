exports['literal() Parse "" 1'] = {
  "node": {
    "type": "literal",
    "range": {
      "start": 0,
      "end": 0
    },
    "options": {
      "pool": [
        "foobar",
        "foo",
        "bar"
      ]
    },
    "value": ""
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “foobar”, “foo”, or “bar”",
      "severity": 3
    }
  ]
}

exports['literal() Parse "bar qux" 1'] = {
  "node": {
    "type": "literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "options": {
      "pool": [
        "foobar",
        "foo",
        "bar"
      ]
    },
    "value": "bar"
  },
  "errors": []
}

exports['literal() Parse "foo qux" 1'] = {
  "node": {
    "type": "literal",
    "range": {
      "start": 0,
      "end": 3
    },
    "options": {
      "pool": [
        "foobar",
        "foo",
        "bar"
      ]
    },
    "value": "foo"
  },
  "errors": []
}

exports['literal() Parse "foobar qux" 1'] = {
  "node": {
    "type": "literal",
    "range": {
      "start": 0,
      "end": 6
    },
    "options": {
      "pool": [
        "foobar",
        "foo",
        "bar"
      ]
    },
    "value": "foobar"
  },
  "errors": []
}

exports['literal() Parse "wrong" 1'] = {
  "node": {
    "type": "literal",
    "range": {
      "start": 0,
      "end": 0
    },
    "options": {
      "pool": [
        "qux"
      ]
    },
    "value": ""
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “qux”",
      "severity": 3
    }
  ]
}
