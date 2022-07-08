exports['mcdoc __fixture__ struct/duplicated key 1'] = {
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
      "::test::DuplicatedKey": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "pair",
                "key": "naughty",
                "type": {
                  "kind": "boolean"
                }
              },
              {
                "kind": "pair",
                "key": "naughty",
                "type": {
                  "kind": "string"
                }
              }
            ]
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 7,
              "end": 20
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 7
              },
              "end": {
                "line": 0,
                "character": 20
              }
            },
            "fullRange": {
              "start": 0,
              "end": 61
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
          "naughty": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 24,
                  "end": 31
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
                  "start": 24,
                  "end": 40
                },
                "fullPosRange": {
                  "start": {
                    "line": 1,
                    "character": 1
                  },
                  "end": {
                    "line": 1,
                    "character": 17
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
        "end": 61
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
                    "end": 20
                  },
                  "value": "DuplicatedKey",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::DuplicatedKey"
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
                            "start": 24,
                            "end": 31
                          },
                          "value": "naughty",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::DuplicatedKey",
                              "naughty"
                            ]
                          }
                        },
                        {
                          "type": "mcdoc:type/boolean",
                          "children": [
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 33,
                                "end": 40
                              },
                              "value": "boolean",
                              "colorTokenType": "type"
                            }
                          ],
                          "range": {
                            "start": 33,
                            "end": 40
                          }
                        }
                      ],
                      "range": {
                        "start": 24,
                        "end": 40
                      }
                    },
                    {
                      "type": "mcdoc:struct/field/pair",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 43,
                            "end": 50
                          },
                          "value": "naughty"
                        },
                        {
                          "type": "mcdoc:type/string",
                          "children": [
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 52,
                                "end": 58
                              },
                              "value": "string",
                              "colorTokenType": "type"
                            }
                          ],
                          "range": {
                            "start": 52,
                            "end": 58
                          }
                        }
                      ],
                      "range": {
                        "start": 43,
                        "end": 58
                      }
                    }
                  ],
                  "range": {
                    "start": 21,
                    "end": 61
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 61
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 61
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": [
        {
          "range": {
            "start": 43,
            "end": 50
          },
          "message": "Duplicated declaration for “naughty”",
          "severity": 2,
          "info": {
            "related": [
              {
                "location": {
                  "uri": "file:///test.mcdoc",
                  "range": {
                    "start": 24,
                    "end": 31
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
                    "start": 24,
                    "end": 40
                  },
                  "fullPosRange": {
                    "start": {
                      "line": 1,
                      "character": 1
                    },
                    "end": {
                      "line": 1,
                      "character": 17
                    }
                  },
                  "contributor": "binder"
                },
                "message": "“naughty” is already declared here"
              }
            ]
          }
        }
      ]
    }
  }
}
