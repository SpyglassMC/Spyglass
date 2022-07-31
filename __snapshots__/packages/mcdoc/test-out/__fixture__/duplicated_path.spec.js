exports['mcdoc __fixture__ duplicated path 1'] = {
  "global": {
    "mcdoc": {
      "::test": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 0,
              "end": 0
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 0,
                "character": 0
              }
            },
            "contributor": "uri_binder"
          }
        ],
        "data": {
          "nextAnonymousIndex": 0
        }
      },
      "::test::Foo": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": []
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 7,
              "end": 10
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 7
              },
              "end": {
                "line": 0,
                "character": 10
              }
            },
            "fullRange": {
              "start": 0,
              "end": 14
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 1,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ]
      }
    }
  },
  "nodes": {
    "file:///test.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 32
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 0,
                    "end": 6
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 7,
                    "end": 10
                  },
                  "value": "Foo",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Foo"
                    ]
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 11,
                    "end": 13
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 14
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 14,
                    "end": 18
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 19,
                    "end": 22
                  },
                  "value": "Foo"
                },
                {
                  "type": "mcdoc:type/boolean",
                  "children": [
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 25,
                        "end": 32
                      },
                      "value": "boolean",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 25,
                    "end": 32
                  }
                }
              ],
              "range": {
                "start": 14,
                "end": 32
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 32
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": [
        {
          "range": {
            "start": 19,
            "end": 22
          },
          "message": "Duplicated declaration for “::test::Foo”",
          "severity": 2,
          "info": {
            "related": [
              {
                "location": {
                  "uri": "file:///test.mcdoc",
                  "range": {
                    "start": 7,
                    "end": 10
                  },
                  "posRange": {
                    "start": {
                      "line": 0,
                      "character": 7
                    },
                    "end": {
                      "line": 0,
                      "character": 10
                    }
                  },
                  "fullRange": {
                    "start": 0,
                    "end": 14
                  },
                  "fullPosRange": {
                    "start": {
                      "line": 0,
                      "character": 0
                    },
                    "end": {
                      "line": 1,
                      "character": 0
                    }
                  },
                  "contributor": "binder"
                },
                "message": "“::test::Foo” is already declared here"
              }
            ]
          }
        }
      ]
    }
  }
}
