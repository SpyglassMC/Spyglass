exports['keyword() Should parse \'\' 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['keyword() Should parse \'f\' 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['keyword() Should parse \'foo something else;\' 1'] = {
  "node": {
    "type": "nbtdoc:keyword",
    "range": {
      "start": 0,
      "end": 3
    },
    "text": "foo"
  },
  "errors": []
}

exports['keyword() Should parse \'foo\' 1'] = {
  "node": {
    "type": "nbtdoc:keyword",
    "range": {
      "start": 0,
      "end": 3
    },
    "text": "foo"
  },
  "errors": []
}

exports['keyword() Should parse \'foobar\' 1'] = {
  "node": {
    "type": "nbtdoc:keyword",
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

exports['punctuation() Should parse \'\' 1'] = {
  "node": {
    "type": "nbtdoc:punctuation",
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

exports['punctuation() Should parse \';\' 1'] = {
  "node": {
    "type": "nbtdoc:punctuation",
    "text": ";",
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": []
}

exports['punctuation() Should parse \';foo\' 1'] = {
  "node": {
    "type": "nbtdoc:punctuation",
    "text": ";",
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": []
}

exports['punctuation() Should parse \';↓something else;\' 1'] = {
  "node": {
    "type": "nbtdoc:punctuation",
    "text": ";",
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": []
}
