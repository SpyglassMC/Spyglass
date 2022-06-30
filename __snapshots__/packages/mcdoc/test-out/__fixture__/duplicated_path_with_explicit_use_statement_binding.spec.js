exports['mcdoc __fixture__ duplicated path with explicit use statement binding 1'] = {
  "global": {
    "mcdoc": {
      "::bar": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///bar.mcdoc",
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
      "::bar::Bar": {
        "data": {
          "typeDef": {
            "kind": "struct",
            "fields": []
          }
        },
        "subcategory": "struct",
        "definition": [
          {
            "uri": "file:///bar.mcdoc",
            "range": {
              "start": 7,
              "end": 10
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 7
              },
              "end": {
                "line": 0,
                "character": 10
              }
            },
            "fullRange": {
              "start": 0,
              "end": 15
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
      },
      "::foo::Bar": {
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
              "start": 43,
              "end": 46
            },
            "posRange": {
              "start": {
                "line": 2,
                "character": 7
              },
              "end": {
                "line": 2,
                "character": 10
              }
            },
            "fullRange": {
              "start": 36,
              "end": 50
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
      }
    }
  },
  "nodes": {
    "file:///bar.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 15
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
                    "end": 10
                  },
                  "value": "Bar",
                  "symbol": {
                    "category": "mcdoc",
                    "identifier": "::bar::Bar",
                    "path": [
                      "::bar::Bar"
                    ],
                    "data": {
                      "typeDef": {
                        "kind": "struct",
                        "fields": []
                      }
                    },
                    "subcategory": "struct",
                    "definition": [
                      {
                        "uri": "file:///bar.mcdoc",
                        "range": {
                          "start": 7,
                          "end": 10
                        },
                        "posRange": {
                          "start": {
                            "line": 0,
                            "character": 7
                          },
                          "end": {
                            "line": 0,
                            "character": 10
                          }
                        },
                        "fullRange": {
                          "start": 0,
                          "end": 15
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
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 11,
                    "end": 13
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 15
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 15
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
        "end": 72
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
                        "end": 14
                      },
                      "value": "bar"
                    },
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 16,
                        "end": 19
                      },
                      "value": "Bar"
                    }
                  ],
                  "range": {
                    "start": 4,
                    "end": 19
                  }
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 20,
                    "end": 22
                  },
                  "value": "as"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 23,
                    "end": 34
                  },
                  "value": "ImportedBar",
                  "symbol": {
                    "category": "mcdoc",
                    "identifier": "::foo::ImportedBar",
                    "path": [
                      "::foo::ImportedBar"
                    ],
                    "subcategory": "use_statement_binding",
                    "visibility": 1,
                    "definition": [
                      {
                        "uri": "file:///foo.mcdoc",
                        "range": {
                          "start": 23,
                          "end": 34
                        },
                        "posRange": {
                          "start": {
                            "line": 0,
                            "character": 23
                          },
                          "end": {
                            "line": 0,
                            "character": 34
                          }
                        },
                        "fullRange": {
                          "start": 0,
                          "end": 36
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
              ],
              "range": {
                "start": 0,
                "end": 36
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 36,
                    "end": 42
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 43,
                    "end": 46
                  },
                  "value": "Bar",
                  "symbol": {
                    "category": "mcdoc",
                    "identifier": "::foo::Bar",
                    "path": [
                      "::foo::Bar"
                    ],
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
                          "start": 43,
                          "end": 46
                        },
                        "posRange": {
                          "start": {
                            "line": 2,
                            "character": 7
                          },
                          "end": {
                            "line": 2,
                            "character": 10
                          }
                        },
                        "fullRange": {
                          "start": 36,
                          "end": 50
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
                  }
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 47,
                    "end": 49
                  }
                }
              ],
              "range": {
                "start": 36,
                "end": 50
              }
            },
            {
              "type": "mcdoc:struct",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 50,
                    "end": 56
                  },
                  "value": "struct",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 57,
                    "end": 68
                  },
                  "value": "ImportedBar"
                },
                {
                  "type": "mcdoc:struct/block",
                  "children": [],
                  "range": {
                    "start": 69,
                    "end": 71
                  }
                }
              ],
              "range": {
                "start": 50,
                "end": 72
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 72
          }
        }
      ],
      "locals": {
        "mcdoc": {
          "::foo::ImportedBar": {
            "category": "mcdoc",
            "identifier": "::foo::ImportedBar",
            "path": [
              "::foo::ImportedBar"
            ],
            "subcategory": "use_statement_binding",
            "visibility": 1,
            "definition": [
              {
                "uri": "file:///foo.mcdoc",
                "range": {
                  "start": 23,
                  "end": 34
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 23
                  },
                  "end": {
                    "line": 0,
                    "character": 34
                  }
                },
                "fullRange": {
                  "start": 0,
                  "end": 36
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
            "start": 57,
            "end": 68
          },
          "message": "",
          "severity": 2,
          "info": {
            "related": [
              {
                "location": {
                  "uri": "file:///foo.mcdoc",
                  "range": {
                    "start": 23,
                    "end": 34
                  },
                  "posRange": {
                    "start": {
                      "line": 0,
                      "character": 23
                    },
                    "end": {
                      "line": 0,
                      "character": 34
                    }
                  },
                  "fullRange": {
                    "start": 0,
                    "end": 36
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
                "message": ""
              }
            ]
          }
        }
      ]
    }
  }
}
