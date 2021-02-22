exports['ErrorReporter absorb() Should absorb another reporter 1'] = {
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Error message 1",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Error message 2",
      "severity": 2
    },
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Error message 3",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Error message 4",
      "severity": 2
    }
  ]
}

exports['ErrorReporter absorb() Should absorb another reporter 2'] = {
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Error message 3",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Error message 4",
      "severity": 2
    }
  ]
}

exports['ErrorReporter report() & dump() Should report and dump errors correctly 1'] = [
  {
    "range": {
      "start": 0,
      "end": 1
    },
    "message": "Error message 1",
    "severity": 3
  },
  {
    "range": {
      "start": 0,
      "end": 1
    },
    "message": "Error message 2",
    "severity": 2
  }
]

exports['ErrorReporter report() & dump() Should report and dump errors correctly 2'] = [
  {
    "range": {
      "start": 0,
      "end": 1
    },
    "message": "Error message 3",
    "severity": 3
  }
]
