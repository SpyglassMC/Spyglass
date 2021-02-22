exports['any() Test "bar" with "foo | bar" 1'] = {
  "node": {
    "type": "literal",
    "literal": "bar",
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['any() Test "foo" with "foo | bar" 1'] = {
  "node": {
    "type": "literal",
    "literal": "foo",
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['any() Test "foo" with "foo*1 | foo*1" 1'] = {
  "node": {
    "type": "literal",
    "literal": "foo",
    "meta": "correct",
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Test Error",
      "severity": 3
    }
  ]
}

exports['any() Test "foo" with "foo*1 | foo*2" 1'] = {
  "node": {
    "type": "literal",
    "literal": "foo",
    "meta": "correct",
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Test Error",
      "severity": 3
    }
  ]
}

exports['any() Test "foo" with "foo*2 | foo*1" 1'] = {
  "node": {
    "type": "literal",
    "literal": "foo",
    "meta": "correct",
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Test Error",
      "severity": 3
    }
  ]
}

exports['any() Test "qux" with "foo | bar" 1'] = {
  "node": "FAILURE",
  "errors": []
}
