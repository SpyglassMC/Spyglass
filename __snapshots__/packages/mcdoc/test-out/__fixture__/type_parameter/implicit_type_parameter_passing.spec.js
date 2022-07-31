exports['mcdoc __fixture__ type parameter/implicit type parameter passing 1'] = {
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
      "::test::Test1": {
        "data": {
          "typeDef": {
            "kind": "template",
            "child": {
              "kind": "struct",
              "fields": [
                {
                  "kind": "pair",
                  "key": "value",
                  "type": {
                    "kind": "reference",
                    "path": "::test::T"
                  }
                }
              ]
            },
            "typeParams": [
              {
                "path": "::test::T"
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
              "end": 36
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
        ],
        "reference": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 49,
              "end": 54
            },
            "posRange": {
              "start": {
                "line": 1,
                "character": 13
              },
              "end": {
                "line": 1,
                "character": 18
              }
            },
            "fullRange": {
              "start": 49,
              "end": 54
            },
            "fullPosRange": {
              "start": {
                "line": 1,
                "character": 13
              },
              "end": {
                "line": 1,
                "character": 18
              }
            },
            "contributor": "binder",
            "skipRenaming": false
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
                "key": "value",
                "type": {
                  "kind": "reference",
                  "path": "::test::T"
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
              "start": 16,
              "end": 22
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 16
              },
              "end": {
                "line": 0,
                "character": 22
              }
            },
            "contributor": "binder"
          }
        ],
        "members": {
          "value": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 25,
                  "end": 30
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 25
                  },
                  "end": {
                    "line": 0,
                    "character": 30
                  }
                },
                "fullRange": {
                  "start": 25,
                  "end": 34
                },
                "fullPosRange": {
                  "start": {
                    "line": 0,
                    "character": 25
                  },
                  "end": {
                    "line": 0,
                    "character": 34
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        }
      },
      "::test::Test2": {
        "data": {
          "typeDef": {
            "kind": "reference",
            "path": "::test::Test1"
          }
        },
        "desc": "",
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 41,
              "end": 46
            },
            "posRange": {
              "start": {
                "line": 1,
                "character": 5
              },
              "end": {
                "line": 1,
                "character": 10
              }
            },
            "fullRange": {
              "start": 36,
              "end": 56
            },
            "fullPosRange": {
              "start": {
                "line": 1,
                "character": 0
              },
              "end": {
                "line": 3,
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
              "start": 70,
              "end": 75
            },
            "posRange": {
              "start": {
                "line": 3,
                "character": 14
              },
              "end": {
                "line": 3,
                "character": 19
              }
            },
            "fullRange": {
              "start": 70,
              "end": 75
            },
            "fullPosRange": {
              "start": {
                "line": 3,
                "character": 14
              },
              "end": {
                "line": 3,
                "character": 19
              }
            },
            "contributor": "binder",
            "skipRenaming": false
          }
        ]
      },
      "::test::Result": {
        "data": {
          "typeDef": {
            "kind": "concrete",
            "child": {
              "kind": "reference",
              "path": "::test::Test2"
            },
            "typeArgs": [
              {
                "kind": "literal",
                "value": {
                  "kind": "boolean",
                  "value": true
                }
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
              "start": 61,
              "end": 67
            },
            "posRange": {
              "start": {
                "line": 3,
                "character": 5
              },
              "end": {
                "line": 3,
                "character": 11
              }
            },
            "fullRange": {
              "start": 56,
              "end": 81
            },
            "fullPosRange": {
              "start": {
                "line": 3,
                "character": 0
              },
              "end": {
                "line": 3,
                "character": 25
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
        "end": 81
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
                  "value": "Test1",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Test1"
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
                            "start": 11,
                            "end": 12
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
                        "start": 11,
                        "end": 12
                      }
                    }
                  ],
                  "range": {
                    "start": 10,
                    "end": 14
                  }
                },
                {
                  "type": "mcdoc:struct",
                  "children": [
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 16,
                        "end": 22
                      },
                      "value": "struct",
                      "colorTokenType": "keyword",
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::test::<anonymous 0>"
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
                                "start": 25,
                                "end": 30
                              },
                              "value": "value",
                              "symbol": {
                                "category": "mcdoc",
                                "path": [
                                  "::test::<anonymous 0>",
                                  "value"
                                ]
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
                                        "start": 32,
                                        "end": 33
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
                                    "start": 32,
                                    "end": 33
                                  }
                                }
                              ],
                              "range": {
                                "start": 32,
                                "end": 34
                              }
                            }
                          ],
                          "range": {
                            "start": 25,
                            "end": 34
                          }
                        }
                      ],
                      "range": {
                        "start": 23,
                        "end": 36
                      }
                    }
                  ],
                  "range": {
                    "start": 16,
                    "end": 36
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 36
              },
              "locals": {
                "mcdoc": {
                  "::test::T": {
                    "category": "mcdoc",
                    "identifier": "::test::T",
                    "path": [
                      "::test::T"
                    ],
                    "visibility": 0,
                    "declaration": [
                      {
                        "uri": "file:///test.mcdoc",
                        "range": {
                          "start": 11,
                          "end": 12
                        },
                        "posRange": {
                          "start": {
                            "line": 0,
                            "character": 11
                          },
                          "end": {
                            "line": 0,
                            "character": 12
                          }
                        },
                        "fullRange": {
                          "start": 11,
                          "end": 12
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 0,
                            "character": 11
                          },
                          "end": {
                            "line": 0,
                            "character": 12
                          }
                        },
                        "contributor": "binder"
                      }
                    ],
                    "reference": [
                      {
                        "uri": "file:///test.mcdoc",
                        "range": {
                          "start": 32,
                          "end": 33
                        },
                        "posRange": {
                          "start": {
                            "line": 0,
                            "character": 32
                          },
                          "end": {
                            "line": 0,
                            "character": 33
                          }
                        },
                        "fullRange": {
                          "start": 32,
                          "end": 33
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 0,
                            "character": 32
                          },
                          "end": {
                            "line": 0,
                            "character": 33
                          }
                        },
                        "contributor": "binder",
                        "skipRenaming": false
                      }
                    ]
                  }
                }
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:doc_comments",
                  "children": [],
                  "range": {
                    "start": 36,
                    "end": 36
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 36,
                    "end": 40
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 41,
                    "end": 46
                  },
                  "value": "Test2",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Test2"
                    ]
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
                            "start": 49,
                            "end": 54
                          },
                          "value": "Test1",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::Test1"
                            ]
                          }
                        }
                      ],
                      "range": {
                        "start": 49,
                        "end": 54
                      }
                    }
                  ],
                  "range": {
                    "start": 49,
                    "end": 56
                  }
                }
              ],
              "range": {
                "start": 36,
                "end": 56
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:doc_comments",
                  "children": [],
                  "range": {
                    "start": 56,
                    "end": 56
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 56,
                    "end": 60
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 61,
                    "end": 67
                  },
                  "value": "Result",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Result"
                    ]
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
                            "start": 70,
                            "end": 75
                          },
                          "value": "Test2",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::Test2"
                            ]
                          }
                        }
                      ],
                      "range": {
                        "start": 70,
                        "end": 75
                      }
                    },
                    {
                      "type": "mcdoc:type_arg_block",
                      "children": [
                        {
                          "type": "mcdoc:type/literal",
                          "children": [
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 76,
                                "end": 80
                              },
                              "value": "true",
                              "colorTokenType": "type"
                            }
                          ],
                          "range": {
                            "start": 76,
                            "end": 80
                          }
                        }
                      ],
                      "range": {
                        "start": 75,
                        "end": 81
                      }
                    }
                  ],
                  "range": {
                    "start": 70,
                    "end": 81
                  }
                }
              ],
              "range": {
                "start": 56,
                "end": 81
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 81
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
