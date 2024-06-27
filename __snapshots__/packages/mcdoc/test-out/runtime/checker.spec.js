exports['mcdoc runtime checker typeDefinition “( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })” with value {"one":"something"} 1'] = []

exports['mcdoc runtime checker typeDefinition “( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })” with value {"one":91} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 91,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 91
        }
      }
    },
    "expected": [
      {
        "kind": "string"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })” with value {"two":91,"four":91} 1'] = [
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "four",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "four"
        }
      }
    },
    "nodesWithConflictingErrors": [
      {
        "originalNode": "four",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "four"
          }
        }
      },
      {
        "originalNode": "two",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "two"
          }
        }
      }
    ]
  },
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "two",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "two"
        }
      }
    },
    "nodesWithConflictingErrors": [
      {
        "originalNode": "four",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "four"
          }
        }
      },
      {
        "originalNode": "two",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "two"
          }
        }
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })” with value {"two":91,"three":true} 1'] = []

exports['mcdoc runtime checker typeDefinition “( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })” with value {"two":91} 1'] = []

exports['mcdoc runtime checker typeDefinition “( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })” with value {} 1'] = []

exports['mcdoc runtime checker typeDefinition “( struct { text: string } | struct { selector: number })” with value {"selector":20} 1'] = []

exports['mcdoc runtime checker typeDefinition “( struct { text: string } | struct { selector: number })” with value {"selector":[1]} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": [
        1
      ],
      "inferredType": {
        "kind": "list",
        "item": {
          "kind": "any"
        }
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “( struct { text: string } | struct { selector: number })” with value {"text":"foo","selector":40} 1'] = [
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "selector",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "selector"
        }
      }
    },
    "nodesWithConflictingErrors": [
      {
        "originalNode": "selector",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "selector"
          }
        }
      },
      {
        "originalNode": "text",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "text"
          }
        }
      }
    ]
  },
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "text",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "text"
        }
      }
    },
    "nodesWithConflictingErrors": [
      {
        "originalNode": "selector",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "selector"
          }
        }
      },
      {
        "originalNode": "text",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "text"
          }
        }
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “( struct { text: string } | struct { selector: number })” with value {"text":"something"} 1'] = []

exports['mcdoc runtime checker typeDefinition “( struct { text: string } | struct { selector: number })” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "text",
      "selector"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “(double @ 2..4 | double @ 8..)” with value 3 1'] = []

exports['mcdoc runtime checker typeDefinition “(double @ 2..4 | double @ 8..)” with value 5 1'] = [
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": 5,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 5
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 2,
        "max": 4
      },
      {
        "kind": 0,
        "min": 8
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “(double @ 2..4 | double @ 8..)” with value 9 1'] = []

exports['mcdoc runtime checker typeDefinition “(struct { foo: (int @ 0..5 | int @ 20..25) } | struct { foo: int @ 4..6 })” with value {"foo":23} 1'] = []

exports['mcdoc runtime checker typeDefinition “(struct { foo: (int @ 0..5 | int @ 20..25) } | struct { foo: int @ 4..6 })” with value {"foo":4} 1'] = []

exports['mcdoc runtime checker typeDefinition “(struct { foo: (int @ 0..5 | int @ 20..25) } | struct { foo: int @ 4..6 })” with value {"foo":9} 1'] = [
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": 9,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 9
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 4,
        "max": 6
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “(struct { foo: int @ 0..5 } | struct { foo: int @ 4..6 })” with value {"foo":4} 1'] = []

exports['mcdoc runtime checker typeDefinition “(struct { foo: int @ 0..5 } | struct { foo: int @ 4..6 })” with value {"foo":9} 1'] = [
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": 9,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 9
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 0,
        "max": 5
      },
      {
        "kind": 0,
        "min": 4,
        "max": 6
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “[double @ 0..1] @ 1..3” with value [0.2,6] 1'] = [
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": 6,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 6
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 0,
        "max": 1
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “[double @ 0..1] @ 1..3” with value [0.3,0.1] 1'] = []

exports['mcdoc runtime checker typeDefinition “[double @ 0..1] @ 1..3” with value [0.3,0.9,0.1,0.1] 1'] = [
  {
    "kind": "invalid_collection_length",
    "node": {
      "originalNode": [
        0.3,
        0.9,
        0.1,
        0.1
      ],
      "inferredType": {
        "kind": "list",
        "item": {
          "kind": "any"
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 1,
        "max": 3
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “[double @ 0..1] @ 1..3” with value [2,0.9,0.1,0.1] 1'] = [
  {
    "kind": "invalid_collection_length",
    "node": {
      "originalNode": [
        2,
        0.9,
        0.1,
        0.1
      ],
      "inferredType": {
        "kind": "list",
        "item": {
          "kind": "any"
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": 2,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 2
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 0,
        "max": 1
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “[double @ 0..1] @ 1..3” with value [] 1'] = [
  {
    "kind": "invalid_collection_length",
    "node": {
      "originalNode": [],
      "inferredType": {
        "kind": "list",
        "item": {
          "kind": "any"
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 1,
        "max": 3
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “[int] @ 0..5” with value [1,2,3,4,5,6] 1'] = [
  {
    "kind": "invalid_collection_length",
    "node": {
      "originalNode": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "inferredType": {
        "kind": "list",
        "item": {
          "kind": "any"
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 0,
        "max": 5
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “[int] @ 0..5” with value [1,2,3] 1'] = []

exports['mcdoc runtime checker typeDefinition “[int] @ 0..5” with value [] 1'] = []

exports['mcdoc runtime checker typeDefinition “[struct { foo: double, bar?: boolean }]” with value [4] 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 4,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 4
        }
      }
    },
    "expected": [
      {
        "kind": "struct",
        "fields": [
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "foo"
              }
            },
            "type": {
              "kind": "double"
            }
          },
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "bar"
              }
            },
            "optional": true,
            "type": {
              "kind": "boolean"
            }
          }
        ]
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “[struct { foo: double, bar?: boolean }]” with value [] 1'] = []

exports['mcdoc runtime checker typeDefinition “[struct { foo: double, bar?: boolean }]” with value [{"foo":2},{"foo":3,"bar":4},"test"] 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "test",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "test"
        }
      }
    },
    "expected": [
      {
        "kind": "struct",
        "fields": [
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "foo"
              }
            },
            "type": {
              "kind": "double"
            }
          },
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "bar"
              }
            },
            "optional": true,
            "type": {
              "kind": "boolean"
            }
          }
        ]
      }
    ]
  },
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 4,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 4
        }
      }
    },
    "expected": [
      {
        "kind": "boolean"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “[struct { foo: double, bar?: boolean }]” with value [{"foo":5}] 1'] = []

exports['mcdoc runtime checker typeDefinition “[struct { foo: double, bar?: boolean }]” with value [{}] 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "foo"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “dispatch minecraft:item[elytra] to struct { Damage: double }; struct { id: string, tag?: minecraft:item[[id]] }” with value {"id":"diamond"} 1'] = []

exports['mcdoc runtime checker typeDefinition “dispatch minecraft:item[elytra] to struct { Damage: double }; struct { id: string, tag?: minecraft:item[[id]] }” with value {"id":"elytra","tag":{"Damage":20}} 1'] = []

exports['mcdoc runtime checker typeDefinition “dispatch minecraft:item[elytra] to struct { Damage: double }; struct { id: string, tag?: minecraft:item[[id]] }” with value {"id":"elytra","tag":{"Damage":true}} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": true,
      "inferredType": {
        "kind": "boolean"
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “dispatch minecraft:item[elytra] to struct { Damage: double }; struct { id: string, tag?: minecraft:item[[id]] }” with value {"id":"elytra","tag":{}} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "Damage"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “dispatch minecraft:item[elytra] to struct { Damage: double }; struct { id: string, tag?: minecraft:item[[id]] }” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "id"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “double @ 2..<4” with value 2 1'] = []

exports['mcdoc runtime checker typeDefinition “double @ 2..<4” with value 3.99 1'] = []

exports['mcdoc runtime checker typeDefinition “double @ 2..<4” with value 4 1'] = [
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": 4,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 4
        }
      }
    },
    "ranges": [
      {
        "kind": 1,
        "min": 2,
        "max": 4
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “double @ 3..6.2” with value "hello" 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "double",
        "valueRange": {
          "kind": 0,
          "min": 3,
          "max": 6.2
        }
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “double @ 3..6.2” with value 1 1'] = [
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": 1,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 1
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 3,
        "max": 6.2
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “double @ 3..6.2” with value 3 1'] = []

exports['mcdoc runtime checker typeDefinition “double @ 3..6.2” with value 4 1'] = []

exports['mcdoc runtime checker typeDefinition “double @ 3..6.2” with value 6.2 1'] = []

exports['mcdoc runtime checker typeDefinition “double @ 3..6.2” with value 6.3 1'] = [
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": 6.3,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 6.3
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 3,
        "max": 6.2
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “string @ ..8” with value "abc" 1'] = []

exports['mcdoc runtime checker typeDefinition “string @ ..8” with value "abcdefghij" 1'] = [
  {
    "kind": "invalid_string_length",
    "node": {
      "originalNode": "abcdefghij",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "abcdefghij"
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "max": 8
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “string @ ..8” with value 1 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 1,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 1
        }
      }
    },
    "expected": [
      {
        "kind": "string",
        "lengthRange": {
          "kind": 0,
          "max": 8
        }
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { ...struct { foo: double, bar: boolean }, foo: string }” with value {"foo":"hello","bar":true} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { ...struct { foo: double, bar: boolean }, foo: string }” with value {"foo":"hello"} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {
        "foo": "hello"
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "bar"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { ...struct { foo: double, bar: boolean }, foo: string }” with value {"foo":4,"bar":false} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 4,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 4
        }
      }
    },
    "expected": [
      {
        "kind": "string"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { ...struct { foo: double, bar: boolean }, foo: string }” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "foo"
    ]
  },
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "bar"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: double, bar: string }[foo]” with value "hello" 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: double, bar: string }[foo]” with value 5 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { foo: double, bar: string }[foo]” with value {"foo":4,"bar":"wrong"} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": {
        "foo": 4,
        "bar": "wrong"
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: string, ...( struct { bar: string } | struct { baz: string } ) }” with value {"foo":"hello","bar":"world"} 1'] = [
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "bar",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "bar"
        }
      }
    }
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: string, ...( struct { bar: string } | struct { baz: string } ) }” with value {"foo":"hello","baz":"world"} 1'] = [
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "baz",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "baz"
        }
      }
    }
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: string, ...( struct { bar: string } | struct { baz: string } ) }” with value {"foo":"hi","bar":1} 1'] = [
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "bar",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "bar"
        }
      }
    }
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: string, ...( struct { bar: string } | struct { baz: string } ) }” with value {"foo":"hi"} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { foo: string, ...( struct { bar: string } | struct { baz: string } ) }” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "foo"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: string, bar: [double] }” with value 2 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 2,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 2
        }
      }
    },
    "expected": [
      {
        "kind": "struct",
        "fields": [
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "foo"
              }
            },
            "type": {
              "kind": "string"
            }
          },
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "bar"
              }
            },
            "type": {
              "kind": "list",
              "item": {
                "kind": "double"
              }
            }
          }
        ]
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: string, bar: [double] }” with value {"foo":"hello"} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {
        "foo": "hello"
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "bar"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: string, bar: [double] }” with value {"foo":true,"bar":[]} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": true,
      "inferredType": {
        "kind": "boolean"
      }
    },
    "expected": [
      {
        "kind": "string"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { foo: string, bar: [double] }” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "foo"
    ]
  },
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "bar"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"fallback"} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"other","baz":"world"} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "world",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "world"
        }
      }
    },
    "expected": [
      {
        "kind": "boolean"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"other","baz":true} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"other"} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {
        "id": "other"
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "baz"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"test","baz":true} 1'] = [
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "baz",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "baz"
        }
      }
    }
  },
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {
        "id": "test",
        "baz": true
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "config"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"test","config":"hello"} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"test","config":5} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"test"} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {
        "id": "test"
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "config"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "id"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"fallback","data":{"baz":true}} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"fallback","data":{"config":"hello"}} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"fallback","data":{}} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"fallback"} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {
        "id": "fallback"
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "data"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"other","data":{"baz":"world"}} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "world",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "world"
        }
      }
    },
    "expected": [
      {
        "kind": "boolean"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"other","data":{"baz":true}} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"other","data":{}} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "baz"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"test","data":{"baz":true}} 1'] = [
  {
    "kind": "unknown_key",
    "node": {
      "originalNode": "baz",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "baz"
        }
      }
    }
  },
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {
        "baz": true
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "config"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"test","data":{"config":"hello"}} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"test","data":{"config":5}} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {"id":"test","data":{}} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "config"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "id"
    ]
  },
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "data"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { pages: ([struct { raw: string, filtered?: string }] | [string]) }” with value {"pages":["foo","bar"]} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { pages: ([struct { raw: string, filtered?: string }] | [string]) }” with value {"pages":["foo",{"raw":"bar"}]} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "foo",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "foo"
        }
      }
    },
    "expected": [
      {
        "kind": "struct",
        "fields": [
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "raw"
              }
            },
            "type": {
              "kind": "string"
            }
          },
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "filtered"
              }
            },
            "optional": true,
            "type": {
              "kind": "string"
            }
          }
        ]
      }
    ],
    "nodesWithConflictingErrors": [
      {
        "originalNode": "foo",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "foo"
          }
        }
      },
      {
        "originalNode": {
          "raw": "bar"
        },
        "inferredType": {
          "kind": "struct",
          "fields": []
        }
      }
    ]
  },
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": {
        "raw": "bar"
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "expected": [
      {
        "kind": "string"
      }
    ],
    "nodesWithConflictingErrors": [
      {
        "originalNode": "foo",
        "inferredType": {
          "kind": "literal",
          "value": {
            "kind": "string",
            "value": "foo"
          }
        }
      },
      {
        "originalNode": {
          "raw": "bar"
        },
        "inferredType": {
          "kind": "struct",
          "fields": []
        }
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { pages: ([struct { raw: string, filtered?: string }] | [string]) }” with value {"pages":[]} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { pages: ([struct { raw: string, filtered?: string }] | [string]) }” with value {"pages":[{"raw":"foo"},{"raw":"bar","filtered":"baz"}]} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { test: double }” with value {"test":"hello"} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { test: double }” with value {"test":1} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { test: struct { config: double }, other: struct { baz: boolean } }[%fallback]” with value {"baz":"world"} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "world",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "world"
        }
      }
    },
    "expected": [
      {
        "kind": "boolean"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { test: struct { config: double }, other: struct { baz: boolean } }[%fallback]” with value {"baz":true} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { test: struct { config: double }, other: struct { baz: boolean } }[%fallback]” with value {"config":"hello"} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “struct { test: struct { config: double }, other: struct { baz: boolean } }[%fallback]” with value {"config":5} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { test: struct { config: double }, other: struct { baz: boolean } }[%fallback]” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "config",
      "baz"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Bounds<T> = struct { min: T, max: T }; Bounds<int @ 1..>” with value {"min":"hello","max":-1} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "int",
        "valueRange": {
          "kind": 0,
          "min": 1
        }
      }
    ]
  },
  {
    "kind": "number_out_of_range",
    "node": {
      "originalNode": -1,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": -1
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "min": 1
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Bounds<T> = struct { min: T, max: T }; Bounds<int @ 1..>” with value {"min":2,"max":5} 1'] = []

exports['mcdoc runtime checker typeDefinition “type Bounds<T> = struct { min: T, max: T }; Bounds<int @ 1..>” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "min"
    ]
  },
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "max"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type EmptyUnion = (); struct { foo: string, ...( struct { bar: string } | EmptyUnion ) }” with value {"foo":"hello","bar":"world"} 1'] = []

exports['mcdoc runtime checker typeDefinition “type EmptyUnion = (); struct { foo: string, ...( struct { bar: string } | EmptyUnion ) }” with value {"foo":"hi","bar":1} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 1,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 1
        }
      }
    },
    "expected": [
      {
        "kind": "string"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type EmptyUnion = (); struct { foo: string, ...( struct { bar: string } | EmptyUnion ) }” with value {"foo":"hi"} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {
        "foo": "hi"
      },
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "bar"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type EmptyUnion = (); struct { foo: string, ...( struct { bar: string } | EmptyUnion ) }” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "foo"
    ]
  },
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "bar"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Inner<B> = struct { bar: B }; type Outer<A> = struct { foo: Inner<[A]> }; Outer<string>” with value {"foo":3} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 3,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 3
        }
      }
    },
    "expected": [
      {
        "kind": "struct",
        "fields": [
          {
            "kind": "pair",
            "key": {
              "kind": "literal",
              "value": {
                "kind": "string",
                "value": "bar"
              }
            },
            "type": {
              "kind": "mapped",
              "child": {
                "kind": "reference",
                "path": "::B"
              },
              "mapping": {
                "::B": {
                  "kind": "list",
                  "item": {
                    "kind": "mapped",
                    "child": {
                      "kind": "reference",
                      "path": "::A"
                    },
                    "mapping": {
                      "::A": {
                        "kind": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Inner<B> = struct { bar: B }; type Outer<A> = struct { foo: Inner<[A]> }; Outer<string>” with value {"foo":{"bar":"hello"}} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "list",
        "item": {
          "kind": "mapped",
          "child": {
            "kind": "reference",
            "path": "::A"
          },
          "mapping": {
            "::A": {
              "kind": "string"
            }
          }
        }
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Inner<B> = struct { bar: B }; type Outer<A> = struct { foo: Inner<[A]> }; Outer<string>” with value {"foo":{"bar":["hello"]}} 1'] = []

exports['mcdoc runtime checker typeDefinition “type Inner<B> = struct { bar: B }; type Outer<A> = struct { foo: Inner<[A]> }; Outer<string>” with value {"foo":{"bar":[2]}} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 2,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 2
        }
      }
    },
    "expected": [
      {
        "kind": "string"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Ref = double; struct { foo: Ref }” with value {"foo":"hello"} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": [
      {
        "kind": "double"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Ref = double; struct { foo: Ref }” with value {"foo":4.1} 1'] = []

exports['mcdoc runtime checker typeDefinition “type Ref = double; struct { foo: Ref }” with value {} 1'] = [
  {
    "kind": "missing_key",
    "node": {
      "originalNode": {},
      "inferredType": {
        "kind": "struct",
        "fields": []
      }
    },
    "keys": [
      "foo"
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Tag<V> = (V | [V]); Tag<string>” with value "hello" 1'] = []

exports['mcdoc runtime checker typeDefinition “type Tag<V> = (V | [V]); Tag<string>” with value 2 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 2,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 2
        }
      }
    },
    "expected": [
      {
        "kind": "string"
      },
      {
        "kind": "list",
        "item": {
          "kind": "mapped",
          "child": {
            "kind": "reference",
            "path": "::V"
          },
          "mapping": {
            "::V": {
              "kind": "string"
            }
          }
        }
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Tag<V> = (V | [V]); Tag<string>” with value ["test"] 1'] = []

exports['mcdoc runtime checker typeDefinition “type Tag<V> = (V | [V]); Tag<string>” with value [10] 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 10,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 10
        }
      }
    },
    "expected": [
      {
        "kind": "string"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Tag<V> = (V | [V]); Tag<string>” with value [] 1'] = []

exports['mcdoc runtime checker typeDefinition “type Tag<V> = [int, V]; Tag<string>” with value "test" 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "test",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "test"
        }
      }
    },
    "expected": [
      {
        "kind": "tuple",
        "items": [
          {
            "kind": "mapped",
            "child": {
              "kind": "int"
            },
            "mapping": {
              "::V": {
                "kind": "string"
              }
            }
          },
          {
            "kind": "mapped",
            "child": {
              "kind": "reference",
              "path": "::V"
            },
            "mapping": {
              "::V": {
                "kind": "string"
              }
            }
          }
        ]
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Tag<V> = [int, V]; Tag<string>” with value ["foo","test"] 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "foo",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "foo"
        }
      }
    },
    "expected": [
      {
        "kind": "int"
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Tag<V> = [int, V]; Tag<string>” with value [10,"test"] 1'] = []

exports['mcdoc runtime checker typeDefinition “type Tag<V> = [int, V]; Tag<string>” with value [10] 1'] = [
  {
    "kind": "invalid_collection_length",
    "node": {
      "originalNode": [
        10
      ],
      "inferredType": {
        "kind": "list",
        "item": {
          "kind": "any"
        }
      }
    },
    "ranges": [
      {
        "kind": 0,
        "max": 2,
        "min": 2
      }
    ]
  }
]

exports['mcdoc runtime checker typeDefinition “type Tag<V> = [int, V]; Tag<string>” with value [4,5] 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 5,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 5
        }
      }
    },
    "expected": [
      {
        "kind": "string"
      }
    ]
  }
]
