exports['any() Parse "bar" with "foo | bar" 1'] = {
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

exports['any() Parse "foo" with "foo | bar" 1'] = {
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

exports['any() Parse "foo" with "foo*1 | foo*1" 1'] = {
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
      "message": "Parse Error",
      "severity": 3
    }
  ]
}

exports['any() Parse "foo" with "foo*1 | foo*2" 1'] = {
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
      "message": "Parse Error",
      "severity": 3
    }
  ]
}

exports['any() Parse "foo" with "foo*2 | foo*1" 1'] = {
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
      "message": "Parse Error",
      "severity": 3
    }
  ]
}

exports['any() Parse "qux" with "foo | bar" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['concatOnTrailingBackslash() Parse "true" 1'] = {
  "node": {
    "type": "boolean",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": true
  },
  "errors": []
}

exports['concatOnTrailingBackslash() Parse "true↓" 1'] = {
  "node": {
    "type": "boolean",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": true
  },
  "errors": []
}

exports['concatOnTrailingBackslash() Parse "tru⧵ ↓ e" 1'] = {
  "node": {
    "type": "boolean",
    "range": {
      "start": 0,
      "end": 8
    },
    "value": true
  },
  "errors": []
}

exports['concatOnTrailingBackslash() Parse "tru⧵ ↓ ⧵↓ e" 1'] = {
  "node": {
    "type": "boolean",
    "range": {
      "start": 0,
      "end": 11
    },
    "value": true
  },
  "errors": []
}

exports['concatOnTrailingBackslash() Parse "tru⧵ ↓e" 1'] = {
  "node": {
    "type": "boolean",
    "range": {
      "start": 0,
      "end": 7
    },
    "value": true
  },
  "errors": []
}

exports['concatOnTrailingBackslash() Parse "tru⧵e ⧵ ↓ e" 1'] = {
  "node": {
    "type": "boolean",
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
      "message": "Expected “false” or “true”",
      "severity": 3
    }
  ]
}

exports['concatOnTrailingBackslash() Parse "tru⧵↓ e" 1'] = {
  "node": {
    "type": "boolean",
    "range": {
      "start": 0,
      "end": 7
    },
    "value": true
  },
  "errors": []
}

exports['concatOnTrailingBackslash() Parse "tru⧵↓e" 1'] = {
  "node": {
    "type": "boolean",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": true
  },
  "errors": []
}

exports['dumpErrors() should not output errors when wrapped with `dumpErrors()` 1'] = {
  "node": {
    "type": "boolean",
    "range": {
      "start": 0,
      "end": 0
    }
  },
  "errors": []
}

exports['dumpErrors() should output errors when not wrapped with `dumpErrors()` 1'] = {
  "node": {
    "type": "boolean",
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
      "message": "Expected “false” or “true”",
      "severity": 3
    }
  ]
}
