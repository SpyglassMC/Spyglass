exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(false, false, false, false, false, undefined) Parse "" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a number",
      "severity": 3
    }
  ]
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(false, false, false, false, false, undefined) Parse ".E" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a number",
      "severity": 3
    },
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected a number",
      "severity": 3
    },
    {
      "range": {
        "start": 1,
        "end": 2
      },
      "message": "Exponent disallowed",
      "severity": 3
    }
  ]
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(false, false, false, false, false, undefined) Parse "1.0045" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": 1.0045
  },
  "errors": []
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(false, false, false, false, false, undefined) Parse "123" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 123
  },
  "errors": []
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(false, false, false, false, false, undefined) Parse "7e+3" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": 7000
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 4
      },
      "message": "Exponent disallowed",
      "severity": 3
    }
  ]
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(false, false, false, false, false, undefined) Parse "foo" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a number",
      "severity": 3
    }
  ]
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(true, true, true, true, true, {"leadingZeros":true,"minusSign":true,"plusSign":true}) Parse "" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a number",
      "severity": 3
    }
  ]
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(true, true, true, true, true, {"leadingZeros":true,"minusSign":true,"plusSign":true}) Parse ".E" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected a number",
      "severity": 3
    }
  ]
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(true, true, true, true, true, {"leadingZeros":true,"minusSign":true,"plusSign":true}) Parse "1.0045" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": 1.0045
  },
  "errors": []
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(true, true, true, true, true, {"leadingZeros":true,"minusSign":true,"plusSign":true}) Parse "123" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 123
  },
  "errors": []
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(true, true, true, true, true, {"leadingZeros":true,"minusSign":true,"plusSign":true}) Parse "7e+3" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": 7000
  },
  "errors": []
}

exports['float() float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent) float(true, true, true, true, true, {"leadingZeros":true,"minusSign":true,"plusSign":true}) Parse "foo" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a number",
      "severity": 3
    }
  ]
}

exports['float() float(min, max, outOfRangeSeverity) float(1, 6, 2) Parse "0.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float between 1 and 6",
      "severity": 2
    }
  ]
}

exports['float() float(min, max, outOfRangeSeverity) float(1, 6, 2) Parse "3.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 3
  },
  "errors": []
}

exports['float() float(min, max, outOfRangeSeverity) float(1, 6, 2) Parse "9.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 9
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float between 1 and 6",
      "severity": 2
    }
  ]
}

exports['float() float(min, max, outOfRangeSeverity) float(1, undefined, undefined) Parse "0.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float between 1 and +∞",
      "severity": 3
    }
  ]
}

exports['float() float(min, max, outOfRangeSeverity) float(1, undefined, undefined) Parse "3.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 3
  },
  "errors": []
}

exports['float() float(min, max, outOfRangeSeverity) float(1, undefined, undefined) Parse "9.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 9
  },
  "errors": []
}

exports['float() float(min, max, outOfRangeSeverity) float(undefined, 6, undefined) Parse "0.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 0
  },
  "errors": []
}

exports['float() float(min, max, outOfRangeSeverity) float(undefined, 6, undefined) Parse "3.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 3
  },
  "errors": []
}

exports['float() float(min, max, outOfRangeSeverity) float(undefined, 6, undefined) Parse "9.0" 1'] = {
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 9
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float between -∞ and 6",
      "severity": 3
    }
  ]
}
