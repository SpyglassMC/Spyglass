exports['string() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:string",
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
      "message": "Expected a string starting with double quote (“\"”)",
      "severity": 3
    }
  ]
}

exports['string() Parse ""foo" 1'] = {
  "node": {
    "type": "nbtdoc:string",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "foo"
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['string() Parse ""foo"" 1'] = {
  "node": {
    "type": "nbtdoc:string",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "foo"
  },
  "errors": []
}

exports['string() Parse ""fo↓o"" 1'] = {
  "node": {
    "type": "nbtdoc:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "fo"
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['string() Parse ""fo⧵Ao"" 1'] = {
  "node": {
    "type": "nbtdoc:string",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "fo"
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 5
      },
      "message": "Unexpected escape character “A”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['string() Parse ""fo⧵no"" 1'] = {
  "node": {
    "type": "nbtdoc:string",
    "range": {
      "start": 0,
      "end": 7
    },
    "value": "fo\no"
  },
  "errors": []
}

exports['string() Parse "foo" 1'] = {
  "node": {
    "type": "nbtdoc:string",
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
      "message": "Expected a string starting with double quote (“\"”)",
      "severity": 3
    }
  ]
}
