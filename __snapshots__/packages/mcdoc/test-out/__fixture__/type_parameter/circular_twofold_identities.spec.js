exports['mcdoc __fixture__ type parameter/circular twofold identities 1'] = {
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
      "::test::Test1": {
        "data": {
          "typeDef": {
            "kind": "reference",
            "path": "::test::Test2",
            "typeParameters": [
              {
                "kind": "reference",
                "path": "::test::T"
              },
              {
                "kind": "reference",
                "path": "::test::U"
              }
            ]
          },
          "typeParams": [
            {
              "identifier": "T"
            },
            {
              "identifier": "U"
            }
          ]
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
              "end": 31
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
              "start": 50,
              "end": 55
            },
            "posRange": {
              "start": {
                "line": 1,
                "character": 19
              },
              "end": {
                "line": 1,
                "character": 24
              }
            },
            "fullRange": {
              "start": 50,
              "end": 55
            },
            "fullPosRange": {
              "start": {
                "line": 1,
                "character": 19
              },
              "end": {
                "line": 1,
                "character": 24
              }
            },
            "contributor": "binder",
            "skipRenaming": false
          }
        ]
      },
      "::test::Test2": {
        "data": {
          "typeDef": {
            "kind": "reference",
            "path": "::test::Test1",
            "typeParameters": [
              {
                "kind": "reference",
                "path": "::test::T"
              },
              {
                "kind": "reference",
                "path": "::test::U"
              }
            ]
          },
          "typeParams": [
            {
              "identifier": "T"
            },
            {
              "identifier": "U"
            }
          ]
        },
        "desc": "",
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 36,
              "end": 41
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
              "start": 31,
              "end": 61
            },
            "fullPosRange": {
              "start": {
                "line": 1,
                "character": 0
              },
              "end": {
                "line": 1,
                "character": 30
              }
            },
            "contributor": "binder"
          }
        ],
        "reference": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 19,
              "end": 24
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 19
              },
              "end": {
                "line": 0,
                "character": 24
              }
            },
            "fullRange": {
              "start": 19,
              "end": 24
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 19
              },
              "end": {
                "line": 0,
                "character": 24
              }
            },
            "contributor": "binder",
            "skipRenaming": false
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
        "end": 61
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
                    },
                    {
                      "type": "mcdoc:type_param",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 14,
                            "end": 15
                          },
                          "value": "U",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::U"
                            ]
                          }
                        }
                      ],
                      "range": {
                        "start": 14,
                        "end": 15
                      }
                    }
                  ],
                  "range": {
                    "start": 10,
                    "end": 17
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
                            "start": 19,
                            "end": 24
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
                        "start": 19,
                        "end": 24
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
                                "start": 25,
                                "end": 26
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
                            "start": 25,
                            "end": 26
                          }
                        }
                      ],
                      "range": {
                        "start": 25,
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
                              "value": "U",
                              "symbol": {
                                "category": "mcdoc",
                                "path": [
                                  "::test::U"
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
                    "start": 19,
                    "end": 31
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 31
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
                          "start": 25,
                          "end": 26
                        },
                        "posRange": {
                          "start": {
                            "line": 0,
                            "character": 25
                          },
                          "end": {
                            "line": 0,
                            "character": 26
                          }
                        },
                        "fullRange": {
                          "start": 25,
                          "end": 26
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 0,
                            "character": 25
                          },
                          "end": {
                            "line": 0,
                            "character": 26
                          }
                        },
                        "contributor": "binder",
                        "skipRenaming": false
                      }
                    ]
                  },
                  "::test::U": {
                    "category": "mcdoc",
                    "identifier": "::test::U",
                    "path": [
                      "::test::U"
                    ],
                    "visibility": 0,
                    "declaration": [
                      {
                        "uri": "file:///test.mcdoc",
                        "range": {
                          "start": 14,
                          "end": 15
                        },
                        "posRange": {
                          "start": {
                            "line": 0,
                            "character": 14
                          },
                          "end": {
                            "line": 0,
                            "character": 15
                          }
                        },
                        "fullRange": {
                          "start": 14,
                          "end": 15
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 0,
                            "character": 14
                          },
                          "end": {
                            "line": 0,
                            "character": 15
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
                            "line": 0,
                            "character": 28
                          },
                          "end": {
                            "line": 0,
                            "character": 29
                          }
                        },
                        "fullRange": {
                          "start": 28,
                          "end": 29
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 0,
                            "character": 28
                          },
                          "end": {
                            "line": 0,
                            "character": 29
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
                    "start": 31,
                    "end": 31
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 31,
                    "end": 35
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 36,
                    "end": 41
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
                  "type": "mcdoc:type_param_block",
                  "children": [
                    {
                      "type": "mcdoc:type_param",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 42,
                            "end": 43
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
                        "start": 42,
                        "end": 43
                      }
                    },
                    {
                      "type": "mcdoc:type_param",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 45,
                            "end": 46
                          },
                          "value": "U",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::U"
                            ]
                          }
                        }
                      ],
                      "range": {
                        "start": 45,
                        "end": 46
                      }
                    }
                  ],
                  "range": {
                    "start": 41,
                    "end": 48
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
                            "start": 50,
                            "end": 55
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
                        "start": 50,
                        "end": 55
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
                                "start": 56,
                                "end": 57
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
                            "start": 56,
                            "end": 57
                          }
                        }
                      ],
                      "range": {
                        "start": 56,
                        "end": 57
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
                                "start": 59,
                                "end": 60
                              },
                              "value": "U",
                              "symbol": {
                                "category": "mcdoc",
                                "path": [
                                  "::test::U"
                                ]
                              }
                            }
                          ],
                          "range": {
                            "start": 59,
                            "end": 60
                          }
                        }
                      ],
                      "range": {
                        "start": 59,
                        "end": 60
                      }
                    }
                  ],
                  "range": {
                    "start": 50,
                    "end": 61
                  }
                }
              ],
              "range": {
                "start": 31,
                "end": 61
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
                          "start": 42,
                          "end": 43
                        },
                        "posRange": {
                          "start": {
                            "line": 1,
                            "character": 11
                          },
                          "end": {
                            "line": 1,
                            "character": 12
                          }
                        },
                        "fullRange": {
                          "start": 42,
                          "end": 43
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 1,
                            "character": 11
                          },
                          "end": {
                            "line": 1,
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
                          "start": 56,
                          "end": 57
                        },
                        "posRange": {
                          "start": {
                            "line": 1,
                            "character": 25
                          },
                          "end": {
                            "line": 1,
                            "character": 26
                          }
                        },
                        "fullRange": {
                          "start": 56,
                          "end": 57
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 1,
                            "character": 25
                          },
                          "end": {
                            "line": 1,
                            "character": 26
                          }
                        },
                        "contributor": "binder",
                        "skipRenaming": false
                      }
                    ]
                  },
                  "::test::U": {
                    "category": "mcdoc",
                    "identifier": "::test::U",
                    "path": [
                      "::test::U"
                    ],
                    "visibility": 0,
                    "declaration": [
                      {
                        "uri": "file:///test.mcdoc",
                        "range": {
                          "start": 45,
                          "end": 46
                        },
                        "posRange": {
                          "start": {
                            "line": 1,
                            "character": 14
                          },
                          "end": {
                            "line": 1,
                            "character": 15
                          }
                        },
                        "fullRange": {
                          "start": 45,
                          "end": 46
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 1,
                            "character": 14
                          },
                          "end": {
                            "line": 1,
                            "character": 15
                          }
                        },
                        "contributor": "binder"
                      }
                    ],
                    "reference": [
                      {
                        "uri": "file:///test.mcdoc",
                        "range": {
                          "start": 59,
                          "end": 60
                        },
                        "posRange": {
                          "start": {
                            "line": 1,
                            "character": 28
                          },
                          "end": {
                            "line": 1,
                            "character": 29
                          }
                        },
                        "fullRange": {
                          "start": 59,
                          "end": 60
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 1,
                            "character": 28
                          },
                          "end": {
                            "line": 1,
                            "character": 29
                          }
                        },
                        "contributor": "binder",
                        "skipRenaming": false
                      }
                    ]
                  }
                }
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
      "binderErrors": []
    }
  }
}
