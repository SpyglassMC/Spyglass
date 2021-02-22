exports['identifier() Test "" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 0
    },
    "text": ""
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

exports['identifier() Test "123" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "text": "123"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "“123” doesn't follow the format of “/^[A-Za-z_][A-Za-z0-9_]*$/”",
      "severity": 3
    }
  ]
}

exports['identifier() Test "foo" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "text": "foo"
  },
  "errors": []
}

exports['identifier() Test "foo()bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "text": "foo"
  },
  "errors": []
}

exports['identifier() Test "foo123" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 6
    },
    "text": "foo123"
  },
  "errors": []
}

exports['identifier() Test "foo;bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "text": "foo"
  },
  "errors": []
}

exports['identifier() Test "foo↓bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "text": "foo"
  },
  "errors": []
}

exports['identifier() Test "foo你好;bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 5
    },
    "text": "foo你好"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "“foo你好” doesn't follow the format of “/^[A-Za-z_][A-Za-z0-9_]*$/”",
      "severity": 3
    }
  ]
}
