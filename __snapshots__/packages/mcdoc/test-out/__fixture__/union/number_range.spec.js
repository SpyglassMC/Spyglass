exports['mcdoc __fixture__ union/number range 1'] = {
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
          "nextAnonymousIndex": 1
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
                "kind": "tuple",
                "items": [
                  {
                    "kind": "int"
                  },
                  {
                    "kind": "int"
                  }
                ]
              },
              {
                "kind": "struct",
                "fields": [
                  {
                    "kind": "pair",
                    "key": "min_inclusive",
                    "type": {
                      "kind": "int"
                    }
                  },
                  {
                    "kind": "pair",
                    "key": "max_inclusive",
                    "type": {
                      "kind": "int"
                    }
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
              "end": 96
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 7,
                "character": 1
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::test::<anonymous 0>": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "pair",
                "key": "min_inclusive",
                "type": {
                  "kind": "int"
                }
              },
              {
                "kind": "pair",
                "key": "max_inclusive",
                "type": {
                  "kind": "int"
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
              "start": 37,
              "end": 93
            },
            "posRange": {
              "start": {
                "line": 3,
                "character": 1
              },
              "end": {
                "line": 6,
                "character": 3
              }
            },
            "contributor": "binder"
          }
        ],
        "members": {
          "min_inclusive": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 48,
                  "end": 61
                },
                "posRange": {
                  "start": {
                    "line": 4,
                    "character": 2
                  },
                  "end": {
                    "line": 4,
                    "character": 15
                  }
                },
                "fullRange": {
                  "start": 48,
                  "end": 66
                },
                "fullPosRange": {
                  "start": {
                    "line": 4,
                    "character": 2
                  },
                  "end": {
                    "line": 4,
                    "character": 20
                  }
                },
                "contributor": "binder"
              }
            ]
          },
          "max_inclusive": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 70,
                  "end": 83
                },
                "posRange": {
                  "start": {
                    "line": 5,
                    "character": 2
                  },
                  "end": {
                    "line": 5,
                    "character": 15
                  }
                },
                "fullRange": {
                  "start": 70,
                  "end": 88
                },
                "fullPosRange": {
                  "start": {
                    "line": 5,
                    "character": 2
                  },
                  "end": {
                    "line": 5,
                    "character": 20
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
        "end": 96
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
                      "type": "mcdoc:type/numeric_type",
                      "children": [
                        {
                          "type": "mcdoc:literal",
                          "range": {
                            "start": 16,
                            "end": 19
                          },
                          "value": "int",
                          "colorTokenType": "type"
                        }
                      ],
                      "range": {
                        "start": 16,
                        "end": 20
                      }
                    },
                    {
                      "type": "mcdoc:type/tuple",
                      "children": [
                        {
                          "type": "mcdoc:type/numeric_type",
                          "children": [
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 24,
                                "end": 27
                              },
                              "value": "int",
                              "colorTokenType": "type"
                            }
                          ],
                          "range": {
                            "start": 24,
                            "end": 27
                          }
                        },
                        {
                          "type": "mcdoc:type/numeric_type",
                          "children": [
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 29,
                                "end": 32
                              },
                              "value": "int",
                              "colorTokenType": "type"
                            }
                          ],
                          "range": {
                            "start": 29,
                            "end": 32
                          }
                        }
                      ],
                      "range": {
                        "start": 23,
                        "end": 34
                      }
                    },
                    {
                      "type": "mcdoc:struct",
                      "children": [
                        {
                          "type": "mcdoc:literal",
                          "range": {
                            "start": 37,
                            "end": 43
                          },
                          "value": "struct",
                          "colorTokenType": "keyword"
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
                                    "start": 48,
                                    "end": 61
                                  },
                                  "value": "min_inclusive",
                                  "symbol": {
                                    "category": "mcdoc",
                                    "path": [
                                      "::test::<anonymous 0>",
                                      "min_inclusive"
                                    ]
                                  }
                                },
                                {
                                  "type": "mcdoc:type/numeric_type",
                                  "children": [
                                    {
                                      "type": "mcdoc:literal",
                                      "range": {
                                        "start": 63,
                                        "end": 66
                                      },
                                      "value": "int",
                                      "colorTokenType": "type"
                                    }
                                  ],
                                  "range": {
                                    "start": 63,
                                    "end": 66
                                  }
                                }
                              ],
                              "range": {
                                "start": 48,
                                "end": 66
                              }
                            },
                            {
                              "type": "mcdoc:struct/field/pair",
                              "children": [
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 70,
                                    "end": 83
                                  },
                                  "value": "max_inclusive",
                                  "symbol": {
                                    "category": "mcdoc",
                                    "path": [
                                      "::test::<anonymous 0>",
                                      "max_inclusive"
                                    ]
                                  }
                                },
                                {
                                  "type": "mcdoc:type/numeric_type",
                                  "children": [
                                    {
                                      "type": "mcdoc:literal",
                                      "range": {
                                        "start": 85,
                                        "end": 88
                                      },
                                      "value": "int",
                                      "colorTokenType": "type"
                                    }
                                  ],
                                  "range": {
                                    "start": 85,
                                    "end": 88
                                  }
                                }
                              ],
                              "range": {
                                "start": 70,
                                "end": 88
                              }
                            }
                          ],
                          "range": {
                            "start": 44,
                            "end": 93
                          }
                        }
                      ],
                      "range": {
                        "start": 37,
                        "end": 93
                      },
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::test::<anonymous 0>"
                        ]
                      }
                    }
                  ],
                  "range": {
                    "start": 13,
                    "end": 96
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 96
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 96
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
