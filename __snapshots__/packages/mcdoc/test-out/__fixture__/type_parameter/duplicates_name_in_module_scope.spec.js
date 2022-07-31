exports['mcdoc __fixture__ type parameter/duplicates name in module scope 1'] = {
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
      "::test::T": {
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
              "end": 8
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 7
              },
              "end": {
                "line": 0,
                "character": 8
              }
            },
            "fullRange": {
              "start": 0,
              "end": 13
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 2,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ],
        "reference": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 28,
              "end": 29
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 15
              },
              "end": {
                "line": 2,
                "character": 16
              }
            },
            "fullRange": {
              "start": 28,
              "end": 29
            },
            "fullPosRange": {
              "start": {
                "line": 2,
                "character": 15
              },
              "end": {
                "line": 2,
                "character": 16
              }
            },
            "contributor": "binder",
            "skipRenaming": false
          }
        ]
      },
      "::test::Test": {
        "data": {
          "typeDef": {
            "kind": "template",
            "child": {
              "kind": "reference",
              "path": "::test::T"
            },
            "typeParams": [
              {
                "path": "::test::T"
              }
            ]
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 18,
              "end": 22
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 5
              },
              "end": {
                "line": 2,
                "character": 9
              }
            },
            "fullRange": {
              "start": 13,
              "end": 29
            },
            "fullPosRange": {
              "start": {
                "line": 2,
                "character": 0
              },
              "end": {
                "line": 2,
                "character": 16
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
                    "end": 8
                  },
                  "value": "T",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::T"
                    ]
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 9,
                    "end": 11
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 13
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 13,
                    "end": 17
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 18,
                    "end": 22
                  },
                  "value": "Test",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Test"
                    ]
                  }
                },
                {
                  "type": "mcdoc:type_param_block",
                  "children": [
                    {
                      "type": "mcdoc:type_param",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 23,
                            "end": 24
                          },
                          "value": "T"
                        }
                      ],
                      "range": {
                        "start": 23,
                        "end": 24
                      }
                    }
                  ],
                  "range": {
                    "start": 22,
                    "end": 26
                  }
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
                            "start": 28,
                            "end": 29
                          },
                          "value": "T",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::T"
                            ]
                          }
                        }
                      ],
                      "range": {
                        "start": 28,
                        "end": 29
                      }
                    }
                  ],
                  "range": {
                    "start": 28,
                    "end": 29
                  }
                }
              ],
              "range": {
                "start": 13,
                "end": 29
              },
              "locals": {}
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
      "binderErrors": [
        {
          "range": {
            "start": 23,
            "end": 24
          },
          "message": "Duplicated declaration for “::test::T”",
          "severity": 2,
          "info": {
            "related": [
              {
                "location": {
                  "uri": "file:///test.mcdoc",
                  "range": {
                    "start": 7,
                    "end": 8
                  },
                  "posRange": {
                    "start": {
                      "line": 0,
                      "character": 7
                    },
                    "end": {
                      "line": 0,
                      "character": 8
                    }
                  },
                  "fullRange": {
                    "start": 0,
                    "end": 13
                  },
                  "fullPosRange": {
                    "start": {
                      "line": 0,
                      "character": 0
                    },
                    "end": {
                      "line": 2,
                      "character": 0
                    }
                  },
                  "contributor": "binder"
                },
                "message": "“::test::T” is already declared here"
              }
            ]
          }
        }
      ]
    }
  }
}
