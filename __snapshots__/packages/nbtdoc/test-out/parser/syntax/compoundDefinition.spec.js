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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 34
        },
        "children": [
          {
            "type": "comment",
            "range": {
              "start": 0,
              "end": 34
            },
            "comment": " Doc comment for the compound.\n"
          }
        ],
        "value": " Doc comment for the compound.\n"
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
        "children": [
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
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 80,
              "end": 132
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 80,
                  "end": 131
                },
                "comment": " How the resultant structure can be transformed\n"
              }
            ],
            "value": " How the resultant structure can be transformed\n"
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
              "children": [
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
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 80,
                "end": 131
              },
              "comment": " How the resultant structure can be transformed\n"
            }
          ],
          "value": " How the resultant structure can be transformed\n"
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
            "children": [
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
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 151,
              "end": 203
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 151,
                  "end": 202
                },
                "comment": " The id of the jigsaw that this will \"spawn\" in\n"
              }
            ],
            "value": " The id of the jigsaw that this will \"spawn\" in\n"
          },
          {
            "type": "string",
            "range": {
              "start": 203,
              "end": 209
            },
            "options": {
              "quotes": [
                "\""
              ],
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ]
              }
            },
            "value": "name",
            "valueMap": {
              "outerRange": {
                "start": 204,
                "end": 208
              },
              "innerRange": {
                "start": 0,
                "end": 4
              },
              "pairs": []
            }
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
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 151,
                "end": 202
              },
              "comment": " The id of the jigsaw that this will \"spawn\" in\n"
            }
          ],
          "value": " The id of the jigsaw that this will \"spawn\" in\n"
        },
        "key": {
          "type": "string",
          "range": {
            "start": 203,
            "end": 209
          },
          "options": {
            "quotes": [
              "\""
            ],
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ]
            }
          },
          "value": "name",
          "valueMap": {
            "outerRange": {
              "start": 204,
              "end": 208
            },
            "innerRange": {
              "start": 0,
              "end": 4
            },
            "pairs": []
          }
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
      "children": [
        {
          "type": "comment",
          "range": {
            "start": 0,
            "end": 34
          },
          "comment": " Doc comment for the compound.\n"
        }
      ],
      "value": " Doc comment for the compound.\n"
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
      "children": [
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
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 80,
              "end": 132
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 80,
                  "end": 131
                },
                "comment": " How the resultant structure can be transformed\n"
              }
            ],
            "value": " How the resultant structure can be transformed\n"
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
              "children": [
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
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 80,
                "end": 131
              },
              "comment": " How the resultant structure can be transformed\n"
            }
          ],
          "value": " How the resultant structure can be transformed\n"
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
            "children": [
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
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 151,
              "end": 203
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 151,
                  "end": 202
                },
                "comment": " The id of the jigsaw that this will \"spawn\" in\n"
              }
            ],
            "value": " The id of the jigsaw that this will \"spawn\" in\n"
          },
          {
            "type": "string",
            "range": {
              "start": 203,
              "end": 209
            },
            "options": {
              "quotes": [
                "\""
              ],
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ]
              }
            },
            "value": "name",
            "valueMap": {
              "outerRange": {
                "start": 204,
                "end": 208
              },
              "innerRange": {
                "start": 0,
                "end": 4
              },
              "pairs": []
            }
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
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 151,
                "end": 202
              },
              "comment": " The id of the jigsaw that this will \"spawn\" in\n"
            }
          ],
          "value": " The id of the jigsaw that this will \"spawn\" in\n"
        },
        "key": {
          "type": "string",
          "range": {
            "start": 203,
            "end": 209
          },
          "options": {
            "quotes": [
              "\""
            ],
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ]
            }
          },
          "value": "name",
          "valueMap": {
            "outerRange": {
              "start": 204,
              "end": 208
            },
            "innerRange": {
              "start": 0,
              "end": 4
            },
            "pairs": []
          }
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

exports['compoundDefinition() Parse "compound Foo { "Bar": [(byte@0..1[] @ 8 | super::Other)] }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 58
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "end": 57
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
            "type": "string",
            "range": {
              "start": 15,
              "end": 20
            },
            "options": {
              "quotes": [
                "\""
              ],
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ]
              }
            },
            "value": "Bar",
            "valueMap": {
              "outerRange": {
                "start": 16,
                "end": 19
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
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
              "end": 57
            },
            "typeType": "list",
            "lengthRange": null,
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
                    "children": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 28,
                          "end": 29
                        },
                        "value": "@"
                      },
                      {
                        "type": "integer",
                        "range": {
                          "start": 29,
                          "end": 30
                        },
                        "value": 0
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
                        "type": "integer",
                        "range": {
                          "start": 32,
                          "end": 33
                        },
                        "value": 1
                      }
                    ],
                    "value": [
                      0,
                      1
                    ]
                  },
                  "lengthRange": {
                    "type": "nbtdoc:unsigned_range",
                    "range": {
                      "start": 36,
                      "end": 39
                    },
                    "children": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 36,
                          "end": 37
                        },
                        "value": "@"
                      },
                      {
                        "type": "integer",
                        "range": {
                          "start": 38,
                          "end": 39
                        },
                        "value": 8
                      }
                    ],
                    "value": [
                      8,
                      8
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
                    "children": [
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
          "children": [],
          "value": ""
        },
        "key": {
          "type": "string",
          "range": {
            "start": 15,
            "end": 20
          },
          "options": {
            "quotes": [
              "\""
            ],
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ]
            }
          },
          "value": "Bar",
          "valueMap": {
            "outerRange": {
              "start": 16,
              "end": 19
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 22,
            "end": 57
          },
          "typeType": "list",
          "lengthRange": null,
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
                  "children": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 28,
                        "end": 29
                      },
                      "value": "@"
                    },
                    {
                      "type": "integer",
                      "range": {
                        "start": 29,
                        "end": 30
                      },
                      "value": 0
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
                      "type": "integer",
                      "range": {
                        "start": 32,
                        "end": 33
                      },
                      "value": 1
                    }
                  ],
                  "value": [
                    0,
                    1
                  ]
                },
                "lengthRange": {
                  "type": "nbtdoc:unsigned_range",
                  "range": {
                    "start": 36,
                    "end": 39
                  },
                  "children": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 36,
                        "end": 37
                      },
                      "value": "@"
                    },
                    {
                      "type": "integer",
                      "range": {
                        "start": 38,
                        "end": 39
                      },
                      "value": 8
                    }
                  ],
                  "value": [
                    8,
                    8
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
                  "children": [
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
          "start": 57,
          "end": 58
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
      "children": [],
      "value": ""
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
          "end": 57
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
            "type": "string",
            "range": {
              "start": 15,
              "end": 20
            },
            "options": {
              "quotes": [
                "\""
              ],
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ]
              }
            },
            "value": "Bar",
            "valueMap": {
              "outerRange": {
                "start": 16,
                "end": 19
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
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
              "end": 57
            },
            "typeType": "list",
            "lengthRange": null,
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
                    "children": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 28,
                          "end": 29
                        },
                        "value": "@"
                      },
                      {
                        "type": "integer",
                        "range": {
                          "start": 29,
                          "end": 30
                        },
                        "value": 0
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
                        "type": "integer",
                        "range": {
                          "start": 32,
                          "end": 33
                        },
                        "value": 1
                      }
                    ],
                    "value": [
                      0,
                      1
                    ]
                  },
                  "lengthRange": {
                    "type": "nbtdoc:unsigned_range",
                    "range": {
                      "start": 36,
                      "end": 39
                    },
                    "children": [
                      {
                        "type": "nbtdoc:literal",
                        "range": {
                          "start": 36,
                          "end": 37
                        },
                        "value": "@"
                      },
                      {
                        "type": "integer",
                        "range": {
                          "start": 38,
                          "end": 39
                        },
                        "value": 8
                      }
                    ],
                    "value": [
                      8,
                      8
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
                    "children": [
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
          "children": [],
          "value": ""
        },
        "key": {
          "type": "string",
          "range": {
            "start": 15,
            "end": 20
          },
          "options": {
            "quotes": [
              "\""
            ],
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ]
            }
          },
          "value": "Bar",
          "valueMap": {
            "outerRange": {
              "start": 16,
              "end": 19
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 22,
            "end": 57
          },
          "typeType": "list",
          "lengthRange": null,
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
                  "children": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 28,
                        "end": 29
                      },
                      "value": "@"
                    },
                    {
                      "type": "integer",
                      "range": {
                        "start": 29,
                        "end": 30
                      },
                      "value": 0
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
                      "type": "integer",
                      "range": {
                        "start": 32,
                        "end": 33
                      },
                      "value": 1
                    }
                  ],
                  "value": [
                    0,
                    1
                  ]
                },
                "lengthRange": {
                  "type": "nbtdoc:unsigned_range",
                  "range": {
                    "start": 36,
                    "end": 39
                  },
                  "children": [
                    {
                      "type": "nbtdoc:literal",
                      "range": {
                        "start": 36,
                        "end": 37
                      },
                      "value": "@"
                    },
                    {
                      "type": "integer",
                      "range": {
                        "start": 38,
                        "end": 39
                      },
                      "value": 8
                    }
                  ],
                  "value": [
                    8,
                    8
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
                  "children": [
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "children": [],
          "value": ""
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
      "children": [],
      "value": ""
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
          "children": [],
          "value": ""
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
              "type": "nbtdoc:unsigned_range",
              "range": {
                "start": 29,
                "end": 34
              },
              "children": [
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
                  "type": "integer",
                  "range": {
                    "start": 33,
                    "end": 34
                  },
                  "value": 1
                }
              ],
              "value": [
                null,
                1
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
          "children": [],
          "value": ""
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
            "type": "nbtdoc:unsigned_range",
            "range": {
              "start": 29,
              "end": 34
            },
            "children": [
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
                "type": "integer",
                "range": {
                  "start": 33,
                  "end": 34
                },
                "value": 1
              }
            ],
            "value": [
              null,
              1
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
      "children": [],
      "value": ""
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
              "type": "nbtdoc:unsigned_range",
              "range": {
                "start": 29,
                "end": 34
              },
              "children": [
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
                  "type": "integer",
                  "range": {
                    "start": 33,
                    "end": 34
                  },
                  "value": 1
                }
              ],
              "value": [
                null,
                1
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
          "children": [],
          "value": ""
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
            "type": "nbtdoc:unsigned_range",
            "range": {
              "start": 29,
              "end": 34
            },
            "children": [
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
                "type": "integer",
                "range": {
                  "start": 33,
                  "end": 34
                },
                "value": 1
              }
            ],
            "value": [
              null,
              1
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "children": [],
          "value": ""
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
      "children": [],
      "value": ""
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
          "children": [],
          "value": ""
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

exports['compoundDefinition() Parse "compound Foo { Bar: byte }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 26
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "end": 25
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
              "end": 25
            },
            "typeType": "byte",
            "valueRange": null
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
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 25
          },
          "typeType": "byte",
          "valueRange": null
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 25,
          "end": 26
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
      "children": [],
      "value": ""
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
          "end": 25
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
              "end": 25
            },
            "typeType": "byte",
            "valueRange": null
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
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 25
          },
          "typeType": "byte",
          "valueRange": null
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "children": [],
          "value": ""
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
      "children": [],
      "value": ""
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
          "children": [],
          "value": ""
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

exports['compoundDefinition() Parse "compound Foo { Bar: double @ 5.6e3 }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 36
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
            "typeType": "double",
            "valueRange": {
              "type": "nbtdoc:float_range",
              "range": {
                "start": 27,
                "end": 34
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 27,
                    "end": 28
                  },
                  "value": "@"
                },
                {
                  "type": "float",
                  "range": {
                    "start": 29,
                    "end": 34
                  },
                  "value": 5600
                }
              ],
              "value": [
                5600,
                5600
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
          "children": [],
          "value": ""
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
          "typeType": "double",
          "valueRange": {
            "type": "nbtdoc:float_range",
            "range": {
              "start": 27,
              "end": 34
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 28
                },
                "value": "@"
              },
              {
                "type": "float",
                "range": {
                  "start": 29,
                  "end": 34
                },
                "value": 5600
              }
            ],
            "value": [
              5600,
              5600
            ]
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
      "children": [],
      "value": ""
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
            "typeType": "double",
            "valueRange": {
              "type": "nbtdoc:float_range",
              "range": {
                "start": 27,
                "end": 34
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 27,
                    "end": 28
                  },
                  "value": "@"
                },
                {
                  "type": "float",
                  "range": {
                    "start": 29,
                    "end": 34
                  },
                  "value": 5600
                }
              ],
              "value": [
                5600,
                5600
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
          "children": [],
          "value": ""
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
          "typeType": "double",
          "valueRange": {
            "type": "nbtdoc:float_range",
            "range": {
              "start": 27,
              "end": 34
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 28
                },
                "value": "@"
              },
              {
                "type": "float",
                "range": {
                  "start": 29,
                  "end": 34
                },
                "value": 5600
              }
            ],
            "value": [
              5600,
              5600
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: float @ 1.2..3.4 }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 38
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "end": 36
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
              "end": 36
            },
            "typeType": "float",
            "valueRange": {
              "type": "nbtdoc:float_range",
              "range": {
                "start": 26,
                "end": 36
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": "@"
                },
                {
                  "type": "float",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "value": 1.2
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
                  "type": "float",
                  "range": {
                    "start": 33,
                    "end": 36
                  },
                  "value": 3.4
                }
              ],
              "value": [
                1.2,
                3.4
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
          "children": [],
          "value": ""
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
            "end": 36
          },
          "typeType": "float",
          "valueRange": {
            "type": "nbtdoc:float_range",
            "range": {
              "start": 26,
              "end": 36
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": "@"
              },
              {
                "type": "float",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": 1.2
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
                "type": "float",
                "range": {
                  "start": 33,
                  "end": 36
                },
                "value": 3.4
              }
            ],
            "value": [
              1.2,
              3.4
            ]
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 37,
          "end": 38
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
      "children": [],
      "value": ""
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
          "end": 36
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
              "end": 36
            },
            "typeType": "float",
            "valueRange": {
              "type": "nbtdoc:float_range",
              "range": {
                "start": 26,
                "end": 36
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": "@"
                },
                {
                  "type": "float",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "value": 1.2
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
                  "type": "float",
                  "range": {
                    "start": 33,
                    "end": 36
                  },
                  "value": 3.4
                }
              ],
              "value": [
                1.2,
                3.4
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
          "children": [],
          "value": ""
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
            "end": 36
          },
          "typeType": "float",
          "valueRange": {
            "type": "nbtdoc:float_range",
            "range": {
              "start": 26,
              "end": 36
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": "@"
              },
              {
                "type": "float",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": 1.2
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
                "type": "float",
                "range": {
                  "start": 33,
                  "end": 36
                },
                "value": 3.4
              }
            ],
            "value": [
              1.2,
              3.4
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: float }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 27
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "end": 26
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
              "end": 26
            },
            "typeType": "float",
            "valueRange": null
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
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 26
          },
          "typeType": "float",
          "valueRange": null
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 26,
          "end": 27
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
      "children": [],
      "value": ""
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
          "end": 26
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
              "end": 26
            },
            "typeType": "float",
            "valueRange": null
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
            "end": 18
          },
          "value": "Bar"
        },
        "fieldType": {
          "type": "nbtdoc:compound_definition/field/type",
          "range": {
            "start": 20,
            "end": 26
          },
          "typeType": "float",
          "valueRange": null
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "children": [],
          "value": ""
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
      "children": [],
      "value": ""
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
          "children": [],
          "value": ""
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": "@"
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": 0
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
                  "type": "integer",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": 1
                }
              ],
              "value": [
                0,
                1
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
          "children": [],
          "value": ""
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
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": "@"
              },
              {
                "type": "integer",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": 0
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
                "type": "integer",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": 1
              }
            ],
            "value": [
              0,
              1
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
      "children": [],
      "value": ""
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
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": "@"
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": 0
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
                  "type": "integer",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": 1
                }
              ],
              "value": [
                0,
                1
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
          "children": [],
          "value": ""
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
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": "@"
              },
              {
                "type": "integer",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": 0
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
                "type": "integer",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": 1
              }
            ],
            "value": [
              0,
              1
            ]
          },
          "lengthRange": null
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: int @ 1 }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 29
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
            "typeType": "int",
            "valueRange": {
              "type": "nbtdoc:int_range",
              "range": {
                "start": 24,
                "end": 27
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": "@"
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": 1
                }
              ],
              "value": [
                1,
                1
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
          "children": [],
          "value": ""
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
          "typeType": "int",
          "valueRange": {
            "type": "nbtdoc:int_range",
            "range": {
              "start": 24,
              "end": 27
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": "@"
              },
              {
                "type": "integer",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": 1
              }
            ],
            "value": [
              1,
              1
            ]
          }
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
      "children": [],
      "value": ""
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
            "typeType": "int",
            "valueRange": {
              "type": "nbtdoc:int_range",
              "range": {
                "start": 24,
                "end": 27
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": "@"
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": 1
                }
              ],
              "value": [
                1,
                1
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
          "children": [],
          "value": ""
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
          "typeType": "int",
          "valueRange": {
            "type": "nbtdoc:int_range",
            "range": {
              "start": 24,
              "end": 27
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": "@"
              },
              {
                "type": "integer",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": 1
              }
            ],
            "value": [
              1,
              1
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: long @ 2.. }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 32
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
            "typeType": "long",
            "valueRange": {
              "type": "nbtdoc:int_range",
              "range": {
                "start": 25,
                "end": 30
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 25,
                    "end": 26
                  },
                  "value": "@"
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 27,
                    "end": 28
                  },
                  "value": 2
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 28,
                    "end": 30
                  },
                  "value": ".."
                }
              ],
              "value": [
                2,
                null
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
          "children": [],
          "value": ""
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
          "typeType": "long",
          "valueRange": {
            "type": "nbtdoc:int_range",
            "range": {
              "start": 25,
              "end": 30
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 25,
                  "end": 26
                },
                "value": "@"
              },
              {
                "type": "integer",
                "range": {
                  "start": 27,
                  "end": 28
                },
                "value": 2
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 28,
                  "end": 30
                },
                "value": ".."
              }
            ],
            "value": [
              2,
              null
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
      "children": [],
      "value": ""
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
            "typeType": "long",
            "valueRange": {
              "type": "nbtdoc:int_range",
              "range": {
                "start": 25,
                "end": 30
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 25,
                    "end": 26
                  },
                  "value": "@"
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 27,
                    "end": 28
                  },
                  "value": 2
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 28,
                    "end": 30
                  },
                  "value": ".."
                }
              ],
              "value": [
                2,
                null
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
          "children": [],
          "value": ""
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
          "typeType": "long",
          "valueRange": {
            "type": "nbtdoc:int_range",
            "range": {
              "start": 25,
              "end": 30
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 25,
                  "end": 26
                },
                "value": "@"
              },
              {
                "type": "integer",
                "range": {
                  "start": 27,
                  "end": 28
                },
                "value": 2
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 28,
                  "end": 30
                },
                "value": ".."
              }
            ],
            "value": [
              2,
              null
            ]
          }
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
              "type": "nbtdoc:unsigned_range",
              "range": {
                "start": 27,
                "end": 30
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 27,
                    "end": 28
                  },
                  "value": "@"
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": 4
                }
              ],
              "value": [
                4,
                4
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
          "children": [],
          "value": ""
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
            "type": "nbtdoc:unsigned_range",
            "range": {
              "start": 27,
              "end": 30
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 28
                },
                "value": "@"
              },
              {
                "type": "integer",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": 4
              }
            ],
            "value": [
              4,
              4
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
      "children": [],
      "value": ""
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
              "type": "nbtdoc:unsigned_range",
              "range": {
                "start": 27,
                "end": 30
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 27,
                    "end": 28
                  },
                  "value": "@"
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 29,
                    "end": 30
                  },
                  "value": 4
                }
              ],
              "value": [
                4,
                4
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
          "children": [],
          "value": ""
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
            "type": "nbtdoc:unsigned_range",
            "range": {
              "start": 27,
              "end": 30
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 27,
                  "end": 28
                },
                "value": "@"
              },
              {
                "type": "integer",
                "range": {
                  "start": 29,
                  "end": 30
                },
                "value": 4
              }
            ],
            "value": [
              4,
              4
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: minecraft:block[name.second] }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 50
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "end": 48
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
              "end": 48
            },
            "typeType": "index",
            "index": {
              "type": "nbtdoc:registry_index",
              "range": {
                "start": 20,
                "end": 48
              },
              "children": [
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
                  "value": "."
                },
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 41,
                    "end": 47
                  },
                  "value": "second"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 47,
                    "end": 48
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
                },
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 41,
                    "end": 47
                  },
                  "value": "second"
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
          "children": [],
          "value": ""
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
            "end": 48
          },
          "typeType": "index",
          "index": {
            "type": "nbtdoc:registry_index",
            "range": {
              "start": 20,
              "end": 48
            },
            "children": [
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
                "value": "."
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 41,
                  "end": 47
                },
                "value": "second"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 47,
                  "end": 48
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
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 41,
                  "end": 47
                },
                "value": "second"
              }
            ]
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 49,
          "end": 50
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
      "children": [],
      "value": ""
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
          "end": 48
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
              "end": 48
            },
            "typeType": "index",
            "index": {
              "type": "nbtdoc:registry_index",
              "range": {
                "start": 20,
                "end": 48
              },
              "children": [
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
                  "value": "."
                },
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 41,
                    "end": 47
                  },
                  "value": "second"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 47,
                    "end": 48
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
                },
                {
                  "type": "nbtdoc:identifier",
                  "range": {
                    "start": 41,
                    "end": 47
                  },
                  "value": "second"
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
          "children": [],
          "value": ""
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
            "end": 48
          },
          "typeType": "index",
          "index": {
            "type": "nbtdoc:registry_index",
            "range": {
              "start": 20,
              "end": 48
            },
            "children": [
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
                "value": "."
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 41,
                  "end": 47
                },
                "value": "second"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 47,
                  "end": 48
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
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 41,
                  "end": 47
                },
                "value": "second"
              }
            ]
          }
        }
      }
    ]
  },
  "errors": []
}

exports['compoundDefinition() Parse "compound Foo { Bar: short @ ..3 }" 1'] = {
  "node": {
    "type": "nbtdoc:compound_definition",
    "range": {
      "start": 0,
      "end": 33
    },
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
          "end": 31
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
              "end": 31
            },
            "typeType": "short",
            "valueRange": {
              "type": "nbtdoc:int_range",
              "range": {
                "start": 26,
                "end": 31
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 28,
                    "end": 30
                  },
                  "value": ".."
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 30,
                    "end": 31
                  },
                  "value": 3
                }
              ],
              "value": [
                null,
                3
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
          "children": [],
          "value": ""
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
            "end": 31
          },
          "typeType": "short",
          "valueRange": {
            "type": "nbtdoc:int_range",
            "range": {
              "start": 26,
              "end": 31
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 28,
                  "end": 30
                },
                "value": ".."
              },
              {
                "type": "integer",
                "range": {
                  "start": 30,
                  "end": 31
                },
                "value": 3
              }
            ],
            "value": [
              null,
              3
            ]
          }
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 32,
          "end": 33
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
      "children": [],
      "value": ""
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
          "end": 31
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
              "end": 31
            },
            "typeType": "short",
            "valueRange": {
              "type": "nbtdoc:int_range",
              "range": {
                "start": 26,
                "end": 31
              },
              "children": [
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 26,
                    "end": 27
                  },
                  "value": "@"
                },
                {
                  "type": "nbtdoc:literal",
                  "range": {
                    "start": 28,
                    "end": 30
                  },
                  "value": ".."
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 30,
                    "end": 31
                  },
                  "value": 3
                }
              ],
              "value": [
                null,
                3
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
          "children": [],
          "value": ""
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
            "end": 31
          },
          "typeType": "short",
          "valueRange": {
            "type": "nbtdoc:int_range",
            "range": {
              "start": 26,
              "end": 31
            },
            "children": [
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 26,
                  "end": 27
                },
                "value": "@"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 28,
                  "end": 30
                },
                "value": ".."
              },
              {
                "type": "integer",
                "range": {
                  "start": 30,
                  "end": 31
                },
                "value": 3
              }
            ],
            "value": [
              null,
              3
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
    "children": [
      {
        "type": "nbtdoc:doc_comments",
        "range": {
          "start": 0,
          "end": 0
        },
        "children": [],
        "value": ""
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
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 8,
              "end": 8
            },
            "children": [],
            "value": ""
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
              "children": [
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
          "children": [],
          "value": ""
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
            "children": [
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
      "children": [],
      "value": ""
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
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 8,
              "end": 8
            },
            "children": [],
            "value": ""
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
              "children": [
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
          "children": [],
          "value": ""
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
            "children": [
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
