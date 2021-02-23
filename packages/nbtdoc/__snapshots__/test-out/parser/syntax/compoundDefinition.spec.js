exports['compoundDefinition() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['compoundDefinition() Parse "/// Doc comment for the compound.↓compound Jigsaw extends super::BlockEntity {↓⮀/// How the resultant structure can be transformed↓⮀joint: JointType,↓⮀/// The id of the jigsaw that this will "spawn" in↓⮀"name": string↓}" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 219
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 34
        },
        "nodes": [
          {
            "type": "comment",
            "range": {
              "start": 0,
              "end": 34
            },
            "comment": " Doc comment for the compound.\n"
          }
        ],
        "doc": " Doc comment for the compound.\n"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 34,
          "end": 42
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 43,
          "end": 49
        },
        "value": "Jigsaw"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 50,
          "end": 57
        },
        "value": "extends"
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 58,
              "end": 63
            },
            "value": "super"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 65,
              "end": 76
            },
            "value": "BlockEntity"
          }
        ],
        "range": {
          "start": 58,
          "end": 76
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 77,
          "end": 78
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 80,
          "end": 148
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 80,
              "end": 132
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 80,
                  "end": 131
                },
                "comment": " How the resultant structure can be transformed\n"
              }
            ],
            "doc": " How the resultant structure can be transformed\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 132,
              "end": 137
            },
            "value": "joint"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 137,
              "end": 138
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 139,
              "end": 148
            },
            "typeType": "path",
            "path": {
              "type": "nbtdoc:ident_path",
              "fromGlobalRoot": false,
              "path": [
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 139,
                    "end": 148
                  },
                  "value": "JointType"
                }
              ],
              "range": {
                "start": 139,
                "end": 148
              }
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 80,
            "end": 132
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 80,
                "end": 131
              },
              "comment": " How the resultant structure can be transformed\n"
            }
          ],
          "doc": " How the resultant structure can be transformed\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 132,
            "end": 137
          },
          "value": "joint"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 139,
            "end": 148
          },
          "typeType": "path",
          "path": {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "path": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 139,
                  "end": 148
                },
                "value": "JointType"
              }
            ],
            "range": {
              "start": 139,
              "end": 148
            }
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 148,
          "end": 149
        },
        "value": ","
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 151,
          "end": 217
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 151,
              "end": 203
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 151,
                  "end": 202
                },
                "comment": " The id of the jigsaw that this will \"spawn\" in\n"
              }
            ],
            "doc": " The id of the jigsaw that this will \"spawn\" in\n"
          },
          {
            "type": "nbtdoc:string",
            "range": {
              "start": 203,
              "end": 209
            },
            "value": "name"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 209,
              "end": 210
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 211,
              "end": 217
            },
            "typeType": "string"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 151,
            "end": 203
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 151,
                "end": 202
              },
              "comment": " The id of the jigsaw that this will \"spawn\" in\n"
            }
          ],
          "doc": " The id of the jigsaw that this will \"spawn\" in\n"
        },
        "key": {
          "type": "nbtdoc:string",
          "range": {
            "start": 203,
            "end": 209
          },
          "value": "name"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 211,
            "end": 217
          },
          "typeType": "string"
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 218,
          "end": 219
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 34
      },
      "nodes": [
        {
          "type": "comment",
          "range": {
            "start": 0,
            "end": 34
          },
          "comment": " Doc comment for the compound.\n"
        }
      ],
      "doc": " Doc comment for the compound.\n"
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 43,
        "end": 49
      },
      "value": "Jigsaw"
    },
    "extends": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 58,
            "end": 63
          },
          "value": "super"
        },
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 65,
            "end": 76
          },
          "value": "BlockEntity"
        }
      ],
      "range": {
        "start": 58,
        "end": 76
      }
    },
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 80,
          "end": 148
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 80,
              "end": 132
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 80,
                  "end": 131
                },
                "comment": " How the resultant structure can be transformed\n"
              }
            ],
            "doc": " How the resultant structure can be transformed\n"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 132,
              "end": 137
            },
            "value": "joint"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 137,
              "end": 138
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 139,
              "end": 148
            },
            "typeType": "path",
            "path": {
              "type": "nbtdoc:ident_path",
              "fromGlobalRoot": false,
              "path": [
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 139,
                    "end": 148
                  },
                  "value": "JointType"
                }
              ],
              "range": {
                "start": 139,
                "end": 148
              }
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 80,
            "end": 132
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 80,
                "end": 131
              },
              "comment": " How the resultant structure can be transformed\n"
            }
          ],
          "doc": " How the resultant structure can be transformed\n"
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 132,
            "end": 137
          },
          "value": "joint"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 139,
            "end": 148
          },
          "typeType": "path",
          "path": {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "path": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 139,
                  "end": 148
                },
                "value": "JointType"
              }
            ],
            "range": {
              "start": 139,
              "end": 148
            }
          }
        }
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 151,
          "end": 217
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 151,
              "end": 203
            },
            "nodes": [
              {
                "type": "comment",
                "range": {
                  "start": 151,
                  "end": 202
                },
                "comment": " The id of the jigsaw that this will \"spawn\" in\n"
              }
            ],
            "doc": " The id of the jigsaw that this will \"spawn\" in\n"
          },
          {
            "type": "nbtdoc:string",
            "range": {
              "start": 203,
              "end": 209
            },
            "value": "name"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 209,
              "end": 210
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 211,
              "end": 217
            },
            "typeType": "string"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 151,
            "end": 203
          },
          "nodes": [
            {
              "type": "comment",
              "range": {
                "start": 151,
                "end": 202
              },
              "comment": " The id of the jigsaw that this will \"spawn\" in\n"
            }
          ],
          "doc": " The id of the jigsaw that this will \"spawn\" in\n"
        },
        "key": {
          "type": "nbtdoc:string",
          "range": {
            "start": 203,
            "end": 209
          },
          "value": "name"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 211,
            "end": 217
          },
          "typeType": "string"
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { "Bar": [(byte@0..1[] @ 8 | super::Other)] @ ..1 }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 64
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 62
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 20,
              "end": 21
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 22,
              "end": 62
            },
            "typeType": "list",
            "lengthRange": {
              "type": "nbtdoc:nat_range",
              "range": {
                "start": 57,
                "end": 62
              },
              "nodes": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 57,
                    "end": 58
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 59,
                    "end": 61
                  },
                  "value": ".."
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 61,
                    "end": 62
                  },
                  "value": "1"
                }
              ],
              "value": [
                null,
                "1"
              ]
            },
            "item": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 23,
                "end": 55
              },
              "typeType": "union",
              "members": [
                {
                  "type": "nbtdoc:compound_definition/field/type",
                  "range": {
                    "start": 24,
                    "end": 39
                  },
                  "typeType": "byte_array",
                  "valueRange": {
                    "type": "nbtdoc:int_range",
                    "range": {
                      "start": 28,
                      "end": 33
                    },
                    "nodes": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 28,
                          "end": 29
                        },
                        "value": "@"
                      },
                      {
                        "type": "nbtdoc:integer",
                        "range": {
                          "start": 29,
                          "end": 30
                        },
                        "value": "0"
                      },
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 30,
                          "end": 32
                        },
                        "value": ".."
                      },
                      {
                        "type": "nbtdoc:integer",
                        "range": {
                          "start": 32,
                          "end": 33
                        },
                        "value": "1"
                      }
                    ],
                    "value": [
                      "0",
                      "1"
                    ]
                  },
                  "lengthRange": {
                    "type": "nbtdoc:nat_range",
                    "range": {
                      "start": 36,
                      "end": 39
                    },
                    "nodes": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 36,
                          "end": 37
                        },
                        "value": "@"
                      },
                      {
                        "type": "nbtdoc:integer",
                        "range": {
                          "start": 38,
                          "end": 39
                        },
                        "value": "8"
                      }
                    ],
                    "value": [
                      "8",
                      "8"
                    ]
                  }
                },
                {
                  "type": "nbtdoc:compound_definition/field/type",
                  "range": {
                    "start": 42,
                    "end": 54
                  },
                  "typeType": "path",
                  "path": {
                    "type": "nbtdoc:ident_path",
                    "fromGlobalRoot": false,
                    "path": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 42,
                          "end": 47
                        },
                        "value": "super"
                      },
                      {
                        "type": "nbtdoc:identifier",
                        "range": {
                          "start": 49,
                          "end": 54
                        },
                        "value": "Other"
                      }
                    ],
                    "range": {
                      "start": 42,
                      "end": 54
                    }
                  }
                }
              ]
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 22,
            "end": 62
          },
          "typeType": "list",
          "lengthRange": {
            "type": "nbtdoc:nat_range",
            "range": {
              "start": 57,
              "end": 62
            },
            "nodes": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 57,
                  "end": 58
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 59,
                  "end": 61
                },
                "value": ".."
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 61,
                  "end": 62
                },
                "value": "1"
              }
            ],
            "value": [
              null,
              "1"
            ]
          },
          "item": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 23,
              "end": 55
            },
            "typeType": "union",
            "members": [
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 24,
                  "end": 39
                },
                "typeType": "byte_array",
                "valueRange": {
                  "type": "nbtdoc:int_range",
                  "range": {
                    "start": 28,
                    "end": 33
                  },
                  "nodes": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 28,
                        "end": 29
                      },
                      "value": "@"
                    },
                    {
                      "type": "nbtdoc:integer",
                      "range": {
                        "start": 29,
                        "end": 30
                      },
                      "value": "0"
                    },
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 30,
                        "end": 32
                      },
                      "value": ".."
                    },
                    {
                      "type": "nbtdoc:integer",
                      "range": {
                        "start": 32,
                        "end": 33
                      },
                      "value": "1"
                    }
                  ],
                  "value": [
                    "0",
                    "1"
                  ]
                },
                "lengthRange": {
                  "type": "nbtdoc:nat_range",
                  "range": {
                    "start": 36,
                    "end": 39
                  },
                  "nodes": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 36,
                        "end": 37
                      },
                      "value": "@"
                    },
                    {
                      "type": "nbtdoc:integer",
                      "range": {
                        "start": 38,
                        "end": 39
                      },
                      "value": "8"
                    }
                  ],
                  "value": [
                    "8",
                    "8"
                  ]
                }
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 42,
                  "end": 54
                },
                "typeType": "path",
                "path": {
                  "type": "nbtdoc:ident_path",
                  "fromGlobalRoot": false,
                  "path": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 42,
                        "end": 47
                      },
                      "value": "super"
                    },
                    {
                      "type": "nbtdoc:identifier",
                      "range": {
                        "start": 49,
                        "end": 54
                      },
                      "value": "Other"
                    }
                  ],
                  "range": {
                    "start": 42,
                    "end": 54
                  }
                }
              }
            ]
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 63,
          "end": 64
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 62
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 20,
              "end": 21
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 22,
              "end": 62
            },
            "typeType": "list",
            "lengthRange": {
              "type": "nbtdoc:nat_range",
              "range": {
                "start": 57,
                "end": 62
              },
              "nodes": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 57,
                    "end": 58
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 59,
                    "end": 61
                  },
                  "value": ".."
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 61,
                    "end": 62
                  },
                  "value": "1"
                }
              ],
              "value": [
                null,
                "1"
              ]
            },
            "item": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 23,
                "end": 55
              },
              "typeType": "union",
              "members": [
                {
                  "type": "nbtdoc:compound_definition/field/type",
                  "range": {
                    "start": 24,
                    "end": 39
                  },
                  "typeType": "byte_array",
                  "valueRange": {
                    "type": "nbtdoc:int_range",
                    "range": {
                      "start": 28,
                      "end": 33
                    },
                    "nodes": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 28,
                          "end": 29
                        },
                        "value": "@"
                      },
                      {
                        "type": "nbtdoc:integer",
                        "range": {
                          "start": 29,
                          "end": 30
                        },
                        "value": "0"
                      },
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 30,
                          "end": 32
                        },
                        "value": ".."
                      },
                      {
                        "type": "nbtdoc:integer",
                        "range": {
                          "start": 32,
                          "end": 33
                        },
                        "value": "1"
                      }
                    ],
                    "value": [
                      "0",
                      "1"
                    ]
                  },
                  "lengthRange": {
                    "type": "nbtdoc:nat_range",
                    "range": {
                      "start": 36,
                      "end": 39
                    },
                    "nodes": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 36,
                          "end": 37
                        },
                        "value": "@"
                      },
                      {
                        "type": "nbtdoc:integer",
                        "range": {
                          "start": 38,
                          "end": 39
                        },
                        "value": "8"
                      }
                    ],
                    "value": [
                      "8",
                      "8"
                    ]
                  }
                },
                {
                  "type": "nbtdoc:compound_definition/field/type",
                  "range": {
                    "start": 42,
                    "end": 54
                  },
                  "typeType": "path",
                  "path": {
                    "type": "nbtdoc:ident_path",
                    "fromGlobalRoot": false,
                    "path": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 42,
                          "end": 47
                        },
                        "value": "super"
                      },
                      {
                        "type": "nbtdoc:identifier",
                        "range": {
                          "start": 49,
                          "end": 54
                        },
                        "value": "Other"
                      }
                    ],
                    "range": {
                      "start": 42,
                      "end": 54
                    }
                  }
                }
              ]
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 22,
            "end": 62
          },
          "typeType": "list",
          "lengthRange": {
            "type": "nbtdoc:nat_range",
            "range": {
              "start": 57,
              "end": 62
            },
            "nodes": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 57,
                  "end": 58
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 59,
                  "end": 61
                },
                "value": ".."
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 61,
                  "end": 62
                },
                "value": "1"
              }
            ],
            "value": [
              null,
              "1"
            ]
          },
          "item": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 23,
              "end": 55
            },
            "typeType": "union",
            "members": [
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 24,
                  "end": 39
                },
                "typeType": "byte_array",
                "valueRange": {
                  "type": "nbtdoc:int_range",
                  "range": {
                    "start": 28,
                    "end": 33
                  },
                  "nodes": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 28,
                        "end": 29
                      },
                      "value": "@"
                    },
                    {
                      "type": "nbtdoc:integer",
                      "range": {
                        "start": 29,
                        "end": 30
                      },
                      "value": "0"
                    },
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 30,
                        "end": 32
                      },
                      "value": ".."
                    },
                    {
                      "type": "nbtdoc:integer",
                      "range": {
                        "start": 32,
                        "end": 33
                      },
                      "value": "1"
                    }
                  ],
                  "value": [
                    "0",
                    "1"
                  ]
                },
                "lengthRange": {
                  "type": "nbtdoc:nat_range",
                  "range": {
                    "start": 36,
                    "end": 39
                  },
                  "nodes": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 36,
                        "end": 37
                      },
                      "value": "@"
                    },
                    {
                      "type": "nbtdoc:integer",
                      "range": {
                        "start": 38,
                        "end": 39
                      },
                      "value": "8"
                    }
                  ],
                  "value": [
                    "8",
                    "8"
                  ]
                }
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 42,
                  "end": 54
                },
                "typeType": "path",
                "path": {
                  "type": "nbtdoc:ident_path",
                  "fromGlobalRoot": false,
                  "path": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 42,
                        "end": 47
                      },
                      "value": "super"
                    },
                    {
                      "type": "nbtdoc:identifier",
                      "range": {
                        "start": 49,
                        "end": 54
                      },
                      "value": "Other"
                    }
                  ],
                  "range": {
                    "start": 42,
                    "end": 54
                  }
                }
              }
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: () }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 24
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 22
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 22
            },
            "typeType": "union",
            "members": []
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 22
          },
          "typeType": "union",
          "members": []
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 23,
          "end": 24
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 22
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 22
            },
            "typeType": "union",
            "members": []
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 22
          },
          "typeType": "union",
          "members": []
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: [string] @ ..1 }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 36
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 34
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 34
            },
            "typeType": "list",
            "lengthRange": {
              "type": "nbtdoc:nat_range",
              "range": {
                "start": 29,
                "end": 34
              },
              "nodes": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 31,
                    "end": 33
                  },
                  "value": ".."
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 33,
                    "end": 34
                  },
                  "value": "1"
                }
              ],
              "value": [
                null,
                "1"
              ]
            },
            "item": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 21,
                "end": 27
              },
              "typeType": "string"
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 34
          },
          "typeType": "list",
          "lengthRange": {
            "type": "nbtdoc:nat_range",
            "range": {
              "start": 29,
              "end": 34
            },
            "nodes": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 31,
                  "end": 33
                },
                "value": ".."
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 33,
                  "end": 34
                },
                "value": "1"
              }
            ],
            "value": [
              null,
              "1"
            ]
          },
          "item": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 21,
              "end": 27
            },
            "typeType": "string"
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 35,
          "end": 36
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 34
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 34
            },
            "typeType": "list",
            "lengthRange": {
              "type": "nbtdoc:nat_range",
              "range": {
                "start": 29,
                "end": 34
              },
              "nodes": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 31,
                    "end": 33
                  },
                  "value": ".."
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 33,
                    "end": 34
                  },
                  "value": "1"
                }
              ],
              "value": [
                null,
                "1"
              ]
            },
            "item": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 21,
                "end": 27
              },
              "typeType": "string"
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 34
          },
          "typeType": "list",
          "lengthRange": {
            "type": "nbtdoc:nat_range",
            "range": {
              "start": 29,
              "end": 34
            },
            "nodes": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 31,
                  "end": 33
                },
                "value": ".."
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 33,
                  "end": 34
                },
                "value": "1"
              }
            ],
            "value": [
              null,
              "1"
            ]
          },
          "item": {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 21,
              "end": 27
            },
            "typeType": "string"
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: boolean }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 29
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 27
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 27
            },
            "typeType": "boolean"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 27
          },
          "typeType": "boolean"
        }
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
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 27
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 27
            },
            "typeType": "boolean"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 27
          },
          "typeType": "boolean"
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: byte[] }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 28
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 27
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 27
            },
            "typeType": "byte_array",
            "valueRange": null,
            "lengthRange": null
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 27
          },
          "typeType": "byte_array",
          "valueRange": null,
          "lengthRange": null
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
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 27
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 27
            },
            "typeType": "byte_array",
            "valueRange": null,
            "lengthRange": null
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 27
          },
          "typeType": "byte_array",
          "valueRange": null,
          "lengthRange": null
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: id(minecraft:entity) }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 42
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 40
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 40
            },
            "typeType": "id",
            "registry": {
              "type": "nbtdoc:minecraft_identifier",
              "range": {
                "start": 23,
                "end": 39
              },
              "namespace": "minecraft",
              "path": [
                "entity"
              ]
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 40
          },
          "typeType": "id",
          "registry": {
            "type": "nbtdoc:minecraft_identifier",
            "range": {
              "start": 23,
              "end": 39
            },
            "namespace": "minecraft",
            "path": [
              "entity"
            ]
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 41,
          "end": 42
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 40
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 40
            },
            "typeType": "id",
            "registry": {
              "type": "nbtdoc:minecraft_identifier",
              "range": {
                "start": 23,
                "end": 39
              },
              "namespace": "minecraft",
              "path": [
                "entity"
              ]
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 40
          },
          "typeType": "id",
          "registry": {
            "type": "nbtdoc:minecraft_identifier",
            "range": {
              "start": 23,
              "end": 39
            },
            "namespace": "minecraft",
            "path": [
              "entity"
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: int @ 0..1 [] }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 35
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 34
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 34
            },
            "typeType": "int_array",
            "valueRange": {
              "type": "nbtdoc:int_range",
              "range": {
                "start": 24,
                "end": 30
              },
              "nodes": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": "0"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 27,
                    "end": 29
                  },
                  "value": ".."
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": "1"
                }
              ],
              "value": [
                "0",
                "1"
              ]
            },
            "lengthRange": null
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 34
          },
          "typeType": "int_array",
          "valueRange": {
            "type": "nbtdoc:int_range",
            "range": {
              "start": 24,
              "end": 30
            },
            "nodes": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": "0"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 29
                },
                "value": ".."
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": "1"
              }
            ],
            "value": [
              "0",
              "1"
            ]
          },
          "lengthRange": null
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 34,
          "end": 35
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 34
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 34
            },
            "typeType": "int_array",
            "valueRange": {
              "type": "nbtdoc:int_range",
              "range": {
                "start": 24,
                "end": 30
              },
              "nodes": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": "0"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 27,
                    "end": 29
                  },
                  "value": ".."
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": "1"
                }
              ],
              "value": [
                "0",
                "1"
              ]
            },
            "lengthRange": null
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 34
          },
          "typeType": "int_array",
          "valueRange": {
            "type": "nbtdoc:int_range",
            "range": {
              "start": 24,
              "end": 30
            },
            "nodes": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": "0"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 29
                },
                "value": ".."
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": "1"
              }
            ],
            "value": [
              "0",
              "1"
            ]
          },
          "lengthRange": null
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: long[] @ 4 }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 32
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 30
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 30
            },
            "typeType": "long_array",
            "valueRange": null,
            "lengthRange": {
              "type": "nbtdoc:nat_range",
              "range": {
                "start": 27,
                "end": 30
              },
              "nodes": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 27,
                    "end": 28
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": "4"
                }
              ],
              "value": [
                "4",
                "4"
              ]
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 30
          },
          "typeType": "long_array",
          "valueRange": null,
          "lengthRange": {
            "type": "nbtdoc:nat_range",
            "range": {
              "start": 27,
              "end": 30
            },
            "nodes": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 28
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": "4"
              }
            ],
            "value": [
              "4",
              "4"
            ]
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 31,
          "end": 32
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 30
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 30
            },
            "typeType": "long_array",
            "valueRange": null,
            "lengthRange": {
              "type": "nbtdoc:nat_range",
              "range": {
                "start": 27,
                "end": 30
              },
              "nodes": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 27,
                    "end": 28
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:integer",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": "4"
                }
              ],
              "value": [
                "4",
                "4"
              ]
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 30
          },
          "typeType": "long_array",
          "valueRange": null,
          "lengthRange": {
            "type": "nbtdoc:nat_range",
            "range": {
              "start": 27,
              "end": 30
            },
            "nodes": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 28
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:integer",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": "4"
              }
            ],
            "value": [
              "4",
              "4"
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: minecraft:block[name] }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 43
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 9,
          "end": 12
        },
        "value": "Foo"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 13,
          "end": 14
        },
        "value": "{"
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 41
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 41
            },
            "typeType": "index",
            "index": {
              "type": "nbtdoc:registry_index",
              "range": {
                "start": 20,
                "end": 41
              },
              "nodes": [
                {
                  "type": "nbtdoc:minecraft_identifier",
                  "range": {
                    "start": 20,
                    "end": 35
                  },
                  "namespace": "minecraft",
                  "path": [
                    "block"
                  ]
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 35,
                    "end": 36
                  },
                  "value": "["
                },
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 36,
                    "end": 40
                  },
                  "value": "name"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 40,
                    "end": 41
                  },
                  "value": "]"
                }
              ],
              "registry": {
                "type": "nbtdoc:minecraft_identifier",
                "range": {
                  "start": 20,
                  "end": 35
                },
                "namespace": "minecraft",
                "path": [
                  "block"
                ]
              },
              "path": [
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 36,
                    "end": 40
                  },
                  "value": "name"
                }
              ]
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 41
          },
          "typeType": "index",
          "index": {
            "type": "nbtdoc:registry_index",
            "range": {
              "start": 20,
              "end": 41
            },
            "nodes": [
              {
                "type": "nbtdoc:minecraft_identifier",
                "range": {
                  "start": 20,
                  "end": 35
                },
                "namespace": "minecraft",
                "path": [
                  "block"
                ]
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 35,
                  "end": 36
                },
                "value": "["
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 36,
                  "end": 40
                },
                "value": "name"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 40,
                  "end": 41
                },
                "value": "]"
              }
            ],
            "registry": {
              "type": "nbtdoc:minecraft_identifier",
              "range": {
                "start": 20,
                "end": 35
              },
              "namespace": "minecraft",
              "path": [
                "block"
              ]
            },
            "path": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 36,
                  "end": 40
                },
                "value": "name"
              }
            ]
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 42,
          "end": 43
        },
        "value": "}"
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 9,
        "end": 12
      },
      "value": "Foo"
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 15,
          "end": 41
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 15,
              "end": 15
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 15,
              "end": 18
            },
            "value": "Bar"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 18,
              "end": 19
            },
            "value": ":"
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 20,
              "end": 41
            },
            "typeType": "index",
            "index": {
              "type": "nbtdoc:registry_index",
              "range": {
                "start": 20,
                "end": 41
              },
              "nodes": [
                {
                  "type": "nbtdoc:minecraft_identifier",
                  "range": {
                    "start": 20,
                    "end": 35
                  },
                  "namespace": "minecraft",
                  "path": [
                    "block"
                  ]
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 35,
                    "end": 36
                  },
                  "value": "["
                },
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 36,
                    "end": 40
                  },
                  "value": "name"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 40,
                    "end": 41
                  },
                  "value": "]"
                }
              ],
              "registry": {
                "type": "nbtdoc:minecraft_identifier",
                "range": {
                  "start": 20,
                  "end": 35
                },
                "namespace": "minecraft",
                "path": [
                  "block"
                ]
              },
              "path": [
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 36,
                    "end": 40
                  },
                  "value": "name"
                }
              ]
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 15,
            "end": 15
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 15,
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 41
          },
          "typeType": "index",
          "index": {
            "type": "nbtdoc:registry_index",
            "range": {
              "start": 20,
              "end": 41
            },
            "nodes": [
              {
                "type": "nbtdoc:minecraft_identifier",
                "range": {
                  "start": 20,
                  "end": 35
                },
                "namespace": "minecraft",
                "path": [
                  "block"
                ]
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 35,
                  "end": 36
                },
                "value": "["
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 36,
                  "end": 40
                },
                "value": "name"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 40,
                  "end": 41
                },
                "value": "]"
              }
            ],
            "registry": {
              "type": "nbtdoc:minecraft_identifier",
              "range": {
                "start": 20,
                "end": 35
              },
              "namespace": "minecraft",
              "path": [
                "block"
              ]
            },
            "path": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 36,
                  "end": 40
                },
                "value": "name"
              }
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 8
    },
    "nodes": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "nodes": [],
        "doc": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 8
        },
        "value": "compound"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 8,
          "end": 8
        },
        "value": ""
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 8,
          "end": 8
        },
        "value": ""
      },
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 8,
          "end": 8
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 8,
              "end": 8
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": ""
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 8,
              "end": 8
            },
            "typeType": "path",
            "path": {
              "type": "nbtdoc:ident_path",
              "fromGlobalRoot": false,
              "path": [
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 8,
                    "end": 8
                  },
                  "value": ""
                }
              ],
              "range": {
                "start": 8,
                "end": 8
              }
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 8,
            "end": 8
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 8,
            "end": 8
          },
          "value": ""
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 8,
            "end": 8
          },
          "typeType": "path",
          "path": {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "path": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 8,
                  "end": 8
                },
                "value": ""
              }
            ],
            "range": {
              "start": 8,
              "end": 8
            }
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 8,
          "end": 8
        },
        "value": ""
      }
    ],
    "doc": {
      "type": "nbtdoc:doc_comments",
      "range": {
        "start": 0,
        "end": 0
      },
      "nodes": [],
      "doc": ""
    },
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 8,
        "end": 8
      },
      "value": ""
    },
    "extends": null,
    "fields": [
      {
        "type": "nbtdoc:compound_definition/field",
        "range": {
          "start": 8,
          "end": 8
        },
        "nodes": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 8,
              "end": 8
            },
            "nodes": [],
            "doc": ""
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": ""
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": ""
          },
          {
            "type": "nbtdoc:compound_definition/field/type",
            "range": {
              "start": 8,
              "end": 8
            },
            "typeType": "path",
            "path": {
              "type": "nbtdoc:ident_path",
              "fromGlobalRoot": false,
              "path": [
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 8,
                    "end": 8
                  },
                  "value": ""
                }
              ],
              "range": {
                "start": 8,
                "end": 8
              }
            }
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 8,
            "end": 8
          },
          "nodes": [],
          "doc": ""
        },
        "key": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 8,
            "end": 8
          },
          "value": ""
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 8,
            "end": 8
          },
          "typeType": "path",
          "path": {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "path": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 8,
                  "end": 8
                },
                "value": ""
              }
            ],
            "range": {
              "start": 8,
              "end": 8
            }
          }
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “{”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “:”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “}”",
      "severity": 3
    }
  ]
}
