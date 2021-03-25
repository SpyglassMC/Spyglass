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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "keys": {
        "type": "json:string"
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
          "typedoc": "String",
          "expectation": {
            "type": "json:string"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "String",
            "expectation": {
              "type": "json:string"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "String",
          "expectation": {
            "type": "json:string"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "String",
            "expectation": {
              "type": "json:string"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
            }
          }
        ]
      }
    ],
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "keys": {
        "type": "json:string"
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
          "typedoc": "String",
          "expectation": {
            "type": "json:string"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "String",
            "expectation": {
              "type": "json:string"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "String",
          "expectation": {
            "type": "json:string"
          }
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo",
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "String",
            "expectation": {
              "type": "json:string"
            }
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo",
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "String",
          "expectation": {
            "type": "json:string"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "String",
            "expectation": {
              "type": "json:string"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "String",
          "expectation": {
            "type": "json:string"
          }
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "foo",
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "String",
            "expectation": {
              "type": "json:string"
            }
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "foo",
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
            }
          }
        ]
      }
    ],
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "keys": {
        "type": "json:string"
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
          "typedoc": "String",
          "expectation": {
            "type": "json:string"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "String",
            "expectation": {
              "type": "json:string"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "String",
          "expectation": {
            "type": "json:string"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "String",
            "expectation": {
              "type": "json:string"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
            }
          }
        ]
      }
    ],
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "keys": {
        "type": "json:string"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "keys": {
        "type": "json:string"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
            }
          }
        ]
      }
    ],
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
            }
          }
        ]
      }
    ],
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
          "typedoc": "Number",
          "expectation": {
            "type": "json:number"
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
            "typedoc": "Number",
            "expectation": {
              "type": "json:number"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
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
    "typedoc": "Object",
    "expectation": {
      "type": "json:object",
      "fields": [
        {
          "key": "a",
          "value": {
            "type": "json:number"
          },
          "opt": true
        }
      ]
    }
  },
  "parserErrors": [],
  "checkerErrors": []
}
