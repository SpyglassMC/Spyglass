exports['enumDefinition() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['enumDefinition() Parse "/// Doc comments for enum↓enum(float) TestEnum {↓⮀/// Doc comments for field 1↓⮀One = 1.0,↓⮀/// Doc comments for field 2↓⮀Two = 2.0↓}" 1'] = {
  "node": {
    "type": "nbtdoc:enum_definition",
    "range": {
      "start": 0,
      "end": 133
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 26
        },
        "nodes": [
          {
            "type": "comment",
            "range": {
              "start": 0,
              "end": 26
            },
            "comment": " Doc comments for enum\n"
          }
        ],
        "doc": " Doc comments for enum\n"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 26,
          "end": 30
        },
        "text": "enum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 30,
          "end": 31
        },
        "text": "("
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 31,
          "end": 36
        },
        "text": "float"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 36,
          "end": 37
        },
        "text": ")"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 38,
          "end": 46
        },
        "text": "TestEnum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 47,
          "end": 48
        },
        "text": "{"
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 50,
          "end": 89
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 50,
              "end": 80
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 50,
                  "end": 79
                },
                "comment": " Doc comments for field 1\n"
              }
            ],
            "doc": " Doc comments for field 1\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 80,
              "end": 83
            },
            "text": "One"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 84,
              "end": 85
            },
            "text": "="
          },
          {
            "type": "nbtdoc:float",
            "range": {
              "start": 86,
              "end": 89
            },
            "value": 1
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 50,
            "end": 80
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 50,
                "end": 79
              },
              "comment": " Doc comments for field 1\n"
            }
          ],
          "doc": " Doc comments for field 1\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 80,
            "end": 83
          },
          "text": "One"
        },
        "value": {
          "type": "nbtdoc:float",
          "range": {
            "start": 86,
            "end": 89
          },
          "value": 1
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 89,
          "end": 90
        },
        "text": ","
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 92,
          "end": 131
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 92,
              "end": 122
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 92,
                  "end": 121
                },
                "comment": " Doc comments for field 2\n"
              }
            ],
            "doc": " Doc comments for field 2\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 122,
              "end": 125
            },
            "text": "Two"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 126,
              "end": 127
            },
            "text": "="
          },
          {
            "type": "nbtdoc:float",
            "range": {
              "start": 128,
              "end": 131
            },
            "value": 2
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 92,
            "end": 122
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 92,
                "end": 121
              },
              "comment": " Doc comments for field 2\n"
            }
          ],
          "doc": " Doc comments for field 2\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 122,
            "end": 125
          },
          "text": "Two"
        },
        "value": {
          "type": "nbtdoc:float",
          "range": {
            "start": 128,
            "end": 131
          },
          "value": 2
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 132,
          "end": 133
        },
        "text": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 26
      },
      "nodes": [
        {
          "type": "comment",
          "range": {
            "start": 0,
            "end": 26
          },
          "comment": " Doc comments for enum\n"
        }
      ],
      "doc": " Doc comments for enum\n"
    },
    "enumType": {
      "type": "nbtdoc:literal",
      "range": {
        "start": 31,
        "end": 36
      },
      "text": "float"
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 38,
        "end": 46
      },
      "text": "TestEnum"
    },
    "fields": [
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 50,
          "end": 89
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 50,
              "end": 80
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 50,
                  "end": 79
                },
                "comment": " Doc comments for field 1\n"
              }
            ],
            "doc": " Doc comments for field 1\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 80,
              "end": 83
            },
            "text": "One"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 84,
              "end": 85
            },
            "text": "="
          },
          {
            "type": "nbtdoc:float",
            "range": {
              "start": 86,
              "end": 89
            },
            "value": 1
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 50,
            "end": 80
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 50,
                "end": 79
              },
              "comment": " Doc comments for field 1\n"
            }
          ],
          "doc": " Doc comments for field 1\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 80,
            "end": 83
          },
          "text": "One"
        },
        "value": {
          "type": "nbtdoc:float",
          "range": {
            "start": 86,
            "end": 89
          },
          "value": 1
        }
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 92,
          "end": 131
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 92,
              "end": 122
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 92,
                  "end": 121
                },
                "comment": " Doc comments for field 2\n"
              }
            ],
            "doc": " Doc comments for field 2\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 122,
              "end": 125
            },
            "text": "Two"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 126,
              "end": 127
            },
            "text": "="
          },
          {
            "type": "nbtdoc:float",
            "range": {
              "start": 128,
              "end": 131
            },
            "value": 2
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 92,
            "end": 122
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 92,
                "end": 121
              },
              "comment": " Doc comments for field 2\n"
            }
          ],
          "doc": " Doc comments for field 2\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 122,
            "end": 125
          },
          "text": "Two"
        },
        "value": {
          "type": "nbtdoc:float",
          "range": {
            "start": 128,
            "end": 131
          },
          "value": 2
        }
      }
    ]
  },
  "errors": []
}

exports['enumDefinition() Parse "/// Doc comments for enum↓enum(string) TestEnum {↓⮀/// Doc comments for field 1↓⮀/// The second line↓⮀Foo = "foo"↓}" 1'] = {
  "node": {
    "type": "nbtdoc:enum_definition",
    "range": {
      "start": 0,
      "end": 115
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 26
        },
        "nodes": [
          {
            "type": "comment",
            "range": {
              "start": 0,
              "end": 26
            },
            "comment": " Doc comments for enum\n"
          }
        ],
        "doc": " Doc comments for enum\n"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 26,
          "end": 30
        },
        "text": "enum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 30,
          "end": 31
        },
        "text": "("
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 31,
          "end": 37
        },
        "text": "string"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 37,
          "end": 38
        },
        "text": ")"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 39,
          "end": 47
        },
        "text": "TestEnum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 48,
          "end": 49
        },
        "text": "{"
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 51,
          "end": 113
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 51,
              "end": 102
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 51,
                  "end": 80
                },
                "comment": " Doc comments for field 1\n"
              },
              {
                "type": "comment",
                "range": {
                  "start": 81,
                  "end": 101
                },
                "comment": " The second line\n"
              }
            ],
            "doc": " Doc comments for field 1\n The second line\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 102,
              "end": 105
            },
            "text": "Foo"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 106,
              "end": 107
            },
            "text": "="
          },
          {
            "type": "nbtdoc:string",
            "range": {
              "start": 108,
              "end": 113
            },
            "value": "foo"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 51,
            "end": 102
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 51,
                "end": 80
              },
              "comment": " Doc comments for field 1\n"
            },
            {
              "type": "comment",
              "range": {
                "start": 81,
                "end": 101
              },
              "comment": " The second line\n"
            }
          ],
          "doc": " Doc comments for field 1\n The second line\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 102,
            "end": 105
          },
          "text": "Foo"
        },
        "value": {
          "type": "nbtdoc:string",
          "range": {
            "start": 108,
            "end": 113
          },
          "value": "foo"
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 114,
          "end": 115
        },
        "text": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 26
      },
      "nodes": [
        {
          "type": "comment",
          "range": {
            "start": 0,
            "end": 26
          },
          "comment": " Doc comments for enum\n"
        }
      ],
      "doc": " Doc comments for enum\n"
    },
    "enumType": {
      "type": "nbtdoc:literal",
      "range": {
        "start": 31,
        "end": 37
      },
      "text": "string"
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 39,
        "end": 47
      },
      "text": "TestEnum"
    },
    "fields": [
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 51,
          "end": 113
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 51,
              "end": 102
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 51,
                  "end": 80
                },
                "comment": " Doc comments for field 1\n"
              },
              {
                "type": "comment",
                "range": {
                  "start": 81,
                  "end": 101
                },
                "comment": " The second line\n"
              }
            ],
            "doc": " Doc comments for field 1\n The second line\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 102,
              "end": 105
            },
            "text": "Foo"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 106,
              "end": 107
            },
            "text": "="
          },
          {
            "type": "nbtdoc:string",
            "range": {
              "start": 108,
              "end": 113
            },
            "value": "foo"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 51,
            "end": 102
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 51,
                "end": 80
              },
              "comment": " Doc comments for field 1\n"
            },
            {
              "type": "comment",
              "range": {
                "start": 81,
                "end": 101
              },
              "comment": " The second line\n"
            }
          ],
          "doc": " Doc comments for field 1\n The second line\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 102,
            "end": 105
          },
          "text": "Foo"
        },
        "value": {
          "type": "nbtdoc:string",
          "range": {
            "start": 108,
            "end": 113
          },
          "value": "foo"
        }
      }
    ]
  },
  "errors": []
}

exports['enumDefinition() Parse "enum" 1'] = {
  "node": {
    "type": "nbtdoc:enum_definition",
    "range": {
      "start": 0,
      "end": 4
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "text": "enum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 4
        },
        "text": ""
      },
      {
        "type": "nbtdoc:literal",
        "text": "",
        "range": {
          "start": 4,
          "end": 4
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 4
        },
        "text": ""
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 4
        },
        "text": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 4
        },
        "text": ""
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 4,
          "end": 4
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 4,
              "end": 4
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 4
            },
            "text": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 4,
              "end": 4
            },
            "text": ""
          },
          {
            "type": "nbtdoc:integer",
            "range": {
              "start": 4,
              "end": 4
            },
            "value": "0"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 4,
            "end": 4
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 4
          },
          "text": ""
        },
        "value": {
          "type": "nbtdoc:integer",
          "range": {
            "start": 4,
            "end": 4
          },
          "value": "0"
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 4
        },
        "text": ""
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "enumType": {
      "type": "nbtdoc:literal",
      "range": {
        "start": 4,
        "end": 4
      },
      "text": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 4
      },
      "text": ""
    },
    "fields": [
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 4,
          "end": 4
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 4,
              "end": 4
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 4
            },
            "text": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 4,
              "end": 4
            },
            "text": ""
          },
          {
            "type": "nbtdoc:integer",
            "range": {
              "start": 4,
              "end": 4
            },
            "value": "0"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 4,
            "end": 4
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 4
          },
          "text": ""
        },
        "value": {
          "type": "nbtdoc:integer",
          "range": {
            "start": 4,
            "end": 4
          },
          "value": "0"
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
      "message": "Expected “(”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “byte”, “short”, “int”, “long”, “string”, “float”, or “double”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “)”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “{”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “=”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected an integer",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “}”",
      "severity": 3
    }
  ]
}

exports['enumDefinition() Parse "enum(byte) TestEnum {One = 1,}" 1'] = {
  "node": {
    "type": "nbtdoc:enum_definition",
    "range": {
      "start": 0,
      "end": 30
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "text": "enum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 5
        },
        "text": "("
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 5,
          "end": 9
        },
        "text": "byte"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 9,
          "end": 10
        },
        "text": ")"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 11,
          "end": 19
        },
        "text": "TestEnum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 20,
          "end": 21
        },
        "text": "{"
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 21,
          "end": 28
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 21,
              "end": 21
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 21,
              "end": 24
            },
            "text": "One"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 25,
              "end": 26
            },
            "text": "="
          },
          {
            "type": "nbtdoc:integer",
            "range": {
              "start": 27,
              "end": 28
            },
            "value": "1"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 21,
            "end": 21
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 21,
            "end": 24
          },
          "text": "One"
        },
        "value": {
          "type": "nbtdoc:integer",
          "range": {
            "start": 27,
            "end": 28
          },
          "value": "1"
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 28,
          "end": 29
        },
        "text": ","
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 29,
          "end": 29
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 29,
              "end": 29
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 29,
              "end": 29
            },
            "text": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 29,
              "end": 29
            },
            "text": ""
          },
          {
            "type": "nbtdoc:integer",
            "range": {
              "start": 29,
              "end": 29
            },
            "value": "0"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 29,
            "end": 29
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 29,
            "end": 29
          },
          "text": ""
        },
        "value": {
          "type": "nbtdoc:integer",
          "range": {
            "start": 29,
            "end": 29
          },
          "value": "0"
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 29,
          "end": 30
        },
        "text": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "enumType": {
      "type": "nbtdoc:literal",
      "range": {
        "start": 5,
        "end": 9
      },
      "text": "byte"
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 11,
        "end": 19
      },
      "text": "TestEnum"
    },
    "fields": [
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 21,
          "end": 28
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 21,
              "end": 21
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 21,
              "end": 24
            },
            "text": "One"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 25,
              "end": 26
            },
            "text": "="
          },
          {
            "type": "nbtdoc:integer",
            "range": {
              "start": 27,
              "end": 28
            },
            "value": "1"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 21,
            "end": 21
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 21,
            "end": 24
          },
          "text": "One"
        },
        "value": {
          "type": "nbtdoc:integer",
          "range": {
            "start": 27,
            "end": 28
          },
          "value": "1"
        }
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 29,
          "end": 29
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 29,
              "end": 29
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 29,
              "end": 29
            },
            "text": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 29,
              "end": 29
            },
            "text": ""
          },
          {
            "type": "nbtdoc:integer",
            "range": {
              "start": 29,
              "end": 29
            },
            "value": "0"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 29,
            "end": 29
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 29,
            "end": 29
          },
          "text": ""
        },
        "value": {
          "type": "nbtdoc:integer",
          "range": {
            "start": 29,
            "end": 29
          },
          "value": "0"
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 29,
        "end": 29
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 29,
        "end": 29
      },
      "message": "Expected “=”",
      "severity": 3
    },
    {
      "range": {
        "start": 29,
        "end": 29
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}
