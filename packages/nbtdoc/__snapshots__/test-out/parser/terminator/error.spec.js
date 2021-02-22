exports['error() parse() Should parse \'\' 1'] = {
  "node": {
    "type": "nbtdoc:error",
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
      "message": "Failed to parse this line as any nbtdoc syntax",
      "severity": 3
    }
  ]
}

exports['error() parse() Should parse \'Something↓Next line;\' 1'] = {
  "node": {
    "type": "nbtdoc:error",
    "range": {
      "start": 0,
      "end": 9
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 9
      },
      "message": "Failed to parse this line as any nbtdoc syntax",
      "severity": 3
    }
  ]
}
