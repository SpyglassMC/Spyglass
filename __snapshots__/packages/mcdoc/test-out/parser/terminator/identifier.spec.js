exports['mcdoc identifier Parse "" 1'] = {
  "node": {
    "type": "mcdoc:identifier",
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
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['mcdoc identifier Parse "123" 1'] = {
  "node": {
    "type": "mcdoc:identifier",
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
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['mcdoc identifier Parse "foo" 1'] = {
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['mcdoc identifier Parse "foo()bar" 1'] = {
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['mcdoc identifier Parse "foo123" 1'] = {
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": "foo123"
  },
  "errors": []
}

exports['mcdoc identifier Parse "foo;bar" 1'] = {
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['mcdoc identifier Parse "foo↓bar" 1'] = {
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['mcdoc identifier Parse "foo你好;bar" 1'] = {
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "foo你好"
  },
  "errors": []
}
