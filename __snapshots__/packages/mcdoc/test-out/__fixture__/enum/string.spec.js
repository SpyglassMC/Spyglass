exports['mcdoc __fixture__ enum/string 1'] = {
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
      "::test::Trigger": {
        "data": {
          "typeDef": {
            "kind": "enum",
            "enumKind": "string",
            "values": [
              {
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
                "identifier": "AllayDropItemOnBlock",
                "value": "allay_drop_item_on_block"
              },
              {
                "identifier": "BeeNestDestroyed",
                "value": "bee_nest_destroyed"
              }
            ]
          }
        },
        "subcategory": "enum",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 13,
              "end": 20
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 13
              },
              "end": {
                "line": 0,
                "character": 20
              }
            },
            "fullRange": {
              "start": 0,
              "end": 132
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
          "AllayDropItemOnBlock": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 38,
                  "end": 58
                },
                "posRange": {
                  "start": {
                    "line": 1,
                    "character": 15
                  },
                  "end": {
                    "line": 1,
                    "character": 35
                  }
                },
                "fullRange": {
                  "start": 24,
                  "end": 87
                },
                "fullPosRange": {
                  "start": {
                    "line": 1,
                    "character": 1
                  },
                  "end": {
                    "line": 1,
                    "character": 64
                  }
                },
                "contributor": "binder"
              }
            ]
          },
          "BeeNestDestroyed": {
            "definition": [
              {
                "uri": "file:///test.mcdoc",
                "range": {
                  "start": 90,
                  "end": 106
                },
                "posRange": {
                  "start": {
                    "line": 2,
                    "character": 1
                  },
                  "end": {
                    "line": 2,
                    "character": 17
                  }
                },
                "fullRange": {
                  "start": 90,
                  "end": 129
                },
                "fullPosRange": {
                  "start": {
                    "line": 2,
                    "character": 1
                  },
                  "end": {
                    "line": 2,
                    "character": 40
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
        "end": 132
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
                    "start": 5,
                    "end": 11
                  },
                  "value": "string",
                  "colorTokenType": "type"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 13,
                    "end": 20
                  },
                  "value": "Trigger",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::Trigger"
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
                          "type": "mcdoc:attribute",
                          "children": [
                            {
                              "type": "mcdoc:identifier",
                              "range": {
                                "start": 26,
                                "end": 31
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
                                        "start": 32,
                                        "end": 36
                                      },
                                      "value": 1.19
                                    }
                                  ],
                                  "range": {
                                    "start": 32,
                                    "end": 36
                                  }
                                }
                              ],
                              "range": {
                                "start": 32,
                                "end": 36
                              }
                            }
                          ],
                          "range": {
                            "start": 24,
                            "end": 38
                          }
                        },
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 38,
                            "end": 58
                          },
                          "value": "AllayDropItemOnBlock",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::Trigger",
                              "AllayDropItemOnBlock"
                            ]
                          }
                        },
                        {
                          "type": "string",
                          "range": {
                            "start": 61,
                            "end": 87
                          },
                          "value": "allay_drop_item_on_block",
                          "valueMap": [
                            {
                              "inner": {
                                "start": 0,
                                "end": 0
                              },
                              "outer": {
                                "start": 62,
                                "end": 62
                              }
                            }
                          ]
                        }
                      ],
                      "range": {
                        "start": 24,
                        "end": 87
                      }
                    },
                    {
                      "type": "mcdoc:enum/field",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 90,
                            "end": 106
                          },
                          "value": "BeeNestDestroyed",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::test::Trigger",
                              "BeeNestDestroyed"
                            ]
                          }
                        },
                        {
                          "type": "string",
                          "range": {
                            "start": 109,
                            "end": 129
                          },
                          "value": "bee_nest_destroyed",
                          "valueMap": [
                            {
                              "inner": {
                                "start": 0,
                                "end": 0
                              },
                              "outer": {
                                "start": 110,
                                "end": 110
                              }
                            }
                          ]
                        }
                      ],
                      "range": {
                        "start": 90,
                        "end": 129
                      }
                    }
                  ],
                  "range": {
                    "start": 21,
                    "end": 132
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 132
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 132
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
