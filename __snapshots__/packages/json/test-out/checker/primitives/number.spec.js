exports['JSON number float Check ""5"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "5",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 2
      },
      "innerRange": {
        "start": 0,
        "end": 1
      },
      "pairs": []
    },
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}

exports['JSON number float Check "-5.62" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -5.62,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number float Check "-7" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -7,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number float Check "2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 2,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number float Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number float Check "4.3" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 4.3,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number float Check "6e4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 60000,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number float Check "8b" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 8,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number float Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(-5, null) Check ""5"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "5",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 2
      },
      "innerRange": {
        "start": 0,
        "end": 1
      },
      "pairs": []
    },
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(-5, null) Check "-5.62" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -5.62,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected a number greater than or equal to -5",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(-5, null) Check "-7" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -7,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Expected a number greater than or equal to -5",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(-5, null) Check "2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 2,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number floatRange(-5, null) Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number floatRange(-5, null) Check "4.3" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 4.3,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number floatRange(-5, null) Check "6e4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 60000,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number floatRange(-5, null) Check "8b" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 8,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number floatRange(-5, null) Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-5, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(1, 2.4) Check ""5"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "5",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 2
      },
      "innerRange": {
        "start": 0,
        "end": 1
      },
      "pairs": []
    },
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(1, 2.4) Check "-5.62" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -5.62,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected a number between 1 and 2.4",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(1, 2.4) Check "-7" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -7,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Expected a number between 1 and 2.4",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(1, 2.4) Check "2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 2,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number floatRange(1, 2.4) Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number between 1 and 2.4",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(1, 2.4) Check "4.3" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 4.3,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a number between 1 and 2.4",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(1, 2.4) Check "6e4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 60000,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a number between 1 and 2.4",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(1, 2.4) Check "8b" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 8,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number between 1 and 2.4",
      "severity": 3
    }
  ]
}

exports['JSON number floatRange(1, 2.4) Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 2.4)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}

exports['JSON number int Check ""5"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "5",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 2
      },
      "innerRange": {
        "start": 0,
        "end": 1
      },
      "pairs": []
    },
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number int Check "-5.62" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -5.62,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number int Check "-7" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -7,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number int Check "2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 2,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number int Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number int Check "4.3" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 4.3,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number int Check "6e4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 60000,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number int Check "8b" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 8,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number int Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(-9, 0) Check ""5"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "5",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 2
      },
      "innerRange": {
        "start": 0,
        "end": 1
      },
      "pairs": []
    },
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(-9, 0) Check "-5.62" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -5.62,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(-9, 0) Check "-7" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -7,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number intRange(-9, 0) Check "2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 2,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number between -9 and 0",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(-9, 0) Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number between -9 and 0",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(-9, 0) Check "4.3" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 4.3,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(-9, 0) Check "6e4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 60000,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a number between -9 and 0",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(-9, 0) Check "8b" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 8,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number between -9 and 0",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(-9, 0) Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-9, 0)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(1, 3) Check ""5"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "5",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 2
      },
      "innerRange": {
        "start": 0,
        "end": 1
      },
      "pairs": []
    },
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(1, 3) Check "-5.62" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -5.62,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(1, 3) Check "-7" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -7,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Expected a number between 1 and 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(1, 3) Check "2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 2,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number intRange(1, 3) Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number between 1 and 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(1, 3) Check "4.3" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 4.3,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(1, 3) Check "6e4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 60000,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a number between 1 and 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(1, 3) Check "8b" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 8,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number between 1 and 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(1, 3) Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(1, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(3, null) Check ""5"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "5",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 2
      },
      "innerRange": {
        "start": 0,
        "end": 1
      },
      "pairs": []
    },
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(3, null) Check "-5.62" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -5.62,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(3, null) Check "-7" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -7,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Expected a number greater than or equal to 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(3, null) Check "2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 2,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number greater than or equal to 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(3, null) Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number intRange(3, null) Check "4.3" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 4.3,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(3, null) Check "6e4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 60000,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number intRange(3, null) Check "8b" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 8,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number intRange(3, null) Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(3, +∞)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(null, 3) Check ""5"" 1'] = {
  "node": {
    "type": "json:string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "5",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 2
      },
      "innerRange": {
        "start": 0,
        "end": 1
      },
      "pairs": []
    },
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(null, 3) Check "-5.62" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -5.62,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(null, 3) Check "-7" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -7,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number intRange(null, 3) Check "2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 2,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON number intRange(null, 3) Check "4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 4,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number smaller than or equal to 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(null, 3) Check "4.3" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 4.3,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(null, 3) Check "6e4" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 60000,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected a number smaller than or equal to 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(null, 3) Check "8b" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 8,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a number smaller than or equal to 3",
      "severity": 3
    }
  ]
}

exports['JSON number intRange(null, 3) Check "false" 1'] = {
  "node": {
    "type": "json:boolean",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": false,
    "expectation": [
      {
        "type": "json:number",
        "typedoc": "Number(-∞, 3)"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}
