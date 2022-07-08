exports['mcdoc __fixture__ struct 1'] = {
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
      "::foo::Empty": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": []
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
            "range": {
              "start": 18,
              "end": 23
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 7
              },
              "end": {
                "line": 2,
                "character": 12
              }
            },
            "fullRange": {
              "start": 11,
              "end": 28
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
      },
      "::foo::Simple": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "pair",
                "key": "Foo",
                "type": {
                  "kind": "byte"
                }
              },
              {
                "kind": "pair",
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
                "key": "Bar",
                "type": {
                  "attributes": [
                    {
                      "name": "id"
                    }
                  ],
                  "kind": "string"
                },
                "optional": true
              }
            ]
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
            "range": {
              "start": 35,
              "end": 41
            },
            "posRange": {
              "start": {
                "line": 4,
                "character": 7
              },
              "end": {
                "line": 4,
                "character": 13
              }
            },
            "fullRange": {
              "start": 28,
              "end": 95
            },
            "fullPosRange": {
              "start": {
                "line": 4,
                "character": 0
              },
              "end": {
                "line": 10,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::foo::Nested": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": [
              {
                "kind": "pair",
                "key": "Child",
                "type": {
                  "kind": "struct",
                  "fields": [
                    {
                      "kind": "pair",
                      "key": "Grandchild",
                      "type": {
                        "kind": "struct",
                        "fields": []
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
            "range": {
              "start": 102,
              "end": 108
            },
            "posRange": {
              "start": {
                "line": 10,
                "character": 7
              },
              "end": {
                "line": 10,
                "character": 13
              }
            },
            "fullRange": {
              "start": 95,
              "end": 174
            },
            "fullPosRange": {
              "start": {
                "line": 10,
                "character": 0
              },
              "end": {
                "line": 16,
                "character": 0
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::foo::NamedGrandchild": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": []
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
            "range": {
              "start": 149,
              "end": 164
            },
            "posRange": {
              "start": {
                "line": 12,
                "character": 21
              },
              "end": {
                "line": 12,
                "character": 36
              }
            },
            "fullRange": {
              "start": 142,
              "end": 169
            },
            "fullPosRange": {
              "start": {
                "line": 12,
                "character": 14
              },
              "end": {
                "line": 13,
                "character": 1
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::foo::NestedSpread": {
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
                        "kind": "number",
                        "value": 1.17
                      }
                    }
                  }
                ],
                "type": {
                  "attributes": [
                    {
                      "name": "expandable"
                    }
                  ],
                  "kind": "struct",
                  "fields": [
                    {
                      "kind": "spread",
                      "type": {
                        "kind": "dispatcher",
                        "index": [
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
            ]
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///foo.mcdoc",
            "range": {
              "start": 181,
              "end": 193
            },
            "posRange": {
              "start": {
                "line": 16,
                "character": 7
              },
              "end": {
                "line": 16,
                "character": 19
              }
            },
            "fullRange": {
              "start": 174,
              "end": 291
            },
            "fullPosRange": {
              "start": {
                "line": 16,
                "character": 0
              },
              "end": {
                "line": 23,
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
        "end": 836
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
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 7,
                    "end": 9
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 11
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 18,
                    "end": 23
                  },
                  "value": "Empty",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::Empty"
                    ]
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 24,
                    "end": 26
                  }
                }
              ],
              "range": {
                "start": 11,
                "end": 28
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 28,
                    "end": 34
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 35,
                    "end": 41
                  },
                  "value": "Simple",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::Simple"
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
                            "start": 45,
                            "end": 48
                          },
                          "value": "Foo"
                        },
                        {
                          "type": "mcdoc:type/numeric_type",
                          "children": [
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 50,
                                "end": 54
                              },
                              "value": "byte",
                              "colorTokenType": "type"
                            }
                          ],
                          "range": {
                            "start": 50,
                            "end": 54
                          }
                        }
                      ],
                      "range": {
                        "start": 45,
                        "end": 54
                      }
                    },
                    {
                      "type": "mcdoc:struct/field/pair",
                      "children": [
                        {
                          "type": "mcdoc:attribute",
                          "children": [
                            {
                              "type": "mcdoc:identifier",
                              "range": {
                                "start": 59,
                                "end": 64
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
                                        "start": 65,
                                        "end": 69
                                      },
                                      "value": 1.19
                                    }
                                  ],
                                  "range": {
                                    "start": 65,
                                    "end": 69
                                  }
                                }
                              ],
                              "range": {
                                "start": 65,
                                "end": 69
                              }
                            }
                          ],
                          "range": {
                            "start": 57,
                            "end": 72
                          }
                        },
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 72,
                            "end": 75
                          },
                          "value": "Bar"
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
                                    "start": 80,
                                    "end": 82
                                  },
                                  "value": "id"
                                }
                              ],
                              "range": {
                                "start": 78,
                                "end": 83
                              }
                            },
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 84,
                                "end": 90
                              },
                              "value": "string",
                              "colorTokenType": "type"
                            }
                          ],
                          "range": {
                            "start": 78,
                            "end": 90
                          }
                        }
                      ],
                      "range": {
                        "start": 57,
                        "end": 90
                      },
                      "isOptional": true
                    }
                  ],
                  "range": {
                    "start": 42,
                    "end": 95
                  }
                }
              ],
              "range": {
                "start": 28,
                "end": 95
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 95,
                    "end": 101
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 102,
                    "end": 108
                  },
                  "value": "Nested",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::Nested"
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
                            "start": 112,
                            "end": 117
                          },
                          "value": "Child"
                        },
                        {
                          "type": "mcdoc:struct",
                          "children": [
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 119,
                                "end": 125
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
                                        "start": 130,
                                        "end": 140
                                      },
                                      "value": "Grandchild"
                                    },
                                    {
                                      "type": "mcdoc:struct",
                                      "children": [
                                        {
                                          "type": "mcdoc:literal",
                                          "range": {
                                            "start": 142,
                                            "end": 148
                                          },
                                          "value": "struct",
                                          "colorTokenType": "keyword"
                                        },
                                        {
                                          "type": "mcdoc:identifier",
                                          "range": {
                                            "start": 149,
                                            "end": 164
                                          },
                                          "value": "NamedGrandchild",
                                          "symbol": {
                                            "category": "mcdoc",
                                            "path": [
                                              "::foo::NamedGrandchild"
                                            ]
                                          }
                                        },
                                        {
                                          "type": "mcdoc:struct/block",
                                          "children": [],
                                          "range": {
                                            "start": 165,
                                            "end": 167
                                          }
                                        }
                                      ],
                                      "range": {
                                        "start": 142,
                                        "end": 169
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 130,
                                    "end": 169
                                  }
                                }
                              ],
                              "range": {
                                "start": 126,
                                "end": 171
                              }
                            }
                          ],
                          "range": {
                            "start": 119,
                            "end": 171
                          }
                        }
                      ],
                      "range": {
                        "start": 112,
                        "end": 171
                      }
                    }
                  ],
                  "range": {
                    "start": 109,
                    "end": 174
                  }
                }
              ],
              "range": {
                "start": 95,
                "end": 174
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 174,
                    "end": 180
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 181,
                    "end": 193
                  },
                  "value": "NestedSpread",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::NestedSpread"
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
                                "start": 199,
                                "end": 204
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
                                        "start": 205,
                                        "end": 209
                                      },
                                      "value": 1.17
                                    }
                                  ],
                                  "range": {
                                    "start": 205,
                                    "end": 209
                                  }
                                }
                              ],
                              "range": {
                                "start": 205,
                                "end": 209
                              }
                            }
                          ],
                          "range": {
                            "start": 197,
                            "end": 212
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
                                    "start": 217,
                                    "end": 227
                                  },
                                  "value": "expandable"
                                }
                              ],
                              "range": {
                                "start": 215,
                                "end": 228
                              }
                            },
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 229,
                                "end": 235
                              },
                              "value": "struct",
                              "colorTokenType": "keyword"
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
                                            "start": 243,
                                            "end": 266
                                          },
                                          "namespace": "minecraft",
                                          "path": [
                                            "carver_config"
                                          ]
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
                                                    "start": 268,
                                                    "end": 275
                                                  },
                                                  "value": "%parent"
                                                },
                                                {
                                                  "type": "mcdoc:identifier",
                                                  "range": {
                                                    "start": 276,
                                                    "end": 280
                                                  },
                                                  "value": "type"
                                                }
                                              ],
                                              "range": {
                                                "start": 267,
                                                "end": 281
                                              }
                                            }
                                          ],
                                          "range": {
                                            "start": 266,
                                            "end": 282
                                          }
                                        }
                                      ],
                                      "range": {
                                        "start": 243,
                                        "end": 282
                                      }
                                    }
                                  ],
                                  "range": {
                                    "start": 240,
                                    "end": 282
                                  }
                                }
                              ],
                              "range": {
                                "start": 236,
                                "end": 286
                              }
                            }
                          ],
                          "range": {
                            "start": 215,
                            "end": 286
                          }
                        }
                      ],
                      "range": {
                        "start": 197,
                        "end": 286
                      }
                    }
                  ],
                  "range": {
                    "start": 194,
                    "end": 291
                  }
                }
              ],
              "range": {
                "start": 174,
                "end": 291
              }
            },
            {
              "type": "comment",
              "range": {
                "start": 291,
                "end": 313
              },
              "comment": " //== type parameter"
            },
            {
              "type": "comment",
              "range": {
                "start": 314,
                "end": 333
              },
              "comment": " //=== /foo.mcdoc"
            },
            {
              "type": "comment",
              "range": {
                "start": 334,
                "end": 363
              },
              "comment": " type InclusiveRange<T> = ("
            },
            {
              "type": "comment",
              "range": {
                "start": 364,
                "end": 371
              },
              "comment": " \tT |"
            },
            {
              "type": "comment",
              "range": {
                "start": 372,
                "end": 385
              },
              "comment": " \t[T] @ 2 |"
            },
            {
              "type": "comment",
              "range": {
                "start": 386,
                "end": 398
              },
              "comment": " \tstruct {"
            },
            {
              "type": "comment",
              "range": {
                "start": 399,
                "end": 421
              },
              "comment": " \t\tmin_inclusive: T,"
            },
            {
              "type": "comment",
              "range": {
                "start": 422,
                "end": 444
              },
              "comment": " \t\tmax_inclusive: T,"
            },
            {
              "type": "comment",
              "range": {
                "start": 445,
                "end": 452
              },
              "comment": " \t} |"
            },
            {
              "type": "comment",
              "range": {
                "start": 453,
                "end": 457
              },
              "comment": " )"
            },
            {
              "type": "comment",
              "range": {
                "start": 459,
                "end": 508
              },
              "comment": " type VarietyType = InclusiveRange<int @ 1..64>"
            },
            {
              "type": "comment",
              "range": {
                "start": 510,
                "end": 528
              },
              "comment": " //== dispatcher"
            },
            {
              "type": "comment",
              "range": {
                "start": 529,
                "end": 548
              },
              "comment": " //=== /foo.mcdoc"
            },
            {
              "type": "comment",
              "range": {
                "start": 549,
                "end": 565
              },
              "comment": " #[since=1.18]"
            },
            {
              "type": "comment",
              "range": {
                "start": 566,
                "end": 659
              },
              "comment": " dispatch minecraft:block_state_provider[dual_noise_provider] to struct DualNoiseProvider {"
            },
            {
              "type": "comment",
              "range": {
                "start": 660,
                "end": 681
              },
              "comment": " \t...NoiseProvider,"
            },
            {
              "type": "comment",
              "range": {
                "start": 682,
                "end": 723
              },
              "comment": " \tvariety: InclusiveRange<int @ 1..64>,"
            },
            {
              "type": "comment",
              "range": {
                "start": 724,
                "end": 756
              },
              "comment": " \tslow_noise: NoiseParameters,"
            },
            {
              "type": "comment",
              "range": {
                "start": 757,
                "end": 804
              },
              "comment": " \tslow_scale: float @ 0.., // TODO: exclude 0"
            },
            {
              "type": "comment",
              "range": {
                "start": 805,
                "end": 830
              },
              "comment": " \tstates: [BlockState],"
            },
            {
              "type": "comment",
              "range": {
                "start": 831,
                "end": 835
              },
              "comment": " }"
            }
          ],
          "range": {
            "start": 0,
            "end": 836
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
