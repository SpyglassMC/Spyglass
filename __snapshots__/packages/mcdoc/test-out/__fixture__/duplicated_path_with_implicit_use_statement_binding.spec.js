exports['mcdoc __fixture__ duplicated path with implicit use statement binding 1'] = {
  "global": {
    "mcdoc": {
      "::used": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///used.mcdoc",
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
        "reference": [
          {
            "uri": "file:///client.mcdoc",
            "range": {
              "start": 11,
              "end": 15
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 11
              },
              "end": {
                "line": 0,
                "character": 15
              }
            },
            "fullRange": {
              "start": 4,
              "end": 21
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 4
              },
              "end": {
                "line": 0,
                "character": 21
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
        ]
      },
      "::used::Used": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": []
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///used.mcdoc",
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
              "start": 17,
              "end": 21
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 17
              },
              "end": {
                "line": 0,
                "character": 21
              }
            },
            "fullRange": {
              "start": 4,
              "end": 21
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 4
              },
              "end": {
                "line": 0,
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
    "file:///used.mcdoc": {
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
                      "::used::Used"
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
        "end": 37
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
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 4,
                        "end": 9
                      },
                      "value": "super"
                    },
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 11,
                        "end": 15
                      },
                      "value": "used",
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::used"
                        ]
                      }
                    },
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 17,
                        "end": 21
                      },
                      "value": "Used",
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::used::Used"
                        ]
                      }
                    }
                  ],
                  "range": {
                    "start": 4,
                    "end": 21
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 23
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 23,
                    "end": 29
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 30,
                    "end": 34
                  },
                  "value": "Used"
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 35,
                    "end": 37
                  }
                }
              ],
              "range": {
                "start": 23,
                "end": 37
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 37
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
            "definition": [
              {
                "uri": "file:///client.mcdoc",
                "range": {
                  "start": 17,
                  "end": 21
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 17
                  },
                  "end": {
                    "line": 0,
                    "character": 21
                  }
                },
                "fullRange": {
                  "start": 0,
                  "end": 23
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
      "binderErrors": [
        {
          "range": {
            "start": 30,
            "end": 34
          },
          "message": "Duplicated declaration for “::client::Used”",
          "severity": 2,
          "info": {
            "related": [
              {
                "location": {
                  "uri": "file:///client.mcdoc",
                  "range": {
                    "start": 17,
                    "end": 21
                  },
                  "posRange": {
                    "start": {
                      "line": 0,
                      "character": 17
                    },
                    "end": {
                      "line": 0,
                      "character": 21
                    }
                  },
                  "fullRange": {
                    "start": 0,
                    "end": 23
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
                },
                "message": "“::client::Used” is already declared here"
              }
            ]
          }
        }
      ]
    }
  }
}
