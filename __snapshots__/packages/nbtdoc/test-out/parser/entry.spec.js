exports['entry() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "range": {
      "start": 0,
      "end": 0
    },
    "children": []
  },
  "errors": []
}

exports['entry() Parse "mod describes minecraft:block;" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "range": {
      "start": 0,
      "end": 30
    },
    "children": [
      {
        "type": "nbtdoc:describes_clause",
        "range": {
          "start": 0,
          "end": 30
        },
        "children": [
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 0,
                  "end": 3
                },
                "value": "mod"
              }
            ],
            "range": {
              "start": 0,
              "end": 3
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 4,
              "end": 13
            },
            "value": "describes"
          },
          {
            "type": "nbtdoc:minecraft_identifier",
            "range": {
              "start": 14,
              "end": 29
            },
            "namespace": "minecraft",
            "path": [
              "block"
            ]
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 29,
              "end": 30
            },
            "value": ";"
          }
        ],
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 0,
                "end": 3
              },
              "value": "mod"
            }
          ],
          "range": {
            "start": 0,
            "end": 3
          }
        },
        "registry": {
          "type": "nbtdoc:minecraft_identifier",
          "range": {
            "start": 14,
            "end": 29
          },
          "namespace": "minecraft",
          "path": [
            "block"
          ]
        },
        "objects": null
      }
    ]
  },
  "errors": []
}

exports['entry() Parse "mod describes;" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "range": {
      "start": 0,
      "end": 14
    },
    "children": [
      {
        "type": "nbtdoc:module_declaration",
        "range": {
          "start": 0,
          "end": 14
        },
        "children": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "mod"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 13
            },
            "value": "describes"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 13,
              "end": 14
            },
            "value": ";"
          }
        ],
        "identifier": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 13
          },
          "value": "describes"
        }
      }
    ]
  },
  "errors": []
}

exports['entry() Parse "↓// https://github.com/Yurihaia/mc-nbtdoc/blob/2e5a3da2ca01cb12c61dd9c5146ef8b711031e29/minecraft/block/jigsaw.nbtdoc by [Yurihaia](https://github.com/Yurihaia)↓// CC BY 4.0↓// Modified for testing doc comments parsing.↓/// Jigsaw block.↓compound Jigsaw extends super::BlockEntity {↓⮀/// How the resultant structure can be transformed↓⮀joint: JointType,↓⮀/// The id of the jigsaw that this will "spawn" in↓⮀name: string,↓⮀/// The structure pool that the jigsaw will "spawn" in↓⮀pool: string,↓⮀/// The final block state of the jigsaw↓⮀final_state: string,↓⮀/// The id of the type of jigsaw this will be "spawned" from↓⮀target: string↓}↓↓/// Joint type.↓enum(string) JointType {↓⮀/// The structure can be rotated↓⮀Rollable = "rollable",↓⮀/// The structure cannot be transformed↓⮀Aligned = "aligned"↓}↓↓Jigsaw describes minecraft:block[minecraft:jigsaw];" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "range": {
      "start": 0,
      "end": 851
    },
    "children": [
      {
        "type": "comment",
        "range": {
          "start": 1,
          "end": 160
        },
        "comment": " https://github.com/Yurihaia/mc-nbtdoc/blob/2e5a3da2ca01cb12c61dd9c5146ef8b711031e29/minecraft/block/jigsaw.nbtdoc by [Yurihaia](https://github.com/Yurihaia)"
      },
      {
        "type": "comment",
        "range": {
          "start": 161,
          "end": 173
        },
        "comment": " CC BY 4.0"
      },
      {
        "type": "comment",
        "range": {
          "start": 174,
          "end": 219
        },
        "comment": " Modified for testing doc comments parsing."
      },
      {
        "type": "nbtdoc:compound_definition",
        "range": {
          "start": 220,
          "end": 634
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 220,
              "end": 238
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 220,
                  "end": 238
                },
                "comment": " Jigsaw block.\n"
              }
            ],
            "value": " Jigsaw block.\n"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 238,
              "end": 246
            },
            "value": "compound"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 247,
              "end": 253
            },
            "value": "Jigsaw"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 254,
              "end": 261
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
                  "start": 262,
                  "end": 267
                },
                "value": "super"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 269,
                  "end": 280
                },
                "value": "BlockEntity"
              }
            ],
            "range": {
              "start": 262,
              "end": 280
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 281,
              "end": 282
            },
            "value": "{"
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 284,
              "end": 352
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 284,
                  "end": 336
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 284,
                      "end": 335
                    },
                    "comment": " How the resultant structure can be transformed\n"
                  }
                ],
                "value": " How the resultant structure can be transformed\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 336,
                  "end": 341
                },
                "value": "joint"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 341,
                  "end": 342
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 343,
                  "end": 352
                },
                "typeType": "path",
                "path": {
                  "type": "nbtdoc:ident_path",
                  "fromGlobalRoot": false,
                  "children": [
                    {
                      "type": "nbtdoc:identifier",
                      "range": {
                        "start": 343,
                        "end": 352
                      },
                      "value": "JointType"
                    }
                  ],
                  "range": {
                    "start": 343,
                    "end": 352
                  }
                }
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 284,
                "end": 336
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 284,
                    "end": 335
                  },
                  "comment": " How the resultant structure can be transformed\n"
                }
              ],
              "value": " How the resultant structure can be transformed\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 336,
                "end": 341
              },
              "value": "joint"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 343,
                "end": 352
              },
              "typeType": "path",
              "path": {
                "type": "nbtdoc:ident_path",
                "fromGlobalRoot": false,
                "children": [
                  {
                    "type": "nbtdoc:identifier",
                    "range": {
                      "start": 343,
                      "end": 352
                    },
                    "value": "JointType"
                  }
                ],
                "range": {
                  "start": 343,
                  "end": 352
                }
              }
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 352,
              "end": 353
            },
            "value": ","
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 355,
              "end": 419
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 355,
                  "end": 407
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 355,
                      "end": 406
                    },
                    "comment": " The id of the jigsaw that this will \"spawn\" in\n"
                  }
                ],
                "value": " The id of the jigsaw that this will \"spawn\" in\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 407,
                  "end": 411
                },
                "value": "name"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 411,
                  "end": 412
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 413,
                  "end": 419
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 355,
                "end": 407
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 355,
                    "end": 406
                  },
                  "comment": " The id of the jigsaw that this will \"spawn\" in\n"
                }
              ],
              "value": " The id of the jigsaw that this will \"spawn\" in\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 407,
                "end": 411
              },
              "value": "name"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 413,
                "end": 419
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 419,
              "end": 420
            },
            "value": ","
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 422,
              "end": 490
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 422,
                  "end": 478
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 422,
                      "end": 477
                    },
                    "comment": " The structure pool that the jigsaw will \"spawn\" in\n"
                  }
                ],
                "value": " The structure pool that the jigsaw will \"spawn\" in\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 478,
                  "end": 482
                },
                "value": "pool"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 482,
                  "end": 483
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 484,
                  "end": 490
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 422,
                "end": 478
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 422,
                    "end": 477
                  },
                  "comment": " The structure pool that the jigsaw will \"spawn\" in\n"
                }
              ],
              "value": " The structure pool that the jigsaw will \"spawn\" in\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 478,
                "end": 482
              },
              "value": "pool"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 484,
                "end": 490
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 490,
              "end": 491
            },
            "value": ","
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 493,
              "end": 553
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 493,
                  "end": 534
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 493,
                      "end": 533
                    },
                    "comment": " The final block state of the jigsaw\n"
                  }
                ],
                "value": " The final block state of the jigsaw\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 534,
                  "end": 545
                },
                "value": "final_state"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 545,
                  "end": 546
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 547,
                  "end": 553
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 493,
                "end": 534
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 493,
                    "end": 533
                  },
                  "comment": " The final block state of the jigsaw\n"
                }
              ],
              "value": " The final block state of the jigsaw\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 534,
                "end": 545
              },
              "value": "final_state"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 547,
                "end": 553
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 553,
              "end": 554
            },
            "value": ","
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 556,
              "end": 632
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 556,
                  "end": 618
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 556,
                      "end": 617
                    },
                    "comment": " The id of the type of jigsaw this will be \"spawned\" from\n"
                  }
                ],
                "value": " The id of the type of jigsaw this will be \"spawned\" from\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 618,
                  "end": 624
                },
                "value": "target"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 624,
                  "end": 625
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 626,
                  "end": 632
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 556,
                "end": 618
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 556,
                    "end": 617
                  },
                  "comment": " The id of the type of jigsaw this will be \"spawned\" from\n"
                }
              ],
              "value": " The id of the type of jigsaw this will be \"spawned\" from\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 618,
                "end": 624
              },
              "value": "target"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 626,
                "end": 632
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 633,
              "end": 634
            },
            "value": "}"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 220,
            "end": 238
          },
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 220,
                "end": 238
              },
              "comment": " Jigsaw block.\n"
            }
          ],
          "value": " Jigsaw block.\n"
        },
        "identifier": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 247,
            "end": 253
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
                "start": 262,
                "end": 267
              },
              "value": "super"
            },
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 269,
                "end": 280
              },
              "value": "BlockEntity"
            }
          ],
          "range": {
            "start": 262,
            "end": 280
          }
        },
        "fields": [
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 284,
              "end": 352
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 284,
                  "end": 336
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 284,
                      "end": 335
                    },
                    "comment": " How the resultant structure can be transformed\n"
                  }
                ],
                "value": " How the resultant structure can be transformed\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 336,
                  "end": 341
                },
                "value": "joint"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 341,
                  "end": 342
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 343,
                  "end": 352
                },
                "typeType": "path",
                "path": {
                  "type": "nbtdoc:ident_path",
                  "fromGlobalRoot": false,
                  "children": [
                    {
                      "type": "nbtdoc:identifier",
                      "range": {
                        "start": 343,
                        "end": 352
                      },
                      "value": "JointType"
                    }
                  ],
                  "range": {
                    "start": 343,
                    "end": 352
                  }
                }
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 284,
                "end": 336
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 284,
                    "end": 335
                  },
                  "comment": " How the resultant structure can be transformed\n"
                }
              ],
              "value": " How the resultant structure can be transformed\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 336,
                "end": 341
              },
              "value": "joint"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 343,
                "end": 352
              },
              "typeType": "path",
              "path": {
                "type": "nbtdoc:ident_path",
                "fromGlobalRoot": false,
                "children": [
                  {
                    "type": "nbtdoc:identifier",
                    "range": {
                      "start": 343,
                      "end": 352
                    },
                    "value": "JointType"
                  }
                ],
                "range": {
                  "start": 343,
                  "end": 352
                }
              }
            }
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 355,
              "end": 419
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 355,
                  "end": 407
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 355,
                      "end": 406
                    },
                    "comment": " The id of the jigsaw that this will \"spawn\" in\n"
                  }
                ],
                "value": " The id of the jigsaw that this will \"spawn\" in\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 407,
                  "end": 411
                },
                "value": "name"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 411,
                  "end": 412
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 413,
                  "end": 419
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 355,
                "end": 407
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 355,
                    "end": 406
                  },
                  "comment": " The id of the jigsaw that this will \"spawn\" in\n"
                }
              ],
              "value": " The id of the jigsaw that this will \"spawn\" in\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 407,
                "end": 411
              },
              "value": "name"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 413,
                "end": 419
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 422,
              "end": 490
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 422,
                  "end": 478
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 422,
                      "end": 477
                    },
                    "comment": " The structure pool that the jigsaw will \"spawn\" in\n"
                  }
                ],
                "value": " The structure pool that the jigsaw will \"spawn\" in\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 478,
                  "end": 482
                },
                "value": "pool"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 482,
                  "end": 483
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 484,
                  "end": 490
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 422,
                "end": 478
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 422,
                    "end": 477
                  },
                  "comment": " The structure pool that the jigsaw will \"spawn\" in\n"
                }
              ],
              "value": " The structure pool that the jigsaw will \"spawn\" in\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 478,
                "end": 482
              },
              "value": "pool"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 484,
                "end": 490
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 493,
              "end": 553
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 493,
                  "end": 534
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 493,
                      "end": 533
                    },
                    "comment": " The final block state of the jigsaw\n"
                  }
                ],
                "value": " The final block state of the jigsaw\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 534,
                  "end": 545
                },
                "value": "final_state"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 545,
                  "end": 546
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 547,
                  "end": 553
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 493,
                "end": 534
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 493,
                    "end": 533
                  },
                  "comment": " The final block state of the jigsaw\n"
                }
              ],
              "value": " The final block state of the jigsaw\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 534,
                "end": 545
              },
              "value": "final_state"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 547,
                "end": 553
              },
              "typeType": "string"
            }
          },
          {
            "type": "nbtdoc:compound_definition/field",
            "range": {
              "start": 556,
              "end": 632
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 556,
                  "end": 618
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 556,
                      "end": 617
                    },
                    "comment": " The id of the type of jigsaw this will be \"spawned\" from\n"
                  }
                ],
                "value": " The id of the type of jigsaw this will be \"spawned\" from\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 618,
                  "end": 624
                },
                "value": "target"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 624,
                  "end": 625
                },
                "value": ":"
              },
              {
                "type": "nbtdoc:compound_definition/field/type",
                "range": {
                  "start": 626,
                  "end": 632
                },
                "typeType": "string"
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 556,
                "end": 618
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 556,
                    "end": 617
                  },
                  "comment": " The id of the type of jigsaw this will be \"spawned\" from\n"
                }
              ],
              "value": " The id of the type of jigsaw this will be \"spawned\" from\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 618,
                "end": 624
              },
              "value": "target"
            },
            "fieldType": {
              "type": "nbtdoc:compound_definition/field/type",
              "range": {
                "start": 626,
                "end": 632
              },
              "typeType": "string"
            }
          }
        ]
      },
      {
        "type": "nbtdoc:enum_definition",
        "range": {
          "start": 636,
          "end": 798
        },
        "children": [
          {
            "type": "nbtdoc:doc_comments",
            "range": {
              "start": 636,
              "end": 652
            },
            "children": [
              {
                "type": "comment",
                "range": {
                  "start": 636,
                  "end": 652
                },
                "comment": " Joint type.\n"
              }
            ],
            "value": " Joint type.\n"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 652,
              "end": 656
            },
            "value": "enum"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 656,
              "end": 657
            },
            "value": "("
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 657,
              "end": 663
            },
            "value": "string"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 663,
              "end": 664
            },
            "value": ")"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 665,
              "end": 674
            },
            "value": "JointType"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 675,
              "end": 676
            },
            "value": "{"
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 678,
              "end": 733
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 678,
                  "end": 712
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 678,
                      "end": 711
                    },
                    "comment": " The structure can be rotated\n"
                  }
                ],
                "value": " The structure can be rotated\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 712,
                  "end": 720
                },
                "value": "Rollable"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 721,
                  "end": 722
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 723,
                  "end": 733
                },
                "value": "rollable",
                "valueMap": {
                  "outerRange": {
                    "start": 724,
                    "end": 732
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                }
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 678,
                "end": 712
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 678,
                    "end": 711
                  },
                  "comment": " The structure can be rotated\n"
                }
              ],
              "value": " The structure can be rotated\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 712,
                "end": 720
              },
              "value": "Rollable"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 723,
                "end": 733
              },
              "value": "rollable",
              "valueMap": {
                "outerRange": {
                  "start": 724,
                  "end": 732
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              }
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 733,
              "end": 734
            },
            "value": ","
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 736,
              "end": 796
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 736,
                  "end": 777
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 736,
                      "end": 776
                    },
                    "comment": " The structure cannot be transformed\n"
                  }
                ],
                "value": " The structure cannot be transformed\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 777,
                  "end": 784
                },
                "value": "Aligned"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 785,
                  "end": 786
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 787,
                  "end": 796
                },
                "value": "aligned",
                "valueMap": {
                  "outerRange": {
                    "start": 788,
                    "end": 795
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 7
                  },
                  "pairs": []
                }
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 736,
                "end": 777
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 736,
                    "end": 776
                  },
                  "comment": " The structure cannot be transformed\n"
                }
              ],
              "value": " The structure cannot be transformed\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 777,
                "end": 784
              },
              "value": "Aligned"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 787,
                "end": 796
              },
              "value": "aligned",
              "valueMap": {
                "outerRange": {
                  "start": 788,
                  "end": 795
                },
                "innerRange": {
                  "start": 0,
                  "end": 7
                },
                "pairs": []
              }
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 797,
              "end": 798
            },
            "value": "}"
          }
        ],
        "doc": {
          "type": "nbtdoc:doc_comments",
          "range": {
            "start": 636,
            "end": 652
          },
          "children": [
            {
              "type": "comment",
              "range": {
                "start": 636,
                "end": 652
              },
              "comment": " Joint type.\n"
            }
          ],
          "value": " Joint type.\n"
        },
        "enumType": {
          "type": "nbtdoc:literal",
          "range": {
            "start": 657,
            "end": 663
          },
          "value": "string"
        },
        "identifier": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 665,
            "end": 674
          },
          "value": "JointType"
        },
        "fields": [
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 678,
              "end": 733
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 678,
                  "end": 712
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 678,
                      "end": 711
                    },
                    "comment": " The structure can be rotated\n"
                  }
                ],
                "value": " The structure can be rotated\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 712,
                  "end": 720
                },
                "value": "Rollable"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 721,
                  "end": 722
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 723,
                  "end": 733
                },
                "value": "rollable",
                "valueMap": {
                  "outerRange": {
                    "start": 724,
                    "end": 732
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                }
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 678,
                "end": 712
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 678,
                    "end": 711
                  },
                  "comment": " The structure can be rotated\n"
                }
              ],
              "value": " The structure can be rotated\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 712,
                "end": 720
              },
              "value": "Rollable"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 723,
                "end": 733
              },
              "value": "rollable",
              "valueMap": {
                "outerRange": {
                  "start": 724,
                  "end": 732
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              }
            }
          },
          {
            "type": "nbtdoc:enum_definition/field",
            "range": {
              "start": 736,
              "end": 796
            },
            "children": [
              {
                "type": "nbtdoc:doc_comments",
                "range": {
                  "start": 736,
                  "end": 777
                },
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 736,
                      "end": 776
                    },
                    "comment": " The structure cannot be transformed\n"
                  }
                ],
                "value": " The structure cannot be transformed\n"
              },
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 777,
                  "end": 784
                },
                "value": "Aligned"
              },
              {
                "type": "nbtdoc:literal",
                "range": {
                  "start": 785,
                  "end": 786
                },
                "value": "="
              },
              {
                "type": "string",
                "range": {
                  "start": 787,
                  "end": 796
                },
                "value": "aligned",
                "valueMap": {
                  "outerRange": {
                    "start": 788,
                    "end": 795
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 7
                  },
                  "pairs": []
                }
              }
            ],
            "doc": {
              "type": "nbtdoc:doc_comments",
              "range": {
                "start": 736,
                "end": 777
              },
              "children": [
                {
                  "type": "comment",
                  "range": {
                    "start": 736,
                    "end": 776
                  },
                  "comment": " The structure cannot be transformed\n"
                }
              ],
              "value": " The structure cannot be transformed\n"
            },
            "key": {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 777,
                "end": 784
              },
              "value": "Aligned"
            },
            "value": {
              "type": "string",
              "range": {
                "start": 787,
                "end": 796
              },
              "value": "aligned",
              "valueMap": {
                "outerRange": {
                  "start": 788,
                  "end": 795
                },
                "innerRange": {
                  "start": 0,
                  "end": 7
                },
                "pairs": []
              }
            }
          }
        ]
      },
      {
        "type": "nbtdoc:describes_clause",
        "range": {
          "start": 800,
          "end": 851
        },
        "children": [
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "children": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 800,
                  "end": 806
                },
                "value": "Jigsaw"
              }
            ],
            "range": {
              "start": 800,
              "end": 806
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 807,
              "end": 816
            },
            "value": "describes"
          },
          {
            "type": "nbtdoc:minecraft_identifier",
            "range": {
              "start": 817,
              "end": 832
            },
            "namespace": "minecraft",
            "path": [
              "block"
            ]
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 832,
              "end": 833
            },
            "value": "["
          },
          {
            "type": "nbtdoc:minecraft_identifier",
            "range": {
              "start": 833,
              "end": 849
            },
            "namespace": "minecraft",
            "path": [
              "jigsaw"
            ]
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 849,
              "end": 850
            },
            "value": "]"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 850,
              "end": 851
            },
            "value": ";"
          }
        ],
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "children": [
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 800,
                "end": 806
              },
              "value": "Jigsaw"
            }
          ],
          "range": {
            "start": 800,
            "end": 806
          }
        },
        "registry": {
          "type": "nbtdoc:minecraft_identifier",
          "range": {
            "start": 817,
            "end": 832
          },
          "namespace": "minecraft",
          "path": [
            "block"
          ]
        },
        "objects": [
          {
            "type": "nbtdoc:minecraft_identifier",
            "range": {
              "start": 833,
              "end": 849
            },
            "namespace": "minecraft",
            "path": [
              "jigsaw"
            ]
          }
        ]
      }
    ]
  },
  "errors": []
}
