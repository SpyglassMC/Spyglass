exports['prefixed() Parse "!!true" 1'] = {
  "node": {
    "type": "prefixed",
    "range": {
      "start": 0,
      "end": 1
    },
    "prefix": "!",
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": "!"
      },
      {
        "type": "boolean",
        "range": {
          "start": 1,
          "end": 1
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected “false” or “true”",
      "severity": 3
    }
  ]
}

exports['prefixed() Parse "!false" 1'] = {
  "node": {
    "type": "prefixed",
    "range": {
      "start": 0,
      "end": 6
    },
    "prefix": "!",
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": "!"
      },
      {
        "type": "boolean",
        "range": {
          "start": 1,
          "end": 6
        },
        "value": false
      }
    ]
  },
  "errors": []
}

exports['prefixed() Parse "!test" 1'] = {
  "node": {
    "type": "prefixed",
    "range": {
      "start": 0,
      "end": 1
    },
    "prefix": "!",
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": "!"
      },
      {
        "type": "boolean",
        "range": {
          "start": 1,
          "end": 1
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected “false” or “true”",
      "severity": 3
    }
  ]
}

exports['prefixed() Parse "" 1'] = {
  "node": {
    "type": "prefixed",
    "range": {
      "start": 0,
      "end": 0
    },
    "prefix": "!",
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 0,
          "end": 0
        },
        "value": ""
      },
      {
        "type": "boolean",
        "range": {
          "start": 0,
          "end": 0
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “!”",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “false” or “true”",
      "severity": 3
    }
  ]
}

exports['prefixed() Parse "false" 1'] = {
  "node": {
    "type": "prefixed",
    "range": {
      "start": 0,
      "end": 5
    },
    "prefix": "!",
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 0,
          "end": 0
        },
        "value": ""
      },
      {
        "type": "boolean",
        "range": {
          "start": 0,
          "end": 5
        },
        "value": false
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “!”",
      "severity": 3
    }
  ]
}
