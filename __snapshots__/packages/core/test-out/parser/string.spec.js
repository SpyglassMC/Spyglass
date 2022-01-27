exports['string() quoted_string(", ⧵?) Parse ""foo⧵u00a7⧵abar"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 16
    },
    "value": "foou00a7abar",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      },
      {
        "inner": {
          "start": 3,
          "end": 4
        },
        "outer": {
          "start": 4,
          "end": 6
        }
      },
      {
        "inner": {
          "start": 8,
          "end": 9
        },
        "outer": {
          "start": 10,
          "end": 12
        }
      }
    ]
  },
  "errors": []
}

exports['string() quoted_string(", ⧵n⧵t) Parse "" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
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
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['string() quoted_string(", ⧵n⧵t) Parse ""foo" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "foo",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      }
    ]
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

exports['string() quoted_string(", ⧵n⧵t) Parse ""foo"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "foo",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      }
    ]
  },
  "errors": []
}

exports['string() quoted_string(", ⧵n⧵t) Parse ""foo↓" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "foo",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      }
    ]
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

exports['string() quoted_string(", ⧵n⧵t) Parse ""foo⧵nbar⧵t⧵"⧵⧵qux"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 19
    },
    "value": "foo\nbar\t\"\\qux",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      },
      {
        "inner": {
          "start": 3,
          "end": 4
        },
        "outer": {
          "start": 4,
          "end": 6
        }
      },
      {
        "inner": {
          "start": 7,
          "end": 8
        },
        "outer": {
          "start": 9,
          "end": 11
        }
      },
      {
        "inner": {
          "start": 8,
          "end": 9
        },
        "outer": {
          "start": 11,
          "end": 13
        }
      },
      {
        "inner": {
          "start": 9,
          "end": 10
        },
        "outer": {
          "start": 13,
          "end": 15
        }
      }
    ]
  },
  "errors": []
}

exports['string() quoted_string(", ⧵n⧵t) Parse ""foo⧵u00a7⧵abar"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 16
    },
    "value": "foou00a7abar",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      },
      {
        "inner": {
          "start": 3,
          "end": 4
        },
        "outer": {
          "start": 4,
          "end": 6
        }
      },
      {
        "inner": {
          "start": 8,
          "end": 9
        },
        "outer": {
          "start": 10,
          "end": 12
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 5,
        "end": 6
      },
      "message": "Unexpected escape character “u”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 12
      },
      "message": "Unexpected escape character “a”",
      "severity": 3
    }
  ]
}

exports['string() quoted_string(", ⧵n⧵t) Parse "\'foo\'" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "foo",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
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
      "message": "Only “\"” can be used to quote strings here",
      "severity": 3
    }
  ]
}

exports['string() quoted_string(", ⧵u⧵?) Parse ""foo⧵u00a7⧵abar"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 16
    },
    "value": "foo§abar",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      },
      {
        "inner": {
          "start": 3,
          "end": 4
        },
        "outer": {
          "start": 4,
          "end": 10
        }
      },
      {
        "inner": {
          "start": 4,
          "end": 5
        },
        "outer": {
          "start": 10,
          "end": 12
        }
      }
    ]
  },
  "errors": []
}

exports['string() quoted_string(", ⧵u⧵?) Parse ""⧵uggez"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 8
    },
    "value": "uggez",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      },
      {
        "inner": {
          "start": 0,
          "end": 1
        },
        "outer": {
          "start": 1,
          "end": 3
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 7
      },
      "message": "Hexadecimal digit expected",
      "severity": 3
    }
  ]
}

exports['string() quoted_string(quoted_string()) Parse ""foo"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "foo",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      }
    ],
    "children": [
      {
        "type": "string",
        "range": {
          "start": 1,
          "end": 1
        },
        "value": "",
        "valueMap": [
          {
            "inner": {
              "start": 0,
              "end": 0
            },
            "outer": {
              "start": 1,
              "end": 1
            }
          }
        ]
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['string() quoted_string(quoted_string()) Parse ""⧵"⧵u0066oo⧵⧵⧵⧵bar⧵""" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 21
    },
    "value": "\"foo\\\\bar\"",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      },
      {
        "inner": {
          "start": 0,
          "end": 1
        },
        "outer": {
          "start": 1,
          "end": 3
        }
      },
      {
        "inner": {
          "start": 1,
          "end": 2
        },
        "outer": {
          "start": 3,
          "end": 9
        }
      },
      {
        "inner": {
          "start": 4,
          "end": 5
        },
        "outer": {
          "start": 11,
          "end": 13
        }
      },
      {
        "inner": {
          "start": 5,
          "end": 6
        },
        "outer": {
          "start": 13,
          "end": 15
        }
      },
      {
        "inner": {
          "start": 9,
          "end": 10
        },
        "outer": {
          "start": 18,
          "end": 20
        }
      }
    ],
    "children": [
      {
        "type": "string",
        "range": {
          "start": 1,
          "end": 20
        },
        "value": "foo\\bar",
        "valueMap": [
          {
            "inner": {
              "start": 0,
              "end": 0
            },
            "outer": {
              "start": 3,
              "end": 3
            }
          },
          {
            "inner": {
              "start": 3,
              "end": 4
            },
            "outer": {
              "start": 11,
              "end": 15
            }
          }
        ]
      }
    ]
  },
  "errors": []
}

exports['string() unquoted_string() Parse "" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
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
      "message": "Expected a string",
      "severity": 3
    }
  ]
}

exports['string() unquoted_string() Parse ""foo"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
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
      "message": "Expected a string",
      "severity": 3
    }
  ]
}

exports['string() unquoted_string() Parse "$$$" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
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
      "message": "Expected a string",
      "severity": 3
    }
  ]
}

exports['string() unquoted_string() Parse "foo" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 0,
          "end": 0
        }
      }
    ]
  },
  "errors": []
}
