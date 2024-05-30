exports['mcdoc __fixture__ use statement/reference alias 1'] = {
  "global": {
    "mcdoc": {
      "::module": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///module.mcdoc",
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
        },
        "reference": [
          {
            "uri": "file:///client.mcdoc",
            "range": {
              "start": 6,
              "end": 12
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 6
              },
              "end": {
                "line": 0,
                "character": 12
              }
            },
            "fullRange": {
              "start": 6,
              "end": 18
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 6
              },
              "end": {
                "line": 0,
                "character": 18
              }
            },
            "contributor": "binder",
            "skipRenaming": false
          }
        ]
      },
      "::client": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///client.mcdoc",
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
      "::client::Reference": {
        "data": {
          "typeDef": {
            "kind": "reference",
            "path": "::module::Used"
          }
        },
        "subcategory": "type_alias",
        "definition": [
          {
            "uri": "file:///client.mcdoc",
            "range": {
              "start": 25,
              "end": 34
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 5
              },
              "end": {
                "line": 2,
                "character": 14
              }
            },
            "fullRange": {
              "start": 20,
              "end": 41
            },
            "fullPosRange": {
              "start": {
                "line": 2,
                "character": 0
              },
              "end": {
                "line": 2,
                "character": 21
              }
            },
            "contributor": "binder"
          }
        ]
      },
      "::module::Used": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": []
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///module.mcdoc",
            "range": {
              "start": 7,
              "end": 11
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 7
              },
              "end": {
                "line": 0,
                "character": 11
              }
            },
            "fullRange": {
              "start": 0,
              "end": 14
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 0,
                "character": 14
              }
            },
            "contributor": "binder"
          }
        ],
        "reference": [
          {
            "uri": "file:///client.mcdoc",
            "range": {
              "start": 14,
              "end": 18
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 14
              },
              "end": {
                "line": 0,
                "character": 18
              }
            },
            "fullRange": {
              "start": 6,
              "end": 18
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 6
              },
              "end": {
                "line": 0,
                "character": 18
              }
            },
            "contributor": "binder",
            "skipRenaming": false
          },
          {
            "uri": "file:///client.mcdoc",
            "range": {
              "start": 37,
              "end": 41
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 17
              },
              "end": {
                "line": 2,
                "character": 21
              }
            },
            "fullRange": {
              "start": 37,
              "end": 41
            },
            "fullPosRange": {
              "start": {
                "line": 2,
                "character": 17
              },
              "end": {
                "line": 2,
                "character": 21
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
    "file:///module.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 14
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
                    "end": 11
                  },
                  "value": "Used",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::module::Used"
                    ]
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 12,
                    "end": 14
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 14
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 14
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    },
    "file:///client.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 41
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:use_statement",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 0,
                    "end": 3
                  },
                  "value": "use",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:path",
                  "children": [
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 6,
                        "end": 12
                      },
                      "value": "module",
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::module"
                        ]
                      }
                    },
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 14,
                        "end": 18
                      },
                      "value": "Used",
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::module::Used"
                        ]
                      }
                    }
                  ],
                  "range": {
                    "start": 6,
                    "end": 18
                  },
                  "isAbsolute": true
                }
              ],
              "range": {
                "start": 0,
                "end": 20
              }
            },
            {
              "type": "mcdoc:type_alias",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 20,
                    "end": 24
                  },
                  "value": "type",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 25,
                    "end": 34
                  },
                  "value": "Reference",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::client::Reference"
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
                            "start": 37,
                            "end": 41
                          },
                          "value": "Used",
                          "symbol": {
                            "category": "mcdoc",
                            "path": [
                              "::module::Used"
                            ]
                          }
                        }
                      ],
                      "range": {
                        "start": 37,
                        "end": 41
                      }
                    }
                  ],
                  "range": {
                    "start": 37,
                    "end": 41
                  }
                }
              ],
              "range": {
                "start": 20,
                "end": 41
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 41
          }
        }
      ],
      "locals": {
        "mcdoc": {
          "::client::Used": {
            "category": "mcdoc",
            "identifier": "::client::Used",
            "path": [
              "::client::Used"
            ],
            "subcategory": "use_statement_binding",
            "visibility": 1,
            "data": {
              "target": [
                "module",
                "Used"
              ]
            },
            "definition": [
              {
                "uri": "file:///client.mcdoc",
                "range": {
                  "start": 14,
                  "end": 18
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 14
                  },
                  "end": {
                    "line": 0,
                    "character": 18
                  }
                },
                "fullRange": {
                  "start": 0,
                  "end": 20
                },
                "fullPosRange": {
                  "start": {
                    "line": 0,
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
          }
        }
      },
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
