exports['mcdoc __fixture__ struct/nested spread 1'] = {
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
      "::test::NestedSpread": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "spread",
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
                  }
                ],
                "type": {
                  "kind": "attributed",
                  "attribute": {
                    "name": "expandable"
                  },
                  "child": {
                    "kind": "struct",
                    "fields": [
                      {
                        "kind": "spread",
                        "type": {
                          "kind": "dispatcher",
                          "parallelIndices": [
                            {
                              "kind": "dynamic",
                              "accessor": [
                                "%parent",
                                "type"
                              ]
                            }
                          ],
                          "registry": "minecraft:carver_config"
                        }
                      }
                    ]
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
              "start": 7,
              "end": 19
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 7
              },
              "end": {
                "line": 0,
                "character": 19
              }
            },
            "fullRange": {
              "start": 0,
              "end": 115
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 5,
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
            "kind": "attributed",
            "attribute": {
              "name": "expandable"
            },
            "child": {
              "kind": "struct",
              "fields": [
                {
                  "kind": "spread",
                  "type": {
                    "kind": "dispatcher",
                    "parallelIndices": [
                      {
                        "kind": "dynamic",
                        "accessor": [
                          "%parent",
                          "type"
                        ]
                      }
                    ],
                    "registry": "minecraft:carver_config"
                  }
                }
              ]
            }
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 55,
              "end": 61
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 18
              },
              "end": {
                "line": 2,
                "character": 24
              }
            },
            "contributor": "binder"
          }
        ]
      }
    },
    "mcdoc/dispatcher": {
      "minecraft:carver_config": {
        "reference": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 69,
              "end": 92
            },
            "posRange": {
              "start": {
                "line": 3,
                "character": 5
              },
              "end": {
                "line": 3,
                "character": 28
              }
            },
            "fullRange": {
              "start": 69,
              "end": 108
            },
            "fullPosRange": {
              "start": {
                "line": 3,
                "character": 5
              },
              "end": {
                "line": 3,
                "character": 44
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
        "end": 115
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
                    "end": 19
                  },
                  "value": "NestedSpread",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::NestedSpread"
                    ]
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [
                    {
                      "type": "mcdoc:struct/field/spread",
                      "children": [
                        {
                          "type": "mcdoc:attribute",
                          "children": [
                            {
                              "type": "mcdoc:identifier",
                              "range": {
                                "start": 25,
                                "end": 30
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
                                        "start": 31,
                                        "end": 35
                                      },
                                      "value": 1.17
                                    }
                                  ],
                                  "range": {
                                    "start": 31,
                                    "end": 35
                                  }
                                }
                              ],
                              "range": {
                                "start": 31,
                                "end": 35
                              }
                            }
                          ],
                          "range": {
                            "start": 23,
                            "end": 38
                          }
                        },
                        {
                          "type": "mcdoc:struct",
                          "children": [
                            {
                              "type": "mcdoc:attribute",
                              "children": [
                                {
                                  "type": "mcdoc:identifier",
                                  "range": {
                                    "start": 43,
                                    "end": 53
                                  },
                                  "value": "expandable"
                                }
                              ],
                              "range": {
                                "start": 41,
                                "end": 54
                              }
                            },
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 55,
                                "end": 61
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
                                  "type": "mcdoc:struct/field/spread",
                                  "children": [
                                    {
                                      "type": "mcdoc:type/dispatcher",
                                      "children": [
                                        {
                                          "type": "resource_location",
                                          "range": {
                                            "start": 69,
                                            "end": 92
                                          },
                                          "namespace": "minecraft",
                                          "path": [
                                            "carver_config"
                                          ],
                                          "symbol": {
                                            "category": "mcdoc/dispatcher",
                                            "path": [
                                              "minecraft:carver_config"
                                            ]
                                          }
                                        },
                                        {
                                          "type": "mcdoc:index_body",
                                          "children": [
                                            {
                                              "type": "mcdoc:dynamic_index",
                                              "children": [
                                                {
                                                  "type": "mcdoc:literal",
                                                  "range": {
                                                    "start": 94,
                                                    "end": 101
                                                  },
                                                  "value": "%parent"
                                                },
                                                {
                                                  "type": "mcdoc:identifier",
                                                  "range": {
                                                    "start": 102,
                                                    "end": 106
                                                  },
                                                  "value": "type"
                                                }
                                              ],
                                              "range": {
                                                "start": 93,
                                                "end": 107
                                              }
                                            }
                                          ],
                                          "range": {
                                            "start": 92,
                                            "end": 108
                                          }
                                        }
                                      ],
                                      "range": {
                                        "start": 69,
                                        "end": 108
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 66,
                                    "end": 108
                                  }
                                }
                              ],
                              "range": {
                                "start": 62,
                                "end": 112
                              }
                            }
                          ],
                          "range": {
                            "start": 41,
                            "end": 112
                          }
                        }
                      ],
                      "range": {
                        "start": 23,
                        "end": 112
                      }
                    }
                  ],
                  "range": {
                    "start": 20,
                    "end": 115
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 115
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 115
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
