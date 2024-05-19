exports['mcdoc __fixture__ enum/duplicated keys 1'] = {
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
      "::test::Test": {
        "data": {
          "typeDef": {
            "kind": "enum",
            "enumKind": "byte",
            "values": [
              {
                "identifier": "Naughty",
                "value": 42
              },
              {
                "identifier": "Naughty",
                "value": 91
              }
            ]
          }
        },
        "subcategory": "enum",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 12,
              "end": 16
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 12
              },
              "end": {
                "line": 0,
                "character": 16
              }
            },
            "fullRange": {
              "start": 0,
              "end": 52
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
        ],
        "members": {
          "Naughty": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 20,
                  "end": 27
                },
                "posRange": {
                  "start": {
                    "line": 1,
                    "character": 1
                  },
                  "end": {
                    "line": 1,
                    "character": 8
                  }
                },
                "fullRange": {
                  "start": 20,
                  "end": 33
                },
                "fullPosRange": {
                  "start": {
                    "line": 1,
                    "character": 1
                  },
                  "end": {
                    "line": 1,
                    "character": 14
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        }
      }
    }
  },
  "nodes": {
    "file:///test.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 52
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:enum",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "value": "enum",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 6,
                    "end": 10
                  },
                  "value": "byte",
                  "colorTokenType": "type"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 12,
                    "end": 16
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
                  "type": "mcdoc:enum/block",
                  "children": [
                    {
                      "type": "mcdoc:enum/field",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 20,
                            "end": 27
                          },
                          "value": "Naughty",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::Test",
                              "Naughty"
                            ]
                          }
                        },
                        {
                          "type": "mcdoc:typed_number",
                          "children": [
                            {
                              "type": "integer",
                              "range": {
                                "start": 30,
                                "end": 32
                              },
                              "value": 42
                            },
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 32,
                                "end": 33
                              },
                              "value": "b",
                              "colorTokenType": "keyword"
                            }
                          ],
                          "range": {
                            "start": 30,
                            "end": 33
                          }
                        }
                      ],
                      "range": {
                        "start": 20,
                        "end": 33
                      }
                    },
                    {
                      "type": "mcdoc:enum/field",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 36,
                            "end": 43
                          },
                          "value": "Naughty"
                        },
                        {
                          "type": "mcdoc:typed_number",
                          "children": [
                            {
                              "type": "integer",
                              "range": {
                                "start": 46,
                                "end": 48
                              },
                              "value": 91
                            },
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 48,
                                "end": 49
                              },
                              "value": "b",
                              "colorTokenType": "keyword"
                            }
                          ],
                          "range": {
                            "start": 46,
                            "end": 49
                          }
                        }
                      ],
                      "range": {
                        "start": 36,
                        "end": 49
                      }
                    }
                  ],
                  "range": {
                    "start": 17,
                    "end": 52
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 52
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 52
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": [
        {
          "range": {
            "start": 36,
            "end": 43
          },
          "message": "Duplicated declaration for “Naughty”",
          "severity": 2,
          "info": {
            "related": [
              {
                "location": {
                  "uri": "file:///test.mcdoc",
                  "range": {
                    "start": 20,
                    "end": 27
                  },
                  "posRange": {
                    "start": {
                      "line": 1,
                      "character": 1
                    },
                    "end": {
                      "line": 1,
                      "character": 8
                    }
                  },
                  "fullRange": {
                    "start": 20,
                    "end": 33
                  },
                  "fullPosRange": {
                    "start": {
                      "line": 1,
                      "character": 1
                    },
                    "end": {
                      "line": 1,
                      "character": 14
                    }
                  },
                  "contributor": "binder"
                },
                "message": "“Naughty” is already declared here"
              }
            ]
          }
        }
      ]
    }
  }
}
