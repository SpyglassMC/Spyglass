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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 26
        },
        "children": [
          {
            "type": "comment",
            "range": {
              "start": 0,
              "end": 26
            },
            "comment": " Doc comments for enum\n"
          }
        ],
        "value": " Doc comments for enum\n"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 26,
          "end": 30
        },
        "value": "enum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 30,
          "end": 31
        },
        "value": "("
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 31,
          "end": 36
        },
        "value": "float"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 36,
          "end": 37
        },
        "value": ")"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 38,
          "end": 46
        },
        "value": "TestEnum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 47,
          "end": 48
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 50,
          "end": 89
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 50,
              "end": 80
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 50,
                  "end": 79
                },
                "comment": " Doc comments for field 1\n"
              }
            ],
            "value": " Doc comments for field 1\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 80,
              "end": 83
            },
            "value": "One"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 84,
              "end": 85
            },
            "value": "="
          },
          {
            "type": "float",
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
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 50,
                "end": 79
              },
              "comment": " Doc comments for field 1\n"
            }
          ],
          "value": " Doc comments for field 1\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 80,
            "end": 83
          },
          "value": "One"
        },
        "value": {
          "type": "float",
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
        "value": ","
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 92,
          "end": 131
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 92,
              "end": 122
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 92,
                  "end": 121
                },
                "comment": " Doc comments for field 2\n"
              }
            ],
            "value": " Doc comments for field 2\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 122,
              "end": 125
            },
            "value": "Two"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 126,
              "end": 127
            },
            "value": "="
          },
          {
            "type": "float",
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
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 92,
                "end": 121
              },
              "comment": " Doc comments for field 2\n"
            }
          ],
          "value": " Doc comments for field 2\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 122,
            "end": 125
          },
          "value": "Two"
        },
        "value": {
          "type": "float",
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
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 26
      },
      "children": [
        {
          "type": "comment",
          "range": {
            "start": 0,
            "end": 26
          },
          "comment": " Doc comments for enum\n"
        }
      ],
      "value": " Doc comments for enum\n"
    },
    "enumType": {
      "type": "nbtdoc:literal",
      "range": {
        "start": 31,
        "end": 36
      },
      "value": "float"
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 38,
        "end": 46
      },
      "value": "TestEnum"
    },
    "fields": [
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 50,
          "end": 89
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 50,
              "end": 80
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 50,
                  "end": 79
                },
                "comment": " Doc comments for field 1\n"
              }
            ],
            "value": " Doc comments for field 1\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 80,
              "end": 83
            },
            "value": "One"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 84,
              "end": 85
            },
            "value": "="
          },
          {
            "type": "float",
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
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 50,
                "end": 79
              },
              "comment": " Doc comments for field 1\n"
            }
          ],
          "value": " Doc comments for field 1\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 80,
            "end": 83
          },
          "value": "One"
        },
        "value": {
          "type": "float",
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
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 92,
              "end": 122
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 92,
                  "end": 121
                },
                "comment": " Doc comments for field 2\n"
              }
            ],
            "value": " Doc comments for field 2\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 122,
              "end": 125
            },
            "value": "Two"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 126,
              "end": 127
            },
            "value": "="
          },
          {
            "type": "float",
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
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 92,
                "end": 121
              },
              "comment": " Doc comments for field 2\n"
            }
          ],
          "value": " Doc comments for field 2\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 122,
            "end": 125
          },
          "value": "Two"
        },
        "value": {
          "type": "float",
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 26
        },
        "children": [
          {
            "type": "comment",
            "range": {
              "start": 0,
              "end": 26
            },
            "comment": " Doc comments for enum\n"
          }
        ],
        "value": " Doc comments for enum\n"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 26,
          "end": 30
        },
        "value": "enum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 30,
          "end": 31
        },
        "value": "("
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 31,
          "end": 37
        },
        "value": "string"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 37,
          "end": 38
        },
        "value": ")"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 39,
          "end": 47
        },
        "value": "TestEnum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 48,
          "end": 49
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 51,
          "end": 113
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 51,
              "end": 102
            },
            "children": [
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
            "value": " Doc comments for field 1\n The second line\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 102,
              "end": 105
            },
            "value": "Foo"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 106,
              "end": 107
            },
            "value": "="
          },
          {
            "type": "string",
            "range": {
              "start": 108,
              "end": 113
            },
            "options": {
              "quotes": [
                "\""
              ],
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ]
              }
            },
            "value": "foo",
            "valueMap": {
              "outerRange": {
                "start": 109,
                "end": 112
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 51,
            "end": 102
          },
          "children": [
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
          "value": " Doc comments for field 1\n The second line\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 102,
            "end": 105
          },
          "value": "Foo"
        },
        "value": {
          "type": "string",
          "range": {
            "start": 108,
            "end": 113
          },
          "options": {
            "quotes": [
              "\""
            ],
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ]
            }
          },
          "value": "foo",
          "valueMap": {
            "outerRange": {
              "start": 109,
              "end": 112
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 114,
          "end": 115
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 26
      },
      "children": [
        {
          "type": "comment",
          "range": {
            "start": 0,
            "end": 26
          },
          "comment": " Doc comments for enum\n"
        }
      ],
      "value": " Doc comments for enum\n"
    },
    "enumType": {
      "type": "nbtdoc:literal",
      "range": {
        "start": 31,
        "end": 37
      },
      "value": "string"
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 39,
        "end": 47
      },
      "value": "TestEnum"
    },
    "fields": [
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 51,
          "end": 113
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 51,
              "end": 102
            },
            "children": [
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
            "value": " Doc comments for field 1\n The second line\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 102,
              "end": 105
            },
            "value": "Foo"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 106,
              "end": 107
            },
            "value": "="
          },
          {
            "type": "string",
            "range": {
              "start": 108,
              "end": 113
            },
            "options": {
              "quotes": [
                "\""
              ],
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ]
              }
            },
            "value": "foo",
            "valueMap": {
              "outerRange": {
                "start": 109,
                "end": 112
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 51,
            "end": 102
          },
          "children": [
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
          "value": " Doc comments for field 1\n The second line\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 102,
            "end": 105
          },
          "value": "Foo"
        },
        "value": {
          "type": "string",
          "range": {
            "start": 108,
            "end": 113
          },
          "options": {
            "quotes": [
              "\""
            ],
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ]
            }
          },
          "value": "foo",
          "valueMap": {
            "outerRange": {
              "start": 109,
              "end": 112
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 4
        },
        "value": ""
      },
      {
        "type": "nbtdoc:literal",
        "value": "",
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
        "value": ""
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 4
        },
        "value": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 4
        },
        "value": ""
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 4,
          "end": 4
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 4,
              "end": 4
            },
            "children": [],
            "value": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 4
            },
            "value": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 4,
              "end": 4
            },
            "value": ""
          },
          {
            "type": "integer",
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
          "children": [],
          "value": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 4
          },
          "value": ""
        },
        "value": {
          "type": "integer",
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
        "value": ""
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "children": [],
      "value": ""
    },
    "enumType": {
      "type": "nbtdoc:literal",
      "range": {
        "start": 4,
        "end": 4
      },
      "value": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 4
      },
      "value": ""
    },
    "fields": [
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 4,
          "end": 4
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 4,
              "end": 4
            },
            "children": [],
            "value": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 4
            },
            "value": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 4,
              "end": 4
            },
            "value": ""
          },
          {
            "type": "integer",
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
          "children": [],
          "value": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 4
          },
          "value": ""
        },
        "value": {
          "type": "integer",
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 5
        },
        "value": "("
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 5,
          "end": 9
        },
        "value": "byte"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 9,
          "end": 10
        },
        "value": ")"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 11,
          "end": 19
        },
        "value": "TestEnum"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 20,
          "end": 21
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 21,
          "end": 28
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 21,
              "end": 21
            },
            "children": [],
            "value": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 21,
              "end": 24
            },
            "value": "One"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 25,
              "end": 26
            },
            "value": "="
          },
          {
            "type": "integer",
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
          "children": [],
          "value": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 21,
            "end": 24
          },
          "value": "One"
        },
        "value": {
          "type": "integer",
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
        "value": ","
      },
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 29,
          "end": 29
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 29,
              "end": 29
            },
            "children": [],
            "value": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 29,
              "end": 29
            },
            "value": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 29,
              "end": 29
            },
            "value": ""
          },
          {
            "type": "integer",
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
          "children": [],
          "value": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 29,
            "end": 29
          },
          "value": ""
        },
        "value": {
          "type": "integer",
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
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "children": [],
      "value": ""
    },
    "enumType": {
      "type": "nbtdoc:literal",
      "range": {
        "start": 5,
        "end": 9
      },
      "value": "byte"
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 11,
        "end": 19
      },
      "value": "TestEnum"
    },
    "fields": [
      {
        "type": "nbtdoc:enum_definition/field",
        "range": {
          "start": 21,
          "end": 28
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 21,
              "end": 21
            },
            "children": [],
            "value": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 21,
              "end": 24
            },
            "value": "One"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 25,
              "end": 26
            },
            "value": "="
          },
          {
            "type": "integer",
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
          "children": [],
          "value": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 21,
            "end": 24
          },
          "value": "One"
        },
        "value": {
          "type": "integer",
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
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 29,
              "end": 29
            },
            "children": [],
            "value": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 29,
              "end": 29
            },
            "value": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 29,
              "end": 29
            },
            "value": ""
          },
          {
            "type": "integer",
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
          "children": [],
          "value": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 29,
            "end": 29
          },
          "value": ""
        },
        "value": {
          "type": "integer",
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
