exports['JSON object object() Check "[2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "items": [
      {
        "type": "json:number",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": 2,
        "isInteger": true
      }
    ],
    "children": [
      {
        "type": "json:number",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": 2,
        "isInteger": true
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object"
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an object",
      "severity": 3
    }
  ]
}

exports['JSON object object() Check "{ "a": 1 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "isInteger": true
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "isInteger": true
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object"
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object() Check "{ "a": 3, "b": "foo" }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "isInteger": true
          }
        ]
      },
      {
        "type": "json:property",
        "range": {
          "start": 10,
          "end": 20
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "value": "b"
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo"
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "b"
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo"
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "isInteger": true
          }
        ]
      },
      {
        "type": "json:property",
        "range": {
          "start": 10,
          "end": 20
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "value": "b"
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo"
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "b"
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo"
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object"
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object() Check "{ "b": 6 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "b"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "b"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "isInteger": true
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "b"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "b"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "isInteger": true
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object"
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object() Check "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "properties": [],
    "children": [],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object"
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object(string, () => int) Check "[2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "items": [
      {
        "type": "json:number",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": 2,
        "isInteger": true
      }
    ],
    "children": [
      {
        "type": "json:number",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": 2,
        "isInteger": true
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "keys": {
        "type": "json:string",
        "typedoc": "String"
      }
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an object",
      "severity": 3
    }
  ]
}

exports['JSON object object(string, () => int) Check "{ "a": 1 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "expectation": {
            "type": "json:string",
            "typedoc": "String"
          }
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "expectation": {
              "type": "json:string",
              "typedoc": "String"
            }
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "expectation": {
            "type": "json:string",
            "typedoc": "String"
          }
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "expectation": {
              "type": "json:string",
              "typedoc": "String"
            }
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "keys": {
        "type": "json:string",
        "typedoc": "String"
      }
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object(string, () => int) Check "{ "a": 3, "b": "foo" }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "expectation": {
            "type": "json:string",
            "typedoc": "String"
          }
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "expectation": {
              "type": "json:string",
              "typedoc": "String"
            }
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      },
      {
        "type": "json:property",
        "range": {
          "start": 10,
          "end": 20
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "value": "b",
          "expectation": {
            "type": "json:string",
            "typedoc": "String"
          }
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo",
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "b",
            "expectation": {
              "type": "json:string",
              "typedoc": "String"
            }
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo",
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "expectation": {
            "type": "json:string",
            "typedoc": "String"
          }
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "expectation": {
              "type": "json:string",
              "typedoc": "String"
            }
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      },
      {
        "type": "json:property",
        "range": {
          "start": 10,
          "end": 20
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "value": "b",
          "expectation": {
            "type": "json:string",
            "typedoc": "String"
          }
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo",
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "b",
            "expectation": {
              "type": "json:string",
              "typedoc": "String"
            }
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo",
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "keys": {
        "type": "json:string",
        "typedoc": "String"
      }
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 15,
        "end": 20
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON object object(string, () => int) Check "{ "b": 6 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "b",
          "expectation": {
            "type": "json:string",
            "typedoc": "String"
          }
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "b",
            "expectation": {
              "type": "json:string",
              "typedoc": "String"
            }
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "b",
          "expectation": {
            "type": "json:string",
            "typedoc": "String"
          }
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "b",
            "expectation": {
              "type": "json:string",
              "typedoc": "String"
            }
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "keys": {
        "type": "json:string",
        "typedoc": "String"
      }
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object(string, () => int) Check "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "properties": [],
    "children": [],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "keys": {
        "type": "json:string",
        "typedoc": "String"
      }
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object record({ a: int }) Check "[2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "items": [
      {
        "type": "json:number",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": 2,
        "isInteger": true
      }
    ],
    "children": [
      {
        "type": "json:number",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": 2,
        "isInteger": true
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          }
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an object",
      "severity": 3
    }
  ]
}

exports['JSON object record({ a: int }) Check "{ "a": 1 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "hover": "```typescript\n.a: Number\n```"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "hover": "```typescript\n.a: Number\n```"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          }
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object record({ a: int }) Check "{ "a": 3, "b": "foo" }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "hover": "```typescript\n.a: Number\n```"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      },
      {
        "type": "json:property",
        "range": {
          "start": 10,
          "end": 20
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "value": "b"
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo"
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "b"
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo"
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "hover": "```typescript\n.a: Number\n```"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      },
      {
        "type": "json:property",
        "range": {
          "start": 10,
          "end": 20
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "value": "b"
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo"
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "b"
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo"
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          }
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 10,
        "end": 13
      },
      "message": "Unknown property “b”",
      "severity": 2
    }
  ]
}

exports['JSON object record({ a: int }) Check "{ "b": 6 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "b"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "b"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "isInteger": true
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "b"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "b"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "isInteger": true
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          }
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Missing property “a”",
      "severity": 3
    },
    {
      "range": {
        "start": 2,
        "end": 5
      },
      "message": "Unknown property “b”",
      "severity": 2
    }
  ]
}

exports['JSON object record({ a: int }) Check "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "properties": [],
    "children": [],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          }
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Missing property “a”",
      "severity": 3
    }
  ]
}

exports['JSON object record({ a: opt(int) }) Check "[2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "items": [
      {
        "type": "json:number",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": 2,
        "isInteger": true
      }
    ],
    "children": [
      {
        "type": "json:number",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": 2,
        "isInteger": true
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          },
          "opt": true
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an object",
      "severity": 3
    }
  ]
}

exports['JSON object record({ a: opt(int) }) Check "{ "a": 1 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "hover": "```typescript\n.a: Number\n```"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "hover": "```typescript\n.a: Number\n```"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          },
          "opt": true
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object record({ a: opt(int) }) Check "{ "a": 3, "b": "foo" }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "hover": "```typescript\n.a: Number\n```"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      },
      {
        "type": "json:property",
        "range": {
          "start": 10,
          "end": 20
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "value": "b"
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo"
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "b"
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo"
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "a",
          "hover": "```typescript\n.a: Number\n```"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "isInteger": true,
          "expectation": {
            "type": "json:number",
            "typedoc": "Number"
          }
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "a",
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "isInteger": true,
            "expectation": {
              "type": "json:number",
              "typedoc": "Number"
            }
          }
        ]
      },
      {
        "type": "json:property",
        "range": {
          "start": 10,
          "end": 20
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "value": "b"
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo"
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": "b"
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo"
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          },
          "opt": true
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 10,
        "end": 13
      },
      "message": "Unknown property “b”",
      "severity": 2
    }
  ]
}

exports['JSON object record({ a: opt(int) }) Check "{ "b": 6 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "properties": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "b"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "b"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "isInteger": true
          }
        ]
      }
    ],
    "children": [
      {
        "type": "json:property",
        "range": {
          "start": 2,
          "end": 8
        },
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "value": "b"
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "isInteger": true
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "value": "b"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "isInteger": true
          }
        ]
      }
    ],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          },
          "opt": true
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 2,
        "end": 5
      },
      "message": "Unknown property “b”",
      "severity": 2
    }
  ]
}

exports['JSON object record({ a: opt(int) }) Check "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "properties": [],
    "children": [],
    "expectation": {
      "type": "json:object",
      "typedoc": "Object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number",
            "typedoc": "Number"
          },
          "opt": true
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}
