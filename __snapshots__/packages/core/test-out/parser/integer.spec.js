exports['integer() integer(allowsEmpty) integer(allowsEmpty=true) Parse "" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() integer(allowsEmpty) integer(allowsEmpty=true) Parse "-" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() integer(failsOnEmpty) integer(failsOnEmpty=true) Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "+0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Plus sign (“+”) disallowed",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "+1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "1"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Plus sign (“+”) disallowed",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "-" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Minus sign (“-”) disallowed",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "-0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Minus sign (“-”) disallowed",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "-1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "-1"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Minus sign (“-”) disallowed",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "0123" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "123"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 4
      },
      "message": "Leading zeros disallowed",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "1"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "123" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "123"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(false, false, false) Parse "foo" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "+0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "+1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "1"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "-" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number",
      "severity": 3
    }
  ]
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "-0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "-1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "-1"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "0123" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "123"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "1" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "1"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "123" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "123"
  },
  "errors": []
}

exports['integer() integer(leadingZeros, minusSign, plusSign) integer(true, true, true) Parse "foo" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(1, 6, 2) Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected an integer between 1 and 6",
      "severity": 2
    }
  ]
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(1, 6, 2) Parse "3" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "3"
  },
  "errors": []
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(1, 6, 2) Parse "9" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "9"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected an integer between 1 and 6",
      "severity": 2
    }
  ]
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(1, undefined, undefined) Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected an integer between 1 and +∞",
      "severity": 3
    }
  ]
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(1, undefined, undefined) Parse "3" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "3"
  },
  "errors": []
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(1, undefined, undefined) Parse "9" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "9"
  },
  "errors": []
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(undefined, 6, undefined) Parse "0" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": []
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(undefined, 6, undefined) Parse "3" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "3"
  },
  "errors": []
}

exports['integer() integer(min, max, outOfRangeSeverity) integer(undefined, 6, undefined) Parse "9" 1'] = {
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "9"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected an integer between -∞ and 6",
      "severity": 3
    }
  ]
}
