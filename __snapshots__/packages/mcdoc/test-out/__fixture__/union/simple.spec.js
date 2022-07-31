exports['mcdoc __fixture__ union/simple 1'] = {
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
      "::test::Union": {
        "data": {
          "typeDef": {
            "kind": "union",
            "members": [
              {
                "kind": "int"
              },
              {
                "kind": "string"
              }
            ]
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 5,
              "end": 10
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 5
              },
              "end": {
                "line": 0,
                "character": 10
              }
            },
            "fullRange": {
              "start": 0,
              "end": 27
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 0,
                "character": 27
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
        "end": 27
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 5,
                    "end": 10
                  },
                  "value": "Union",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Union"
                    ]
                  }
                },
                {
                  "type": "mcdoc:type/union",
                  "children": [
                    {
                      "type": "mcdoc:type/numeric_type",
                      "children": [
                        {
                          "type": "mcdoc:literal",
                          "range": {
                            "start": 14,
                            "end": 17
                          },
                          "value": "int",
                          "colorTokenType": "type"
                        }
                      ],
                      "range": {
                        "start": 14,
                        "end": 18
                      }
                    },
                    {
                      "type": "mcdoc:type/string",
                      "children": [
                        {
                          "type": "mcdoc:literal",
                          "range": {
                            "start": 20,
                            "end": 26
                          },
                          "value": "string",
                          "colorTokenType": "type"
                        }
                      ],
                      "range": {
                        "start": 20,
                        "end": 26
                      }
                    }
                  ],
                  "range": {
                    "start": 13,
                    "end": 27
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 27
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 27
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
