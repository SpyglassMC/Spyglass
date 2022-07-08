exports['mcdoc __fixture__ union/nested 1'] = {
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
        ]
      },
      "::test::Union": {
        "data": {
          "typeDef": {
            "kind": "union",
            "members": [
              {
                "kind": "string"
              },
              {
                "kind": "union",
                "members": [
                  {
                    "kind": "boolean"
                  },
                  {
                    "kind": "union",
                    "members": [
                      {
                        "kind": "union",
                        "members": [
                          {
                            "kind": "byte"
                          },
                          {
                            "kind": "int"
                          }
                        ]
                      },
                      {
                        "kind": "short"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        },
        "desc": "",
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
              "end": 64
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 3,
                "character": 1
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
        "end": 64
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:doc_comments",
                  "children": [],
                  "range": {
                    "start": 0,
                    "end": 0
                  }
                },
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
                      "type": "mcdoc:type/string",
                      "children": [
                        {
                          "type": "mcdoc:literal",
                          "range": {
                            "start": 16,
                            "end": 22
                          },
                          "value": "string",
                          "colorTokenType": "type"
                        }
                      ],
                      "range": {
                        "start": 16,
                        "end": 23
                      }
                    },
                    {
                      "type": "mcdoc:type/union",
                      "children": [
                        {
                          "type": "mcdoc:type/boolean",
                          "children": [
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 27,
                                "end": 34
                              },
                              "value": "boolean",
                              "colorTokenType": "type"
                            }
                          ],
                          "range": {
                            "start": 27,
                            "end": 35
                          }
                        },
                        {
                          "type": "mcdoc:type/union",
                          "children": [
                            {
                              "type": "mcdoc:type/union",
                              "children": [
                                {
                                  "type": "mcdoc:type/numeric_type",
                                  "children": [
                                    {
                                      "type": "mcdoc:literal",
                                      "range": {
                                        "start": 39,
                                        "end": 43
                                      },
                                      "value": "byte",
                                      "colorTokenType": "type"
                                    }
                                  ],
                                  "range": {
                                    "start": 39,
                                    "end": 44
                                  }
                                },
                                {
                                  "type": "mcdoc:type/numeric_type",
                                  "children": [
                                    {
                                      "type": "mcdoc:literal",
                                      "range": {
                                        "start": 46,
                                        "end": 49
                                      },
                                      "value": "int",
                                      "colorTokenType": "type"
                                    }
                                  ],
                                  "range": {
                                    "start": 46,
                                    "end": 49
                                  }
                                }
                              ],
                              "range": {
                                "start": 38,
                                "end": 51
                              }
                            },
                            {
                              "type": "mcdoc:type/numeric_type",
                              "children": [
                                {
                                  "type": "mcdoc:literal",
                                  "range": {
                                    "start": 53,
                                    "end": 58
                                  },
                                  "value": "short",
                                  "colorTokenType": "type"
                                }
                              ],
                              "range": {
                                "start": 53,
                                "end": 58
                              }
                            }
                          ],
                          "range": {
                            "start": 37,
                            "end": 59
                          }
                        }
                      ],
                      "range": {
                        "start": 26,
                        "end": 61
                      }
                    }
                  ],
                  "range": {
                    "start": 13,
                    "end": 64
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 64
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 64
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
