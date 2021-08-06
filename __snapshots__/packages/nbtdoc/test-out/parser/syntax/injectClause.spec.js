exports['injectClause() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['injectClause() Parse "inject compound super::Foo {}" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 29
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      },
      {
        "type": "nbtdoc:inject_clause/compound",
        "range": {
          "start": 7,
          "end": 29
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 7,
              "end": 15
            },
            "value": "compound"
          },
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 16,
                  "end": 21
                },
                "value": "super"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 23,
                  "end": 26
                },
                "value": "Foo"
              }
            ],
            "range": {
              "start": 16,
              "end": 26
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 27,
              "end": 28
            },
            "value": "{"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 28,
              "end": 29
            },
            "value": "}"
          }
        ],
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 16,
                "end": 21
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 23,
                "end": 26
              },
              "value": "Foo"
            }
          ],
          "range": {
            "start": 16,
            "end": 26
          }
        },
        "fields": []
      }
    ],
    "def": {
      "type": "nbtdoc:inject_clause/compound",
      "range": {
        "start": 7,
        "end": 29
      },
      "children": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 7,
            "end": 15
          },
          "value": "compound"
        },
        {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 16,
                "end": 21
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 23,
                "end": 26
              },
              "value": "Foo"
            }
          ],
          "range": {
            "start": 16,
            "end": 26
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 27,
            "end": 28
          },
          "value": "{"
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 28,
            "end": 29
          },
          "value": "}"
        }
      ],
      "path": {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 16,
              "end": 21
            },
            "value": "super"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 23,
              "end": 26
            },
            "value": "Foo"
          }
        ],
        "range": {
          "start": 16,
          "end": 26
        }
      },
      "fields": []
    }
  },
  "errors": []
}

exports['injectClause() Parse "inject compound super::Foo {↓⮀/// Doc comment 1.↓⮀bar: string↓,↓⮀/// Doc comment 2.↓⮀bar: string↓}" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 98
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      },
      {
        "type": "nbtdoc:inject_clause/compound",
        "range": {
          "start": 7,
          "end": 98
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 7,
              "end": 15
            },
            "value": "compound"
          },
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 16,
                  "end": 21
                },
                "value": "super"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 23,
                  "end": 26
                },
                "value": "Foo"
              }
            ],
            "range": {
              "start": 16,
              "end": 26
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 27,
              "end": 28
            },
            "value": "{"
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 30,
              "end": 61
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 30,
                  "end": 50
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 30,
                      "end": 49
                    },
                    "comment": " Doc comment 1.\n"
                  }
                ],
                "value": " Doc comment 1.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 50,
                  "end": 53
                },
                "value": "bar"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 53,
                  "end": 54
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 55,
                  "end": 61
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 30,
                "end": 50
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 30,
                    "end": 49
                  },
                  "comment": " Doc comment 1.\n"
                }
              ],
              "value": " Doc comment 1.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 50,
                "end": 53
              },
              "value": "bar"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 55,
                "end": 61
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 62,
              "end": 63
            },
            "value": ","
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 65,
              "end": 96
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 65,
                  "end": 85
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 65,
                      "end": 84
                    },
                    "comment": " Doc comment 2.\n"
                  }
                ],
                "value": " Doc comment 2.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 85,
                  "end": 88
                },
                "value": "bar"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 88,
                  "end": 89
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 90,
                  "end": 96
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 65,
                "end": 85
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 65,
                    "end": 84
                  },
                  "comment": " Doc comment 2.\n"
                }
              ],
              "value": " Doc comment 2.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 85,
                "end": 88
              },
              "value": "bar"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 90,
                "end": 96
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 97,
              "end": 98
            },
            "value": "}"
          }
        ],
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 16,
                "end": 21
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 23,
                "end": 26
              },
              "value": "Foo"
            }
          ],
          "range": {
            "start": 16,
            "end": 26
          }
        },
        "fields": [
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 30,
              "end": 61
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 30,
                  "end": 50
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 30,
                      "end": 49
                    },
                    "comment": " Doc comment 1.\n"
                  }
                ],
                "value": " Doc comment 1.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 50,
                  "end": 53
                },
                "value": "bar"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 53,
                  "end": 54
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 55,
                  "end": 61
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 30,
                "end": 50
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 30,
                    "end": 49
                  },
                  "comment": " Doc comment 1.\n"
                }
              ],
              "value": " Doc comment 1.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 50,
                "end": 53
              },
              "value": "bar"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 55,
                "end": 61
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 65,
              "end": 96
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 65,
                  "end": 85
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 65,
                      "end": 84
                    },
                    "comment": " Doc comment 2.\n"
                  }
                ],
                "value": " Doc comment 2.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 85,
                  "end": 88
                },
                "value": "bar"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 88,
                  "end": 89
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 90,
                  "end": 96
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 65,
                "end": 85
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 65,
                    "end": 84
                  },
                  "comment": " Doc comment 2.\n"
                }
              ],
              "value": " Doc comment 2.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 85,
                "end": 88
              },
              "value": "bar"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 90,
                "end": 96
              },
              "typeType": "string"
            }
          }
        ]
      }
    ],
    "def": {
      "type": "nbtdoc:inject_clause/compound",
      "range": {
        "start": 7,
        "end": 98
      },
      "children": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 7,
            "end": 15
          },
          "value": "compound"
        },
        {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 16,
                "end": 21
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 23,
                "end": 26
              },
              "value": "Foo"
            }
          ],
          "range": {
            "start": 16,
            "end": 26
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 27,
            "end": 28
          },
          "value": "{"
        },
        {
          "type": "nbtdoc:compound_definition/field",
          "range": {
            "start": 30,
            "end": 61
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 30,
                "end": 50
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 30,
                    "end": 49
                  },
                  "comment": " Doc comment 1.\n"
                }
              ],
              "value": " Doc comment 1.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 50,
                "end": 53
              },
              "value": "bar"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 53,
                "end": 54
              },
              "value": ":"
            },
            {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 55,
                "end": 61
              },
              "typeType": "string"
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 30,
              "end": 50
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 30,
                  "end": 49
                },
                "comment": " Doc comment 1.\n"
              }
            ],
            "value": " Doc comment 1.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 50,
              "end": 53
            },
            "value": "bar"
          },
          "fieldType": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 55,
              "end": 61
            },
            "typeType": "string"
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 62,
            "end": 63
          },
          "value": ","
        },
        {
          "type": "nbtdoc:compound_definition/field",
          "range": {
            "start": 65,
            "end": 96
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 65,
                "end": 85
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 65,
                    "end": 84
                  },
                  "comment": " Doc comment 2.\n"
                }
              ],
              "value": " Doc comment 2.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 85,
                "end": 88
              },
              "value": "bar"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 88,
                "end": 89
              },
              "value": ":"
            },
            {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 90,
                "end": 96
              },
              "typeType": "string"
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 65,
              "end": 85
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 65,
                  "end": 84
                },
                "comment": " Doc comment 2.\n"
              }
            ],
            "value": " Doc comment 2.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 85,
              "end": 88
            },
            "value": "bar"
          },
          "fieldType": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 90,
              "end": 96
            },
            "typeType": "string"
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 97,
            "end": 98
          },
          "value": "}"
        }
      ],
      "path": {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 16,
              "end": 21
            },
            "value": "super"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 23,
              "end": 26
            },
            "value": "Foo"
          }
        ],
        "range": {
          "start": 16,
          "end": 26
        }
      },
      "fields": [
        {
          "type": "nbtdoc:compound_definition/field",
          "range": {
            "start": 30,
            "end": 61
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 30,
                "end": 50
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 30,
                    "end": 49
                  },
                  "comment": " Doc comment 1.\n"
                }
              ],
              "value": " Doc comment 1.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 50,
                "end": 53
              },
              "value": "bar"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 53,
                "end": 54
              },
              "value": ":"
            },
            {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 55,
                "end": 61
              },
              "typeType": "string"
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 30,
              "end": 50
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 30,
                  "end": 49
                },
                "comment": " Doc comment 1.\n"
              }
            ],
            "value": " Doc comment 1.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 50,
              "end": 53
            },
            "value": "bar"
          },
          "fieldType": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 55,
              "end": 61
            },
            "typeType": "string"
          }
        },
        {
          "type": "nbtdoc:compound_definition/field",
          "range": {
            "start": 65,
            "end": 96
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 65,
                "end": 85
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 65,
                    "end": 84
                  },
                  "comment": " Doc comment 2.\n"
                }
              ],
              "value": " Doc comment 2.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 85,
                "end": 88
              },
              "value": "bar"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 88,
                "end": 89
              },
              "value": ":"
            },
            {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 90,
                "end": 96
              },
              "typeType": "string"
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 65,
              "end": 85
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 65,
                  "end": 84
                },
                "comment": " Doc comment 2.\n"
              }
            ],
            "value": " Doc comment 2.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 85,
              "end": 88
            },
            "value": "bar"
          },
          "fieldType": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 90,
              "end": 96
            },
            "typeType": "string"
          }
        }
      ]
    }
  },
  "errors": []
}

exports['injectClause() Parse "inject compound super::Foo {↓⮀/// Doc comment.↓⮀bar: string↓}" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 61
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      },
      {
        "type": "nbtdoc:inject_clause/compound",
        "range": {
          "start": 7,
          "end": 61
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 7,
              "end": 15
            },
            "value": "compound"
          },
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 16,
                  "end": 21
                },
                "value": "super"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 23,
                  "end": 26
                },
                "value": "Foo"
              }
            ],
            "range": {
              "start": 16,
              "end": 26
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 27,
              "end": 28
            },
            "value": "{"
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 30,
              "end": 59
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 30,
                  "end": 48
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 30,
                      "end": 47
                    },
                    "comment": " Doc comment.\n"
                  }
                ],
                "value": " Doc comment.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 48,
                  "end": 51
                },
                "value": "bar"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 51,
                  "end": 52
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 53,
                  "end": 59
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 30,
                "end": 48
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 30,
                    "end": 47
                  },
                  "comment": " Doc comment.\n"
                }
              ],
              "value": " Doc comment.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 48,
                "end": 51
              },
              "value": "bar"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 53,
                "end": 59
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 60,
              "end": 61
            },
            "value": "}"
          }
        ],
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 16,
                "end": 21
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 23,
                "end": 26
              },
              "value": "Foo"
            }
          ],
          "range": {
            "start": 16,
            "end": 26
          }
        },
        "fields": [
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 30,
              "end": 59
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 30,
                  "end": 48
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 30,
                      "end": 47
                    },
                    "comment": " Doc comment.\n"
                  }
                ],
                "value": " Doc comment.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 48,
                  "end": 51
                },
                "value": "bar"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 51,
                  "end": 52
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 53,
                  "end": 59
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 30,
                "end": 48
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 30,
                    "end": 47
                  },
                  "comment": " Doc comment.\n"
                }
              ],
              "value": " Doc comment.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 48,
                "end": 51
              },
              "value": "bar"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 53,
                "end": 59
              },
              "typeType": "string"
            }
          }
        ]
      }
    ],
    "def": {
      "type": "nbtdoc:inject_clause/compound",
      "range": {
        "start": 7,
        "end": 61
      },
      "children": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 7,
            "end": 15
          },
          "value": "compound"
        },
        {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 16,
                "end": 21
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 23,
                "end": 26
              },
              "value": "Foo"
            }
          ],
          "range": {
            "start": 16,
            "end": 26
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 27,
            "end": 28
          },
          "value": "{"
        },
        {
          "type": "nbtdoc:compound_definition/field",
          "range": {
            "start": 30,
            "end": 59
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 30,
                "end": 48
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 30,
                    "end": 47
                  },
                  "comment": " Doc comment.\n"
                }
              ],
              "value": " Doc comment.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 48,
                "end": 51
              },
              "value": "bar"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 51,
                "end": 52
              },
              "value": ":"
            },
            {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 53,
                "end": 59
              },
              "typeType": "string"
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 30,
              "end": 48
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 30,
                  "end": 47
                },
                "comment": " Doc comment.\n"
              }
            ],
            "value": " Doc comment.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 48,
              "end": 51
            },
            "value": "bar"
          },
          "fieldType": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 53,
              "end": 59
            },
            "typeType": "string"
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 60,
            "end": 61
          },
          "value": "}"
        }
      ],
      "path": {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 16,
              "end": 21
            },
            "value": "super"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 23,
              "end": 26
            },
            "value": "Foo"
          }
        ],
        "range": {
          "start": 16,
          "end": 26
        }
      },
      "fields": [
        {
          "type": "nbtdoc:compound_definition/field",
          "range": {
            "start": 30,
            "end": 59
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 30,
                "end": 48
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 30,
                    "end": 47
                  },
                  "comment": " Doc comment.\n"
                }
              ],
              "value": " Doc comment.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 48,
                "end": 51
              },
              "value": "bar"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 51,
                "end": 52
              },
              "value": ":"
            },
            {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 53,
                "end": 59
              },
              "typeType": "string"
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 30,
              "end": 48
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 30,
                  "end": 47
                },
                "comment": " Doc comment.\n"
              }
            ],
            "value": " Doc comment.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 48,
              "end": 51
            },
            "value": "bar"
          },
          "fieldType": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 53,
              "end": 59
            },
            "typeType": "string"
          }
        }
      ]
    }
  },
  "errors": []
}

exports['injectClause() Parse "inject compound" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 15
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      },
      {
        "type": "nbtdoc:inject_clause/compound",
        "range": {
          "start": 7,
          "end": 15
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 7,
              "end": 15
            },
            "value": "compound"
          },
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "value": ""
              }
            ],
            "range": {
              "start": 15,
              "end": 15
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 15,
              "end": 15
            },
            "value": ""
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 15,
              "end": 15
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "children": [],
                "value": ""
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "value": ""
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "value": ""
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "typeType": "path",
                "path": {
                  "type": "nbtdoc:ident_path",
                  "fromGlobalRoot": false,
                  "children": [
                    {
                      "type": "nbtdoc:identifier",
                      "range": {
                        "start": 15,
                        "end": 15
                      },
                      "value": ""
                    }
                  ],
                  "range": {
                    "start": 15,
                    "end": 15
                  }
                }
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 15,
                "end": 15
              },
              "children": [],
              "value": ""
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 15,
                "end": 15
              },
              "value": ""
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 15,
                "end": 15
              },
              "typeType": "path",
              "path": {
                "type": "nbtdoc:ident_path",
                "fromGlobalRoot": false,
                "children": [
                  {
                    "type": "nbtdoc:identifier",
                    "range": {
                      "start": 15,
                      "end": 15
                    },
                    "value": ""
                  }
                ],
                "range": {
                  "start": 15,
                  "end": 15
                }
              }
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 15,
              "end": 15
            },
            "value": ""
          }
        ],
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 15,
                "end": 15
              },
              "value": ""
            }
          ],
          "range": {
            "start": 15,
            "end": 15
          }
        },
        "fields": [
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 15,
              "end": 15
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "children": [],
                "value": ""
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "value": ""
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "value": ""
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 15,
                  "end": 15
                },
                "typeType": "path",
                "path": {
                  "type": "nbtdoc:ident_path",
                  "fromGlobalRoot": false,
                  "children": [
                    {
                      "type": "nbtdoc:identifier",
                      "range": {
                        "start": 15,
                        "end": 15
                      },
                      "value": ""
                    }
                  ],
                  "range": {
                    "start": 15,
                    "end": 15
                  }
                }
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 15,
                "end": 15
              },
              "children": [],
              "value": ""
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 15,
                "end": 15
              },
              "value": ""
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 15,
                "end": 15
              },
              "typeType": "path",
              "path": {
                "type": "nbtdoc:ident_path",
                "fromGlobalRoot": false,
                "children": [
                  {
                    "type": "nbtdoc:identifier",
                    "range": {
                      "start": 15,
                      "end": 15
                    },
                    "value": ""
                  }
                ],
                "range": {
                  "start": 15,
                  "end": 15
                }
              }
            }
          }
        ]
      }
    ],
    "def": {
      "type": "nbtdoc:inject_clause/compound",
      "range": {
        "start": 7,
        "end": 15
      },
      "children": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 7,
            "end": 15
          },
          "value": "compound"
        },
        {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 15,
                "end": 15
              },
              "value": ""
            }
          ],
          "range": {
            "start": 15,
            "end": 15
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 15,
            "end": 15
          },
          "value": ""
        },
        {
          "type": "nbtdoc:compound_definition/field",
          "range": {
            "start": 15,
            "end": 15
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 15,
                "end": 15
              },
              "children": [],
              "value": ""
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 15,
                "end": 15
              },
              "value": ""
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 15,
                "end": 15
              },
              "value": ""
            },
            {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 15,
                "end": 15
              },
              "typeType": "path",
              "path": {
                "type": "nbtdoc:ident_path",
                "fromGlobalRoot": false,
                "children": [
                  {
                    "type": "nbtdoc:identifier",
                    "range": {
                      "start": 15,
                      "end": 15
                    },
                    "value": ""
                  }
                ],
                "range": {
                  "start": 15,
                  "end": 15
                }
              }
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "children": [],
            "value": ""
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 15
            },
            "value": ""
          },
          "fieldType": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 15,
              "end": 15
            },
            "typeType": "path",
            "path": {
              "type": "nbtdoc:ident_path",
              "fromGlobalRoot": false,
              "children": [
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 15,
                    "end": 15
                  },
                  "value": ""
                }
              ],
              "range": {
                "start": 15,
                "end": 15
              }
            }
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 15,
            "end": 15
          },
          "value": ""
        }
      ],
      "path": {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 15
            },
            "value": ""
          }
        ],
        "range": {
          "start": 15,
          "end": 15
        }
      },
      "fields": [
        {
          "type": "nbtdoc:compound_definition/field",
          "range": {
            "start": 15,
            "end": 15
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 15,
                "end": 15
              },
              "children": [],
              "value": ""
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 15,
                "end": 15
              },
              "value": ""
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 15,
                "end": 15
              },
              "value": ""
            },
            {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 15,
                "end": 15
              },
              "typeType": "path",
              "path": {
                "type": "nbtdoc:ident_path",
                "fromGlobalRoot": false,
                "children": [
                  {
                    "type": "nbtdoc:identifier",
                    "range": {
                      "start": 15,
                      "end": 15
                    },
                    "value": ""
                  }
                ],
                "range": {
                  "start": 15,
                  "end": 15
                }
              }
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "children": [],
            "value": ""
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 15
            },
            "value": ""
          },
          "fieldType": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 15,
              "end": 15
            },
            "typeType": "path",
            "path": {
              "type": "nbtdoc:ident_path",
              "fromGlobalRoot": false,
              "children": [
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 15,
                    "end": 15
                  },
                  "value": ""
                }
              ],
              "range": {
                "start": 15,
                "end": 15
              }
            }
          }
        }
      ]
    }
  },
  "errors": [
    {
      "range": {
        "start": 15,
        "end": 15
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 15,
        "end": 15
      },
      "message": "Expected “{”",
      "severity": 3
    },
    {
      "range": {
        "start": 15,
        "end": 15
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 15,
        "end": 15
      },
      "message": "Expected “:”",
      "severity": 3
    },
    {
      "range": {
        "start": 15,
        "end": 15
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 15,
        "end": 15
      },
      "message": "Expected “}”",
      "severity": 3
    }
  ]
}

exports['injectClause() Parse "inject enum () super::Eww {}" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 28
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      },
      {
        "type": "nbtdoc:inject_clause/enum",
        "range": {
          "start": 7,
          "end": 28
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 7,
              "end": 11
            },
            "value": "enum"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 12,
              "end": 13
            },
            "value": "("
          },
          {
            "type": "nbtdoc:literal",
            "value": "",
            "range": {
              "start": 13,
              "end": 13
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 13,
              "end": 14
            },
            "value": ")"
          },
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 15,
                  "end": 20
                },
                "value": "super"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 22,
                  "end": 25
                },
                "value": "Eww"
              }
            ],
            "range": {
              "start": 15,
              "end": 25
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 26,
              "end": 27
            },
            "value": "{"
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 27,
              "end": 27
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 27,
                  "end": 27
                },
                "children": [],
                "value": ""
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 27,
                  "end": 27
                },
                "value": ""
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 27
                },
                "value": ""
              },
              {
                "type": "integer",
                "range": {
                  "start": 27,
                  "end": 27
                },
                "value": 0
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 27,
                "end": 27
              },
              "children": [],
              "value": ""
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": ""
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": 0
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 27,
              "end": 28
            },
            "value": "}"
          }
        ],
        "enumType": {
          "type": "nbtdoc:literal",
          "value": "",
          "range": {
            "start": 13,
            "end": 13
          }
        },
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 15,
                "end": 20
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 22,
                "end": 25
              },
              "value": "Eww"
            }
          ],
          "range": {
            "start": 15,
            "end": 25
          }
        },
        "fields": [
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 27,
              "end": 27
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 27,
                  "end": 27
                },
                "children": [],
                "value": ""
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 27,
                  "end": 27
                },
                "value": ""
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 27
                },
                "value": ""
              },
              {
                "type": "integer",
                "range": {
                  "start": 27,
                  "end": 27
                },
                "value": 0
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 27,
                "end": 27
              },
              "children": [],
              "value": ""
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": ""
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": 0
            }
          }
        ]
      }
    ],
    "def": {
      "type": "nbtdoc:inject_clause/enum",
      "range": {
        "start": 7,
        "end": 28
      },
      "children": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 7,
            "end": 11
          },
          "value": "enum"
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 12,
            "end": 13
          },
          "value": "("
        },
        {
          "type": "nbtdoc:literal",
          "value": "",
          "range": {
            "start": 13,
            "end": 13
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 13,
            "end": 14
          },
          "value": ")"
        },
        {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 15,
                "end": 20
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 22,
                "end": 25
              },
              "value": "Eww"
            }
          ],
          "range": {
            "start": 15,
            "end": 25
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 26,
            "end": 27
          },
          "value": "{"
        },
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 27,
            "end": 27
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 27,
                "end": 27
              },
              "children": [],
              "value": ""
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": ""
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": ""
            },
            {
              "type": "integer",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": 0
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 27,
              "end": 27
            },
            "children": [],
            "value": ""
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 27,
              "end": 27
            },
            "value": ""
          },
          "value": {
            "type": "integer",
            "range": {
              "start": 27,
              "end": 27
            },
            "value": 0
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 27,
            "end": 28
          },
          "value": "}"
        }
      ],
      "enumType": {
        "type": "nbtdoc:literal",
        "value": "",
        "range": {
          "start": 13,
          "end": 13
        }
      },
      "path": {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "super"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 22,
              "end": 25
            },
            "value": "Eww"
          }
        ],
        "range": {
          "start": 15,
          "end": 25
        }
      },
      "fields": [
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 27,
            "end": 27
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 27,
                "end": 27
              },
              "children": [],
              "value": ""
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": ""
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": ""
            },
            {
              "type": "integer",
              "range": {
                "start": 27,
                "end": 27
              },
              "value": 0
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 27,
              "end": 27
            },
            "children": [],
            "value": ""
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 27,
              "end": 27
            },
            "value": ""
          },
          "value": {
            "type": "integer",
            "range": {
              "start": 27,
              "end": 27
            },
            "value": 0
          }
        }
      ]
    }
  },
  "errors": [
    {
      "range": {
        "start": 13,
        "end": 13
      },
      "message": "Expected “byte”, “short”, “int”, “long”, “string”, “float”, or “double”",
      "severity": 3
    },
    {
      "range": {
        "start": 27,
        "end": 27
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 27,
        "end": 27
      },
      "message": "Expected “=”",
      "severity": 3
    },
    {
      "range": {
        "start": 27,
        "end": 27
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['injectClause() Parse "inject enum (string) super::Eww {↓⮀/// Doc comment 1.↓⮀Color1 = "Red",↓⮀/// Doc comment 2.↓⮀Color2 = "Blue"↓}" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 109
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      },
      {
        "type": "nbtdoc:inject_clause/enum",
        "range": {
          "start": 7,
          "end": 109
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 7,
              "end": 11
            },
            "value": "enum"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 12,
              "end": 13
            },
            "value": "("
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 13,
              "end": 19
            },
            "value": "string"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 19,
              "end": 20
            },
            "value": ")"
          },
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 21,
                  "end": 26
                },
                "value": "super"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": "Eww"
              }
            ],
            "range": {
              "start": 21,
              "end": 31
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 32,
              "end": 33
            },
            "value": "{"
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 35,
              "end": 69
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 35,
                  "end": 55
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 35,
                      "end": 54
                    },
                    "comment": " Doc comment 1.\n"
                  }
                ],
                "value": " Doc comment 1.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 55,
                  "end": 61
                },
                "value": "Color1"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 62,
                  "end": 63
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 64,
                  "end": 69
                },
                "value": "Red",
                "valueMap": [
                  {
                    "outer": {
                      "start": 65,
                      "end": 65
                    },
                    "inner": {
                      "start": 0,
                      "end": 0
                    }
                  }
                ]
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 35,
                "end": 55
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 35,
                    "end": 54
                  },
                  "comment": " Doc comment 1.\n"
                }
              ],
              "value": " Doc comment 1.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 55,
                "end": 61
              },
              "value": "Color1"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 64,
                "end": 69
              },
              "value": "Red",
              "valueMap": [
                {
                  "outer": {
                    "start": 65,
                    "end": 65
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 69,
              "end": 70
            },
            "value": ","
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 72,
              "end": 107
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 72,
                  "end": 92
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 72,
                      "end": 91
                    },
                    "comment": " Doc comment 2.\n"
                  }
                ],
                "value": " Doc comment 2.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 92,
                  "end": 98
                },
                "value": "Color2"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 99,
                  "end": 100
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 101,
                  "end": 107
                },
                "value": "Blue",
                "valueMap": [
                  {
                    "outer": {
                      "start": 102,
                      "end": 102
                    },
                    "inner": {
                      "start": 0,
                      "end": 0
                    }
                  }
                ]
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 72,
                "end": 92
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 72,
                    "end": 91
                  },
                  "comment": " Doc comment 2.\n"
                }
              ],
              "value": " Doc comment 2.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 92,
                "end": 98
              },
              "value": "Color2"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 101,
                "end": 107
              },
              "value": "Blue",
              "valueMap": [
                {
                  "outer": {
                    "start": 102,
                    "end": 102
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 108,
              "end": 109
            },
            "value": "}"
          }
        ],
        "enumType": {
          "type": "nbtdoc:literal",
          "range": {
            "start": 13,
            "end": 19
          },
          "value": "string"
        },
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 21,
                "end": 26
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 28,
                "end": 31
              },
              "value": "Eww"
            }
          ],
          "range": {
            "start": 21,
            "end": 31
          }
        },
        "fields": [
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 35,
              "end": 69
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 35,
                  "end": 55
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 35,
                      "end": 54
                    },
                    "comment": " Doc comment 1.\n"
                  }
                ],
                "value": " Doc comment 1.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 55,
                  "end": 61
                },
                "value": "Color1"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 62,
                  "end": 63
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 64,
                  "end": 69
                },
                "value": "Red",
                "valueMap": [
                  {
                    "outer": {
                      "start": 65,
                      "end": 65
                    },
                    "inner": {
                      "start": 0,
                      "end": 0
                    }
                  }
                ]
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 35,
                "end": 55
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 35,
                    "end": 54
                  },
                  "comment": " Doc comment 1.\n"
                }
              ],
              "value": " Doc comment 1.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 55,
                "end": 61
              },
              "value": "Color1"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 64,
                "end": 69
              },
              "value": "Red",
              "valueMap": [
                {
                  "outer": {
                    "start": 65,
                    "end": 65
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 72,
              "end": 107
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 72,
                  "end": 92
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 72,
                      "end": 91
                    },
                    "comment": " Doc comment 2.\n"
                  }
                ],
                "value": " Doc comment 2.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 92,
                  "end": 98
                },
                "value": "Color2"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 99,
                  "end": 100
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 101,
                  "end": 107
                },
                "value": "Blue",
                "valueMap": [
                  {
                    "outer": {
                      "start": 102,
                      "end": 102
                    },
                    "inner": {
                      "start": 0,
                      "end": 0
                    }
                  }
                ]
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 72,
                "end": 92
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 72,
                    "end": 91
                  },
                  "comment": " Doc comment 2.\n"
                }
              ],
              "value": " Doc comment 2.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 92,
                "end": 98
              },
              "value": "Color2"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 101,
                "end": 107
              },
              "value": "Blue",
              "valueMap": [
                {
                  "outer": {
                    "start": 102,
                    "end": 102
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    "def": {
      "type": "nbtdoc:inject_clause/enum",
      "range": {
        "start": 7,
        "end": 109
      },
      "children": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 7,
            "end": 11
          },
          "value": "enum"
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 12,
            "end": 13
          },
          "value": "("
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 13,
            "end": 19
          },
          "value": "string"
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 19,
            "end": 20
          },
          "value": ")"
        },
        {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 21,
                "end": 26
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 28,
                "end": 31
              },
              "value": "Eww"
            }
          ],
          "range": {
            "start": 21,
            "end": 31
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 32,
            "end": 33
          },
          "value": "{"
        },
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 35,
            "end": 69
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 35,
                "end": 55
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 35,
                    "end": 54
                  },
                  "comment": " Doc comment 1.\n"
                }
              ],
              "value": " Doc comment 1.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 55,
                "end": 61
              },
              "value": "Color1"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 62,
                "end": 63
              },
              "value": "="
            },
            {
              "type": "string",
              "range": {
                "start": 64,
                "end": 69
              },
              "value": "Red",
              "valueMap": [
                {
                  "outer": {
                    "start": 65,
                    "end": 65
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 35,
              "end": 55
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 35,
                  "end": 54
                },
                "comment": " Doc comment 1.\n"
              }
            ],
            "value": " Doc comment 1.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 55,
              "end": 61
            },
            "value": "Color1"
          },
          "value": {
            "type": "string",
            "range": {
              "start": 64,
              "end": 69
            },
            "value": "Red",
            "valueMap": [
              {
                "outer": {
                  "start": 65,
                  "end": 65
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 69,
            "end": 70
          },
          "value": ","
        },
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 72,
            "end": 107
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 72,
                "end": 92
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 72,
                    "end": 91
                  },
                  "comment": " Doc comment 2.\n"
                }
              ],
              "value": " Doc comment 2.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 92,
                "end": 98
              },
              "value": "Color2"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 99,
                "end": 100
              },
              "value": "="
            },
            {
              "type": "string",
              "range": {
                "start": 101,
                "end": 107
              },
              "value": "Blue",
              "valueMap": [
                {
                  "outer": {
                    "start": 102,
                    "end": 102
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 72,
              "end": 92
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 72,
                  "end": 91
                },
                "comment": " Doc comment 2.\n"
              }
            ],
            "value": " Doc comment 2.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 92,
              "end": 98
            },
            "value": "Color2"
          },
          "value": {
            "type": "string",
            "range": {
              "start": 101,
              "end": 107
            },
            "value": "Blue",
            "valueMap": [
              {
                "outer": {
                  "start": 102,
                  "end": 102
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 108,
            "end": 109
          },
          "value": "}"
        }
      ],
      "enumType": {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 19
        },
        "value": "string"
      },
      "path": {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 21,
              "end": 26
            },
            "value": "super"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 28,
              "end": 31
            },
            "value": "Eww"
          }
        ],
        "range": {
          "start": 21,
          "end": 31
        }
      },
      "fields": [
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 35,
            "end": 69
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 35,
                "end": 55
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 35,
                    "end": 54
                  },
                  "comment": " Doc comment 1.\n"
                }
              ],
              "value": " Doc comment 1.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 55,
                "end": 61
              },
              "value": "Color1"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 62,
                "end": 63
              },
              "value": "="
            },
            {
              "type": "string",
              "range": {
                "start": 64,
                "end": 69
              },
              "value": "Red",
              "valueMap": [
                {
                  "outer": {
                    "start": 65,
                    "end": 65
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 35,
              "end": 55
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 35,
                  "end": 54
                },
                "comment": " Doc comment 1.\n"
              }
            ],
            "value": " Doc comment 1.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 55,
              "end": 61
            },
            "value": "Color1"
          },
          "value": {
            "type": "string",
            "range": {
              "start": 64,
              "end": 69
            },
            "value": "Red",
            "valueMap": [
              {
                "outer": {
                  "start": 65,
                  "end": 65
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        },
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 72,
            "end": 107
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 72,
                "end": 92
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 72,
                    "end": 91
                  },
                  "comment": " Doc comment 2.\n"
                }
              ],
              "value": " Doc comment 2.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 92,
                "end": 98
              },
              "value": "Color2"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 99,
                "end": 100
              },
              "value": "="
            },
            {
              "type": "string",
              "range": {
                "start": 101,
                "end": 107
              },
              "value": "Blue",
              "valueMap": [
                {
                  "outer": {
                    "start": 102,
                    "end": 102
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 72,
              "end": 92
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 72,
                  "end": 91
                },
                "comment": " Doc comment 2.\n"
              }
            ],
            "value": " Doc comment 2.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 92,
              "end": 98
            },
            "value": "Color2"
          },
          "value": {
            "type": "string",
            "range": {
              "start": 101,
              "end": 107
            },
            "value": "Blue",
            "valueMap": [
              {
                "outer": {
                  "start": 102,
                  "end": 102
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        }
      ]
    }
  },
  "errors": []
}

exports['injectClause() Parse "inject enum (string) super::Eww {↓⮀/// Doc comment.↓⮀Color = "Red"↓}" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 68
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      },
      {
        "type": "nbtdoc:inject_clause/enum",
        "range": {
          "start": 7,
          "end": 68
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 7,
              "end": 11
            },
            "value": "enum"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 12,
              "end": 13
            },
            "value": "("
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 13,
              "end": 19
            },
            "value": "string"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 19,
              "end": 20
            },
            "value": ")"
          },
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 21,
                  "end": 26
                },
                "value": "super"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": "Eww"
              }
            ],
            "range": {
              "start": 21,
              "end": 31
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 32,
              "end": 33
            },
            "value": "{"
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 35,
              "end": 66
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 35,
                  "end": 53
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 35,
                      "end": 52
                    },
                    "comment": " Doc comment.\n"
                  }
                ],
                "value": " Doc comment.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 53,
                  "end": 58
                },
                "value": "Color"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 59,
                  "end": 60
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 61,
                  "end": 66
                },
                "value": "Red",
                "valueMap": [
                  {
                    "outer": {
                      "start": 62,
                      "end": 62
                    },
                    "inner": {
                      "start": 0,
                      "end": 0
                    }
                  }
                ]
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 35,
                "end": 53
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 35,
                    "end": 52
                  },
                  "comment": " Doc comment.\n"
                }
              ],
              "value": " Doc comment.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 53,
                "end": 58
              },
              "value": "Color"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 61,
                "end": 66
              },
              "value": "Red",
              "valueMap": [
                {
                  "outer": {
                    "start": 62,
                    "end": 62
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 67,
              "end": 68
            },
            "value": "}"
          }
        ],
        "enumType": {
          "type": "nbtdoc:literal",
          "range": {
            "start": 13,
            "end": 19
          },
          "value": "string"
        },
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 21,
                "end": 26
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 28,
                "end": 31
              },
              "value": "Eww"
            }
          ],
          "range": {
            "start": 21,
            "end": 31
          }
        },
        "fields": [
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 35,
              "end": 66
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 35,
                  "end": 53
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 35,
                      "end": 52
                    },
                    "comment": " Doc comment.\n"
                  }
                ],
                "value": " Doc comment.\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 53,
                  "end": 58
                },
                "value": "Color"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 59,
                  "end": 60
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 61,
                  "end": 66
                },
                "value": "Red",
                "valueMap": [
                  {
                    "outer": {
                      "start": 62,
                      "end": 62
                    },
                    "inner": {
                      "start": 0,
                      "end": 0
                    }
                  }
                ]
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 35,
                "end": 53
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 35,
                    "end": 52
                  },
                  "comment": " Doc comment.\n"
                }
              ],
              "value": " Doc comment.\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 53,
                "end": 58
              },
              "value": "Color"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 61,
                "end": 66
              },
              "value": "Red",
              "valueMap": [
                {
                  "outer": {
                    "start": 62,
                    "end": 62
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    "def": {
      "type": "nbtdoc:inject_clause/enum",
      "range": {
        "start": 7,
        "end": 68
      },
      "children": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 7,
            "end": 11
          },
          "value": "enum"
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 12,
            "end": 13
          },
          "value": "("
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 13,
            "end": 19
          },
          "value": "string"
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 19,
            "end": 20
          },
          "value": ")"
        },
        {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 21,
                "end": 26
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 28,
                "end": 31
              },
              "value": "Eww"
            }
          ],
          "range": {
            "start": 21,
            "end": 31
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 32,
            "end": 33
          },
          "value": "{"
        },
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 35,
            "end": 66
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 35,
                "end": 53
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 35,
                    "end": 52
                  },
                  "comment": " Doc comment.\n"
                }
              ],
              "value": " Doc comment.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 53,
                "end": 58
              },
              "value": "Color"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 59,
                "end": 60
              },
              "value": "="
            },
            {
              "type": "string",
              "range": {
                "start": 61,
                "end": 66
              },
              "value": "Red",
              "valueMap": [
                {
                  "outer": {
                    "start": 62,
                    "end": 62
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 35,
              "end": 53
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 35,
                  "end": 52
                },
                "comment": " Doc comment.\n"
              }
            ],
            "value": " Doc comment.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 53,
              "end": 58
            },
            "value": "Color"
          },
          "value": {
            "type": "string",
            "range": {
              "start": 61,
              "end": 66
            },
            "value": "Red",
            "valueMap": [
              {
                "outer": {
                  "start": 62,
                  "end": 62
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 67,
            "end": 68
          },
          "value": "}"
        }
      ],
      "enumType": {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 19
        },
        "value": "string"
      },
      "path": {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 21,
              "end": 26
            },
            "value": "super"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 28,
              "end": 31
            },
            "value": "Eww"
          }
        ],
        "range": {
          "start": 21,
          "end": 31
        }
      },
      "fields": [
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 35,
            "end": 66
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 35,
                "end": 53
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 35,
                    "end": 52
                  },
                  "comment": " Doc comment.\n"
                }
              ],
              "value": " Doc comment.\n"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 53,
                "end": 58
              },
              "value": "Color"
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 59,
                "end": 60
              },
              "value": "="
            },
            {
              "type": "string",
              "range": {
                "start": 61,
                "end": 66
              },
              "value": "Red",
              "valueMap": [
                {
                  "outer": {
                    "start": 62,
                    "end": 62
                  },
                  "inner": {
                    "start": 0,
                    "end": 0
                  }
                }
              ]
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 35,
              "end": 53
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 35,
                  "end": 52
                },
                "comment": " Doc comment.\n"
              }
            ],
            "value": " Doc comment.\n"
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 53,
              "end": 58
            },
            "value": "Color"
          },
          "value": {
            "type": "string",
            "range": {
              "start": 61,
              "end": 66
            },
            "value": "Red",
            "valueMap": [
              {
                "outer": {
                  "start": 62,
                  "end": 62
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        }
      ]
    }
  },
  "errors": []
}

exports['injectClause() Parse "inject enum" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      },
      {
        "type": "nbtdoc:inject_clause/enum",
        "range": {
          "start": 7,
          "end": 11
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 7,
              "end": 11
            },
            "value": "enum"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": ""
          },
          {
            "type": "nbtdoc:literal",
            "value": "",
            "range": {
              "start": 11,
              "end": 11
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": ""
          },
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "value": ""
              }
            ],
            "range": {
              "start": 11,
              "end": 11
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": ""
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 11,
              "end": 11
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "children": [],
                "value": ""
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "value": ""
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "value": ""
              },
              {
                "type": "integer",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "value": 0
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 11,
                "end": 11
              },
              "children": [],
              "value": ""
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": ""
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": 0
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": ""
          }
        ],
        "enumType": {
          "type": "nbtdoc:literal",
          "range": {
            "start": 11,
            "end": 11
          },
          "value": ""
        },
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": ""
            }
          ],
          "range": {
            "start": 11,
            "end": 11
          }
        },
        "fields": [
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 11,
              "end": 11
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "children": [],
                "value": ""
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "value": ""
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "value": ""
              },
              {
                "type": "integer",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "value": 0
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 11,
                "end": 11
              },
              "children": [],
              "value": ""
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": ""
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": 0
            }
          }
        ]
      }
    ],
    "def": {
      "type": "nbtdoc:inject_clause/enum",
      "range": {
        "start": 7,
        "end": 11
      },
      "children": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 7,
            "end": 11
          },
          "value": "enum"
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 11,
            "end": 11
          },
          "value": ""
        },
        {
          "type": "nbtdoc:literal",
          "value": "",
          "range": {
            "start": 11,
            "end": 11
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 11,
            "end": 11
          },
          "value": ""
        },
        {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": ""
            }
          ],
          "range": {
            "start": 11,
            "end": 11
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 11,
            "end": 11
          },
          "value": ""
        },
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 11,
            "end": 11
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 11,
                "end": 11
              },
              "children": [],
              "value": ""
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": ""
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": ""
            },
            {
              "type": "integer",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": 0
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 11,
              "end": 11
            },
            "children": [],
            "value": ""
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": ""
          },
          "value": {
            "type": "integer",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": 0
          }
        },
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 11,
            "end": 11
          },
          "value": ""
        }
      ],
      "enumType": {
        "type": "nbtdoc:literal",
        "range": {
          "start": 11,
          "end": 11
        },
        "value": ""
      },
      "path": {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": ""
          }
        ],
        "range": {
          "start": 11,
          "end": 11
        }
      },
      "fields": [
        {
          "type": "nbtdoc:enum_definition/field",
          "range": {
            "start": 11,
            "end": 11
          },
          "children": [
            {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 11,
                "end": 11
              },
              "children": [],
              "value": ""
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": ""
            },
            {
              "type": "nbtdoc:literal",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": ""
            },
            {
              "type": "integer",
              "range": {
                "start": 11,
                "end": 11
              },
              "value": 0
            }
          ],
          "doc": {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 11,
              "end": 11
            },
            "children": [],
            "value": ""
          },
          "key": {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": ""
          },
          "value": {
            "type": "integer",
            "range": {
              "start": 11,
              "end": 11
            },
            "value": 0
          }
        }
      ]
    }
  },
  "errors": [
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “(”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “byte”, “short”, “int”, “long”, “string”, “float”, or “double”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “)”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “{”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “=”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected an integer",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “}”",
      "severity": 3
    }
  ]
}

exports['injectClause() Parse "inject" 1'] = {
  "node": {
    "type": "nbtdoc:inject_clause",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "inject"
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 6,
        "end": 6
      },
      "message": "Expected either an enum inject or a compound inject",
      "severity": 3
    }
  ]
}
