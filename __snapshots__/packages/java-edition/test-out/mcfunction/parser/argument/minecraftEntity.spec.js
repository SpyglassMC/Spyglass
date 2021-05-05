exports['mcfunction argument minecraft:entity Parse "0123" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 4
        },
        "options": {
          "escapable": {},
          "quotes": [
            "\"",
            "'"
          ],
          "unquotable": {}
        },
        "value": "0123",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 4
          },
          "innerRange": {
            "start": 0,
            "end": 4
          },
          "pairs": []
        }
      }
    ],
    "name": "test",
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 4
      },
      "options": {
        "escapable": {},
        "quotes": [
          "\"",
          "'"
        ],
        "unquotable": {}
      },
      "value": "0123",
      "valueMap": {
        "outerRange": {
          "start": 0,
          "end": 4
        },
        "innerRange": {
          "start": 0,
          "end": 4
        },
        "pairs": []
      }
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "0123" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 4
        },
        "options": {
          "escapable": {},
          "quotes": [
            "\"",
            "'"
          ],
          "unquotable": {}
        },
        "value": "0123",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 4
          },
          "innerRange": {
            "start": 0,
            "end": 4
          },
          "pairs": []
        }
      }
    ],
    "name": "test",
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 4
      },
      "options": {
        "escapable": {},
        "quotes": [
          "\"",
          "'"
        ],
        "unquotable": {}
      },
      "value": "0123",
      "valueMap": {
        "outerRange": {
          "start": 0,
          "end": 4
        },
        "innerRange": {
          "start": 0,
          "end": 4
        },
        "pairs": []
      }
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 5
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 5
            },
            "children": []
          }
        ],
        "range": {
          "start": 0,
          "end": 5
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 5
          },
          "children": []
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 5
          },
          "children": []
        }
      ],
      "range": {
        "start": 0,
        "end": 5
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 5
        },
        "children": []
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ advancements = { minecraft:foo = true , minecraft:bar = { qux = true , } , } , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 84
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 84
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 82
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 16
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "advancements",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 16
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 12
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 12
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "advancements"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/advancements",
                    "range": {
                      "start": 19,
                      "end": 80
                    },
                    "children": [
                      {
                        "type": "pair",
                        "range": {
                          "start": 21,
                          "end": 43
                        },
                        "children": [
                          {
                            "type": "resource_location",
                            "range": {
                              "start": 21,
                              "end": 34
                            },
                            "options": {
                              "category": "advancement"
                            },
                            "namespace": "minecraft",
                            "path": [
                              "foo"
                            ]
                          },
                          {
                            "type": "boolean",
                            "range": {
                              "start": 37,
                              "end": 41
                            },
                            "value": true
                          }
                        ],
                        "key": {
                          "type": "resource_location",
                          "range": {
                            "start": 21,
                            "end": 34
                          },
                          "options": {
                            "category": "advancement"
                          },
                          "namespace": "minecraft",
                          "path": [
                            "foo"
                          ]
                        },
                        "sep": {
                          "start": 35,
                          "end": 36
                        },
                        "value": {
                          "type": "boolean",
                          "range": {
                            "start": 37,
                            "end": 41
                          },
                          "value": true
                        },
                        "end": {
                          "start": 42,
                          "end": 43
                        }
                      },
                      {
                        "type": "pair",
                        "range": {
                          "start": 44,
                          "end": 78
                        },
                        "children": [
                          {
                            "type": "resource_location",
                            "range": {
                              "start": 44,
                              "end": 57
                            },
                            "options": {
                              "category": "advancement"
                            },
                            "namespace": "minecraft",
                            "path": [
                              "bar"
                            ]
                          },
                          {
                            "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                            "range": {
                              "start": 60,
                              "end": 76
                            },
                            "children": [
                              {
                                "type": "pair",
                                "range": {
                                  "start": 62,
                                  "end": 74
                                },
                                "children": [
                                  {
                                    "type": "string",
                                    "range": {
                                      "start": 62,
                                      "end": 65
                                    },
                                    "options": {
                                      "unquotable": {}
                                    },
                                    "value": "qux",
                                    "valueMap": {
                                      "outerRange": {
                                        "start": 62,
                                        "end": 65
                                      },
                                      "innerRange": {
                                        "start": 0,
                                        "end": 3
                                      },
                                      "pairs": []
                                    }
                                  },
                                  {
                                    "type": "boolean",
                                    "range": {
                                      "start": 68,
                                      "end": 72
                                    },
                                    "value": true
                                  }
                                ],
                                "key": {
                                  "type": "string",
                                  "range": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "options": {
                                    "unquotable": {}
                                  },
                                  "value": "qux",
                                  "valueMap": {
                                    "outerRange": {
                                      "start": 62,
                                      "end": 65
                                    },
                                    "innerRange": {
                                      "start": 0,
                                      "end": 3
                                    },
                                    "pairs": []
                                  }
                                },
                                "sep": {
                                  "start": 66,
                                  "end": 67
                                },
                                "value": {
                                  "type": "boolean",
                                  "range": {
                                    "start": 68,
                                    "end": 72
                                  },
                                  "value": true
                                },
                                "end": {
                                  "start": 73,
                                  "end": 74
                                }
                              }
                            ]
                          }
                        ],
                        "key": {
                          "type": "resource_location",
                          "range": {
                            "start": 44,
                            "end": 57
                          },
                          "options": {
                            "category": "advancement"
                          },
                          "namespace": "minecraft",
                          "path": [
                            "bar"
                          ]
                        },
                        "sep": {
                          "start": 58,
                          "end": 59
                        },
                        "value": {
                          "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                          "range": {
                            "start": 60,
                            "end": 76
                          },
                          "children": [
                            {
                              "type": "pair",
                              "range": {
                                "start": 62,
                                "end": 74
                              },
                              "children": [
                                {
                                  "type": "string",
                                  "range": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "options": {
                                    "unquotable": {}
                                  },
                                  "value": "qux",
                                  "valueMap": {
                                    "outerRange": {
                                      "start": 62,
                                      "end": 65
                                    },
                                    "innerRange": {
                                      "start": 0,
                                      "end": 3
                                    },
                                    "pairs": []
                                  }
                                },
                                {
                                  "type": "boolean",
                                  "range": {
                                    "start": 68,
                                    "end": 72
                                  },
                                  "value": true
                                }
                              ],
                              "key": {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              "sep": {
                                "start": 66,
                                "end": 67
                              },
                              "value": {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              },
                              "end": {
                                "start": 73,
                                "end": 74
                              }
                            }
                          ]
                        },
                        "end": {
                          "start": 77,
                          "end": 78
                        }
                      }
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 16
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 16
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                "sep": {
                  "start": 17,
                  "end": 18
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 19,
                    "end": 80
                  },
                  "children": [
                    {
                      "type": "pair",
                      "range": {
                        "start": 21,
                        "end": 43
                      },
                      "children": [
                        {
                          "type": "resource_location",
                          "range": {
                            "start": 21,
                            "end": 34
                          },
                          "options": {
                            "category": "advancement"
                          },
                          "namespace": "minecraft",
                          "path": [
                            "foo"
                          ]
                        },
                        {
                          "type": "boolean",
                          "range": {
                            "start": 37,
                            "end": 41
                          },
                          "value": true
                        }
                      ],
                      "key": {
                        "type": "resource_location",
                        "range": {
                          "start": 21,
                          "end": 34
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "foo"
                        ]
                      },
                      "sep": {
                        "start": 35,
                        "end": 36
                      },
                      "value": {
                        "type": "boolean",
                        "range": {
                          "start": 37,
                          "end": 41
                        },
                        "value": true
                      },
                      "end": {
                        "start": 42,
                        "end": 43
                      }
                    },
                    {
                      "type": "pair",
                      "range": {
                        "start": 44,
                        "end": 78
                      },
                      "children": [
                        {
                          "type": "resource_location",
                          "range": {
                            "start": 44,
                            "end": 57
                          },
                          "options": {
                            "category": "advancement"
                          },
                          "namespace": "minecraft",
                          "path": [
                            "bar"
                          ]
                        },
                        {
                          "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                          "range": {
                            "start": 60,
                            "end": 76
                          },
                          "children": [
                            {
                              "type": "pair",
                              "range": {
                                "start": 62,
                                "end": 74
                              },
                              "children": [
                                {
                                  "type": "string",
                                  "range": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "options": {
                                    "unquotable": {}
                                  },
                                  "value": "qux",
                                  "valueMap": {
                                    "outerRange": {
                                      "start": 62,
                                      "end": 65
                                    },
                                    "innerRange": {
                                      "start": 0,
                                      "end": 3
                                    },
                                    "pairs": []
                                  }
                                },
                                {
                                  "type": "boolean",
                                  "range": {
                                    "start": 68,
                                    "end": 72
                                  },
                                  "value": true
                                }
                              ],
                              "key": {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              "sep": {
                                "start": 66,
                                "end": 67
                              },
                              "value": {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              },
                              "end": {
                                "start": 73,
                                "end": 74
                              }
                            }
                          ]
                        }
                      ],
                      "key": {
                        "type": "resource_location",
                        "range": {
                          "start": 44,
                          "end": 57
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "bar"
                        ]
                      },
                      "sep": {
                        "start": 58,
                        "end": 59
                      },
                      "value": {
                        "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                        "range": {
                          "start": 60,
                          "end": 76
                        },
                        "children": [
                          {
                            "type": "pair",
                            "range": {
                              "start": 62,
                              "end": 74
                            },
                            "children": [
                              {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              }
                            ],
                            "key": {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            "sep": {
                              "start": 66,
                              "end": 67
                            },
                            "value": {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            },
                            "end": {
                              "start": 73,
                              "end": 74
                            }
                          }
                        ]
                      },
                      "end": {
                        "start": 77,
                        "end": 78
                      }
                    }
                  ]
                },
                "end": {
                  "start": 81,
                  "end": 82
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 84
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 84
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 82
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 16
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 16
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 19,
                    "end": 80
                  },
                  "children": [
                    {
                      "type": "pair",
                      "range": {
                        "start": 21,
                        "end": 43
                      },
                      "children": [
                        {
                          "type": "resource_location",
                          "range": {
                            "start": 21,
                            "end": 34
                          },
                          "options": {
                            "category": "advancement"
                          },
                          "namespace": "minecraft",
                          "path": [
                            "foo"
                          ]
                        },
                        {
                          "type": "boolean",
                          "range": {
                            "start": 37,
                            "end": 41
                          },
                          "value": true
                        }
                      ],
                      "key": {
                        "type": "resource_location",
                        "range": {
                          "start": 21,
                          "end": 34
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "foo"
                        ]
                      },
                      "sep": {
                        "start": 35,
                        "end": 36
                      },
                      "value": {
                        "type": "boolean",
                        "range": {
                          "start": 37,
                          "end": 41
                        },
                        "value": true
                      },
                      "end": {
                        "start": 42,
                        "end": 43
                      }
                    },
                    {
                      "type": "pair",
                      "range": {
                        "start": 44,
                        "end": 78
                      },
                      "children": [
                        {
                          "type": "resource_location",
                          "range": {
                            "start": 44,
                            "end": 57
                          },
                          "options": {
                            "category": "advancement"
                          },
                          "namespace": "minecraft",
                          "path": [
                            "bar"
                          ]
                        },
                        {
                          "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                          "range": {
                            "start": 60,
                            "end": 76
                          },
                          "children": [
                            {
                              "type": "pair",
                              "range": {
                                "start": 62,
                                "end": 74
                              },
                              "children": [
                                {
                                  "type": "string",
                                  "range": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "options": {
                                    "unquotable": {}
                                  },
                                  "value": "qux",
                                  "valueMap": {
                                    "outerRange": {
                                      "start": 62,
                                      "end": 65
                                    },
                                    "innerRange": {
                                      "start": 0,
                                      "end": 3
                                    },
                                    "pairs": []
                                  }
                                },
                                {
                                  "type": "boolean",
                                  "range": {
                                    "start": 68,
                                    "end": 72
                                  },
                                  "value": true
                                }
                              ],
                              "key": {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              "sep": {
                                "start": 66,
                                "end": 67
                              },
                              "value": {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              },
                              "end": {
                                "start": 73,
                                "end": 74
                              }
                            }
                          ]
                        }
                      ],
                      "key": {
                        "type": "resource_location",
                        "range": {
                          "start": 44,
                          "end": 57
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "bar"
                        ]
                      },
                      "sep": {
                        "start": 58,
                        "end": 59
                      },
                      "value": {
                        "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                        "range": {
                          "start": 60,
                          "end": 76
                        },
                        "children": [
                          {
                            "type": "pair",
                            "range": {
                              "start": 62,
                              "end": 74
                            },
                            "children": [
                              {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              }
                            ],
                            "key": {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            "sep": {
                              "start": 66,
                              "end": 67
                            },
                            "value": {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            },
                            "end": {
                              "start": 73,
                              "end": 74
                            }
                          }
                        ]
                      },
                      "end": {
                        "start": 77,
                        "end": 78
                      }
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 16
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 16
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              "sep": {
                "start": 17,
                "end": 18
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 19,
                  "end": 80
                },
                "children": [
                  {
                    "type": "pair",
                    "range": {
                      "start": 21,
                      "end": 43
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 21,
                          "end": 34
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "foo"
                        ]
                      },
                      {
                        "type": "boolean",
                        "range": {
                          "start": 37,
                          "end": 41
                        },
                        "value": true
                      }
                    ],
                    "key": {
                      "type": "resource_location",
                      "range": {
                        "start": 21,
                        "end": 34
                      },
                      "options": {
                        "category": "advancement"
                      },
                      "namespace": "minecraft",
                      "path": [
                        "foo"
                      ]
                    },
                    "sep": {
                      "start": 35,
                      "end": 36
                    },
                    "value": {
                      "type": "boolean",
                      "range": {
                        "start": 37,
                        "end": 41
                      },
                      "value": true
                    },
                    "end": {
                      "start": 42,
                      "end": 43
                    }
                  },
                  {
                    "type": "pair",
                    "range": {
                      "start": 44,
                      "end": 78
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 44,
                          "end": 57
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "bar"
                        ]
                      },
                      {
                        "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                        "range": {
                          "start": 60,
                          "end": 76
                        },
                        "children": [
                          {
                            "type": "pair",
                            "range": {
                              "start": 62,
                              "end": 74
                            },
                            "children": [
                              {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              }
                            ],
                            "key": {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            "sep": {
                              "start": 66,
                              "end": 67
                            },
                            "value": {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            },
                            "end": {
                              "start": 73,
                              "end": 74
                            }
                          }
                        ]
                      }
                    ],
                    "key": {
                      "type": "resource_location",
                      "range": {
                        "start": 44,
                        "end": 57
                      },
                      "options": {
                        "category": "advancement"
                      },
                      "namespace": "minecraft",
                      "path": [
                        "bar"
                      ]
                    },
                    "sep": {
                      "start": 58,
                      "end": 59
                    },
                    "value": {
                      "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                      "range": {
                        "start": 60,
                        "end": 76
                      },
                      "children": [
                        {
                          "type": "pair",
                          "range": {
                            "start": 62,
                            "end": 74
                          },
                          "children": [
                            {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            }
                          ],
                          "key": {
                            "type": "string",
                            "range": {
                              "start": 62,
                              "end": 65
                            },
                            "options": {
                              "unquotable": {}
                            },
                            "value": "qux",
                            "valueMap": {
                              "outerRange": {
                                "start": 62,
                                "end": 65
                              },
                              "innerRange": {
                                "start": 0,
                                "end": 3
                              },
                              "pairs": []
                            }
                          },
                          "sep": {
                            "start": 66,
                            "end": 67
                          },
                          "value": {
                            "type": "boolean",
                            "range": {
                              "start": 68,
                              "end": 72
                            },
                            "value": true
                          },
                          "end": {
                            "start": 73,
                            "end": 74
                          }
                        }
                      ]
                    },
                    "end": {
                      "start": 77,
                      "end": 78
                    }
                  }
                ]
              },
              "end": {
                "start": 81,
                "end": 82
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 84
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 82
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 16
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 16
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 19,
                    "end": 80
                  },
                  "children": [
                    {
                      "type": "pair",
                      "range": {
                        "start": 21,
                        "end": 43
                      },
                      "children": [
                        {
                          "type": "resource_location",
                          "range": {
                            "start": 21,
                            "end": 34
                          },
                          "options": {
                            "category": "advancement"
                          },
                          "namespace": "minecraft",
                          "path": [
                            "foo"
                          ]
                        },
                        {
                          "type": "boolean",
                          "range": {
                            "start": 37,
                            "end": 41
                          },
                          "value": true
                        }
                      ],
                      "key": {
                        "type": "resource_location",
                        "range": {
                          "start": 21,
                          "end": 34
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "foo"
                        ]
                      },
                      "sep": {
                        "start": 35,
                        "end": 36
                      },
                      "value": {
                        "type": "boolean",
                        "range": {
                          "start": 37,
                          "end": 41
                        },
                        "value": true
                      },
                      "end": {
                        "start": 42,
                        "end": 43
                      }
                    },
                    {
                      "type": "pair",
                      "range": {
                        "start": 44,
                        "end": 78
                      },
                      "children": [
                        {
                          "type": "resource_location",
                          "range": {
                            "start": 44,
                            "end": 57
                          },
                          "options": {
                            "category": "advancement"
                          },
                          "namespace": "minecraft",
                          "path": [
                            "bar"
                          ]
                        },
                        {
                          "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                          "range": {
                            "start": 60,
                            "end": 76
                          },
                          "children": [
                            {
                              "type": "pair",
                              "range": {
                                "start": 62,
                                "end": 74
                              },
                              "children": [
                                {
                                  "type": "string",
                                  "range": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "options": {
                                    "unquotable": {}
                                  },
                                  "value": "qux",
                                  "valueMap": {
                                    "outerRange": {
                                      "start": 62,
                                      "end": 65
                                    },
                                    "innerRange": {
                                      "start": 0,
                                      "end": 3
                                    },
                                    "pairs": []
                                  }
                                },
                                {
                                  "type": "boolean",
                                  "range": {
                                    "start": 68,
                                    "end": 72
                                  },
                                  "value": true
                                }
                              ],
                              "key": {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              "sep": {
                                "start": 66,
                                "end": 67
                              },
                              "value": {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              },
                              "end": {
                                "start": 73,
                                "end": 74
                              }
                            }
                          ]
                        }
                      ],
                      "key": {
                        "type": "resource_location",
                        "range": {
                          "start": 44,
                          "end": 57
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "bar"
                        ]
                      },
                      "sep": {
                        "start": 58,
                        "end": 59
                      },
                      "value": {
                        "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                        "range": {
                          "start": 60,
                          "end": 76
                        },
                        "children": [
                          {
                            "type": "pair",
                            "range": {
                              "start": 62,
                              "end": 74
                            },
                            "children": [
                              {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              }
                            ],
                            "key": {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            "sep": {
                              "start": 66,
                              "end": 67
                            },
                            "value": {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            },
                            "end": {
                              "start": 73,
                              "end": 74
                            }
                          }
                        ]
                      },
                      "end": {
                        "start": 77,
                        "end": 78
                      }
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 16
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 16
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              "sep": {
                "start": 17,
                "end": 18
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 19,
                  "end": 80
                },
                "children": [
                  {
                    "type": "pair",
                    "range": {
                      "start": 21,
                      "end": 43
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 21,
                          "end": 34
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "foo"
                        ]
                      },
                      {
                        "type": "boolean",
                        "range": {
                          "start": 37,
                          "end": 41
                        },
                        "value": true
                      }
                    ],
                    "key": {
                      "type": "resource_location",
                      "range": {
                        "start": 21,
                        "end": 34
                      },
                      "options": {
                        "category": "advancement"
                      },
                      "namespace": "minecraft",
                      "path": [
                        "foo"
                      ]
                    },
                    "sep": {
                      "start": 35,
                      "end": 36
                    },
                    "value": {
                      "type": "boolean",
                      "range": {
                        "start": 37,
                        "end": 41
                      },
                      "value": true
                    },
                    "end": {
                      "start": 42,
                      "end": 43
                    }
                  },
                  {
                    "type": "pair",
                    "range": {
                      "start": 44,
                      "end": 78
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 44,
                          "end": 57
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "bar"
                        ]
                      },
                      {
                        "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                        "range": {
                          "start": 60,
                          "end": 76
                        },
                        "children": [
                          {
                            "type": "pair",
                            "range": {
                              "start": 62,
                              "end": 74
                            },
                            "children": [
                              {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              }
                            ],
                            "key": {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            "sep": {
                              "start": 66,
                              "end": 67
                            },
                            "value": {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            },
                            "end": {
                              "start": 73,
                              "end": 74
                            }
                          }
                        ]
                      }
                    ],
                    "key": {
                      "type": "resource_location",
                      "range": {
                        "start": 44,
                        "end": 57
                      },
                      "options": {
                        "category": "advancement"
                      },
                      "namespace": "minecraft",
                      "path": [
                        "bar"
                      ]
                    },
                    "sep": {
                      "start": 58,
                      "end": 59
                    },
                    "value": {
                      "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                      "range": {
                        "start": 60,
                        "end": 76
                      },
                      "children": [
                        {
                          "type": "pair",
                          "range": {
                            "start": 62,
                            "end": 74
                          },
                          "children": [
                            {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            }
                          ],
                          "key": {
                            "type": "string",
                            "range": {
                              "start": 62,
                              "end": 65
                            },
                            "options": {
                              "unquotable": {}
                            },
                            "value": "qux",
                            "valueMap": {
                              "outerRange": {
                                "start": 62,
                                "end": 65
                              },
                              "innerRange": {
                                "start": 0,
                                "end": 3
                              },
                              "pairs": []
                            }
                          },
                          "sep": {
                            "start": 66,
                            "end": 67
                          },
                          "value": {
                            "type": "boolean",
                            "range": {
                              "start": 68,
                              "end": 72
                            },
                            "value": true
                          },
                          "end": {
                            "start": 73,
                            "end": 74
                          }
                        }
                      ]
                    },
                    "end": {
                      "start": 77,
                      "end": 78
                    }
                  }
                ]
              },
              "end": {
                "start": 81,
                "end": 82
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 84
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 84
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 82
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 16
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 16
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 19,
                  "end": 80
                },
                "children": [
                  {
                    "type": "pair",
                    "range": {
                      "start": 21,
                      "end": 43
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 21,
                          "end": 34
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "foo"
                        ]
                      },
                      {
                        "type": "boolean",
                        "range": {
                          "start": 37,
                          "end": 41
                        },
                        "value": true
                      }
                    ],
                    "key": {
                      "type": "resource_location",
                      "range": {
                        "start": 21,
                        "end": 34
                      },
                      "options": {
                        "category": "advancement"
                      },
                      "namespace": "minecraft",
                      "path": [
                        "foo"
                      ]
                    },
                    "sep": {
                      "start": 35,
                      "end": 36
                    },
                    "value": {
                      "type": "boolean",
                      "range": {
                        "start": 37,
                        "end": 41
                      },
                      "value": true
                    },
                    "end": {
                      "start": 42,
                      "end": 43
                    }
                  },
                  {
                    "type": "pair",
                    "range": {
                      "start": 44,
                      "end": 78
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 44,
                          "end": 57
                        },
                        "options": {
                          "category": "advancement"
                        },
                        "namespace": "minecraft",
                        "path": [
                          "bar"
                        ]
                      },
                      {
                        "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                        "range": {
                          "start": 60,
                          "end": 76
                        },
                        "children": [
                          {
                            "type": "pair",
                            "range": {
                              "start": 62,
                              "end": 74
                            },
                            "children": [
                              {
                                "type": "string",
                                "range": {
                                  "start": 62,
                                  "end": 65
                                },
                                "options": {
                                  "unquotable": {}
                                },
                                "value": "qux",
                                "valueMap": {
                                  "outerRange": {
                                    "start": 62,
                                    "end": 65
                                  },
                                  "innerRange": {
                                    "start": 0,
                                    "end": 3
                                  },
                                  "pairs": []
                                }
                              },
                              {
                                "type": "boolean",
                                "range": {
                                  "start": 68,
                                  "end": 72
                                },
                                "value": true
                              }
                            ],
                            "key": {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            "sep": {
                              "start": 66,
                              "end": 67
                            },
                            "value": {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            },
                            "end": {
                              "start": 73,
                              "end": 74
                            }
                          }
                        ]
                      }
                    ],
                    "key": {
                      "type": "resource_location",
                      "range": {
                        "start": 44,
                        "end": 57
                      },
                      "options": {
                        "category": "advancement"
                      },
                      "namespace": "minecraft",
                      "path": [
                        "bar"
                      ]
                    },
                    "sep": {
                      "start": 58,
                      "end": 59
                    },
                    "value": {
                      "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                      "range": {
                        "start": 60,
                        "end": 76
                      },
                      "children": [
                        {
                          "type": "pair",
                          "range": {
                            "start": 62,
                            "end": 74
                          },
                          "children": [
                            {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            }
                          ],
                          "key": {
                            "type": "string",
                            "range": {
                              "start": 62,
                              "end": 65
                            },
                            "options": {
                              "unquotable": {}
                            },
                            "value": "qux",
                            "valueMap": {
                              "outerRange": {
                                "start": 62,
                                "end": 65
                              },
                              "innerRange": {
                                "start": 0,
                                "end": 3
                              },
                              "pairs": []
                            }
                          },
                          "sep": {
                            "start": 66,
                            "end": 67
                          },
                          "value": {
                            "type": "boolean",
                            "range": {
                              "start": 68,
                              "end": 72
                            },
                            "value": true
                          },
                          "end": {
                            "start": 73,
                            "end": 74
                          }
                        }
                      ]
                    },
                    "end": {
                      "start": 77,
                      "end": 78
                    }
                  }
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 16
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "advancements",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 16
                },
                "innerRange": {
                  "start": 0,
                  "end": 12
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 12
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "advancements"
              }
            },
            "sep": {
              "start": 17,
              "end": 18
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/advancements",
              "range": {
                "start": 19,
                "end": 80
              },
              "children": [
                {
                  "type": "pair",
                  "range": {
                    "start": 21,
                    "end": 43
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 21,
                        "end": 34
                      },
                      "options": {
                        "category": "advancement"
                      },
                      "namespace": "minecraft",
                      "path": [
                        "foo"
                      ]
                    },
                    {
                      "type": "boolean",
                      "range": {
                        "start": 37,
                        "end": 41
                      },
                      "value": true
                    }
                  ],
                  "key": {
                    "type": "resource_location",
                    "range": {
                      "start": 21,
                      "end": 34
                    },
                    "options": {
                      "category": "advancement"
                    },
                    "namespace": "minecraft",
                    "path": [
                      "foo"
                    ]
                  },
                  "sep": {
                    "start": 35,
                    "end": 36
                  },
                  "value": {
                    "type": "boolean",
                    "range": {
                      "start": 37,
                      "end": 41
                    },
                    "value": true
                  },
                  "end": {
                    "start": 42,
                    "end": 43
                  }
                },
                {
                  "type": "pair",
                  "range": {
                    "start": 44,
                    "end": 78
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 44,
                        "end": 57
                      },
                      "options": {
                        "category": "advancement"
                      },
                      "namespace": "minecraft",
                      "path": [
                        "bar"
                      ]
                    },
                    {
                      "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                      "range": {
                        "start": 60,
                        "end": 76
                      },
                      "children": [
                        {
                          "type": "pair",
                          "range": {
                            "start": 62,
                            "end": 74
                          },
                          "children": [
                            {
                              "type": "string",
                              "range": {
                                "start": 62,
                                "end": 65
                              },
                              "options": {
                                "unquotable": {}
                              },
                              "value": "qux",
                              "valueMap": {
                                "outerRange": {
                                  "start": 62,
                                  "end": 65
                                },
                                "innerRange": {
                                  "start": 0,
                                  "end": 3
                                },
                                "pairs": []
                              }
                            },
                            {
                              "type": "boolean",
                              "range": {
                                "start": 68,
                                "end": 72
                              },
                              "value": true
                            }
                          ],
                          "key": {
                            "type": "string",
                            "range": {
                              "start": 62,
                              "end": 65
                            },
                            "options": {
                              "unquotable": {}
                            },
                            "value": "qux",
                            "valueMap": {
                              "outerRange": {
                                "start": 62,
                                "end": 65
                              },
                              "innerRange": {
                                "start": 0,
                                "end": 3
                              },
                              "pairs": []
                            }
                          },
                          "sep": {
                            "start": 66,
                            "end": 67
                          },
                          "value": {
                            "type": "boolean",
                            "range": {
                              "start": 68,
                              "end": 72
                            },
                            "value": true
                          },
                          "end": {
                            "start": 73,
                            "end": 74
                          }
                        }
                      ]
                    }
                  ],
                  "key": {
                    "type": "resource_location",
                    "range": {
                      "start": 44,
                      "end": 57
                    },
                    "options": {
                      "category": "advancement"
                    },
                    "namespace": "minecraft",
                    "path": [
                      "bar"
                    ]
                  },
                  "sep": {
                    "start": 58,
                    "end": 59
                  },
                  "value": {
                    "type": "mcfunction:entity_selector/arguments/advancements/criteria",
                    "range": {
                      "start": 60,
                      "end": 76
                    },
                    "children": [
                      {
                        "type": "pair",
                        "range": {
                          "start": 62,
                          "end": 74
                        },
                        "children": [
                          {
                            "type": "string",
                            "range": {
                              "start": 62,
                              "end": 65
                            },
                            "options": {
                              "unquotable": {}
                            },
                            "value": "qux",
                            "valueMap": {
                              "outerRange": {
                                "start": 62,
                                "end": 65
                              },
                              "innerRange": {
                                "start": 0,
                                "end": 3
                              },
                              "pairs": []
                            }
                          },
                          {
                            "type": "boolean",
                            "range": {
                              "start": 68,
                              "end": 72
                            },
                            "value": true
                          }
                        ],
                        "key": {
                          "type": "string",
                          "range": {
                            "start": 62,
                            "end": 65
                          },
                          "options": {
                            "unquotable": {}
                          },
                          "value": "qux",
                          "valueMap": {
                            "outerRange": {
                              "start": 62,
                              "end": 65
                            },
                            "innerRange": {
                              "start": 0,
                              "end": 3
                            },
                            "pairs": []
                          }
                        },
                        "sep": {
                          "start": 66,
                          "end": 67
                        },
                        "value": {
                          "type": "boolean",
                          "range": {
                            "start": 68,
                            "end": 72
                          },
                          "value": true
                        },
                        "end": {
                          "start": 73,
                          "end": 74
                        }
                      }
                    ]
                  },
                  "end": {
                    "start": 77,
                    "end": 78
                  }
                }
              ]
            },
            "end": {
              "start": 81,
              "end": 82
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ advancements = { } , advancements = { } , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 47
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 47
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 24
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 16
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "advancements",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 16
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 12
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 12
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "advancements"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/advancements",
                    "range": {
                      "start": 19,
                      "end": 22
                    },
                    "children": []
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 16
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 16
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                "sep": {
                  "start": 17,
                  "end": 18
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 19,
                    "end": 22
                  },
                  "children": []
                },
                "end": {
                  "start": 23,
                  "end": 24
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 25,
                  "end": 45
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 25,
                      "end": 37
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "advancements",
                    "valueMap": {
                      "outerRange": {
                        "start": 25,
                        "end": 37
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 12
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 12
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "advancements"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/advancements",
                    "range": {
                      "start": 40,
                      "end": 43
                    },
                    "children": []
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 25,
                    "end": 37
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 25,
                      "end": 37
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                "sep": {
                  "start": 38,
                  "end": 39
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 40,
                    "end": 43
                  },
                  "children": []
                },
                "end": {
                  "start": 44,
                  "end": 45
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 47
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 47
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 24
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 16
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 16
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 19,
                    "end": 22
                  },
                  "children": []
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 16
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 16
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              "sep": {
                "start": 17,
                "end": 18
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 19,
                  "end": 22
                },
                "children": []
              },
              "end": {
                "start": 23,
                "end": 24
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 25,
                "end": 45
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 25,
                    "end": 37
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 25,
                      "end": 37
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 40,
                    "end": 43
                  },
                  "children": []
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 25,
                  "end": 37
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 25,
                    "end": 37
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              "sep": {
                "start": 38,
                "end": 39
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 40,
                  "end": 43
                },
                "children": []
              },
              "end": {
                "start": 44,
                "end": 45
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 47
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 24
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 16
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 16
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 19,
                    "end": 22
                  },
                  "children": []
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 16
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 16
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              "sep": {
                "start": 17,
                "end": 18
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 19,
                  "end": 22
                },
                "children": []
              },
              "end": {
                "start": 23,
                "end": 24
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 25,
                "end": 45
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 25,
                    "end": 37
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "advancements",
                  "valueMap": {
                    "outerRange": {
                      "start": 25,
                      "end": 37
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 12
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "advancements"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/advancements",
                  "range": {
                    "start": 40,
                    "end": 43
                  },
                  "children": []
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 25,
                  "end": 37
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 25,
                    "end": 37
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              "sep": {
                "start": 38,
                "end": 39
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 40,
                  "end": 43
                },
                "children": []
              },
              "end": {
                "start": 44,
                "end": 45
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 47
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 47
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 24
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 16
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 16
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 19,
                  "end": 22
                },
                "children": []
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 16
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "advancements",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 16
                },
                "innerRange": {
                  "start": 0,
                  "end": 12
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 12
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "advancements"
              }
            },
            "sep": {
              "start": 17,
              "end": 18
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/advancements",
              "range": {
                "start": 19,
                "end": 22
              },
              "children": []
            },
            "end": {
              "start": 23,
              "end": 24
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 25,
              "end": 45
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 25,
                  "end": 37
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "advancements",
                "valueMap": {
                  "outerRange": {
                    "start": 25,
                    "end": 37
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 12
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "advancements"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/advancements",
                "range": {
                  "start": 40,
                  "end": 43
                },
                "children": []
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 25,
                "end": 37
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "advancements",
              "valueMap": {
                "outerRange": {
                  "start": 25,
                  "end": 37
                },
                "innerRange": {
                  "start": 0,
                  "end": 12
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 12
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "advancements"
              }
            },
            "sep": {
              "start": 38,
              "end": 39
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/advancements",
              "range": {
                "start": 40,
                "end": 43
              },
              "children": []
            },
            "end": {
              "start": 44,
              "end": 45
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 25,
        "end": 37
      },
      "message": "Duplicate key “advancements”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "@a[ distance = ..-1 , distance = 1..0 , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 41
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 41
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 21
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 12
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "distance",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 12
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "distance"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:float_range",
                    "range": {
                      "start": 15,
                      "end": 19
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 15,
                          "end": 17
                        },
                        "options": {
                          "pool": [
                            ".."
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": ".."
                      },
                      {
                        "type": "float",
                        "range": {
                          "start": 17,
                          "end": 19
                        },
                        "value": -1
                      }
                    ],
                    "name": "",
                    "value": [
                      null,
                      -1
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                "sep": {
                  "start": 13,
                  "end": 14
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 15,
                    "end": 19
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 17
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 19
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    null,
                    -1
                  ]
                },
                "end": {
                  "start": 20,
                  "end": 21
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 22,
                  "end": 39
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 22,
                      "end": 30
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "distance",
                    "valueMap": {
                      "outerRange": {
                        "start": 22,
                        "end": 30
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "distance"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:float_range",
                    "range": {
                      "start": 33,
                      "end": 37
                    },
                    "children": [
                      {
                        "type": "float",
                        "range": {
                          "start": 33,
                          "end": 34
                        },
                        "value": 1
                      },
                      {
                        "type": "literal",
                        "range": {
                          "start": 34,
                          "end": 36
                        },
                        "options": {
                          "pool": [
                            ".."
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": ".."
                      },
                      {
                        "type": "float",
                        "range": {
                          "start": 36,
                          "end": 37
                        },
                        "value": 0
                      }
                    ],
                    "name": "",
                    "value": [
                      1,
                      0
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 22,
                    "end": 30
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 22,
                      "end": 30
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                "sep": {
                  "start": 31,
                  "end": 32
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 33,
                    "end": 37
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 33,
                        "end": 34
                      },
                      "value": 1
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 34,
                        "end": 36
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 36,
                        "end": 37
                      },
                      "value": 0
                    }
                  ],
                  "name": "",
                  "value": [
                    1,
                    0
                  ]
                },
                "end": {
                  "start": 38,
                  "end": 39
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 41
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 41
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 21
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 15,
                    "end": 19
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 17
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 19
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    null,
                    -1
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 15,
                  "end": 19
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 17
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 19
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  null,
                  -1
                ]
              },
              "end": {
                "start": 20,
                "end": 21
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 22,
                "end": 39
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 22,
                    "end": 30
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 22,
                      "end": 30
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 33,
                    "end": 37
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 33,
                        "end": 34
                      },
                      "value": 1
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 34,
                        "end": 36
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 36,
                        "end": 37
                      },
                      "value": 0
                    }
                  ],
                  "name": "",
                  "value": [
                    1,
                    0
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 22,
                  "end": 30
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 22,
                    "end": 30
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              "sep": {
                "start": 31,
                "end": 32
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 33,
                  "end": 37
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 33,
                      "end": 34
                    },
                    "value": 1
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 36
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 36,
                      "end": 37
                    },
                    "value": 0
                  }
                ],
                "name": "",
                "value": [
                  1,
                  0
                ]
              },
              "end": {
                "start": 38,
                "end": 39
              }
            }
          ]
        },
        "chunkLimited": false,
        "currentEntity": false,
        "dimensionLimited": true,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Great  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `true`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 41
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 21
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 15,
                    "end": 19
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 17
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 19
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    null,
                    -1
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 15,
                  "end": 19
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 17
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 19
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  null,
                  -1
                ]
              },
              "end": {
                "start": 20,
                "end": 21
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 22,
                "end": 39
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 22,
                    "end": 30
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 22,
                      "end": 30
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 33,
                    "end": 37
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 33,
                        "end": 34
                      },
                      "value": 1
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 34,
                        "end": 36
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 36,
                        "end": 37
                      },
                      "value": 0
                    }
                  ],
                  "name": "",
                  "value": [
                    1,
                    0
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 22,
                  "end": 30
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 22,
                    "end": 30
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              "sep": {
                "start": 31,
                "end": 32
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 33,
                  "end": 37
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 33,
                      "end": 34
                    },
                    "value": 1
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 36
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 36,
                      "end": 37
                    },
                    "value": 0
                  }
                ],
                "name": "",
                "value": [
                  1,
                  0
                ]
              },
              "end": {
                "start": 38,
                "end": 39
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 41
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 41
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 21
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 15,
                  "end": 19
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 17
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 19
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  null,
                  -1
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 12
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "distance",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 12
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 8
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "distance"
              }
            },
            "sep": {
              "start": 13,
              "end": 14
            },
            "value": {
              "type": "mcfunction:argument/minecraft:float_range",
              "range": {
                "start": 15,
                "end": 19
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 15,
                    "end": 17
                  },
                  "options": {
                    "pool": [
                      ".."
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": ".."
                },
                {
                  "type": "float",
                  "range": {
                    "start": 17,
                    "end": 19
                  },
                  "value": -1
                }
              ],
              "name": "",
              "value": [
                null,
                -1
              ]
            },
            "end": {
              "start": 20,
              "end": 21
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 22,
              "end": 39
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 22,
                  "end": 30
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 22,
                    "end": 30
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 33,
                  "end": 37
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 33,
                      "end": 34
                    },
                    "value": 1
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 36
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 36,
                      "end": 37
                    },
                    "value": 0
                  }
                ],
                "name": "",
                "value": [
                  1,
                  0
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 22,
                "end": 30
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "distance",
              "valueMap": {
                "outerRange": {
                  "start": 22,
                  "end": 30
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 8
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "distance"
              }
            },
            "sep": {
              "start": 31,
              "end": 32
            },
            "value": {
              "type": "mcfunction:argument/minecraft:float_range",
              "range": {
                "start": 33,
                "end": 37
              },
              "children": [
                {
                  "type": "float",
                  "range": {
                    "start": 33,
                    "end": 34
                  },
                  "value": 1
                },
                {
                  "type": "literal",
                  "range": {
                    "start": 34,
                    "end": 36
                  },
                  "options": {
                    "pool": [
                      ".."
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": ".."
                },
                {
                  "type": "float",
                  "range": {
                    "start": 36,
                    "end": 37
                  },
                  "value": 0
                }
              ],
              "name": "",
              "value": [
                1,
                0
              ]
            },
            "end": {
              "start": 38,
              "end": 39
            }
          }
        ]
      },
      "chunkLimited": false,
      "currentEntity": false,
      "dimensionLimited": true,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Great  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `true`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 33,
        "end": 37
      },
      "message": "The minimum value 1 is larger than the maximum value 0",
      "severity": 3
    },
    {
      "range": {
        "start": 22,
        "end": 30
      },
      "message": "Duplicate key “distance”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "@a[ distance = ..1 , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 22
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 20
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 12
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "distance",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 12
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "distance"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:float_range",
                    "range": {
                      "start": 15,
                      "end": 18
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 15,
                          "end": 17
                        },
                        "options": {
                          "pool": [
                            ".."
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": ".."
                      },
                      {
                        "type": "float",
                        "range": {
                          "start": 17,
                          "end": 18
                        },
                        "value": 1
                      }
                    ],
                    "name": "",
                    "value": [
                      null,
                      1
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                "sep": {
                  "start": 13,
                  "end": 14
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 15,
                    "end": 18
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 17
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 18
                      },
                      "value": 1
                    }
                  ],
                  "name": "",
                  "value": [
                    null,
                    1
                  ]
                },
                "end": {
                  "start": 19,
                  "end": 20
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 22
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 22
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 20
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 15,
                    "end": 18
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 17
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 18
                      },
                      "value": 1
                    }
                  ],
                  "name": "",
                  "value": [
                    null,
                    1
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 15,
                  "end": 18
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 17
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 18
                    },
                    "value": 1
                  }
                ],
                "name": "",
                "value": [
                  null,
                  1
                ]
              },
              "end": {
                "start": 19,
                "end": 20
              }
            }
          ]
        },
        "chunkLimited": false,
        "currentEntity": false,
        "dimensionLimited": true,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Great  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `true`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 22
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 20
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "distance",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "distance"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 15,
                    "end": 18
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 17
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    },
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 18
                      },
                      "value": 1
                    }
                  ],
                  "name": "",
                  "value": [
                    null,
                    1
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 15,
                  "end": 18
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 17
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 18
                    },
                    "value": 1
                  }
                ],
                "name": "",
                "value": [
                  null,
                  1
                ]
              },
              "end": {
                "start": 19,
                "end": 20
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 22
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 22
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 20
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "distance",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "distance"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 15,
                  "end": 18
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 17
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 18
                    },
                    "value": 1
                  }
                ],
                "name": "",
                "value": [
                  null,
                  1
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 12
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "distance",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 12
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 8
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "distance"
              }
            },
            "sep": {
              "start": 13,
              "end": 14
            },
            "value": {
              "type": "mcfunction:argument/minecraft:float_range",
              "range": {
                "start": 15,
                "end": 18
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 15,
                    "end": 17
                  },
                  "options": {
                    "pool": [
                      ".."
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": ".."
                },
                {
                  "type": "float",
                  "range": {
                    "start": 17,
                    "end": 18
                  },
                  "value": 1
                }
              ],
              "name": "",
              "value": [
                null,
                1
              ]
            },
            "end": {
              "start": 19,
              "end": 20
            }
          }
        ]
      },
      "chunkLimited": false,
      "currentEntity": false,
      "dimensionLimited": true,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Great  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `true`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ gamemode = ! creative , gamemode = ! adventure , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 54
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 54
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 27
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 12
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "gamemode",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 12
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "gamemode"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 15,
                      "end": 25
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 15,
                          "end": 16
                        },
                        "options": {
                          "pool": [
                            "!"
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": "!"
                      },
                      {
                        "type": "string",
                        "range": {
                          "start": 17,
                          "end": 25
                        },
                        "options": {
                          "unquotable": {},
                          "value": {
                            "type": "literal"
                          }
                        },
                        "value": "creative",
                        "valueMap": {
                          "outerRange": {
                            "start": 17,
                            "end": 25
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 8
                          },
                          "pairs": []
                        },
                        "valueNode": {
                          "type": "literal",
                          "range": {
                            "start": 0,
                            "end": 8
                          },
                          "options": {
                            "pool": [
                              "adventure",
                              "spectator",
                              "creative",
                              "survival"
                            ]
                          },
                          "value": "creative"
                        }
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 17,
                        "end": 25
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "creative",
                      "valueMap": {
                        "outerRange": {
                          "start": 17,
                          "end": 25
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 8
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "creative"
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                "sep": {
                  "start": 13,
                  "end": 14
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 15,
                    "end": 25
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 16
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 17,
                        "end": 25
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "creative",
                      "valueMap": {
                        "outerRange": {
                          "start": 17,
                          "end": 25
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 8
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "creative"
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 17,
                        "end": 25
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                },
                "end": {
                  "start": 26,
                  "end": 27
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 28,
                  "end": 52
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 28,
                      "end": 36
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "gamemode",
                    "valueMap": {
                      "outerRange": {
                        "start": 28,
                        "end": 36
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "gamemode"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 39,
                      "end": 50
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 39,
                          "end": 40
                        },
                        "options": {
                          "pool": [
                            "!"
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": "!"
                      },
                      {
                        "type": "string",
                        "range": {
                          "start": 41,
                          "end": 50
                        },
                        "options": {
                          "unquotable": {},
                          "value": {
                            "type": "literal"
                          }
                        },
                        "value": "adventure",
                        "valueMap": {
                          "outerRange": {
                            "start": 41,
                            "end": 50
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 9
                          },
                          "pairs": []
                        },
                        "valueNode": {
                          "type": "literal",
                          "range": {
                            "start": 0,
                            "end": 9
                          },
                          "options": {
                            "pool": [
                              "adventure",
                              "spectator",
                              "creative",
                              "survival"
                            ]
                          },
                          "value": "adventure"
                        }
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 41,
                        "end": 50
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "adventure",
                      "valueMap": {
                        "outerRange": {
                          "start": 41,
                          "end": 50
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 9
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 9
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "adventure"
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 28,
                    "end": 36
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 28,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                "sep": {
                  "start": 37,
                  "end": 38
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 39,
                    "end": 50
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 39,
                        "end": 40
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 41,
                        "end": 50
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "adventure",
                      "valueMap": {
                        "outerRange": {
                          "start": 41,
                          "end": 50
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 9
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 9
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "adventure"
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "adventure",
                    "valueMap": {
                      "outerRange": {
                        "start": 41,
                        "end": 50
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 9
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 9
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "adventure"
                    }
                  }
                },
                "end": {
                  "start": 51,
                  "end": 52
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 54
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 54
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 27
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 15,
                    "end": 25
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 16
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 17,
                        "end": 25
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "creative",
                      "valueMap": {
                        "outerRange": {
                          "start": 17,
                          "end": 25
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 8
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "creative"
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 17,
                        "end": 25
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 15,
                  "end": 25
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 16
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 17,
                        "end": 25
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 25
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "creative",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "creative"
                  }
                }
              },
              "end": {
                "start": 26,
                "end": 27
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 28,
                "end": 52
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 28,
                    "end": 36
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 28,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 39,
                    "end": 50
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 39,
                        "end": 40
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 41,
                        "end": 50
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "adventure",
                      "valueMap": {
                        "outerRange": {
                          "start": 41,
                          "end": 50
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 9
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 9
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "adventure"
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "adventure",
                    "valueMap": {
                      "outerRange": {
                        "start": 41,
                        "end": 50
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 9
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 9
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "adventure"
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 28,
                  "end": 36
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 28,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              "sep": {
                "start": 37,
                "end": 38
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 39,
                  "end": 50
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 39,
                      "end": 40
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "adventure",
                    "valueMap": {
                      "outerRange": {
                        "start": 41,
                        "end": 50
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 9
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 9
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "adventure"
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 41,
                    "end": 50
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "adventure",
                  "valueMap": {
                    "outerRange": {
                      "start": 41,
                      "end": 50
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "adventure"
                  }
                }
              },
              "end": {
                "start": 51,
                "end": 52
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 54
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 27
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 15,
                    "end": 25
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 16
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 17,
                        "end": 25
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "creative",
                      "valueMap": {
                        "outerRange": {
                          "start": 17,
                          "end": 25
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 8
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "creative"
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 17,
                        "end": 25
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 15,
                  "end": 25
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 16
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 17,
                        "end": 25
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 25
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "creative",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "creative"
                  }
                }
              },
              "end": {
                "start": 26,
                "end": 27
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 28,
                "end": 52
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 28,
                    "end": 36
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 28,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 39,
                    "end": 50
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 39,
                        "end": 40
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 41,
                        "end": 50
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "adventure",
                      "valueMap": {
                        "outerRange": {
                          "start": 41,
                          "end": 50
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 9
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 9
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "adventure"
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "adventure",
                    "valueMap": {
                      "outerRange": {
                        "start": 41,
                        "end": 50
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 9
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 9
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "adventure"
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 28,
                  "end": 36
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 28,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              "sep": {
                "start": 37,
                "end": 38
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 39,
                  "end": 50
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 39,
                      "end": 40
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "adventure",
                    "valueMap": {
                      "outerRange": {
                        "start": 41,
                        "end": 50
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 9
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 9
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "adventure"
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 41,
                    "end": 50
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "adventure",
                  "valueMap": {
                    "outerRange": {
                      "start": 41,
                      "end": 50
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "adventure"
                  }
                }
              },
              "end": {
                "start": 51,
                "end": 52
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 54
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 54
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 27
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 15,
                  "end": 25
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 16
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 17,
                        "end": 25
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 25
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "creative",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "creative"
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 12
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "gamemode",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 12
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 8
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "gamemode"
              }
            },
            "sep": {
              "start": 13,
              "end": 14
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 15,
                "end": 25
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 15,
                    "end": 16
                  },
                  "options": {
                    "pool": [
                      "!"
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 25
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "creative",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "creative"
                  }
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 17,
                  "end": 25
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "creative",
                "valueMap": {
                  "outerRange": {
                    "start": 17,
                    "end": 25
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "adventure",
                      "spectator",
                      "creative",
                      "survival"
                    ]
                  },
                  "value": "creative"
                }
              }
            },
            "end": {
              "start": 26,
              "end": 27
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 28,
              "end": 52
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 28,
                  "end": 36
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 28,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 39,
                  "end": 50
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 39,
                      "end": 40
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "adventure",
                    "valueMap": {
                      "outerRange": {
                        "start": 41,
                        "end": 50
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 9
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 9
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "adventure"
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 41,
                    "end": 50
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "adventure",
                  "valueMap": {
                    "outerRange": {
                      "start": 41,
                      "end": 50
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "adventure"
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 28,
                "end": 36
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "gamemode",
              "valueMap": {
                "outerRange": {
                  "start": 28,
                  "end": 36
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 8
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "gamemode"
              }
            },
            "sep": {
              "start": 37,
              "end": 38
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 39,
                "end": 50
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 39,
                    "end": 40
                  },
                  "options": {
                    "pool": [
                      "!"
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 41,
                    "end": 50
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "adventure",
                  "valueMap": {
                    "outerRange": {
                      "start": 41,
                      "end": 50
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "adventure"
                  }
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 41,
                  "end": 50
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "adventure",
                "valueMap": {
                  "outerRange": {
                    "start": 41,
                    "end": 50
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 9
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 9
                  },
                  "options": {
                    "pool": [
                      "adventure",
                      "spectator",
                      "creative",
                      "survival"
                    ]
                  },
                  "value": "adventure"
                }
              }
            },
            "end": {
              "start": 51,
              "end": 52
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ gamemode = creative , gamemode = unknown , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 48
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 48
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 25
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 12
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "gamemode",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 12
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "gamemode"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "children": [
                      {
                        "type": "string",
                        "range": {
                          "start": 15,
                          "end": 23
                        },
                        "options": {
                          "unquotable": {},
                          "value": {
                            "type": "literal"
                          }
                        },
                        "value": "creative",
                        "valueMap": {
                          "outerRange": {
                            "start": 15,
                            "end": 23
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 8
                          },
                          "pairs": []
                        },
                        "valueNode": {
                          "type": "literal",
                          "range": {
                            "start": 0,
                            "end": 8
                          },
                          "options": {
                            "pool": [
                              "adventure",
                              "spectator",
                              "creative",
                              "survival"
                            ]
                          },
                          "value": "creative"
                        }
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 15,
                        "end": 23
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "creative",
                      "valueMap": {
                        "outerRange": {
                          "start": 15,
                          "end": 23
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 8
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "creative"
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                "sep": {
                  "start": 13,
                  "end": 14
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 15,
                        "end": 23
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "creative",
                      "valueMap": {
                        "outerRange": {
                          "start": 15,
                          "end": 23
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 8
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "creative"
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 15,
                        "end": 23
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                },
                "end": {
                  "start": 24,
                  "end": 25
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 26,
                  "end": 46
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 26,
                      "end": 34
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "gamemode",
                    "valueMap": {
                      "outerRange": {
                        "start": 26,
                        "end": 34
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "gamemode"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 37,
                      "end": 44
                    },
                    "children": [
                      {
                        "type": "string",
                        "range": {
                          "start": 37,
                          "end": 44
                        },
                        "options": {
                          "unquotable": {},
                          "value": {
                            "type": "literal"
                          }
                        },
                        "value": "unknown",
                        "valueMap": {
                          "outerRange": {
                            "start": 37,
                            "end": 44
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 7
                          },
                          "pairs": []
                        },
                        "valueNode": {
                          "type": "literal",
                          "range": {
                            "start": 0,
                            "end": 0
                          },
                          "options": {
                            "pool": [
                              "adventure",
                              "spectator",
                              "creative",
                              "survival"
                            ]
                          },
                          "value": ""
                        }
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 44
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "unknown",
                      "valueMap": {
                        "outerRange": {
                          "start": 37,
                          "end": 44
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 7
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 0
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": ""
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 26,
                    "end": 34
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 26,
                      "end": 34
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                "sep": {
                  "start": 35,
                  "end": 36
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 44
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "unknown",
                      "valueMap": {
                        "outerRange": {
                          "start": 37,
                          "end": 44
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 7
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 0
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": ""
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 44
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "unknown",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 44
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 7
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 0
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": ""
                    }
                  }
                },
                "end": {
                  "start": 45,
                  "end": 46
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 48
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 48
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 25
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 15,
                        "end": 23
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "creative",
                      "valueMap": {
                        "outerRange": {
                          "start": 15,
                          "end": 23
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 8
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "creative"
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 15,
                        "end": 23
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 15,
                  "end": 23
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 15,
                        "end": 23
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "creative",
                  "valueMap": {
                    "outerRange": {
                      "start": 15,
                      "end": 23
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "creative"
                  }
                }
              },
              "end": {
                "start": 24,
                "end": 25
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 26,
                "end": 46
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 26,
                    "end": 34
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 26,
                      "end": 34
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 44
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "unknown",
                      "valueMap": {
                        "outerRange": {
                          "start": 37,
                          "end": 44
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 7
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 0
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": ""
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 44
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "unknown",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 44
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 7
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 0
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": ""
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 26,
                  "end": 34
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 26,
                    "end": 34
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              "sep": {
                "start": 35,
                "end": 36
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 37,
                  "end": 44
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 44
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "unknown",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 44
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 7
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 0
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": ""
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "unknown",
                  "valueMap": {
                    "outerRange": {
                      "start": 37,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 7
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 0
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": ""
                  }
                }
              },
              "end": {
                "start": 45,
                "end": 46
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 48
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 25
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 12
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 12
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 15,
                        "end": 23
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "creative",
                      "valueMap": {
                        "outerRange": {
                          "start": 15,
                          "end": 23
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 8
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": "creative"
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 15,
                        "end": 23
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 15,
                  "end": 23
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 15,
                        "end": 23
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "creative",
                  "valueMap": {
                    "outerRange": {
                      "start": 15,
                      "end": 23
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "creative"
                  }
                }
              },
              "end": {
                "start": 24,
                "end": 25
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 26,
                "end": 46
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 26,
                    "end": 34
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "gamemode",
                  "valueMap": {
                    "outerRange": {
                      "start": 26,
                      "end": 34
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "gamemode"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 44
                      },
                      "options": {
                        "unquotable": {},
                        "value": {
                          "type": "literal"
                        }
                      },
                      "value": "unknown",
                      "valueMap": {
                        "outerRange": {
                          "start": 37,
                          "end": 44
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 7
                        },
                        "pairs": []
                      },
                      "valueNode": {
                        "type": "literal",
                        "range": {
                          "start": 0,
                          "end": 0
                        },
                        "options": {
                          "pool": [
                            "adventure",
                            "spectator",
                            "creative",
                            "survival"
                          ]
                        },
                        "value": ""
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 44
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "unknown",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 44
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 7
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 0
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": ""
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 26,
                  "end": 34
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 26,
                    "end": 34
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              "sep": {
                "start": 35,
                "end": 36
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 37,
                  "end": 44
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 44
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "unknown",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 44
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 7
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 0
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": ""
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "unknown",
                  "valueMap": {
                    "outerRange": {
                      "start": 37,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 7
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 0
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": ""
                  }
                }
              },
              "end": {
                "start": 45,
                "end": 46
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 48
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 48
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 25
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 12
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 15,
                  "end": 23
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "creative",
                    "valueMap": {
                      "outerRange": {
                        "start": 15,
                        "end": 23
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 8
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": "creative"
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "creative",
                  "valueMap": {
                    "outerRange": {
                      "start": 15,
                      "end": 23
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "creative"
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 12
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "gamemode",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 12
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 8
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "gamemode"
              }
            },
            "sep": {
              "start": 13,
              "end": 14
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 15,
                "end": 23
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "creative",
                  "valueMap": {
                    "outerRange": {
                      "start": 15,
                      "end": 23
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 8
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": "creative"
                  }
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 15,
                  "end": 23
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "creative",
                "valueMap": {
                  "outerRange": {
                    "start": 15,
                    "end": 23
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "adventure",
                      "spectator",
                      "creative",
                      "survival"
                    ]
                  },
                  "value": "creative"
                }
              }
            },
            "end": {
              "start": 24,
              "end": 25
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 26,
              "end": 46
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 26,
                  "end": 34
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "gamemode",
                "valueMap": {
                  "outerRange": {
                    "start": 26,
                    "end": 34
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 8
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "gamemode"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 37,
                  "end": 44
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 44
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "unknown",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 44
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 7
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 0
                      },
                      "options": {
                        "pool": [
                          "adventure",
                          "spectator",
                          "creative",
                          "survival"
                        ]
                      },
                      "value": ""
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "unknown",
                  "valueMap": {
                    "outerRange": {
                      "start": 37,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 7
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 0
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": ""
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 26,
                "end": 34
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "gamemode",
              "valueMap": {
                "outerRange": {
                  "start": 26,
                  "end": 34
                },
                "innerRange": {
                  "start": 0,
                  "end": 8
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 8
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "gamemode"
              }
            },
            "sep": {
              "start": 35,
              "end": 36
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 37,
                "end": 44
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "unknown",
                  "valueMap": {
                    "outerRange": {
                      "start": 37,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 7
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 0
                    },
                    "options": {
                      "pool": [
                        "adventure",
                        "spectator",
                        "creative",
                        "survival"
                      ]
                    },
                    "value": ""
                  }
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 37,
                  "end": 44
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "unknown",
                "valueMap": {
                  "outerRange": {
                    "start": 37,
                    "end": 44
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 7
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 0
                  },
                  "options": {
                    "pool": [
                      "adventure",
                      "spectator",
                      "creative",
                      "survival"
                    ]
                  },
                  "value": ""
                }
              }
            },
            "end": {
              "start": 45,
              "end": 46
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 37,
        "end": 37
      },
      "message": "Expected “adventure”, “spectator”, “creative”, or “survival”",
      "severity": 3
    },
    {
      "range": {
        "start": 26,
        "end": 34
      },
      "message": "Duplicate key “gamemode”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "@a[ level = -1 , level = -1 , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 31
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 31
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 16
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 9
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "level",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 9
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 5
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 5
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "level"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:int_range",
                    "range": {
                      "start": 12,
                      "end": 14
                    },
                    "children": [
                      {
                        "type": "integer",
                        "range": {
                          "start": 12,
                          "end": 14
                        },
                        "value": -1
                      }
                    ],
                    "name": "",
                    "value": [
                      -1,
                      -1
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                "sep": {
                  "start": 10,
                  "end": 11
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 12,
                    "end": 14
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 12,
                        "end": 14
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    -1,
                    -1
                  ]
                },
                "end": {
                  "start": 15,
                  "end": 16
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 17,
                  "end": 29
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 22
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "level",
                    "valueMap": {
                      "outerRange": {
                        "start": 17,
                        "end": 22
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 5
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 5
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "level"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:int_range",
                    "range": {
                      "start": 25,
                      "end": 27
                    },
                    "children": [
                      {
                        "type": "integer",
                        "range": {
                          "start": 25,
                          "end": 27
                        },
                        "value": -1
                      }
                    ],
                    "name": "",
                    "value": [
                      -1,
                      -1
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 22
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 22
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                "sep": {
                  "start": 23,
                  "end": 24
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 25,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 25,
                        "end": 27
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    -1,
                    -1
                  ]
                },
                "end": {
                  "start": 28,
                  "end": 29
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 31
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 31
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 16
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 12,
                    "end": 14
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 12,
                        "end": 14
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    -1,
                    -1
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 12,
                  "end": 14
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 12,
                      "end": 14
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  -1,
                  -1
                ]
              },
              "end": {
                "start": 15,
                "end": 16
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 17,
                "end": 29
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 22
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 22
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 25,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 25,
                        "end": 27
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    -1,
                    -1
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 17,
                  "end": 22
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 17,
                    "end": 22
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              "sep": {
                "start": 23,
                "end": 24
              },
              "value": {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 25,
                  "end": 27
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 25,
                      "end": 27
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  -1,
                  -1
                ]
              },
              "end": {
                "start": 28,
                "end": 29
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 31
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 16
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 12,
                    "end": 14
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 12,
                        "end": 14
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    -1,
                    -1
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 12,
                  "end": 14
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 12,
                      "end": 14
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  -1,
                  -1
                ]
              },
              "end": {
                "start": 15,
                "end": 16
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 17,
                "end": 29
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 22
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 22
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 25,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 25,
                        "end": 27
                      },
                      "value": -1
                    }
                  ],
                  "name": "",
                  "value": [
                    -1,
                    -1
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 17,
                  "end": 22
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 17,
                    "end": 22
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              "sep": {
                "start": 23,
                "end": 24
              },
              "value": {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 25,
                  "end": 27
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 25,
                      "end": 27
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  -1,
                  -1
                ]
              },
              "end": {
                "start": 28,
                "end": 29
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 31
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 31
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 16
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 12,
                  "end": 14
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 12,
                      "end": 14
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  -1,
                  -1
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 9
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "level",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 9
                },
                "innerRange": {
                  "start": 0,
                  "end": 5
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 5
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "level"
              }
            },
            "sep": {
              "start": 10,
              "end": 11
            },
            "value": {
              "type": "mcfunction:argument/minecraft:int_range",
              "range": {
                "start": 12,
                "end": 14
              },
              "children": [
                {
                  "type": "integer",
                  "range": {
                    "start": 12,
                    "end": 14
                  },
                  "value": -1
                }
              ],
              "name": "",
              "value": [
                -1,
                -1
              ]
            },
            "end": {
              "start": 15,
              "end": 16
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 17,
              "end": 29
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 17,
                  "end": 22
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 17,
                    "end": 22
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 25,
                  "end": 27
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 25,
                      "end": 27
                    },
                    "value": -1
                  }
                ],
                "name": "",
                "value": [
                  -1,
                  -1
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 17,
                "end": 22
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "level",
              "valueMap": {
                "outerRange": {
                  "start": 17,
                  "end": 22
                },
                "innerRange": {
                  "start": 0,
                  "end": 5
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 5
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "level"
              }
            },
            "sep": {
              "start": 23,
              "end": 24
            },
            "value": {
              "type": "mcfunction:argument/minecraft:int_range",
              "range": {
                "start": 25,
                "end": 27
              },
              "children": [
                {
                  "type": "integer",
                  "range": {
                    "start": 25,
                    "end": 27
                  },
                  "value": -1
                }
              ],
              "name": "",
              "value": [
                -1,
                -1
              ]
            },
            "end": {
              "start": 28,
              "end": 29
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 12,
        "end": 14
      },
      "message": "Expected an integer between 0 and 2147483647",
      "severity": 3
    },
    {
      "range": {
        "start": 25,
        "end": 27
      },
      "message": "Expected an integer between 0 and 2147483647",
      "severity": 3
    },
    {
      "range": {
        "start": 17,
        "end": 22
      },
      "message": "Duplicate key “level”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "@a[ level = 1.. , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 19
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 17
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 9
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "level",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 9
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 5
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 5
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "level"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:int_range",
                    "range": {
                      "start": 12,
                      "end": 15
                    },
                    "children": [
                      {
                        "type": "integer",
                        "range": {
                          "start": 12,
                          "end": 13
                        },
                        "value": 1
                      },
                      {
                        "type": "literal",
                        "range": {
                          "start": 13,
                          "end": 15
                        },
                        "options": {
                          "pool": [
                            ".."
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": ".."
                      }
                    ],
                    "name": "",
                    "value": [
                      1,
                      null
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                "sep": {
                  "start": 10,
                  "end": 11
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 12,
                    "end": 15
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 12,
                        "end": 13
                      },
                      "value": 1
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 13,
                        "end": 15
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    }
                  ],
                  "name": "",
                  "value": [
                    1,
                    null
                  ]
                },
                "end": {
                  "start": 16,
                  "end": 17
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 19
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 19
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 17
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 12,
                    "end": 15
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 12,
                        "end": 13
                      },
                      "value": 1
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 13,
                        "end": 15
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    }
                  ],
                  "name": "",
                  "value": [
                    1,
                    null
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 12,
                  "end": 15
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 12,
                      "end": 13
                    },
                    "value": 1
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 13,
                      "end": 15
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  }
                ],
                "name": "",
                "value": [
                  1,
                  null
                ]
              },
              "end": {
                "start": 16,
                "end": 17
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 19
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 17
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "level",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "level"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:int_range",
                  "range": {
                    "start": 12,
                    "end": 15
                  },
                  "children": [
                    {
                      "type": "integer",
                      "range": {
                        "start": 12,
                        "end": 13
                      },
                      "value": 1
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 13,
                        "end": 15
                      },
                      "options": {
                        "pool": [
                          ".."
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": ".."
                    }
                  ],
                  "name": "",
                  "value": [
                    1,
                    null
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 12,
                  "end": 15
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 12,
                      "end": 13
                    },
                    "value": 1
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 13,
                      "end": 15
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  }
                ],
                "name": "",
                "value": [
                  1,
                  null
                ]
              },
              "end": {
                "start": 16,
                "end": 17
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 19
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 19
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 17
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "level",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "level"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:int_range",
                "range": {
                  "start": 12,
                  "end": 15
                },
                "children": [
                  {
                    "type": "integer",
                    "range": {
                      "start": 12,
                      "end": 13
                    },
                    "value": 1
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 13,
                      "end": 15
                    },
                    "options": {
                      "pool": [
                        ".."
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": ".."
                  }
                ],
                "name": "",
                "value": [
                  1,
                  null
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 9
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "level",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 9
                },
                "innerRange": {
                  "start": 0,
                  "end": 5
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 5
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "level"
              }
            },
            "sep": {
              "start": 10,
              "end": 11
            },
            "value": {
              "type": "mcfunction:argument/minecraft:int_range",
              "range": {
                "start": 12,
                "end": 15
              },
              "children": [
                {
                  "type": "integer",
                  "range": {
                    "start": 12,
                    "end": 13
                  },
                  "value": 1
                },
                {
                  "type": "literal",
                  "range": {
                    "start": 13,
                    "end": 15
                  },
                  "options": {
                    "pool": [
                      ".."
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": ".."
                }
              ],
              "name": "",
              "value": [
                1,
                null
              ]
            },
            "end": {
              "start": 16,
              "end": 17
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ limit = 1 , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 17
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 15
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 9
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "limit",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 9
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 5
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 5
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "limit"
                    }
                  },
                  {
                    "type": "integer",
                    "range": {
                      "start": 12,
                      "end": 13
                    },
                    "value": 1
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                "sep": {
                  "start": 10,
                  "end": 11
                },
                "value": {
                  "type": "integer",
                  "range": {
                    "start": 12,
                    "end": 13
                  },
                  "value": 1
                },
                "end": {
                  "start": 14,
                  "end": 15
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 17
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 17
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 15
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 12,
                    "end": 13
                  },
                  "value": 1
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 12,
                  "end": 13
                },
                "value": 1
              },
              "end": {
                "start": 14,
                "end": 15
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": true,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 17
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 15
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 12,
                    "end": 13
                  },
                  "value": 1
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 12,
                  "end": 13
                },
                "value": 1
              },
              "end": {
                "start": 14,
                "end": 15
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 17
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 15
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              {
                "type": "integer",
                "range": {
                  "start": 12,
                  "end": 13
                },
                "value": 1
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 9
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "limit",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 9
                },
                "innerRange": {
                  "start": 0,
                  "end": 5
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 5
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "limit"
              }
            },
            "sep": {
              "start": 10,
              "end": 11
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 12,
                "end": 13
              },
              "value": 1
            },
            "end": {
              "start": 14,
              "end": 15
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": true,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ name = ! "SPGoding" , "name" = ! Misode , \'name\' = ! , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 60
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 60
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 25
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "name",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 8
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 4
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 4
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "name"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 11,
                      "end": 23
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 11,
                          "end": 12
                        },
                        "options": {
                          "pool": [
                            "!"
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": "!"
                      },
                      {
                        "type": "string",
                        "range": {
                          "start": 13,
                          "end": 23
                        },
                        "options": {
                          "escapable": {},
                          "quotes": [
                            "\"",
                            "'"
                          ],
                          "unquotable": {}
                        },
                        "value": "SPGoding",
                        "valueMap": {
                          "outerRange": {
                            "start": 14,
                            "end": 22
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 8
                          },
                          "pairs": []
                        }
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 13,
                        "end": 23
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "SPGoding",
                      "valueMap": {
                        "outerRange": {
                          "start": 14,
                          "end": 22
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                "sep": {
                  "start": 9,
                  "end": 10
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 23
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 11,
                        "end": 12
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 13,
                        "end": 23
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "SPGoding",
                      "valueMap": {
                        "outerRange": {
                          "start": 14,
                          "end": 22
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 14,
                        "end": 22
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                },
                "end": {
                  "start": 24,
                  "end": 25
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 26,
                  "end": 45
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 26,
                      "end": 32
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "name",
                    "valueMap": {
                      "outerRange": {
                        "start": 27,
                        "end": 31
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 4
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 4
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "name"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 35,
                      "end": 43
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 35,
                          "end": 36
                        },
                        "options": {
                          "pool": [
                            "!"
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": "!"
                      },
                      {
                        "type": "string",
                        "range": {
                          "start": 37,
                          "end": 43
                        },
                        "options": {
                          "escapable": {},
                          "quotes": [
                            "\"",
                            "'"
                          ],
                          "unquotable": {}
                        },
                        "value": "Misode",
                        "valueMap": {
                          "outerRange": {
                            "start": 37,
                            "end": 43
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 6
                          },
                          "pairs": []
                        }
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 43
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "Misode",
                      "valueMap": {
                        "outerRange": {
                          "start": 37,
                          "end": 43
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 6
                        },
                        "pairs": []
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 26,
                    "end": 32
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 27,
                      "end": 31
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                "sep": {
                  "start": 33,
                  "end": 34
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 35,
                    "end": 43
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 35,
                        "end": 36
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 43
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "Misode",
                      "valueMap": {
                        "outerRange": {
                          "start": 37,
                          "end": 43
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 6
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 43
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                },
                "end": {
                  "start": 44,
                  "end": 45
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 46,
                  "end": 58
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 46,
                      "end": 52
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "name",
                    "valueMap": {
                      "outerRange": {
                        "start": 47,
                        "end": 51
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 4
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 4
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "name"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 55,
                      "end": 57
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 55,
                          "end": 56
                        },
                        "options": {
                          "pool": [
                            "!"
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": "!"
                      },
                      {
                        "type": "string",
                        "range": {
                          "start": 57,
                          "end": 57
                        },
                        "options": {
                          "escapable": {},
                          "quotes": [
                            "\"",
                            "'"
                          ],
                          "unquotable": {}
                        },
                        "value": "",
                        "valueMap": {
                          "outerRange": {
                            "start": 57,
                            "end": 57
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 0
                          },
                          "pairs": []
                        }
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 57,
                        "end": 57
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "",
                      "valueMap": {
                        "outerRange": {
                          "start": 57,
                          "end": 57
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 0
                        },
                        "pairs": []
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 46,
                    "end": 52
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 47,
                      "end": 51
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                "sep": {
                  "start": 53,
                  "end": 54
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 55,
                    "end": 57
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 55,
                        "end": 56
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 57,
                        "end": 57
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "",
                      "valueMap": {
                        "outerRange": {
                          "start": 57,
                          "end": 57
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 0
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 57,
                        "end": 57
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                },
                "end": {
                  "start": 57,
                  "end": 58
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 60
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 60
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 25
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 23
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 11,
                        "end": 12
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 13,
                        "end": 23
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "SPGoding",
                      "valueMap": {
                        "outerRange": {
                          "start": 14,
                          "end": 22
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 14,
                        "end": 22
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 9,
                "end": 10
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 23
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 11,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 14,
                        "end": 22
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 13,
                    "end": 23
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "SPGoding",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 22
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 24,
                "end": 25
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 26,
                "end": 45
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 26,
                    "end": 32
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 27,
                      "end": 31
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 35,
                    "end": 43
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 35,
                        "end": 36
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 43
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "Misode",
                      "valueMap": {
                        "outerRange": {
                          "start": 37,
                          "end": 43
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 6
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 43
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 26,
                  "end": 32
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 27,
                    "end": 31
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 33,
                "end": 34
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 35,
                  "end": 43
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 35,
                      "end": 36
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 43
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 43
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "Misode",
                  "valueMap": {
                    "outerRange": {
                      "start": 37,
                      "end": 43
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 44,
                "end": 45
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 46,
                "end": 58
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 46,
                    "end": 52
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 47,
                      "end": 51
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 55,
                    "end": 57
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 55,
                        "end": 56
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 57,
                        "end": 57
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "",
                      "valueMap": {
                        "outerRange": {
                          "start": 57,
                          "end": 57
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 0
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 57,
                        "end": 57
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 46,
                  "end": 52
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 47,
                    "end": 51
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 53,
                "end": 54
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 55,
                  "end": 57
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 55,
                      "end": 56
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 57,
                        "end": 57
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 57,
                    "end": 57
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 57,
                      "end": 57
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 57,
                "end": 58
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 60
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 25
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 23
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 11,
                        "end": 12
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 13,
                        "end": 23
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "SPGoding",
                      "valueMap": {
                        "outerRange": {
                          "start": 14,
                          "end": 22
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 14,
                        "end": 22
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 9,
                "end": 10
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 23
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 11,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 14,
                        "end": 22
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 13,
                    "end": 23
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "SPGoding",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 22
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 24,
                "end": 25
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 26,
                "end": 45
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 26,
                    "end": 32
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 27,
                      "end": 31
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 35,
                    "end": 43
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 35,
                        "end": 36
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 43
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "Misode",
                      "valueMap": {
                        "outerRange": {
                          "start": 37,
                          "end": 43
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 6
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 43
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 26,
                  "end": 32
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 27,
                    "end": 31
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 33,
                "end": 34
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 35,
                  "end": 43
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 35,
                      "end": 36
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 43
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 43
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "Misode",
                  "valueMap": {
                    "outerRange": {
                      "start": 37,
                      "end": 43
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 44,
                "end": 45
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 46,
                "end": 58
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 46,
                    "end": 52
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 47,
                      "end": 51
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 55,
                    "end": 57
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 55,
                        "end": 56
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 57,
                        "end": 57
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "",
                      "valueMap": {
                        "outerRange": {
                          "start": 57,
                          "end": 57
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 0
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 57,
                        "end": 57
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 46,
                  "end": 52
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 47,
                    "end": 51
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 53,
                "end": 54
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 55,
                  "end": 57
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 55,
                      "end": 56
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 57,
                        "end": 57
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 57,
                    "end": 57
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 57,
                      "end": 57
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 57,
                "end": 58
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 60
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 60
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 25
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 23
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 11,
                      "end": 12
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 14,
                        "end": 22
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 13,
                    "end": 23
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "SPGoding",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 22
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 8
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "name",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 8
                },
                "innerRange": {
                  "start": 0,
                  "end": 4
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 4
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "name"
              }
            },
            "sep": {
              "start": 9,
              "end": 10
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 11,
                "end": 23
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 11,
                    "end": 12
                  },
                  "options": {
                    "pool": [
                      "!"
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 13,
                    "end": 23
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "SPGoding",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 22
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  }
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 13,
                  "end": 23
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {}
                },
                "value": "SPGoding",
                "valueMap": {
                  "outerRange": {
                    "start": 14,
                    "end": 22
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                }
              }
            },
            "end": {
              "start": 24,
              "end": 25
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 26,
              "end": 45
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 26,
                  "end": 32
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 27,
                    "end": 31
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 35,
                  "end": 43
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 35,
                      "end": 36
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 37,
                        "end": 43
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 43
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "Misode",
                  "valueMap": {
                    "outerRange": {
                      "start": 37,
                      "end": 43
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 26,
                "end": 32
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "name",
              "valueMap": {
                "outerRange": {
                  "start": 27,
                  "end": 31
                },
                "innerRange": {
                  "start": 0,
                  "end": 4
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 4
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "name"
              }
            },
            "sep": {
              "start": 33,
              "end": 34
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 35,
                "end": 43
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 35,
                    "end": 36
                  },
                  "options": {
                    "pool": [
                      "!"
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 43
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "Misode",
                  "valueMap": {
                    "outerRange": {
                      "start": 37,
                      "end": 43
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  }
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 37,
                  "end": 43
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {}
                },
                "value": "Misode",
                "valueMap": {
                  "outerRange": {
                    "start": 37,
                    "end": 43
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                }
              }
            },
            "end": {
              "start": 44,
              "end": 45
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 46,
              "end": 58
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 46,
                  "end": 52
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 47,
                    "end": 51
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 55,
                  "end": 57
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 55,
                      "end": 56
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 57,
                        "end": 57
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 57,
                    "end": 57
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 57,
                      "end": 57
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
                    },
                    "pairs": []
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 46,
                "end": 52
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "name",
              "valueMap": {
                "outerRange": {
                  "start": 47,
                  "end": 51
                },
                "innerRange": {
                  "start": 0,
                  "end": 4
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 4
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "name"
              }
            },
            "sep": {
              "start": 53,
              "end": 54
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 55,
                "end": 57
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 55,
                    "end": 56
                  },
                  "options": {
                    "pool": [
                      "!"
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 57,
                    "end": 57
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 57,
                      "end": 57
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
                    },
                    "pairs": []
                  }
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 57,
                  "end": 57
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {}
                },
                "value": "",
                "valueMap": {
                  "outerRange": {
                    "start": 57,
                    "end": 57
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 0
                  },
                  "pairs": []
                }
              }
            },
            "end": {
              "start": 57,
              "end": 58
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ name = "SPGoding" , "name" = Misode , \'name\' = , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 54
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 54
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 23
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "name",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 8
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 4
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 4
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "name"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "children": [
                      {
                        "type": "string",
                        "range": {
                          "start": 11,
                          "end": 21
                        },
                        "options": {
                          "escapable": {},
                          "quotes": [
                            "\"",
                            "'"
                          ],
                          "unquotable": {}
                        },
                        "value": "SPGoding",
                        "valueMap": {
                          "outerRange": {
                            "start": 12,
                            "end": 20
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 8
                          },
                          "pairs": []
                        }
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 11,
                        "end": 21
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "SPGoding",
                      "valueMap": {
                        "outerRange": {
                          "start": 12,
                          "end": 20
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                "sep": {
                  "start": 9,
                  "end": 10
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 11,
                        "end": 21
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "SPGoding",
                      "valueMap": {
                        "outerRange": {
                          "start": 12,
                          "end": 20
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 12,
                        "end": 20
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                },
                "end": {
                  "start": 22,
                  "end": 23
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 24,
                  "end": 41
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 24,
                      "end": 30
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "name",
                    "valueMap": {
                      "outerRange": {
                        "start": 25,
                        "end": 29
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 4
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 4
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "name"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "children": [
                      {
                        "type": "string",
                        "range": {
                          "start": 33,
                          "end": 39
                        },
                        "options": {
                          "escapable": {},
                          "quotes": [
                            "\"",
                            "'"
                          ],
                          "unquotable": {}
                        },
                        "value": "Misode",
                        "valueMap": {
                          "outerRange": {
                            "start": 33,
                            "end": 39
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 6
                          },
                          "pairs": []
                        }
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 33,
                        "end": 39
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "Misode",
                      "valueMap": {
                        "outerRange": {
                          "start": 33,
                          "end": 39
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 6
                        },
                        "pairs": []
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 30
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 25,
                      "end": 29
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                "sep": {
                  "start": 31,
                  "end": 32
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 33,
                        "end": 39
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "Misode",
                      "valueMap": {
                        "outerRange": {
                          "start": 33,
                          "end": 39
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 6
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 33,
                        "end": 39
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                },
                "end": {
                  "start": 40,
                  "end": 41
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 42,
                  "end": 52
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 42,
                      "end": 48
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "name",
                    "valueMap": {
                      "outerRange": {
                        "start": 43,
                        "end": 47
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 4
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 4
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "name"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 51,
                      "end": 51
                    },
                    "children": [
                      {
                        "type": "string",
                        "range": {
                          "start": 51,
                          "end": 51
                        },
                        "options": {
                          "escapable": {},
                          "quotes": [
                            "\"",
                            "'"
                          ],
                          "unquotable": {}
                        },
                        "value": "",
                        "valueMap": {
                          "outerRange": {
                            "start": 51,
                            "end": 51
                          },
                          "innerRange": {
                            "start": 0,
                            "end": 0
                          },
                          "pairs": []
                        }
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "string",
                      "range": {
                        "start": 51,
                        "end": 51
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "",
                      "valueMap": {
                        "outerRange": {
                          "start": 51,
                          "end": 51
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 0
                        },
                        "pairs": []
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 42,
                    "end": 48
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 43,
                      "end": 47
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                "sep": {
                  "start": 49,
                  "end": 50
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 51,
                        "end": 51
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "",
                      "valueMap": {
                        "outerRange": {
                          "start": 51,
                          "end": 51
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 0
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 51,
                      "end": 51
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 51,
                        "end": 51
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                },
                "end": {
                  "start": 51,
                  "end": 52
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 54
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 54
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 23
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 11,
                        "end": 21
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "SPGoding",
                      "valueMap": {
                        "outerRange": {
                          "start": 12,
                          "end": 20
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 12,
                        "end": 20
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 9,
                "end": 10
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 21
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 12,
                        "end": 20
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "SPGoding",
                  "valueMap": {
                    "outerRange": {
                      "start": 12,
                      "end": 20
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 22,
                "end": 23
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 24,
                "end": 41
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 30
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 25,
                      "end": 29
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 33,
                        "end": 39
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "Misode",
                      "valueMap": {
                        "outerRange": {
                          "start": 33,
                          "end": 39
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 6
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 33,
                        "end": 39
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 30
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 25,
                    "end": 29
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 31,
                "end": 32
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 33,
                  "end": 39
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 33,
                        "end": 39
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "Misode",
                  "valueMap": {
                    "outerRange": {
                      "start": 33,
                      "end": 39
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 40,
                "end": 41
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 42,
                "end": 52
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 42,
                    "end": 48
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 43,
                      "end": 47
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 51,
                        "end": 51
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "",
                      "valueMap": {
                        "outerRange": {
                          "start": 51,
                          "end": 51
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 0
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 51,
                      "end": 51
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 51,
                        "end": 51
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 42,
                  "end": 48
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 43,
                    "end": 47
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 49,
                "end": 50
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 51,
                  "end": 51
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 51,
                      "end": 51
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 51,
                        "end": 51
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 51,
                      "end": 51
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 51,
                "end": 52
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 54
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 23
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 11,
                        "end": 21
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "SPGoding",
                      "valueMap": {
                        "outerRange": {
                          "start": 12,
                          "end": 20
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 8
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 12,
                        "end": 20
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 9,
                "end": 10
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 21
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 12,
                        "end": 20
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "SPGoding",
                  "valueMap": {
                    "outerRange": {
                      "start": 12,
                      "end": 20
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 22,
                "end": 23
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 24,
                "end": 41
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 30
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 25,
                      "end": 29
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 33,
                        "end": 39
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "Misode",
                      "valueMap": {
                        "outerRange": {
                          "start": 33,
                          "end": 39
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 6
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 33,
                        "end": 39
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 30
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 25,
                    "end": 29
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 31,
                "end": 32
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 33,
                  "end": 39
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 33,
                        "end": 39
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "Misode",
                  "valueMap": {
                    "outerRange": {
                      "start": 33,
                      "end": 39
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 40,
                "end": 41
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 42,
                "end": 52
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 42,
                    "end": 48
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "name",
                  "valueMap": {
                    "outerRange": {
                      "start": 43,
                      "end": 47
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 4
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 4
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "name"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "children": [
                    {
                      "type": "string",
                      "range": {
                        "start": 51,
                        "end": 51
                      },
                      "options": {
                        "escapable": {},
                        "quotes": [
                          "\"",
                          "'"
                        ],
                        "unquotable": {}
                      },
                      "value": "",
                      "valueMap": {
                        "outerRange": {
                          "start": 51,
                          "end": 51
                        },
                        "innerRange": {
                          "start": 0,
                          "end": 0
                        },
                        "pairs": []
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 51,
                      "end": 51
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 51,
                        "end": 51
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 42,
                  "end": 48
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 43,
                    "end": 47
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              "sep": {
                "start": 49,
                "end": 50
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 51,
                  "end": 51
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 51,
                      "end": 51
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 51,
                        "end": 51
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 51,
                      "end": 51
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
                    },
                    "pairs": []
                  }
                }
              },
              "end": {
                "start": 51,
                "end": 52
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 54
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 54
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 23
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 21
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "SPGoding",
                    "valueMap": {
                      "outerRange": {
                        "start": 12,
                        "end": 20
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 8
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "SPGoding",
                  "valueMap": {
                    "outerRange": {
                      "start": 12,
                      "end": 20
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 8
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "name",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 8
                },
                "innerRange": {
                  "start": 0,
                  "end": 4
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 4
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "name"
              }
            },
            "sep": {
              "start": 9,
              "end": 10
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 11,
                "end": 21
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "SPGoding",
                  "valueMap": {
                    "outerRange": {
                      "start": 12,
                      "end": 20
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 8
                    },
                    "pairs": []
                  }
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 21
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {}
                },
                "value": "SPGoding",
                "valueMap": {
                  "outerRange": {
                    "start": 12,
                    "end": 20
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 8
                  },
                  "pairs": []
                }
              }
            },
            "end": {
              "start": 22,
              "end": 23
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 24,
              "end": 41
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 30
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 25,
                    "end": 29
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 33,
                  "end": 39
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "Misode",
                    "valueMap": {
                      "outerRange": {
                        "start": 33,
                        "end": 39
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "Misode",
                  "valueMap": {
                    "outerRange": {
                      "start": 33,
                      "end": 39
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 24,
                "end": 30
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "name",
              "valueMap": {
                "outerRange": {
                  "start": 25,
                  "end": 29
                },
                "innerRange": {
                  "start": 0,
                  "end": 4
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 4
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "name"
              }
            },
            "sep": {
              "start": 31,
              "end": 32
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 33,
                "end": 39
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "Misode",
                  "valueMap": {
                    "outerRange": {
                      "start": 33,
                      "end": 39
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  }
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 33,
                  "end": 39
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {}
                },
                "value": "Misode",
                "valueMap": {
                  "outerRange": {
                    "start": 33,
                    "end": 39
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                }
              }
            },
            "end": {
              "start": 40,
              "end": 41
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 42,
              "end": 52
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 42,
                  "end": 48
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "name",
                "valueMap": {
                  "outerRange": {
                    "start": 43,
                    "end": 47
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 4
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "name"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 51,
                  "end": 51
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 51,
                      "end": 51
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {}
                    },
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 51,
                        "end": 51
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
                      },
                      "pairs": []
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 51,
                      "end": 51
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
                    },
                    "pairs": []
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 42,
                "end": 48
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "name",
              "valueMap": {
                "outerRange": {
                  "start": 43,
                  "end": 47
                },
                "innerRange": {
                  "start": 0,
                  "end": 4
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 4
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "name"
              }
            },
            "sep": {
              "start": 49,
              "end": 50
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 51,
                "end": 51
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {}
                  },
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 51,
                      "end": 51
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
                    },
                    "pairs": []
                  }
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 51,
                  "end": 51
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {}
                },
                "value": "",
                "valueMap": {
                  "outerRange": {
                    "start": 51,
                    "end": 51
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 0
                  },
                  "pairs": []
                }
              }
            },
            "end": {
              "start": 51,
              "end": 52
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 24,
        "end": 30
      },
      "message": "Duplicate key “name”",
      "severity": 3
    },
    {
      "range": {
        "start": 42,
        "end": 48
      },
      "message": "Duplicate key “name”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "@a[ nbt = {} , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 16
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 14
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 7
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "nbt",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 7
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 3
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 3
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "nbt"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 10,
                      "end": 12
                    },
                    "children": [
                      {
                        "type": "nbt:compound",
                        "range": {
                          "start": 10,
                          "end": 12
                        },
                        "children": []
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "nbt:compound",
                      "range": {
                        "start": 10,
                        "end": 12
                      },
                      "children": []
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 7
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "nbt",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 7
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 3
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 3
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "nbt"
                  }
                },
                "sep": {
                  "start": 8,
                  "end": 9
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 10,
                    "end": 12
                  },
                  "children": [
                    {
                      "type": "nbt:compound",
                      "range": {
                        "start": 10,
                        "end": 12
                      },
                      "children": []
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "nbt:compound",
                    "range": {
                      "start": 10,
                      "end": 12
                    },
                    "children": []
                  }
                },
                "end": {
                  "start": 13,
                  "end": 14
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 16
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 16
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 14
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 7
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "nbt",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 7
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 3
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 3
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "nbt"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 10,
                    "end": 12
                  },
                  "children": [
                    {
                      "type": "nbt:compound",
                      "range": {
                        "start": 10,
                        "end": 12
                      },
                      "children": []
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "nbt:compound",
                    "range": {
                      "start": 10,
                      "end": 12
                    },
                    "children": []
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 7
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "nbt",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 7
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 3
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 3
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "nbt"
                }
              },
              "sep": {
                "start": 8,
                "end": 9
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 10,
                  "end": 12
                },
                "children": [
                  {
                    "type": "nbt:compound",
                    "range": {
                      "start": 10,
                      "end": 12
                    },
                    "children": []
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "nbt:compound",
                  "range": {
                    "start": 10,
                    "end": 12
                  },
                  "children": []
                }
              },
              "end": {
                "start": 13,
                "end": 14
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 16
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 14
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 7
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "nbt",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 7
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 3
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 3
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "nbt"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 10,
                    "end": 12
                  },
                  "children": [
                    {
                      "type": "nbt:compound",
                      "range": {
                        "start": 10,
                        "end": 12
                      },
                      "children": []
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "nbt:compound",
                    "range": {
                      "start": 10,
                      "end": 12
                    },
                    "children": []
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 7
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "nbt",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 7
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 3
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 3
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "nbt"
                }
              },
              "sep": {
                "start": 8,
                "end": 9
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 10,
                  "end": 12
                },
                "children": [
                  {
                    "type": "nbt:compound",
                    "range": {
                      "start": 10,
                      "end": 12
                    },
                    "children": []
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "nbt:compound",
                  "range": {
                    "start": 10,
                    "end": 12
                  },
                  "children": []
                }
              },
              "end": {
                "start": 13,
                "end": 14
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 16
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 16
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 14
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 7
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "nbt",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 7
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 3
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 3
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "nbt"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 10,
                  "end": 12
                },
                "children": [
                  {
                    "type": "nbt:compound",
                    "range": {
                      "start": 10,
                      "end": 12
                    },
                    "children": []
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "nbt:compound",
                  "range": {
                    "start": 10,
                    "end": 12
                  },
                  "children": []
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 7
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "nbt",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 7
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 3
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "nbt"
              }
            },
            "sep": {
              "start": 8,
              "end": 9
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 10,
                "end": 12
              },
              "children": [
                {
                  "type": "nbt:compound",
                  "range": {
                    "start": 10,
                    "end": 12
                  },
                  "children": []
                }
              ],
              "inverted": false,
              "value": {
                "type": "nbt:compound",
                "range": {
                  "start": 10,
                  "end": 12
                },
                "children": []
              }
            },
            "end": {
              "start": 13,
              "end": 14
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ predicate = spgoding:foo , predicate = ! spgoding:bar , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 61
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 61
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 30
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 13
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "predicate",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 13
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 9
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 9
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "predicate"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 16,
                      "end": 28
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 16,
                          "end": 28
                        },
                        "options": {
                          "category": "predicate"
                        },
                        "namespace": "spgoding",
                        "path": [
                          "foo"
                        ]
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "resource_location",
                      "range": {
                        "start": 16,
                        "end": 28
                      },
                      "options": {
                        "category": "predicate"
                      },
                      "namespace": "spgoding",
                      "path": [
                        "foo"
                      ]
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 13
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "predicate",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 13
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "predicate"
                  }
                },
                "sep": {
                  "start": 14,
                  "end": 15
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 16,
                    "end": 28
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 16,
                        "end": 28
                      },
                      "options": {
                        "category": "predicate"
                      },
                      "namespace": "spgoding",
                      "path": [
                        "foo"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 16,
                      "end": 28
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "foo"
                    ]
                  }
                },
                "end": {
                  "start": 29,
                  "end": 30
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 31,
                  "end": 59
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 31,
                      "end": 40
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "predicate",
                    "valueMap": {
                      "outerRange": {
                        "start": 31,
                        "end": 40
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 9
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 9
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "predicate"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 43,
                      "end": 57
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 43,
                          "end": 44
                        },
                        "options": {
                          "pool": [
                            "!"
                          ],
                          "colorTokenType": "keyword"
                        },
                        "value": "!"
                      },
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 45,
                          "end": 57
                        },
                        "options": {
                          "category": "predicate"
                        },
                        "namespace": "spgoding",
                        "path": [
                          "bar"
                        ]
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "resource_location",
                      "range": {
                        "start": 45,
                        "end": 57
                      },
                      "options": {
                        "category": "predicate"
                      },
                      "namespace": "spgoding",
                      "path": [
                        "bar"
                      ]
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 31,
                    "end": 40
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "predicate",
                  "valueMap": {
                    "outerRange": {
                      "start": 31,
                      "end": 40
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "predicate"
                  }
                },
                "sep": {
                  "start": 41,
                  "end": 42
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 43,
                    "end": 57
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 43,
                        "end": 44
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 45,
                        "end": 57
                      },
                      "options": {
                        "category": "predicate"
                      },
                      "namespace": "spgoding",
                      "path": [
                        "bar"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 45,
                      "end": 57
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "bar"
                    ]
                  }
                },
                "end": {
                  "start": 58,
                  "end": 59
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 61
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 61
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 30
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 13
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "predicate",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 13
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "predicate"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 16,
                    "end": 28
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 16,
                        "end": 28
                      },
                      "options": {
                        "category": "predicate"
                      },
                      "namespace": "spgoding",
                      "path": [
                        "foo"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 16,
                      "end": 28
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "foo"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 13
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "predicate",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 13
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 9
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 9
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "predicate"
                }
              },
              "sep": {
                "start": 14,
                "end": 15
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 16,
                  "end": 28
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 16,
                      "end": 28
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "foo"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 16,
                    "end": 28
                  },
                  "options": {
                    "category": "predicate"
                  },
                  "namespace": "spgoding",
                  "path": [
                    "foo"
                  ]
                }
              },
              "end": {
                "start": 29,
                "end": 30
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 31,
                "end": 59
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 31,
                    "end": 40
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "predicate",
                  "valueMap": {
                    "outerRange": {
                      "start": 31,
                      "end": 40
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "predicate"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 43,
                    "end": 57
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 43,
                        "end": 44
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 45,
                        "end": 57
                      },
                      "options": {
                        "category": "predicate"
                      },
                      "namespace": "spgoding",
                      "path": [
                        "bar"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 45,
                      "end": 57
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "bar"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 31,
                  "end": 40
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "predicate",
                "valueMap": {
                  "outerRange": {
                    "start": 31,
                    "end": 40
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 9
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 9
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "predicate"
                }
              },
              "sep": {
                "start": 41,
                "end": 42
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 43,
                  "end": 57
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 43,
                      "end": 44
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 45,
                      "end": 57
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "bar"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 45,
                    "end": 57
                  },
                  "options": {
                    "category": "predicate"
                  },
                  "namespace": "spgoding",
                  "path": [
                    "bar"
                  ]
                }
              },
              "end": {
                "start": 58,
                "end": 59
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 61
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 30
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 13
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "predicate",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 13
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "predicate"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 16,
                    "end": 28
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 16,
                        "end": 28
                      },
                      "options": {
                        "category": "predicate"
                      },
                      "namespace": "spgoding",
                      "path": [
                        "foo"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 16,
                      "end": 28
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "foo"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 13
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "predicate",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 13
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 9
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 9
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "predicate"
                }
              },
              "sep": {
                "start": 14,
                "end": 15
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 16,
                  "end": 28
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 16,
                      "end": 28
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "foo"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 16,
                    "end": 28
                  },
                  "options": {
                    "category": "predicate"
                  },
                  "namespace": "spgoding",
                  "path": [
                    "foo"
                  ]
                }
              },
              "end": {
                "start": 29,
                "end": 30
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 31,
                "end": 59
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 31,
                    "end": 40
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "predicate",
                  "valueMap": {
                    "outerRange": {
                      "start": 31,
                      "end": 40
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 9
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 9
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "predicate"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 43,
                    "end": 57
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 43,
                        "end": 44
                      },
                      "options": {
                        "pool": [
                          "!"
                        ],
                        "colorTokenType": "keyword"
                      },
                      "value": "!"
                    },
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 45,
                        "end": 57
                      },
                      "options": {
                        "category": "predicate"
                      },
                      "namespace": "spgoding",
                      "path": [
                        "bar"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 45,
                      "end": 57
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "bar"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 31,
                  "end": 40
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "predicate",
                "valueMap": {
                  "outerRange": {
                    "start": 31,
                    "end": 40
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 9
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 9
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "predicate"
                }
              },
              "sep": {
                "start": 41,
                "end": 42
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 43,
                  "end": 57
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 43,
                      "end": 44
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 45,
                      "end": 57
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "bar"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 45,
                    "end": 57
                  },
                  "options": {
                    "category": "predicate"
                  },
                  "namespace": "spgoding",
                  "path": [
                    "bar"
                  ]
                }
              },
              "end": {
                "start": 58,
                "end": 59
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 61
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 61
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 30
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 13
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "predicate",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 13
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 9
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 9
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "predicate"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 16,
                  "end": 28
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 16,
                      "end": 28
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "foo"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 16,
                    "end": 28
                  },
                  "options": {
                    "category": "predicate"
                  },
                  "namespace": "spgoding",
                  "path": [
                    "foo"
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 13
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "predicate",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 13
                },
                "innerRange": {
                  "start": 0,
                  "end": 9
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 9
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "predicate"
              }
            },
            "sep": {
              "start": 14,
              "end": 15
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 16,
                "end": 28
              },
              "children": [
                {
                  "type": "resource_location",
                  "range": {
                    "start": 16,
                    "end": 28
                  },
                  "options": {
                    "category": "predicate"
                  },
                  "namespace": "spgoding",
                  "path": [
                    "foo"
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 16,
                  "end": 28
                },
                "options": {
                  "category": "predicate"
                },
                "namespace": "spgoding",
                "path": [
                  "foo"
                ]
              }
            },
            "end": {
              "start": 29,
              "end": 30
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 31,
              "end": 59
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 31,
                  "end": 40
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "predicate",
                "valueMap": {
                  "outerRange": {
                    "start": 31,
                    "end": 40
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 9
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 9
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "predicate"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 43,
                  "end": 57
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 43,
                      "end": 44
                    },
                    "options": {
                      "pool": [
                        "!"
                      ],
                      "colorTokenType": "keyword"
                    },
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 45,
                      "end": 57
                    },
                    "options": {
                      "category": "predicate"
                    },
                    "namespace": "spgoding",
                    "path": [
                      "bar"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 45,
                    "end": 57
                  },
                  "options": {
                    "category": "predicate"
                  },
                  "namespace": "spgoding",
                  "path": [
                    "bar"
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 31,
                "end": 40
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "predicate",
              "valueMap": {
                "outerRange": {
                  "start": 31,
                  "end": 40
                },
                "innerRange": {
                  "start": 0,
                  "end": 9
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 9
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "predicate"
              }
            },
            "sep": {
              "start": 41,
              "end": 42
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 43,
                "end": 57
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 43,
                    "end": 44
                  },
                  "options": {
                    "pool": [
                      "!"
                    ],
                    "colorTokenType": "keyword"
                  },
                  "value": "!"
                },
                {
                  "type": "resource_location",
                  "range": {
                    "start": 45,
                    "end": 57
                  },
                  "options": {
                    "category": "predicate"
                  },
                  "namespace": "spgoding",
                  "path": [
                    "bar"
                  ]
                }
              ],
              "inverted": true,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 45,
                  "end": 57
                },
                "options": {
                  "category": "predicate"
                },
                "namespace": "spgoding",
                "path": [
                  "bar"
                ]
              }
            },
            "end": {
              "start": 58,
              "end": 59
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[limit=1]" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@a"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 11
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 3,
                  "end": 10
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 3,
                      "end": 8
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "limit",
                    "valueMap": {
                      "outerRange": {
                        "start": 3,
                        "end": 8
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 5
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 5
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "limit"
                    }
                  },
                  {
                    "type": "integer",
                    "range": {
                      "start": 9,
                      "end": 10
                    },
                    "value": 1
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 3,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 3,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                "sep": {
                  "start": 8,
                  "end": 9
                },
                "value": {
                  "type": "integer",
                  "range": {
                    "start": 9,
                    "end": 10
                  },
                  "value": 1
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 11
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 11
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 3,
                "end": 10
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 3,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 3,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 9,
                    "end": 10
                  },
                  "value": 1
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 3,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 3,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 8,
                "end": 9
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 9,
                  "end": 10
                },
                "value": 1
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "single": true,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@a"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 11
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 3,
                "end": 10
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 3,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 3,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 9,
                    "end": 10
                  },
                  "value": 1
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 3,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 3,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 8,
                "end": 9
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 9,
                  "end": 10
                },
                "value": 1
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 11
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 11
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 3,
              "end": 10
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 3,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 3,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              {
                "type": "integer",
                "range": {
                  "start": 9,
                  "end": 10
                },
                "value": 1
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 3,
                "end": 8
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "limit",
              "valueMap": {
                "outerRange": {
                  "start": 3,
                  "end": 8
                },
                "innerRange": {
                  "start": 0,
                  "end": 5
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 5
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "limit"
              }
            },
            "sep": {
              "start": 8,
              "end": 9
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 9,
                "end": 10
              },
              "value": 1
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "single": true,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@e" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@e"
          }
        ],
        "range": {
          "start": 0,
          "end": 2
        },
        "type": "mcfunction:entity_selector",
        "variable": "e",
        "currentEntity": false,
        "playersOnly": false,
        "predicates": [
          "Entity::isAlive"
        ],
        "single": false,
        "typeLimited": false,
        "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@e"
        }
      ],
      "range": {
        "start": 0,
        "end": 2
      },
      "type": "mcfunction:entity_selector",
      "variable": "e",
      "currentEntity": false,
      "playersOnly": false,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": false,
      "typeLimited": false,
      "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@e" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@e"
          }
        ],
        "range": {
          "start": 0,
          "end": 2
        },
        "type": "mcfunction:entity_selector",
        "variable": "e",
        "currentEntity": false,
        "playersOnly": false,
        "predicates": [
          "Entity::isAlive"
        ],
        "single": false,
        "typeLimited": false,
        "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@e"
        }
      ],
      "range": {
        "start": 0,
        "end": 2
      },
      "type": "mcfunction:entity_selector",
      "variable": "e",
      "currentEntity": false,
      "playersOnly": false,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": false,
      "typeLimited": false,
      "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "The selector contains multiple entities",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "The selector contains non-player entities",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "@e[limit=1]" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@e"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 11
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 3,
                  "end": 10
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 3,
                      "end": 8
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "limit",
                    "valueMap": {
                      "outerRange": {
                        "start": 3,
                        "end": 8
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 5
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 5
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "limit"
                    }
                  },
                  {
                    "type": "integer",
                    "range": {
                      "start": 9,
                      "end": 10
                    },
                    "value": 1
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 3,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 3,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                "sep": {
                  "start": 8,
                  "end": 9
                },
                "value": {
                  "type": "integer",
                  "range": {
                    "start": 9,
                    "end": 10
                  },
                  "value": 1
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 11
        },
        "type": "mcfunction:entity_selector",
        "variable": "e",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 11
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 3,
                "end": 10
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 3,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 3,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 9,
                    "end": 10
                  },
                  "value": 1
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 3,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 3,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 8,
                "end": 9
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 9,
                  "end": 10
                },
                "value": 1
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": false,
        "predicates": [
          "Entity::isAlive"
        ],
        "single": true,
        "typeLimited": false,
        "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@e"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 11
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 3,
                "end": 10
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 3,
                    "end": 8
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 3,
                      "end": 8
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 9,
                    "end": 10
                  },
                  "value": 1
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 3,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 3,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 8,
                "end": 9
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 9,
                  "end": 10
                },
                "value": 1
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 11
      },
      "type": "mcfunction:entity_selector",
      "variable": "e",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 11
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 3,
              "end": 10
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 3,
                  "end": 8
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 3,
                    "end": 8
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              {
                "type": "integer",
                "range": {
                  "start": 9,
                  "end": 10
                },
                "value": 1
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 3,
                "end": 8
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "limit",
              "valueMap": {
                "outerRange": {
                  "start": 3,
                  "end": 8
                },
                "innerRange": {
                  "start": 0,
                  "end": 5
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 5
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "limit"
              }
            },
            "sep": {
              "start": 8,
              "end": 9
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 9,
                "end": 10
              },
              "value": 1
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": false,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": true,
      "typeLimited": false,
      "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 11
      },
      "message": "The selector contains non-player entities",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "@e[type=foo]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 12
    },
    "children": [
      {
        "type": "mcfunction:argument/minecraft:uuid",
        "range": {
          "start": 0,
          "end": 12
        },
        "name": "",
        "bits": [
          "0",
          "0"
        ]
      }
    ],
    "name": "test",
    "uuid": {
      "type": "mcfunction:argument/minecraft:uuid",
      "range": {
        "start": 0,
        "end": 12
      },
      "name": "",
      "bits": [
        "0",
        "0"
      ]
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 12
      },
      "message": "Invalid UUID format",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "@r" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@r"
          }
        ],
        "range": {
          "start": 0,
          "end": 2
        },
        "type": "mcfunction:entity_selector",
        "variable": "r",
        "currentEntity": false,
        "playersOnly": true,
        "single": true,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@r"
        }
      ],
      "range": {
        "start": 0,
        "end": 2
      },
      "type": "mcfunction:entity_selector",
      "variable": "r",
      "currentEntity": false,
      "playersOnly": true,
      "single": true,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@s[ limit = 0 , limit = 0 , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 29
    },
    "children": [
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@s"
          },
          {
            "type": "mcfunction:entity_selector/arguments",
            "range": {
              "start": 2,
              "end": 29
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 15
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 9
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "limit",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 9
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 5
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 5
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "limit"
                    }
                  },
                  {
                    "type": "integer",
                    "range": {
                      "start": 12,
                      "end": 13
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                "sep": {
                  "start": 10,
                  "end": 11
                },
                "value": {
                  "type": "integer",
                  "range": {
                    "start": 12,
                    "end": 13
                  },
                  "value": 0
                },
                "end": {
                  "start": 14,
                  "end": 15
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 16,
                  "end": 27
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 16,
                      "end": 21
                    },
                    "options": {
                      "escapable": {},
                      "quotes": [
                        "\"",
                        "'"
                      ],
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "limit",
                    "valueMap": {
                      "outerRange": {
                        "start": 16,
                        "end": 21
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 5
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 5
                      },
                      "options": {
                        "pool": [
                          "advancements",
                          "x_rotation",
                          "y_rotation",
                          "predicate",
                          "distance",
                          "gamemode",
                          "scores",
                          "level",
                          "limit",
                          "name",
                          "sort",
                          "team",
                          "type",
                          "nbt",
                          "tag",
                          "dx",
                          "dy",
                          "dz",
                          "x",
                          "y",
                          "z"
                        ],
                        "colorTokenType": "property"
                      },
                      "value": "limit"
                    }
                  },
                  {
                    "type": "integer",
                    "range": {
                      "start": 24,
                      "end": 25
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 16,
                    "end": 21
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 16,
                      "end": 21
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                "sep": {
                  "start": 22,
                  "end": 23
                },
                "value": {
                  "type": "integer",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": 0
                },
                "end": {
                  "start": 26,
                  "end": 27
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 29
        },
        "type": "mcfunction:entity_selector",
        "variable": "s",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 29
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 15
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 12,
                    "end": 13
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 12,
                  "end": 13
                },
                "value": 0
              },
              "end": {
                "start": 14,
                "end": 15
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 16,
                "end": 27
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 16,
                    "end": 21
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 16,
                      "end": 21
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 16,
                  "end": 21
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 16,
                    "end": 21
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 22,
                "end": 23
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": 0
              },
              "end": {
                "start": 26,
                "end": 27
              }
            }
          ]
        },
        "currentEntity": true,
        "playersOnly": false,
        "single": true,
        "typeLimited": false,
        "hover": "**Performance**: 😌👌  \n- `currentEntity`: `true`"
      }
    ],
    "name": "test",
    "selector": {
      "isSequenceUtil": true,
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "options": {
            "pool": [
              "@p",
              "@a",
              "@r",
              "@s",
              "@e"
            ],
            "colorTokenType": "keyword"
          },
          "value": "@s"
        },
        {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 29
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 15
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 9
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 9
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 12,
                    "end": 13
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 12,
                  "end": 13
                },
                "value": 0
              },
              "end": {
                "start": 14,
                "end": 15
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 16,
                "end": 27
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 16,
                    "end": 21
                  },
                  "options": {
                    "escapable": {},
                    "quotes": [
                      "\"",
                      "'"
                    ],
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "limit",
                  "valueMap": {
                    "outerRange": {
                      "start": 16,
                      "end": 21
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 5
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 5
                    },
                    "options": {
                      "pool": [
                        "advancements",
                        "x_rotation",
                        "y_rotation",
                        "predicate",
                        "distance",
                        "gamemode",
                        "scores",
                        "level",
                        "limit",
                        "name",
                        "sort",
                        "team",
                        "type",
                        "nbt",
                        "tag",
                        "dx",
                        "dy",
                        "dz",
                        "x",
                        "y",
                        "z"
                      ],
                      "colorTokenType": "property"
                    },
                    "value": "limit"
                  }
                },
                {
                  "type": "integer",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 16,
                  "end": 21
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 16,
                    "end": 21
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              "sep": {
                "start": 22,
                "end": 23
              },
              "value": {
                "type": "integer",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": 0
              },
              "end": {
                "start": 26,
                "end": 27
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 29
      },
      "type": "mcfunction:entity_selector",
      "variable": "s",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 29
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 15
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 9
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              {
                "type": "integer",
                "range": {
                  "start": 12,
                  "end": 13
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 9
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "limit",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 9
                },
                "innerRange": {
                  "start": 0,
                  "end": 5
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 5
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "limit"
              }
            },
            "sep": {
              "start": 10,
              "end": 11
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 12,
                "end": 13
              },
              "value": 0
            },
            "end": {
              "start": 14,
              "end": 15
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 16,
              "end": 27
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 16,
                  "end": 21
                },
                "options": {
                  "escapable": {},
                  "quotes": [
                    "\"",
                    "'"
                  ],
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "limit",
                "valueMap": {
                  "outerRange": {
                    "start": 16,
                    "end": 21
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 5
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 5
                  },
                  "options": {
                    "pool": [
                      "advancements",
                      "x_rotation",
                      "y_rotation",
                      "predicate",
                      "distance",
                      "gamemode",
                      "scores",
                      "level",
                      "limit",
                      "name",
                      "sort",
                      "team",
                      "type",
                      "nbt",
                      "tag",
                      "dx",
                      "dy",
                      "dz",
                      "x",
                      "y",
                      "z"
                    ],
                    "colorTokenType": "property"
                  },
                  "value": "limit"
                }
              },
              {
                "type": "integer",
                "range": {
                  "start": 24,
                  "end": 25
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 16,
                "end": 21
              },
              "options": {
                "escapable": {},
                "quotes": [
                  "\"",
                  "'"
                ],
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "limit",
              "valueMap": {
                "outerRange": {
                  "start": 16,
                  "end": 21
                },
                "innerRange": {
                  "start": 0,
                  "end": 5
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 5
                },
                "options": {
                  "pool": [
                    "advancements",
                    "x_rotation",
                    "y_rotation",
                    "predicate",
                    "distance",
                    "gamemode",
                    "scores",
                    "level",
                    "limit",
                    "name",
                    "sort",
                    "team",
                    "type",
                    "nbt",
                    "tag",
                    "dx",
                    "dy",
                    "dz",
                    "x",
                    "y",
                    "z"
                  ],
                  "colorTokenType": "property"
                },
                "value": "limit"
              }
            },
            "sep": {
              "start": 22,
              "end": 23
            },
            "value": {
              "type": "integer",
              "range": {
                "start": 24,
                "end": 25
              },
              "value": 0
            },
            "end": {
              "start": 26,
              "end": 27
            }
          }
        ]
      },
      "currentEntity": true,
      "playersOnly": false,
      "single": true,
      "typeLimited": false,
      "hover": "**Performance**: 😌👌  \n- `currentEntity`: `true`"
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 9
      },
      "message": "“limit” is not applicable here",
      "severity": 3
    },
    {
      "range": {
        "start": 16,
        "end": 21
      },
      "message": "Duplicate key “limit”",
      "severity": 3
    },
    {
      "range": {
        "start": 16,
        "end": 21
      },
      "message": "“limit” is not applicable here",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "Player" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 6
        },
        "options": {
          "escapable": {},
          "quotes": [
            "\"",
            "'"
          ],
          "unquotable": {}
        },
        "value": "Player",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 6
          },
          "innerRange": {
            "start": 0,
            "end": 6
          },
          "pairs": []
        }
      }
    ],
    "name": "test",
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 6
      },
      "options": {
        "escapable": {},
        "quotes": [
          "\"",
          "'"
        ],
        "unquotable": {}
      },
      "value": "Player",
      "valueMap": {
        "outerRange": {
          "start": 0,
          "end": 6
        },
        "innerRange": {
          "start": 0,
          "end": 6
        },
        "pairs": []
      }
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "Player" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 6
        },
        "options": {
          "escapable": {},
          "quotes": [
            "\"",
            "'"
          ],
          "unquotable": {}
        },
        "value": "Player",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 6
          },
          "innerRange": {
            "start": 0,
            "end": 6
          },
          "pairs": []
        }
      }
    ],
    "name": "test",
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 6
      },
      "options": {
        "escapable": {},
        "quotes": [
          "\"",
          "'"
        ],
        "unquotable": {}
      },
      "value": "Player",
      "valueMap": {
        "outerRange": {
          "start": 0,
          "end": 6
        },
        "innerRange": {
          "start": 0,
          "end": 6
        },
        "pairs": []
      }
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "dd12be42-52a9-4a91-a8a1-11c01849e498" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 36
    },
    "children": [
      {
        "type": "mcfunction:argument/minecraft:uuid",
        "range": {
          "start": 0,
          "end": 36
        },
        "name": "",
        "bits": [
          "-2516740049682740591",
          "-6295731287348353896"
        ]
      }
    ],
    "name": "test",
    "uuid": {
      "type": "mcfunction:argument/minecraft:uuid",
      "range": {
        "start": 0,
        "end": 36
      },
      "name": "",
      "bits": [
        "-2516740049682740591",
        "-6295731287348353896"
      ]
    },
    "hover": "<test: entity>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "dd12be42-52a9-4a91-a8a1-11c01849e498" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 36
    },
    "children": [
      {
        "type": "mcfunction:argument/minecraft:uuid",
        "range": {
          "start": 0,
          "end": 36
        },
        "name": "",
        "bits": [
          "-2516740049682740591",
          "-6295731287348353896"
        ]
      }
    ],
    "name": "test",
    "uuid": {
      "type": "mcfunction:argument/minecraft:uuid",
      "range": {
        "start": 0,
        "end": 36
      },
      "name": "",
      "bits": [
        "-2516740049682740591",
        "-6295731287348353896"
      ]
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 36
      },
      "message": "The selector contains non-player entities",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:entity Parse "this_is_a_super_long_player_name" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:entity",
    "range": {
      "start": 0,
      "end": 32
    },
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 32
        },
        "options": {
          "escapable": {},
          "quotes": [
            "\"",
            "'"
          ],
          "unquotable": {}
        },
        "value": "this_is_a_super_long_player_name",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 32
          },
          "innerRange": {
            "start": 0,
            "end": 32
          },
          "pairs": []
        }
      }
    ],
    "name": "test",
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 32
      },
      "options": {
        "escapable": {},
        "quotes": [
          "\"",
          "'"
        ],
        "unquotable": {}
      },
      "value": "this_is_a_super_long_player_name",
      "valueMap": {
        "outerRange": {
          "start": 0,
          "end": 32
        },
        "innerRange": {
          "start": 0,
          "end": 32
        },
        "pairs": []
      }
    },
    "hover": "<test: entity>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 32
      },
      "message": "Player names cannot be longer than 16 characters",
      "severity": 3
    }
  ]
}
