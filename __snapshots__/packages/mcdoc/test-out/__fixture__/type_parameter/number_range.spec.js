exports['mcdoc __fixture__ type parameter/number range 1'] = {
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
      "::test::InclusiveRange": {
        "data": {
          "typeDef": {
            "kind": "union",
            "members": [
              {
                "kind": "reference",
                "path": "::test::T"
              },
              {
                "kind": "list",
                "item": {
                  "kind": "reference",
                  "path": "::test::T"
                },
                "lengthRange": {
                  "kind": 0,
                  "min": 2,
                  "max": 2
                }
              },
              {
                "kind": "struct",
                "fields": [
                  {
                    "kind": "pair",
                    "key": "min_inclusive",
                    "type": {
                      "kind": "reference",
                      "path": "::test::T"
                    }
                  },
                  {
                    "kind": "pair",
                    "key": "max_inclusive",
                    "type": {
                      "kind": "reference",
                      "path": "::test::T"
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
              "end": 19
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 5
              },
              "end": {
                "line": 0,
                "character": 19
              }
            },
            "fullRange": {
              "start": 0,
              "end": 101
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 9,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ],
        "members": {
          "T": {
            "declaration": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 20,
                  "end": 21
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 20
                  },
                  "end": {
                    "line": 0,
                    "character": 21
                  }
                },
                "fullRange": {
                  "start": 20,
                  "end": 21
                },
                "fullPosRange": {
                  "start": {
                    "line": 0,
                    "character": 20
                  },
                  "end": {
                    "line": 0,
                    "character": 21
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        },
        "reference": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 120,
              "end": 134
            },
            "posRange": {
              "start": {
                "line": 9,
                "character": 19
              },
              "end": {
                "line": 9,
                "character": 33
              }
            },
            "fullRange": {
              "start": 120,
              "end": 134
            },
            "fullPosRange": {
              "start": {
                "line": 9,
                "character": 19
              },
              "end": {
                "line": 9,
                "character": 33
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
                "key": "min_inclusive",
                "type": {
                  "kind": "reference",
                  "path": "::test::T"
                }
              },
              {
                "kind": "pair",
                "key": "max_inclusive",
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
              "start": 44,
              "end": 96
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
                  "start": 55,
                  "end": 68
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
                  "start": 55,
                  "end": 71
                },
                "fullPosRange": {
                  "start": {
                    "line": 4,
                    "character": 2
                  },
                  "end": {
                    "line": 4,
                    "character": 18
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
                  "start": 75,
                  "end": 88
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
                  "start": 75,
                  "end": 91
                },
                "fullPosRange": {
                  "start": {
                    "line": 5,
                    "character": 2
                  },
                  "end": {
                    "line": 5,
                    "character": 18
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        }
      },
      "::test::VarietyType": {
        "data": {
          "typeDef": {
            "kind": "reference",
            "path": "::test::InclusiveRange",
            "typeParameters": [
              {
                "kind": "int",
                "valueRange": {
                  "kind": 0,
                  "min": 1,
                  "max": 64
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
              "start": 106,
              "end": 117
            },
            "posRange": {
              "start": {
                "line": 9,
                "character": 5
              },
              "end": {
                "line": 9,
                "character": 16
              }
            },
            "fullRange": {
              "start": 101,
              "end": 147
            },
            "fullPosRange": {
              "start": {
                "line": 9,
                "character": 0
              },
              "end": {
                "line": 9,
                "character": 46
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
        "end": 147
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
                    "end": 19
                  },
                  "value": "InclusiveRange",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::InclusiveRange"
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
                            "start": 20,
                            "end": 21
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
                        "start": 20,
                        "end": 21
                      }
                    }
                  ],
                  "range": {
                    "start": 19,
                    "end": 23
                  }
                },
                {
                  "type": "mcdoc:type/union",
                  "children": [
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
                        "end": 30
                      }
                    },
                    {
                      "type": "mcdoc:type/list",
                      "children": [
                        {
                          "type": "mcdoc:type/reference",
                          "children": [
                            {
                              "type": "mcdoc:path",
                              "children": [
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 34,
                                    "end": 35
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
                                "start": 34,
                                "end": 35
                              }
                            }
                          ],
                          "range": {
                            "start": 34,
                            "end": 35
                          }
                        },
                        {
                          "type": "mcdoc:int_range",
                          "children": [
                            {
                              "type": "integer",
                              "range": {
                                "start": 39,
                                "end": 40
                              },
                              "value": 2
                            }
                          ],
                          "range": {
                            "start": 39,
                            "end": 40
                          }
                        }
                      ],
                      "range": {
                        "start": 33,
                        "end": 41
                      }
                    },
                    {
                      "type": "mcdoc:struct",
                      "children": [
                        {
                          "type": "mcdoc:literal",
                          "range": {
                            "start": 44,
                            "end": 50
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
                                    "start": 55,
                                    "end": 68
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
                                  "type": "mcdoc:type/reference",
                                  "children": [
                                    {
                                      "type": "mcdoc:path",
                                      "children": [
                                        {
                                          "type": "mcdoc:identifier",
                                          "range": {
                                            "start": 70,
                                            "end": 71
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
                                        "start": 70,
                                        "end": 71
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 70,
                                    "end": 71
                                  }
                                }
                              ],
                              "range": {
                                "start": 55,
                                "end": 71
                              }
                            },
                            {
                              "type": "mcdoc:struct/field/pair",
                              "children": [
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 75,
                                    "end": 88
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
                                  "type": "mcdoc:type/reference",
                                  "children": [
                                    {
                                      "type": "mcdoc:path",
                                      "children": [
                                        {
                                          "type": "mcdoc:identifier",
                                          "range": {
                                            "start": 90,
                                            "end": 91
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
                                        "start": 90,
                                        "end": 91
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 90,
                                    "end": 91
                                  }
                                }
                              ],
                              "range": {
                                "start": 75,
                                "end": 91
                              }
                            }
                          ],
                          "range": {
                            "start": 51,
                            "end": 96
                          }
                        }
                      ],
                      "range": {
                        "start": 44,
                        "end": 96
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
                    "start": 25,
                    "end": 101
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 101
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
                          "start": 20,
                          "end": 21
                        },
                        "posRange": {
                          "start": {
                            "line": 0,
                            "character": 20
                          },
                          "end": {
                            "line": 0,
                            "character": 21
                          }
                        },
                        "fullRange": {
                          "start": 20,
                          "end": 21
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 0,
                            "character": 20
                          },
                          "end": {
                            "line": 0,
                            "character": 21
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
                            "line": 1,
                            "character": 1
                          },
                          "end": {
                            "line": 1,
                            "character": 2
                          }
                        },
                        "fullRange": {
                          "start": 28,
                          "end": 29
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 1,
                            "character": 1
                          },
                          "end": {
                            "line": 1,
                            "character": 2
                          }
                        },
                        "contributor": "binder",
                        "skipRenaming": false
                      },
                      {
                        "uri": "file:///test.mcdoc",
                        "range": {
                          "start": 34,
                          "end": 35
                        },
                        "posRange": {
                          "start": {
                            "line": 2,
                            "character": 2
                          },
                          "end": {
                            "line": 2,
                            "character": 3
                          }
                        },
                        "fullRange": {
                          "start": 34,
                          "end": 35
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 2,
                            "character": 2
                          },
                          "end": {
                            "line": 2,
                            "character": 3
                          }
                        },
                        "contributor": "binder",
                        "skipRenaming": false
                      },
                      {
                        "uri": "file:///test.mcdoc",
                        "range": {
                          "start": 70,
                          "end": 71
                        },
                        "posRange": {
                          "start": {
                            "line": 4,
                            "character": 17
                          },
                          "end": {
                            "line": 4,
                            "character": 18
                          }
                        },
                        "fullRange": {
                          "start": 70,
                          "end": 71
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 4,
                            "character": 17
                          },
                          "end": {
                            "line": 4,
                            "character": 18
                          }
                        },
                        "contributor": "binder",
                        "skipRenaming": false
                      },
                      {
                        "uri": "file:///test.mcdoc",
                        "range": {
                          "start": 90,
                          "end": 91
                        },
                        "posRange": {
                          "start": {
                            "line": 5,
                            "character": 17
                          },
                          "end": {
                            "line": 5,
                            "character": 18
                          }
                        },
                        "fullRange": {
                          "start": 90,
                          "end": 91
                        },
                        "fullPosRange": {
                          "start": {
                            "line": 5,
                            "character": 17
                          },
                          "end": {
                            "line": 5,
                            "character": 18
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
                    "start": 101,
                    "end": 101
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 101,
                    "end": 105
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 106,
                    "end": 117
                  },
                  "value": "VarietyType",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::VarietyType"
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
                            "start": 120,
                            "end": 134
                          },
                          "value": "InclusiveRange",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::InclusiveRange"
                            ]
                          }
                        }
                      ],
                      "range": {
                        "start": 120,
                        "end": 134
                      }
                    },
                    {
                      "type": "mcdoc:type/numeric_type",
                      "children": [
                        {
                          "type": "mcdoc:literal",
                          "range": {
                            "start": 135,
                            "end": 138
                          },
                          "value": "int",
                          "colorTokenType": "type"
                        },
                        {
                          "type": "mcdoc:int_range",
                          "children": [
                            {
                              "type": "integer",
                              "range": {
                                "start": 141,
                                "end": 142
                              },
                              "value": 1
                            },
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 142,
                                "end": 144
                              },
                              "value": ".."
                            },
                            {
                              "type": "integer",
                              "range": {
                                "start": 144,
                                "end": 146
                              },
                              "value": 64
                            }
                          ],
                          "range": {
                            "start": 141,
                            "end": 146
                          }
                        }
                      ],
                      "range": {
                        "start": 135,
                        "end": 146
                      }
                    }
                  ],
                  "range": {
                    "start": 120,
                    "end": 147
                  }
                }
              ],
              "range": {
                "start": 101,
                "end": 147
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 147
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
