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

exports['ErrorReporter report() & dump() Should throw error if dumped under attempt 1'] = `
The error reporter is still under an attempt
`

exports['ErrorReporter startAttempt() & endAttempt() Should return false for single attempt 1'] = [
  {
    "range": {
      "start": 0,
      "end": 1
    },
    "message": "Error message at outside",
    "severity": 3
  }
]

exports['ErrorReporter startAttempt() & endAttempt() Should return true for single attempt 1'] = [
  {
    "range": {
      "start": 0,
      "end": 1
    },
    "message": "Error message at outside",
    "severity": 3
  },
  {
    "range": {
      "start": 0,
      "end": 1
    },
    "message": "Error message in attempt",
    "severity": 3
  }
]

exports['ErrorReporter startAttempt() & endAttempt() Should throw error if endAttempt is called when it is out of an attempt 1'] = `
No attempt has been started yet
`

exports['ErrorReporter startAttempt() & endAttempt() Should work for recursive attempts 1'] = [
  {
    "range": {
      "start": 0,
      "end": 1
    },
    "message": "Error message at outside",
    "severity": 3
  },
  {
    "range": {
      "start": 0,
      "end": 1
    },
    "message": "Error message in attempt 1",
    "severity": 3
  }
]
