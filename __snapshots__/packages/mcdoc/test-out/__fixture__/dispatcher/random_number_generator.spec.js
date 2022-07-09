exports['mcdoc __fixture__ dispatcher/random number generator 1'] = {
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
          "nextAnonymousIndex": 2
        }
      },
      "::test::<anonymous 0>": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "pair",
                "key": "min",
                "type": {
                  "kind": "int"
                },
                "optional": true
              },
              {
                "kind": "pair",
                "key": "max",
                "type": {
                  "kind": "int"
                },
                "optional": true
              }
            ]
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 41,
              "end": 77
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 41
              },
              "end": {
                "line": 5,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ],
        "members": {
          "min": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 51,
                  "end": 54
                },
                "posRange": {
                  "start": {
                    "line": 1,
                    "character": 1
                  },
                  "end": {
                    "line": 1,
                    "character": 4
                  }
                },
                "fullRange": {
                  "start": 51,
                  "end": 60
                },
                "fullPosRange": {
                  "start": {
                    "line": 1,
                    "character": 1
                  },
                  "end": {
                    "line": 1,
                    "character": 10
                  }
                },
                "contributor": "binder"
              }
            ]
          },
          "max": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 63,
                  "end": 66
                },
                "posRange": {
                  "start": {
                    "line": 2,
                    "character": 1
                  },
                  "end": {
                    "line": 2,
                    "character": 4
                  }
                },
                "fullRange": {
                  "start": 63,
                  "end": 72
                },
                "fullPosRange": {
                  "start": {
                    "line": 2,
                    "character": 1
                  },
                  "end": {
                    "line": 2,
                    "character": 10
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        }
      },
      "::test::<anonymous 1>": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "pair",
                "key": "n",
                "type": {
                  "kind": "int",
                  "valueRange": {
                    "kind": 0,
                    "min": 0
                  }
                }
              },
              {
                "kind": "pair",
                "key": "p",
                "type": {
                  "kind": "float",
                  "valueRange": {
                    "kind": 0,
                    "min": 0,
                    "max": 1
                  }
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
              "start": 127,
              "end": 172
            },
            "posRange": {
              "start": {
                "line": 6,
                "character": 36
              },
              "end": {
                "line": 11,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ],
        "members": {
          "n": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 137,
                  "end": 138
                },
                "posRange": {
                  "start": {
                    "line": 7,
                    "character": 1
                  },
                  "end": {
                    "line": 7,
                    "character": 2
                  }
                },
                "fullRange": {
                  "start": 137,
                  "end": 149
                },
                "fullPosRange": {
                  "start": {
                    "line": 7,
                    "character": 1
                  },
                  "end": {
                    "line": 7,
                    "character": 13
                  }
                },
                "contributor": "binder"
              }
            ]
          },
          "p": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 152,
                  "end": 153
                },
                "posRange": {
                  "start": {
                    "line": 8,
                    "character": 1
                  },
                  "end": {
                    "line": 8,
                    "character": 2
                  }
                },
                "fullRange": {
                  "start": 152,
                  "end": 167
                },
                "fullPosRange": {
                  "start": {
                    "line": 8,
                    "character": 1
                  },
                  "end": {
                    "line": 8,
                    "character": 16
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        }
      },
      "::test::RNG": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "pair",
                "key": "type",
                "type": {
                  "kind": "union",
                  "members": [
                    {
                      "kind": "literal",
                      "value": {
                        "kind": "string",
                        "value": "uniform"
                      }
                    },
                    {
                      "kind": "literal",
                      "value": {
                        "kind": "string",
                        "value": "binomial"
                      }
                    }
                  ]
                },
                "optional": true
              },
              {
                "kind": "spread",
                "type": {
                  "kind": "dispatcher",
                  "index": [
                    {
                      "kind": "dynamic",
                      "accessor": [
                        "type"
                      ]
                    }
                  ],
                  "registry": "minecraft:rng"
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
              "start": 212,
              "end": 215
            },
            "posRange": {
              "start": {
                "line": 11,
                "character": 40
              },
              "end": {
                "line": 11,
                "character": 43
              }
            },
            "fullRange": {
              "start": 205,
              "end": 280
            },
            "fullPosRange": {
              "start": {
                "line": 11,
                "character": 33
              },
              "end": {
                "line": 14,
                "character": 1
              }
            },
            "contributor": "binder"
          }
        ],
        "members": {
          "type": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 219,
                  "end": 223
                },
                "posRange": {
                  "start": {
                    "line": 12,
                    "character": 1
                  },
                  "end": {
                    "line": 12,
                    "character": 5
                  }
                },
                "fullRange": {
                  "start": 219,
                  "end": 250
                },
                "fullPosRange": {
                  "start": {
                    "line": 12,
                    "character": 1
                  },
                  "end": {
                    "line": 12,
                    "character": 32
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        }
      }
    },
    "mcdoc/dispatcher": {
      "minecraft:rng": {
        "reference": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 9,
              "end": 22
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 9
              },
              "end": {
                "line": 0,
                "character": 22
              }
            },
            "fullRange": {
              "start": 0,
              "end": 77
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 5,
                "character": 0
              }
            },
            "contributor": "binder"
          },
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 100,
              "end": 113
            },
            "posRange": {
              "start": {
                "line": 6,
                "character": 9
              },
              "end": {
                "line": 6,
                "character": 22
              }
            },
            "fullRange": {
              "start": 77,
              "end": 172
            },
            "fullPosRange": {
              "start": {
                "line": 5,
                "character": 0
              },
              "end": {
                "line": 11,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ],
        "members": {
          "uniform": {
            "data": {
              "typeDef": {
                "kind": "struct",
                "fields": [
                  {
                    "kind": "pair",
                    "key": "min",
                    "type": {
                      "kind": "int"
                    },
                    "optional": true
                  },
                  {
                    "kind": "pair",
                    "key": "max",
                    "type": {
                      "kind": "int"
                    },
                    "optional": true
                  }
                ]
              }
            },
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 23,
                  "end": 30
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 23
                  },
                  "end": {
                    "line": 0,
                    "character": 30
                  }
                },
                "fullRange": {
                  "start": 0,
                  "end": 77
                },
                "fullPosRange": {
                  "start": {
                    "line": 0,
                    "character": 0
                  },
                  "end": {
                    "line": 5,
                    "character": 0
                  }
                },
                "contributor": "binder"
              }
            ]
          },
          "%none": {
            "data": {
              "typeDef": {
                "kind": "struct",
                "fields": [
                  {
                    "kind": "pair",
                    "key": "min",
                    "type": {
                      "kind": "int"
                    },
                    "optional": true
                  },
                  {
                    "kind": "pair",
                    "key": "max",
                    "type": {
                      "kind": "int"
                    },
                    "optional": true
                  }
                ]
              }
            },
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 31,
                  "end": 36
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 31
                  },
                  "end": {
                    "line": 0,
                    "character": 36
                  }
                },
                "fullRange": {
                  "start": 0,
                  "end": 77
                },
                "fullPosRange": {
                  "start": {
                    "line": 0,
                    "character": 0
                  },
                  "end": {
                    "line": 5,
                    "character": 0
                  }
                },
                "contributor": "binder"
              }
            ]
          },
          "binomial": {
            "data": {
              "attributes": [
                {
                  "name": "since",
                  "value": {
                    "kind": "literal",
                    "value": {
                      "kind": "number",
                      "value": 1.18
                    }
                  }
                }
              ],
              "typeDef": {
                "kind": "struct",
                "fields": [
                  {
                    "kind": "pair",
                    "key": "n",
                    "type": {
                      "kind": "int",
                      "valueRange": {
                        "kind": 0,
                        "min": 0
                      }
                    }
                  },
                  {
                    "kind": "pair",
                    "key": "p",
                    "type": {
                      "kind": "float",
                      "valueRange": {
                        "kind": 0,
                        "min": 0,
                        "max": 1
                      }
                    }
                  }
                ]
              }
            },
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 114,
                  "end": 122
                },
                "posRange": {
                  "start": {
                    "line": 6,
                    "character": 23
                  },
                  "end": {
                    "line": 6,
                    "character": 31
                  }
                },
                "fullRange": {
                  "start": 77,
                  "end": 172
                },
                "fullPosRange": {
                  "start": {
                    "line": 5,
                    "character": 0
                  },
                  "end": {
                    "line": 11,
                    "character": 0
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        }
      },
      "spyglassmc:meta": {
        "reference": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 181,
              "end": 196
            },
            "posRange": {
              "start": {
                "line": 11,
                "character": 9
              },
              "end": {
                "line": 11,
                "character": 24
              }
            },
            "fullRange": {
              "start": 172,
              "end": 280
            },
            "fullPosRange": {
              "start": {
                "line": 11,
                "character": 0
              },
              "end": {
                "line": 14,
                "character": 1
              }
            },
            "contributor": "binder"
          }
        ],
        "members": {
          "rng": {
            "data": {
              "typeDef": {
                "kind": "struct",
                "fields": [
                  {
                    "kind": "pair",
                    "key": "type",
                    "type": {
                      "kind": "union",
                      "members": [
                        {
                          "kind": "literal",
                          "value": {
                            "kind": "string",
                            "value": "uniform"
                          }
                        },
                        {
                          "kind": "literal",
                          "value": {
                            "kind": "string",
                            "value": "binomial"
                          }
                        }
                      ]
                    },
                    "optional": true
                  },
                  {
                    "kind": "spread",
                    "type": {
                      "kind": "dispatcher",
                      "index": [
                        {
                          "kind": "dynamic",
                          "accessor": [
                            "type"
                          ]
                        }
                      ],
                      "registry": "minecraft:rng"
                    }
                  }
                ]
              }
            },
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 197,
                  "end": 200
                },
                "posRange": {
                  "start": {
                    "line": 11,
                    "character": 25
                  },
                  "end": {
                    "line": 11,
                    "character": 28
                  }
                },
                "fullRange": {
                  "start": 172,
                  "end": 280
                },
                "fullPosRange": {
                  "start": {
                    "line": 11,
                    "character": 0
                  },
                  "end": {
                    "line": 14,
                    "character": 1
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
        "end": 280
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:dispatch_statement",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "value": "dispatch",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "resource_location",
                  "range": {
                    "start": 9,
                    "end": 22
                  },
                  "namespace": "minecraft",
                  "path": [
                    "rng"
                  ],
                  "symbol": {
                    "category": "mcdoc/dispatcher",
                    "path": [
                      "minecraft:rng"
                    ]
                  }
                },
                {
                  "type": "mcdoc:index_body",
                  "children": [
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 23,
                        "end": 30
                      },
                      "value": "uniform",
                      "symbol": {
                        "category": "mcdoc/dispatcher",
                        "path": [
                          "minecraft:rng",
                          "uniform"
                        ]
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 31,
                        "end": 36
                      },
                      "value": "%none",
                      "symbol": {
                        "category": "mcdoc/dispatcher",
                        "path": [
                          "minecraft:rng",
                          "%none"
                        ]
                      }
                    }
                  ],
                  "range": {
                    "start": 22,
                    "end": 37
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 38,
                    "end": 40
                  },
                  "value": "to"
                },
                {
                  "type": "mcdoc:struct",
                  "children": [
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 41,
                        "end": 47
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
                                "start": 51,
                                "end": 54
                              },
                              "value": "min",
                              "symbol": {
                                "category": "mcdoc",
                                "path": [
                                  "::test::<anonymous 0>",
                                  "min"
                                ]
                              }
                            },
                            {
                              "type": "mcdoc:type/numeric_type",
                              "children": [
                                {
                                  "type": "mcdoc:literal",
                                  "range": {
                                    "start": 57,
                                    "end": 60
                                  },
                                  "value": "int",
                                  "colorTokenType": "type"
                                }
                              ],
                              "range": {
                                "start": 57,
                                "end": 60
                              }
                            }
                          ],
                          "range": {
                            "start": 51,
                            "end": 60
                          },
                          "isOptional": true
                        },
                        {
                          "type": "mcdoc:struct/field/pair",
                          "children": [
                            {
                              "type": "mcdoc:identifier",
                              "range": {
                                "start": 63,
                                "end": 66
                              },
                              "value": "max",
                              "symbol": {
                                "category": "mcdoc",
                                "path": [
                                  "::test::<anonymous 0>",
                                  "max"
                                ]
                              }
                            },
                            {
                              "type": "mcdoc:type/numeric_type",
                              "children": [
                                {
                                  "type": "mcdoc:literal",
                                  "range": {
                                    "start": 69,
                                    "end": 72
                                  },
                                  "value": "int",
                                  "colorTokenType": "type"
                                }
                              ],
                              "range": {
                                "start": 69,
                                "end": 72
                              }
                            }
                          ],
                          "range": {
                            "start": 63,
                            "end": 72
                          },
                          "isOptional": true
                        }
                      ],
                      "range": {
                        "start": 48,
                        "end": 77
                      }
                    }
                  ],
                  "range": {
                    "start": 41,
                    "end": 77
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
                "start": 0,
                "end": 77
              }
            },
            {
              "type": "mcdoc:dispatch_statement",
              "children": [
                {
                  "type": "mcdoc:attribute",
                  "children": [
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 79,
                        "end": 84
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
                                "start": 85,
                                "end": 89
                              },
                              "value": 1.18
                            }
                          ],
                          "range": {
                            "start": 85,
                            "end": 89
                          }
                        }
                      ],
                      "range": {
                        "start": 85,
                        "end": 89
                      }
                    }
                  ],
                  "range": {
                    "start": 77,
                    "end": 91
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 91,
                    "end": 99
                  },
                  "value": "dispatch",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "resource_location",
                  "range": {
                    "start": 100,
                    "end": 113
                  },
                  "namespace": "minecraft",
                  "path": [
                    "rng"
                  ],
                  "symbol": {
                    "category": "mcdoc/dispatcher",
                    "path": [
                      "minecraft:rng"
                    ]
                  }
                },
                {
                  "type": "mcdoc:index_body",
                  "children": [
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 114,
                        "end": 122
                      },
                      "value": "binomial",
                      "symbol": {
                        "category": "mcdoc/dispatcher",
                        "path": [
                          "minecraft:rng",
                          "binomial"
                        ]
                      }
                    }
                  ],
                  "range": {
                    "start": 113,
                    "end": 123
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 124,
                    "end": 126
                  },
                  "value": "to"
                },
                {
                  "type": "mcdoc:struct",
                  "children": [
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 127,
                        "end": 133
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
                                "start": 137,
                                "end": 138
                              },
                              "value": "n",
                              "symbol": {
                                "category": "mcdoc",
                                "path": [
                                  "::test::<anonymous 1>",
                                  "n"
                                ]
                              }
                            },
                            {
                              "type": "mcdoc:type/numeric_type",
                              "children": [
                                {
                                  "type": "mcdoc:literal",
                                  "range": {
                                    "start": 140,
                                    "end": 143
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
                                        "start": 146,
                                        "end": 147
                                      },
                                      "value": 0
                                    },
                                    {
                                      "type": "mcdoc:literal",
                                      "range": {
                                        "start": 147,
                                        "end": 149
                                      },
                                      "value": ".."
                                    }
                                  ],
                                  "range": {
                                    "start": 146,
                                    "end": 149
                                  }
                                }
                              ],
                              "range": {
                                "start": 140,
                                "end": 149
                              }
                            }
                          ],
                          "range": {
                            "start": 137,
                            "end": 149
                          }
                        },
                        {
                          "type": "mcdoc:struct/field/pair",
                          "children": [
                            {
                              "type": "mcdoc:identifier",
                              "range": {
                                "start": 152,
                                "end": 153
                              },
                              "value": "p",
                              "symbol": {
                                "category": "mcdoc",
                                "path": [
                                  "::test::<anonymous 1>",
                                  "p"
                                ]
                              }
                            },
                            {
                              "type": "mcdoc:type/numeric_type",
                              "children": [
                                {
                                  "type": "mcdoc:literal",
                                  "range": {
                                    "start": 155,
                                    "end": 160
                                  },
                                  "value": "float",
                                  "colorTokenType": "type"
                                },
                                {
                                  "type": "mcdoc:float_range",
                                  "children": [
                                    {
                                      "type": "float",
                                      "range": {
                                        "start": 163,
                                        "end": 164
                                      },
                                      "value": 0
                                    },
                                    {
                                      "type": "mcdoc:literal",
                                      "range": {
                                        "start": 164,
                                        "end": 166
                                      },
                                      "value": ".."
                                    },
                                    {
                                      "type": "float",
                                      "range": {
                                        "start": 166,
                                        "end": 167
                                      },
                                      "value": 1
                                    }
                                  ],
                                  "range": {
                                    "start": 163,
                                    "end": 167
                                  }
                                }
                              ],
                              "range": {
                                "start": 155,
                                "end": 167
                              }
                            }
                          ],
                          "range": {
                            "start": 152,
                            "end": 167
                          }
                        }
                      ],
                      "range": {
                        "start": 134,
                        "end": 172
                      }
                    }
                  ],
                  "range": {
                    "start": 127,
                    "end": 172
                  },
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::<anonymous 1>"
                    ]
                  }
                }
              ],
              "range": {
                "start": 77,
                "end": 172
              }
            },
            {
              "type": "mcdoc:dispatch_statement",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 172,
                    "end": 180
                  },
                  "value": "dispatch",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "resource_location",
                  "range": {
                    "start": 181,
                    "end": 196
                  },
                  "namespace": "spyglassmc",
                  "path": [
                    "meta"
                  ],
                  "symbol": {
                    "category": "mcdoc/dispatcher",
                    "path": [
                      "spyglassmc:meta"
                    ]
                  }
                },
                {
                  "type": "mcdoc:index_body",
                  "children": [
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 197,
                        "end": 200
                      },
                      "value": "rng",
                      "symbol": {
                        "category": "mcdoc/dispatcher",
                        "path": [
                          "spyglassmc:meta",
                          "rng"
                        ]
                      }
                    }
                  ],
                  "range": {
                    "start": 196,
                    "end": 201
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 202,
                    "end": 204
                  },
                  "value": "to"
                },
                {
                  "type": "mcdoc:struct",
                  "children": [
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 205,
                        "end": 211
                      },
                      "value": "struct",
                      "colorTokenType": "keyword"
                    },
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 212,
                        "end": 215
                      },
                      "value": "RNG",
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::test::RNG"
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
                                "start": 219,
                                "end": 223
                              },
                              "value": "type",
                              "symbol": {
                                "category": "mcdoc",
                                "path": [
                                  "::test::RNG",
                                  "type"
                                ]
                              }
                            },
                            {
                              "type": "mcdoc:type/union",
                              "children": [
                                {
                                  "type": "mcdoc:type/literal",
                                  "children": [
                                    {
                                      "type": "string",
                                      "range": {
                                        "start": 227,
                                        "end": 236
                                      },
                                      "value": "uniform",
                                      "valueMap": [
                                        {
                                          "inner": {
                                            "start": 0,
                                            "end": 0
                                          },
                                          "outer": {
                                            "start": 228,
                                            "end": 228
                                          }
                                        }
                                      ]
                                    }
                                  ],
                                  "range": {
                                    "start": 227,
                                    "end": 237
                                  }
                                },
                                {
                                  "type": "mcdoc:type/literal",
                                  "children": [
                                    {
                                      "type": "string",
                                      "range": {
                                        "start": 239,
                                        "end": 249
                                      },
                                      "value": "binomial",
                                      "valueMap": [
                                        {
                                          "inner": {
                                            "start": 0,
                                            "end": 0
                                          },
                                          "outer": {
                                            "start": 240,
                                            "end": 240
                                          }
                                        }
                                      ]
                                    }
                                  ],
                                  "range": {
                                    "start": 239,
                                    "end": 249
                                  }
                                }
                              ],
                              "range": {
                                "start": 226,
                                "end": 250
                              }
                            }
                          ],
                          "range": {
                            "start": 219,
                            "end": 250
                          },
                          "isOptional": true
                        },
                        {
                          "type": "mcdoc:struct/field/spread",
                          "children": [
                            {
                              "type": "mcdoc:type/dispatcher",
                              "children": [
                                {
                                  "type": "resource_location",
                                  "range": {
                                    "start": 256,
                                    "end": 269
                                  },
                                  "namespace": "minecraft",
                                  "path": [
                                    "rng"
                                  ]
                                },
                                {
                                  "type": "mcdoc:index_body",
                                  "children": [
                                    {
                                      "type": "mcdoc:dynamic_index",
                                      "children": [
                                        {
                                          "type": "mcdoc:identifier",
                                          "range": {
                                            "start": 271,
                                            "end": 275
                                          },
                                          "value": "type"
                                        }
                                      ],
                                      "range": {
                                        "start": 270,
                                        "end": 276
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 269,
                                    "end": 277
                                  }
                                }
                              ],
                              "range": {
                                "start": 256,
                                "end": 277
                              }
                            }
                          ],
                          "range": {
                            "start": 253,
                            "end": 277
                          }
                        }
                      ],
                      "range": {
                        "start": 216,
                        "end": 280
                      }
                    }
                  ],
                  "range": {
                    "start": 205,
                    "end": 280
                  }
                }
              ],
              "range": {
                "start": 172,
                "end": 280
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 280
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
