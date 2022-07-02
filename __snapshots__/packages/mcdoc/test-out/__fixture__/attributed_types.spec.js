exports['mcdoc __fixture__ attributed types 1'] = {
  "global": {
    "mcdoc": {
      "::foo": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
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
      "::foo::AttributeTest0": {
        "data": {
          "typeDef": {
            "attributes": [
              {
                "name": "deprecated"
              }
            ],
            "kind": "boolean"
          }
        },
        "desc": "",
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
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
              "end": 44
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
      "::foo::AttributeTest1": {
        "data": {
          "typeDef": {
            "attributes": [
              {
                "name": "since",
                "value": {
                  "kind": "literal",
                  "value": {
                    "kind": "number",
                    "value": 1.19
                  }
                }
              }
            ],
            "kind": "boolean"
          }
        },
        "desc": "",
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
            "range": {
              "start": 49,
              "end": 63
            },
            "posRange": {
              "start": {
                "line": 1,
                "character": 5
              },
              "end": {
                "line": 1,
                "character": 19
              }
            },
            "fullRange": {
              "start": 44,
              "end": 88
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
      "::foo::AttributeTest2": {
        "data": {
          "typeDef": {
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
                      "path": "::foo::allowed"
                    }
                  }
                }
              }
            ],
            "kind": "string"
          }
        },
        "desc": "",
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
            "range": {
              "start": 93,
              "end": 107
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 5
              },
              "end": {
                "line": 2,
                "character": 19
              }
            },
            "fullRange": {
              "start": 88,
              "end": 164
            },
            "fullPosRange": {
              "start": {
                "line": 2,
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
      }
    }
  },
  "nodes": {
    "file:///foo.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 164
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
                  "value": "AttributeTest0",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::AttributeTest0"
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
                            "start": 24,
                            "end": 34
                          },
                          "value": "deprecated"
                        }
                      ],
                      "range": {
                        "start": 22,
                        "end": 35
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 36,
                        "end": 43
                      },
                      "value": "boolean",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 22,
                    "end": 44
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 44
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:doc_comments",
                  "children": [],
                  "range": {
                    "start": 44,
                    "end": 44
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 44,
                    "end": 48
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 49,
                    "end": 63
                  },
                  "value": "AttributeTest1",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::AttributeTest1"
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
                            "start": 68,
                            "end": 73
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
                                    "start": 74,
                                    "end": 78
                                  },
                                  "value": 1.19
                                }
                              ],
                              "range": {
                                "start": 74,
                                "end": 78
                              }
                            }
                          ],
                          "range": {
                            "start": 74,
                            "end": 78
                          }
                        }
                      ],
                      "range": {
                        "start": 66,
                        "end": 80
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 80,
                        "end": 87
                      },
                      "value": "boolean",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 66,
                    "end": 88
                  }
                }
              ],
              "range": {
                "start": 44,
                "end": 88
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:doc_comments",
                  "children": [],
                  "range": {
                    "start": 88,
                    "end": 88
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 88,
                    "end": 92
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 93,
                    "end": 107
                  },
                  "value": "AttributeTest2",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::AttributeTest2"
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
                            "start": 112,
                            "end": 114
                          },
                          "value": "id"
                        },
                        {
                          "type": "mcdoc:attribute/tree",
                          "range": {
                            "start": 115,
                            "end": 153
                          },
                          "children": [
                            {
                              "type": "mcdoc:attribute/tree/named",
                              "children": [
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 115,
                                    "end": 123
                                  },
                                  "value": "registry"
                                },
                                {
                                  "type": "mcdoc:type/literal",
                                  "children": [
                                    {
                                      "type": "string",
                                      "range": {
                                        "start": 124,
                                        "end": 140
                                      },
                                      "value": "worldgen/biome",
                                      "valueMap": [
                                        {
                                          "inner": {
                                            "start": 0,
                                            "end": 0
                                          },
                                          "outer": {
                                            "start": 125,
                                            "end": 125
                                          }
                                        }
                                      ]
                                    }
                                  ],
                                  "range": {
                                    "start": 124,
                                    "end": 140
                                  }
                                },
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 141,
                                    "end": 145
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
                                            "start": 146,
                                            "end": 153
                                          },
                                          "value": "allowed"
                                        }
                                      ],
                                      "range": {
                                        "start": 146,
                                        "end": 153
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 146,
                                    "end": 153
                                  }
                                }
                              ],
                              "range": {
                                "start": 115,
                                "end": 153
                              }
                            }
                          ],
                          "delim": "("
                        }
                      ],
                      "range": {
                        "start": 110,
                        "end": 156
                      }
                    },
                    {
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 156,
                        "end": 162
                      },
                      "value": "string",
                      "colorTokenType": "type"
                    }
                  ],
                  "range": {
                    "start": 110,
                    "end": 164
                  }
                }
              ],
              "range": {
                "start": 88,
                "end": 164
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 164
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
