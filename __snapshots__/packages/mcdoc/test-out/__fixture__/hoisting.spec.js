exports['mcdoc __fixture__ hoisting 1'] = {
  "global": {
    "mcdoc": {
      "::foo": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
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
        ]
      },
      "::foo::Foo": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "pair",
                "key": "bar",
                "type": {
                  "kind": "reference",
                  "path": "::foo::Bar"
                }
              }
            ]
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
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
              "end": 26
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 3,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::foo::Bar": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": []
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
            "range": {
              "start": 33,
              "end": 36
            },
            "posRange": {
              "start": {
                "line": 3,
                "character": 7
              },
              "end": {
                "line": 3,
                "character": 10
              }
            },
            "fullRange": {
              "start": 26,
              "end": 39
            },
            "fullPosRange": {
              "start": {
                "line": 3,
                "character": 0
              },
              "end": {
                "line": 3,
                "character": 13
              }
            },
            "contributor": "binder"
          }
        ]
      }
    }
  },
  "nodes": {
    "file:///foo.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 39
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
                      "::foo::Foo"
                    ]
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [
                    {
                      "type": "mcdoc:struct/field/pair",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 14,
                            "end": 17
                          },
                          "value": "bar"
                        },
                        {
                          "type": "mcdoc:type/reference",
                          "children": [
                            {
                              "type": "mcdoc:path",
                              "children": [
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 19,
                                    "end": 22
                                  },
                                  "value": "Bar"
                                }
                              ],
                              "range": {
                                "start": 19,
                                "end": 22
                              }
                            }
                          ],
                          "range": {
                            "start": 19,
                            "end": 22
                          }
                        }
                      ],
                      "range": {
                        "start": 14,
                        "end": 22
                      }
                    }
                  ],
                  "range": {
                    "start": 11,
                    "end": 26
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 26
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 26,
                    "end": 32
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 33,
                    "end": 36
                  },
                  "value": "Bar",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::Bar"
                    ]
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 37,
                    "end": 39
                  }
                }
              ],
              "range": {
                "start": 26,
                "end": 39
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 39
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
