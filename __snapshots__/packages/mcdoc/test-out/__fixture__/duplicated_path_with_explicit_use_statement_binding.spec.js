exports['mcdoc __fixture__ duplicated path with explicit use statement binding 1'] = {
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
            "uri": "file:///foo.mcdoc",
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
      "::foo::Used": {
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
              "start": 45,
              "end": 49
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 7
              },
              "end": {
                "line": 2,
                "character": 11
              }
            },
            "fullRange": {
              "start": 38,
              "end": 53
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
            "uri": "file:///foo.mcdoc",
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
    "file:///foo.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 74
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
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 22,
                    "end": 24
                  },
                  "value": "as"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 25,
                    "end": 36
                  },
                  "value": "ReboundUsed",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::ReboundUsed"
                    ]
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 38
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 38,
                    "end": 44
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 45,
                    "end": 49
                  },
                  "value": "Used",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::foo::Used"
                    ]
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 50,
                    "end": 52
                  }
                }
              ],
              "range": {
                "start": 38,
                "end": 53
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 53,
                    "end": 59
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 60,
                    "end": 71
                  },
                  "value": "ReboundUsed"
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 72,
                    "end": 74
                  }
                }
              ],
              "range": {
                "start": 53,
                "end": 74
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 74
          }
        }
      ],
      "locals": {
        "mcdoc": {
          "::foo::ReboundUsed": {
            "category": "mcdoc",
            "identifier": "::foo::ReboundUsed",
            "path": [
              "::foo::ReboundUsed"
            ],
            "subcategory": "use_statement_binding",
            "visibility": 1,
            "definition": [
              {
                "uri": "file:///foo.mcdoc",
                "range": {
                  "start": 25,
                  "end": 36
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 25
                  },
                  "end": {
                    "line": 0,
                    "character": 36
                  }
                },
                "fullRange": {
                  "start": 0,
                  "end": 38
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
            "start": 60,
            "end": 71
          },
          "message": "Duplicated declaration for “::foo::ReboundUsed”",
          "severity": 2,
          "info": {
            "related": [
              {
                "location": {
                  "uri": "file:///foo.mcdoc",
                  "range": {
                    "start": 25,
                    "end": 36
                  },
                  "posRange": {
                    "start": {
                      "line": 0,
                      "character": 25
                    },
                    "end": {
                      "line": 0,
                      "character": 36
                    }
                  },
                  "fullRange": {
                    "start": 0,
                    "end": 38
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
                "message": "“::foo::ReboundUsed” is already declared here"
              }
            ]
          }
        }
      ]
    }
  }
}
