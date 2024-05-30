exports['mcdoc __fixture__ attributed types 1'] = {
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
      "::test::NoValue": {
        "data": {
          "typeDef": {
            "kind": "boolean",
            "attributes": [
              {
                "name": "deprecated"
              }
            ]
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 5,
              "end": 12
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 5
              },
              "end": {
                "line": 0,
                "character": 12
              }
            },
            "fullRange": {
              "start": 0,
              "end": 37
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
        ]
      },
      "::test::SimpleValue": {
        "data": {
          "typeDef": {
            "kind": "boolean",
            "attributes": [
              {
                "name": "since",
                "value": {
                  "kind": "literal",
                  "value": {
                    "kind": "double",
                    "value": 1.19
                  }
                }
              }
            ]
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 42,
              "end": 53
            },
            "posRange": {
              "start": {
                "line": 1,
                "character": 5
              },
              "end": {
                "line": 1,
                "character": 16
              }
            },
            "fullRange": {
              "start": 37,
              "end": 78
            },
            "fullPosRange": {
              "start": {
                "line": 1,
                "character": 0
              },
              "end": {
                "line": 2,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::test::Multiple": {
        "data": {
          "typeDef": {
            "kind": "boolean",
            "attributes": [
              {
                "name": "since",
                "value": {
                  "kind": "literal",
                  "value": {
                    "kind": "double",
                    "value": 1.17
                  }
                }
              },
              {
                "name": "until",
                "value": {
                  "kind": "literal",
                  "value": {
                    "kind": "double",
                    "value": 1.2
                  }
                }
              }
            ]
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 83,
              "end": 91
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 5
              },
              "end": {
                "line": 2,
                "character": 13
              }
            },
            "fullRange": {
              "start": 78,
              "end": 130
            },
            "fullPosRange": {
              "start": {
                "line": 2,
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
      "::test::TreeValue": {
        "data": {
          "typeDef": {
            "kind": "string",
            "attributes": [
              {
                "name": "id",
                "value": {
                  "kind": "tree",
                  "values": {
                    "registry": {
                      "kind": "literal",
                      "value": {
                        "kind": "string",
                        "value": "worldgen/biome"
                      }
                    },
                    "tags": {
                      "kind": "reference",
                      "path": "::test::allowed"
                    }
                  }
                }
              }
            ]
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 135,
              "end": 144
            },
            "posRange": {
              "start": {
                "line": 3,
                "character": 5
              },
              "end": {
                "line": 3,
                "character": 14
              }
            },
            "fullRange": {
              "start": 130,
              "end": 200
            },
            "fullPosRange": {
              "start": {
                "line": 3,
                "character": 0
              },
              "end": {
                "line": 4,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::test::EnumValue": {
        "data": {
          "typeDef": {
            "kind": "int",
            "attributes": [
              {
                "name": "bitfield",
                "value": {
                  "kind": "tree",
                  "values": {
                    "0": {
                      "kind": "enum",
                      "enumKind": "int",
                      "values": [
                        {
                          "identifier": "HandAll",
                          "value": 1
                        },
                        {
                          "identifier": "BootsAll",
                          "value": 2
                        }
                      ]
                    }
                  }
                }
              }
            ]
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 205,
              "end": 214
            },
            "posRange": {
              "start": {
                "line": 4,
                "character": 5
              },
              "end": {
                "line": 4,
                "character": 14
              }
            },
            "fullRange": {
              "start": 200,
              "end": 276
            },
            "fullPosRange": {
              "start": {
                "line": 4,
                "character": 0
              },
              "end": {
                "line": 7,
                "character": 7
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::test::<anonymous 0>": {
        "data": {
          "typeDef": {
            "kind": "enum",
            "enumKind": "int",
            "values": [
              {
                "identifier": "HandAll",
                "value": 1
              },
              {
                "identifier": "BootsAll",
                "value": 2
              }
            ]
          }
        },
        "subcategory": "enum",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 228,
              "end": 232
            },
            "posRange": {
              "start": {
                "line": 4,
                "character": 28
              },
              "end": {
                "line": 4,
                "character": 32
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
        "end": 276
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:type_alias",
              "children": [
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
                    "end": 12
                  },
                  "value": "NoValue",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::NoValue"
                    ]
                  }
                },
                {
                  "type": "mcdoc:type/boolean",
                  "children": [
                    {
                      "type": "mcdoc:attribute",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 17,
                            "end": 27
                          },
                          "value": "deprecated"
                        }
                      ],
                      "range": {
                        "start": 15,
                        "end": 28
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 29,
                        "end": 36
                      },
                      "value": "boolean",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 15,
                    "end": 37
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 37
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 37,
                    "end": 41
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 42,
                    "end": 53
                  },
                  "value": "SimpleValue",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::SimpleValue"
                    ]
                  }
                },
                {
                  "type": "mcdoc:type/boolean",
                  "children": [
                    {
                      "type": "mcdoc:attribute",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 58,
                            "end": 63
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
                                    "start": 64,
                                    "end": 68
                                  },
                                  "value": 1.19
                                }
                              ],
                              "range": {
                                "start": 64,
                                "end": 68
                              }
                            }
                          ],
                          "range": {
                            "start": 64,
                            "end": 68
                          }
                        }
                      ],
                      "range": {
                        "start": 56,
                        "end": 70
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 70,
                        "end": 77
                      },
                      "value": "boolean",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 56,
                    "end": 78
                  }
                }
              ],
              "range": {
                "start": 37,
                "end": 78
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 78,
                    "end": 82
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 83,
                    "end": 91
                  },
                  "value": "Multiple",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Multiple"
                    ]
                  }
                },
                {
                  "type": "mcdoc:type/boolean",
                  "children": [
                    {
                      "type": "mcdoc:attribute",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 96,
                            "end": 101
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
                                    "start": 102,
                                    "end": 106
                                  },
                                  "value": 1.17
                                }
                              ],
                              "range": {
                                "start": 102,
                                "end": 106
                              }
                            }
                          ],
                          "range": {
                            "start": 102,
                            "end": 106
                          }
                        }
                      ],
                      "range": {
                        "start": 94,
                        "end": 108
                      }
                    },
                    {
                      "type": "mcdoc:attribute",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 110,
                            "end": 115
                          },
                          "value": "until"
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
                                    "start": 116,
                                    "end": 120
                                  },
                                  "value": 1.2
                                }
                              ],
                              "range": {
                                "start": 116,
                                "end": 120
                              }
                            }
                          ],
                          "range": {
                            "start": 116,
                            "end": 120
                          }
                        }
                      ],
                      "range": {
                        "start": 108,
                        "end": 122
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 122,
                        "end": 129
                      },
                      "value": "boolean",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 94,
                    "end": 130
                  }
                }
              ],
              "range": {
                "start": 78,
                "end": 130
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 130,
                    "end": 134
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 135,
                    "end": 144
                  },
                  "value": "TreeValue",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::TreeValue"
                    ]
                  }
                },
                {
                  "type": "mcdoc:type/string",
                  "children": [
                    {
                      "type": "mcdoc:attribute",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 149,
                            "end": 151
                          },
                          "value": "id"
                        },
                        {
                          "type": "mcdoc:attribute/tree",
                          "range": {
                            "start": 152,
                            "end": 190
                          },
                          "children": [
                            {
                              "type": "mcdoc:attribute/tree/named",
                              "children": [
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 152,
                                    "end": 160
                                  },
                                  "value": "registry"
                                },
                                {
                                  "type": "mcdoc:type/literal",
                                  "children": [
                                    {
                                      "type": "string",
                                      "range": {
                                        "start": 161,
                                        "end": 177
                                      },
                                      "value": "worldgen/biome",
                                      "valueMap": [
                                        {
                                          "inner": {
                                            "start": 0,
                                            "end": 0
                                          },
                                          "outer": {
                                            "start": 162,
                                            "end": 162
                                          }
                                        }
                                      ]
                                    }
                                  ],
                                  "range": {
                                    "start": 161,
                                    "end": 177
                                  }
                                },
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 178,
                                    "end": 182
                                  },
                                  "value": "tags"
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
                                            "start": 183,
                                            "end": 190
                                          },
                                          "value": "allowed"
                                        }
                                      ],
                                      "range": {
                                        "start": 183,
                                        "end": 190
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 183,
                                    "end": 190
                                  }
                                }
                              ],
                              "range": {
                                "start": 152,
                                "end": 190
                              }
                            }
                          ],
                          "delim": "("
                        }
                      ],
                      "range": {
                        "start": 147,
                        "end": 193
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 193,
                        "end": 199
                      },
                      "value": "string",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 147,
                    "end": 200
                  }
                }
              ],
              "range": {
                "start": 130,
                "end": 200
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 200,
                    "end": 204
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 205,
                    "end": 214
                  },
                  "value": "EnumValue",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::EnumValue"
                    ]
                  }
                },
                {
                  "type": "mcdoc:type/numeric_type",
                  "children": [
                    {
                      "type": "mcdoc:attribute",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 219,
                            "end": 227
                          },
                          "value": "bitfield"
                        },
                        {
                          "type": "mcdoc:attribute/tree",
                          "range": {
                            "start": 228,
                            "end": 270
                          },
                          "children": [
                            {
                              "type": "mcdoc:attribute/tree/pos",
                              "children": [
                                {
                                  "type": "mcdoc:enum",
                                  "children": [
                                    {
                                      "type": "mcdoc:literal",
                                      "range": {
                                        "start": 228,
                                        "end": 232
                                      },
                                      "value": "enum",
                                      "colorTokenType": "keyword",
                                      "symbol": {
                                        "category": "mcdoc",
                                        "path": [
                                          "::test::<anonymous 0>"
                                        ]
                                      }
                                    },
                                    {
                                      "type": "mcdoc:literal",
                                      "range": {
                                        "start": 233,
                                        "end": 236
                                      },
                                      "value": "int",
                                      "colorTokenType": "type"
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
                                                "start": 241,
                                                "end": 248
                                              },
                                              "value": "HandAll"
                                            },
                                            {
                                              "type": "mcdoc:typed_number",
                                              "children": [
                                                {
                                                  "type": "integer",
                                                  "range": {
                                                    "start": 251,
                                                    "end": 252
                                                  },
                                                  "value": 1
                                                }
                                              ],
                                              "range": {
                                                "start": 251,
                                                "end": 252
                                              }
                                            }
                                          ],
                                          "range": {
                                            "start": 241,
                                            "end": 252
                                          }
                                        },
                                        {
                                          "type": "mcdoc:enum/field",
                                          "children": [
                                            {
                                              "type": "mcdoc:identifier",
                                              "range": {
                                                "start": 255,
                                                "end": 263
                                              },
                                              "value": "BootsAll"
                                            },
                                            {
                                              "type": "mcdoc:typed_number",
                                              "children": [
                                                {
                                                  "type": "integer",
                                                  "range": {
                                                    "start": 266,
                                                    "end": 267
                                                  },
                                                  "value": 2
                                                }
                                              ],
                                              "range": {
                                                "start": 266,
                                                "end": 267
                                              }
                                            }
                                          ],
                                          "range": {
                                            "start": 255,
                                            "end": 267
                                          }
                                        }
                                      ],
                                      "range": {
                                        "start": 238,
                                        "end": 270
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 228,
                                    "end": 270
                                  }
                                }
                              ],
                              "range": {
                                "start": 228,
                                "end": 270
                              }
                            }
                          ],
                          "delim": "("
                        }
                      ],
                      "range": {
                        "start": 217,
                        "end": 273
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 273,
                        "end": 276
                      },
                      "value": "int",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 217,
                    "end": 276
                  }
                }
              ],
              "range": {
                "start": 200,
                "end": 276
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 276
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
