exports['mcdoc __fixture__ type alias/attributed 1'] = {
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
            "kind": "attributed",
            "attribute": {
              "name": "since",
              "value": {
                "kind": "literal",
                "value": {
                  "kind": "number",
                  "value": 1.18
                }
              }
            },
            "child": {
              "kind": "literal",
              "value": {
                "kind": "boolean",
                "value": true
              }
            }
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 19,
              "end": 22
            },
            "posRange": {
              "start": {
                "line": 1,
                "character": 5
              },
              "end": {
                "line": 1,
                "character": 8
              }
            },
            "fullRange": {
              "start": 0,
              "end": 29
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 1,
                "character": 15
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
        "end": 29
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:attribute",
                  "children": [
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 2,
                        "end": 7
                      },
                      "value": "since"
                    },
                    {
                      "type": "mcdoc:type/literal",
                      "children": [
                        {
                          "type": "mcdoc:typed_number",
                          "children": [
                            {
                              "type": "float",
                              "range": {
                                "start": 8,
                                "end": 12
                              },
                              "value": 1.18
                            }
                          ],
                          "range": {
                            "start": 8,
                            "end": 12
                          }
                        }
                      ],
                      "range": {
                        "start": 8,
                        "end": 12
                      }
                    }
                  ],
                  "range": {
                    "start": 0,
                    "end": 14
                  }
                },
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
                  "value": "Foo",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Foo"
                    ]
                  }
                },
                {
                  "type": "mcdoc:type/literal",
                  "children": [
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 25,
                        "end": 29
                      },
                      "value": "true",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 25,
                    "end": 29
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 29
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 29
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
