exports['mcfunction argument minecraft:score_holder Parse "*" with {"amount":"multiple"} 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "*" with {"amount":"single"} 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "0123" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "symbol",
        "range": {
          "start": 0,
          "end": 4
        },
        "options": {
          "category": "score_holder"
        },
        "value": "0123",
        "symbol": {
          "category": "score_holder",
          "identifier": "0123",
          "reference": [
            {
              "uri": ""
            }
          ]
        }
      }
    ],
    "name": "test",
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 4
      },
      "options": {
        "category": "score_holder"
      },
      "value": "0123",
      "symbol": {
        "category": "score_holder",
        "identifier": "0123",
        "reference": [
          {
            "uri": ""
          }
        ]
      }
    },
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "0123" with {"amount":"single"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "symbol",
        "range": {
          "start": 0,
          "end": 4
        },
        "options": {
          "category": "score_holder"
        },
        "value": "0123",
        "symbol": {
          "category": "score_holder",
          "identifier": "0123",
          "reference": [
            {
              "uri": ""
            }
          ]
        }
      }
    ],
    "name": "test",
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 4
      },
      "options": {
        "category": "score_holder"
      },
      "value": "0123",
      "symbol": {
        "category": "score_holder",
        "identifier": "0123",
        "reference": [
          {
            "uri": ""
          }
        ]
      }
    },
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ = 1 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
                  "start": 4,
                  "end": 9
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 4
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
                    "value": "",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 4
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 0
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
                      "value": ""
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 4
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
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 4
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
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
                    "value": ""
                  }
                },
                "sep": {
                  "start": 4,
                  "end": 5
                },
                "end": {
                  "start": 8,
                  "end": 9
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
                "start": 4,
                "end": 9
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 4
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
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 4
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
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
                    "value": ""
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 4
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
                "value": "",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 4
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 0
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
                  "value": ""
                }
              },
              "sep": {
                "start": 4,
                "end": 5
              },
              "end": {
                "start": 8,
                "end": 9
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
            "end": 11
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 9
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 4
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
                  "value": "",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 4
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 0
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
                    "value": ""
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 4
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
                "value": "",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 4
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 0
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
                  "value": ""
                }
              },
              "sep": {
                "start": 4,
                "end": 5
              },
              "end": {
                "start": 8,
                "end": 9
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
              "start": 4,
              "end": 9
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 4
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
                "value": "",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 4
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 0
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
                  "value": ""
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 4
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
              "value": "",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 4
                },
                "innerRange": {
                  "start": 0,
                  "end": 0
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
                "value": ""
              }
            },
            "sep": {
              "start": 4,
              "end": 5
            },
            "end": {
              "start": 8,
              "end": 9
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “advancements”, “x_rotation”, “y_rotation”, “predicate”, “distance”, “gamemode”, “scores”, “level”, “limit”, “name”, “sort”, “team”, “type”, “nbt”, “tag”, “dx”, “dy”, “dz”, “x”, “y”, or “z”",
      "severity": 3
    },
    {
      "range": {
        "start": 6,
        "end": 8
      },
      "message": "Expected a value",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ scores = { foo = 1.. , } , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 32
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
              "end": 32
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
                      "end": 10
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
                    "value": "scores",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 10
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 6
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
                      "value": "scores"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/scores",
                    "range": {
                      "start": 13,
                      "end": 28
                    },
                    "children": [
                      {
                        "type": "pair",
                        "range": {
                          "start": 15,
                          "end": 26
                        },
                        "children": [
                          {
                            "type": "symbol",
                            "range": {
                              "start": 15,
                              "end": 18
                            },
                            "options": {
                              "category": "objective"
                            },
                            "value": "foo",
                            "symbol": {
                              "category": "objective",
                              "identifier": "foo",
                              "reference": [
                                {
                                  "uri": ""
                                }
                              ]
                            }
                          },
                          {
                            "type": "mcfunction:argument/minecraft:int_range",
                            "range": {
                              "start": 21,
                              "end": 24
                            },
                            "children": [
                              {
                                "type": "integer",
                                "range": {
                                  "start": 21,
                                  "end": 22
                                },
                                "value": 1
                              },
                              {
                                "type": "literal",
                                "range": {
                                  "start": 22,
                                  "end": 24
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
                          "type": "symbol",
                          "range": {
                            "start": 15,
                            "end": 18
                          },
                          "options": {
                            "category": "objective"
                          },
                          "value": "foo",
                          "symbol": {
                            "category": "objective",
                            "identifier": "foo",
                            "reference": [
                              {
                                "uri": ""
                              }
                            ]
                          }
                        },
                        "sep": {
                          "start": 19,
                          "end": 20
                        },
                        "value": {
                          "type": "mcfunction:argument/minecraft:int_range",
                          "range": {
                            "start": 21,
                            "end": 24
                          },
                          "children": [
                            {
                              "type": "integer",
                              "range": {
                                "start": 21,
                                "end": 22
                              },
                              "value": 1
                            },
                            {
                              "type": "literal",
                              "range": {
                                "start": 22,
                                "end": 24
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
                          "start": 25,
                          "end": 26
                        }
                      }
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 10
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 10
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                "sep": {
                  "start": 11,
                  "end": 12
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 13,
                    "end": 28
                  },
                  "children": [
                    {
                      "type": "pair",
                      "range": {
                        "start": 15,
                        "end": 26
                      },
                      "children": [
                        {
                          "type": "symbol",
                          "range": {
                            "start": 15,
                            "end": 18
                          },
                          "options": {
                            "category": "objective"
                          },
                          "value": "foo",
                          "symbol": {
                            "category": "objective",
                            "identifier": "foo",
                            "reference": [
                              {
                                "uri": ""
                              }
                            ]
                          }
                        },
                        {
                          "type": "mcfunction:argument/minecraft:int_range",
                          "range": {
                            "start": 21,
                            "end": 24
                          },
                          "children": [
                            {
                              "type": "integer",
                              "range": {
                                "start": 21,
                                "end": 22
                              },
                              "value": 1
                            },
                            {
                              "type": "literal",
                              "range": {
                                "start": 22,
                                "end": 24
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
                        "type": "symbol",
                        "range": {
                          "start": 15,
                          "end": 18
                        },
                        "options": {
                          "category": "objective"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "objective",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      },
                      "sep": {
                        "start": 19,
                        "end": 20
                      },
                      "value": {
                        "type": "mcfunction:argument/minecraft:int_range",
                        "range": {
                          "start": 21,
                          "end": 24
                        },
                        "children": [
                          {
                            "type": "integer",
                            "range": {
                              "start": 21,
                              "end": 22
                            },
                            "value": 1
                          },
                          {
                            "type": "literal",
                            "range": {
                              "start": 22,
                              "end": 24
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
                        "start": 25,
                        "end": 26
                      }
                    }
                  ]
                },
                "end": {
                  "start": 29,
                  "end": 30
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 32
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 32
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
                    "end": 10
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 10
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 13,
                    "end": 28
                  },
                  "children": [
                    {
                      "type": "pair",
                      "range": {
                        "start": 15,
                        "end": 26
                      },
                      "children": [
                        {
                          "type": "symbol",
                          "range": {
                            "start": 15,
                            "end": 18
                          },
                          "options": {
                            "category": "objective"
                          },
                          "value": "foo",
                          "symbol": {
                            "category": "objective",
                            "identifier": "foo",
                            "reference": [
                              {
                                "uri": ""
                              }
                            ]
                          }
                        },
                        {
                          "type": "mcfunction:argument/minecraft:int_range",
                          "range": {
                            "start": 21,
                            "end": 24
                          },
                          "children": [
                            {
                              "type": "integer",
                              "range": {
                                "start": 21,
                                "end": 22
                              },
                              "value": 1
                            },
                            {
                              "type": "literal",
                              "range": {
                                "start": 22,
                                "end": 24
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
                        "type": "symbol",
                        "range": {
                          "start": 15,
                          "end": 18
                        },
                        "options": {
                          "category": "objective"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "objective",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      },
                      "sep": {
                        "start": 19,
                        "end": 20
                      },
                      "value": {
                        "type": "mcfunction:argument/minecraft:int_range",
                        "range": {
                          "start": 21,
                          "end": 24
                        },
                        "children": [
                          {
                            "type": "integer",
                            "range": {
                              "start": 21,
                              "end": 22
                            },
                            "value": 1
                          },
                          {
                            "type": "literal",
                            "range": {
                              "start": 22,
                              "end": 24
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
                        "start": 25,
                        "end": 26
                      }
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 10
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 10
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              "sep": {
                "start": 11,
                "end": 12
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 13,
                  "end": 28
                },
                "children": [
                  {
                    "type": "pair",
                    "range": {
                      "start": 15,
                      "end": 26
                    },
                    "children": [
                      {
                        "type": "symbol",
                        "range": {
                          "start": 15,
                          "end": 18
                        },
                        "options": {
                          "category": "objective"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "objective",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      },
                      {
                        "type": "mcfunction:argument/minecraft:int_range",
                        "range": {
                          "start": 21,
                          "end": 24
                        },
                        "children": [
                          {
                            "type": "integer",
                            "range": {
                              "start": 21,
                              "end": 22
                            },
                            "value": 1
                          },
                          {
                            "type": "literal",
                            "range": {
                              "start": 22,
                              "end": 24
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
                      "type": "symbol",
                      "range": {
                        "start": 15,
                        "end": 18
                      },
                      "options": {
                        "category": "objective"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "objective",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    },
                    "sep": {
                      "start": 19,
                      "end": 20
                    },
                    "value": {
                      "type": "mcfunction:argument/minecraft:int_range",
                      "range": {
                        "start": 21,
                        "end": 24
                      },
                      "children": [
                        {
                          "type": "integer",
                          "range": {
                            "start": 21,
                            "end": 22
                          },
                          "value": 1
                        },
                        {
                          "type": "literal",
                          "range": {
                            "start": 22,
                            "end": 24
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
                      "start": 25,
                      "end": 26
                    }
                  }
                ]
              },
              "end": {
                "start": 29,
                "end": 30
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
            "end": 32
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
                    "end": 10
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 10
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 13,
                    "end": 28
                  },
                  "children": [
                    {
                      "type": "pair",
                      "range": {
                        "start": 15,
                        "end": 26
                      },
                      "children": [
                        {
                          "type": "symbol",
                          "range": {
                            "start": 15,
                            "end": 18
                          },
                          "options": {
                            "category": "objective"
                          },
                          "value": "foo",
                          "symbol": {
                            "category": "objective",
                            "identifier": "foo",
                            "reference": [
                              {
                                "uri": ""
                              }
                            ]
                          }
                        },
                        {
                          "type": "mcfunction:argument/minecraft:int_range",
                          "range": {
                            "start": 21,
                            "end": 24
                          },
                          "children": [
                            {
                              "type": "integer",
                              "range": {
                                "start": 21,
                                "end": 22
                              },
                              "value": 1
                            },
                            {
                              "type": "literal",
                              "range": {
                                "start": 22,
                                "end": 24
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
                        "type": "symbol",
                        "range": {
                          "start": 15,
                          "end": 18
                        },
                        "options": {
                          "category": "objective"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "objective",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      },
                      "sep": {
                        "start": 19,
                        "end": 20
                      },
                      "value": {
                        "type": "mcfunction:argument/minecraft:int_range",
                        "range": {
                          "start": 21,
                          "end": 24
                        },
                        "children": [
                          {
                            "type": "integer",
                            "range": {
                              "start": 21,
                              "end": 22
                            },
                            "value": 1
                          },
                          {
                            "type": "literal",
                            "range": {
                              "start": 22,
                              "end": 24
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
                        "start": 25,
                        "end": 26
                      }
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 10
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 10
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              "sep": {
                "start": 11,
                "end": 12
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 13,
                  "end": 28
                },
                "children": [
                  {
                    "type": "pair",
                    "range": {
                      "start": 15,
                      "end": 26
                    },
                    "children": [
                      {
                        "type": "symbol",
                        "range": {
                          "start": 15,
                          "end": 18
                        },
                        "options": {
                          "category": "objective"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "objective",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      },
                      {
                        "type": "mcfunction:argument/minecraft:int_range",
                        "range": {
                          "start": 21,
                          "end": 24
                        },
                        "children": [
                          {
                            "type": "integer",
                            "range": {
                              "start": 21,
                              "end": 22
                            },
                            "value": 1
                          },
                          {
                            "type": "literal",
                            "range": {
                              "start": 22,
                              "end": 24
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
                      "type": "symbol",
                      "range": {
                        "start": 15,
                        "end": 18
                      },
                      "options": {
                        "category": "objective"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "objective",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    },
                    "sep": {
                      "start": 19,
                      "end": 20
                    },
                    "value": {
                      "type": "mcfunction:argument/minecraft:int_range",
                      "range": {
                        "start": 21,
                        "end": 24
                      },
                      "children": [
                        {
                          "type": "integer",
                          "range": {
                            "start": 21,
                            "end": 22
                          },
                          "value": 1
                        },
                        {
                          "type": "literal",
                          "range": {
                            "start": 22,
                            "end": 24
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
                      "start": 25,
                      "end": 26
                    }
                  }
                ]
              },
              "end": {
                "start": 29,
                "end": 30
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 32
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 32
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
                  "end": 10
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 10
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 13,
                  "end": 28
                },
                "children": [
                  {
                    "type": "pair",
                    "range": {
                      "start": 15,
                      "end": 26
                    },
                    "children": [
                      {
                        "type": "symbol",
                        "range": {
                          "start": 15,
                          "end": 18
                        },
                        "options": {
                          "category": "objective"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "objective",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      },
                      {
                        "type": "mcfunction:argument/minecraft:int_range",
                        "range": {
                          "start": 21,
                          "end": 24
                        },
                        "children": [
                          {
                            "type": "integer",
                            "range": {
                              "start": 21,
                              "end": 22
                            },
                            "value": 1
                          },
                          {
                            "type": "literal",
                            "range": {
                              "start": 22,
                              "end": 24
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
                      "type": "symbol",
                      "range": {
                        "start": 15,
                        "end": 18
                      },
                      "options": {
                        "category": "objective"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "objective",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    },
                    "sep": {
                      "start": 19,
                      "end": 20
                    },
                    "value": {
                      "type": "mcfunction:argument/minecraft:int_range",
                      "range": {
                        "start": 21,
                        "end": 24
                      },
                      "children": [
                        {
                          "type": "integer",
                          "range": {
                            "start": 21,
                            "end": 22
                          },
                          "value": 1
                        },
                        {
                          "type": "literal",
                          "range": {
                            "start": 22,
                            "end": 24
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
                      "start": 25,
                      "end": 26
                    }
                  }
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 10
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
              "value": "scores",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 10
                },
                "innerRange": {
                  "start": 0,
                  "end": 6
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 6
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
                "value": "scores"
              }
            },
            "sep": {
              "start": 11,
              "end": 12
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/scores",
              "range": {
                "start": 13,
                "end": 28
              },
              "children": [
                {
                  "type": "pair",
                  "range": {
                    "start": 15,
                    "end": 26
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 15,
                        "end": 18
                      },
                      "options": {
                        "category": "objective"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "objective",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    },
                    {
                      "type": "mcfunction:argument/minecraft:int_range",
                      "range": {
                        "start": 21,
                        "end": 24
                      },
                      "children": [
                        {
                          "type": "integer",
                          "range": {
                            "start": 21,
                            "end": 22
                          },
                          "value": 1
                        },
                        {
                          "type": "literal",
                          "range": {
                            "start": 22,
                            "end": 24
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
                    "type": "symbol",
                    "range": {
                      "start": 15,
                      "end": 18
                    },
                    "options": {
                      "category": "objective"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "objective",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  },
                  "sep": {
                    "start": 19,
                    "end": 20
                  },
                  "value": {
                    "type": "mcfunction:argument/minecraft:int_range",
                    "range": {
                      "start": 21,
                      "end": 24
                    },
                    "children": [
                      {
                        "type": "integer",
                        "range": {
                          "start": 21,
                          "end": 22
                        },
                        "value": 1
                      },
                      {
                        "type": "literal",
                        "range": {
                          "start": 22,
                          "end": 24
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
                    "start": 25,
                    "end": 26
                  }
                }
              ]
            },
            "end": {
              "start": 29,
              "end": 30
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
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ scores = { } , scores = { } , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 35
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
              "end": 35
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 18
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 10
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
                    "value": "scores",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 10
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 6
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
                      "value": "scores"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/scores",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "children": []
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 10
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 10
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                "sep": {
                  "start": 11,
                  "end": 12
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "children": []
                },
                "end": {
                  "start": 17,
                  "end": 18
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 19,
                  "end": 33
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 19,
                      "end": 25
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
                    "value": "scores",
                    "valueMap": {
                      "outerRange": {
                        "start": 19,
                        "end": 25
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 6
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 6
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
                      "value": "scores"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/scores",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "children": []
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 19,
                    "end": 25
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 19,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                "sep": {
                  "start": 26,
                  "end": 27
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "children": []
                },
                "end": {
                  "start": 32,
                  "end": 33
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 35
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 35
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 18
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 10
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 10
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "children": []
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 10
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 10
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              "sep": {
                "start": 11,
                "end": 12
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 13,
                  "end": 16
                },
                "children": []
              },
              "end": {
                "start": 17,
                "end": 18
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 19,
                "end": 33
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 19,
                    "end": 25
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 19,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "children": []
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 19,
                  "end": 25
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 19,
                    "end": 25
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              "sep": {
                "start": 26,
                "end": 27
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "children": []
              },
              "end": {
                "start": 32,
                "end": 33
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
            "end": 35
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 18
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 10
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 10
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "children": []
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 10
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 10
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              "sep": {
                "start": 11,
                "end": 12
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 13,
                  "end": 16
                },
                "children": []
              },
              "end": {
                "start": 17,
                "end": 18
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 19,
                "end": 33
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 19,
                    "end": 25
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
                  "value": "scores",
                  "valueMap": {
                    "outerRange": {
                      "start": 19,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 6
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 6
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
                    "value": "scores"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/scores",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "children": []
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 19,
                  "end": 25
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 19,
                    "end": 25
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              "sep": {
                "start": 26,
                "end": 27
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "children": []
              },
              "end": {
                "start": 32,
                "end": 33
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 35
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 35
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 18
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 10
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 10
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 13,
                  "end": 16
                },
                "children": []
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 10
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
              "value": "scores",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 10
                },
                "innerRange": {
                  "start": 0,
                  "end": 6
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 6
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
                "value": "scores"
              }
            },
            "sep": {
              "start": 11,
              "end": 12
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/scores",
              "range": {
                "start": 13,
                "end": 16
              },
              "children": []
            },
            "end": {
              "start": 17,
              "end": 18
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 19,
              "end": 33
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 19,
                  "end": 25
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
                "value": "scores",
                "valueMap": {
                  "outerRange": {
                    "start": 19,
                    "end": 25
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 6
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 6
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
                  "value": "scores"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/scores",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "children": []
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 19,
                "end": 25
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
              "value": "scores",
              "valueMap": {
                "outerRange": {
                  "start": 19,
                  "end": 25
                },
                "innerRange": {
                  "start": 0,
                  "end": 6
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 6
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
                "value": "scores"
              }
            },
            "sep": {
              "start": 26,
              "end": 27
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/scores",
              "range": {
                "start": 28,
                "end": 31
              },
              "children": []
            },
            "end": {
              "start": 32,
              "end": 33
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 19,
        "end": 25
      },
      "message": "Duplicate key “scores”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ sort = arbitrary , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 24
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
              "end": 24
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 22
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
                    "value": "sort",
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
                      "value": "sort"
                    }
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 20
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "arbitrary",
                    "valueMap": {
                      "outerRange": {
                        "start": 11,
                        "end": 20
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
                          "arbitrary",
                          "furthest",
                          "nearest",
                          "random"
                        ]
                      },
                      "value": "arbitrary"
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
                  "value": "sort",
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
                    "value": "sort"
                  }
                },
                "sep": {
                  "start": 9,
                  "end": 10
                },
                "value": {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "arbitrary",
                  "valueMap": {
                    "outerRange": {
                      "start": 11,
                      "end": 20
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": "arbitrary"
                  }
                },
                "end": {
                  "start": 21,
                  "end": 22
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 24
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 24
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 22
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
                  "value": "sort",
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
                    "value": "sort"
                  }
                },
                {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "arbitrary",
                  "valueMap": {
                    "outerRange": {
                      "start": 11,
                      "end": 20
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": "arbitrary"
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
                "value": "sort",
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
                  "value": "sort"
                }
              },
              "sep": {
                "start": 9,
                "end": 10
              },
              "value": {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 20
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "arbitrary",
                "valueMap": {
                  "outerRange": {
                    "start": 11,
                    "end": 20
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": "arbitrary"
                }
              },
              "end": {
                "start": 21,
                "end": 22
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
            "end": 24
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 22
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
                  "value": "sort",
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
                    "value": "sort"
                  }
                },
                {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "arbitrary",
                  "valueMap": {
                    "outerRange": {
                      "start": 11,
                      "end": 20
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": "arbitrary"
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
                "value": "sort",
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
                  "value": "sort"
                }
              },
              "sep": {
                "start": 9,
                "end": 10
              },
              "value": {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 20
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "arbitrary",
                "valueMap": {
                  "outerRange": {
                    "start": 11,
                    "end": 20
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": "arbitrary"
                }
              },
              "end": {
                "start": 21,
                "end": 22
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 24
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 24
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 22
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
                "value": "sort",
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
                  "value": "sort"
                }
              },
              {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 20
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "arbitrary",
                "valueMap": {
                  "outerRange": {
                    "start": 11,
                    "end": 20
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": "arbitrary"
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
              "value": "sort",
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
                "value": "sort"
              }
            },
            "sep": {
              "start": 9,
              "end": 10
            },
            "value": {
              "type": "string",
              "range": {
                "start": 11,
                "end": 20
              },
              "options": {
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "arbitrary",
              "valueMap": {
                "outerRange": {
                  "start": 11,
                  "end": 20
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
                    "arbitrary",
                    "furthest",
                    "nearest",
                    "random"
                  ]
                },
                "value": "arbitrary"
              }
            },
            "end": {
              "start": 21,
              "end": 22
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
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ tag = foo , tag = ! bar , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
                  "end": 15
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
                    "value": "tag",
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
                      "value": "tag"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 10,
                      "end": 13
                    },
                    "children": [
                      {
                        "type": "symbol",
                        "range": {
                          "start": 10,
                          "end": 13
                        },
                        "options": {
                          "category": "tag"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "tag",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "symbol",
                      "range": {
                        "start": 10,
                        "end": 13
                      },
                      "options": {
                        "category": "tag"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "tag",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
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
                  "value": "tag",
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
                    "value": "tag"
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
                    "end": 13
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 10,
                        "end": 13
                      },
                      "options": {
                        "category": "tag"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "tag",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 10,
                      "end": 13
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "tag",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
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
                  "end": 29
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 16,
                      "end": 19
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
                    "value": "tag",
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
                      "value": "tag"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 22,
                      "end": 27
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 22,
                          "end": 23
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
                        "type": "symbol",
                        "range": {
                          "start": 24,
                          "end": 27
                        },
                        "options": {
                          "category": "tag"
                        },
                        "value": "bar",
                        "symbol": {
                          "category": "tag",
                          "identifier": "bar",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "options": {
                        "category": "tag"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "tag",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 16,
                    "end": 19
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
                  "value": "tag",
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
                    "value": "tag"
                  }
                },
                "sep": {
                  "start": 20,
                  "end": 21
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 22,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 23
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
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "options": {
                        "category": "tag"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "tag",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "tag",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
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
                "end": 15
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
                  "value": "tag",
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
                    "value": "tag"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 10,
                    "end": 13
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 10,
                        "end": 13
                      },
                      "options": {
                        "category": "tag"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "tag",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 10,
                      "end": 13
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "tag",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
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
                "value": "tag",
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
                  "value": "tag"
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
                  "end": 13
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 10,
                      "end": 13
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "tag",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 10,
                    "end": 13
                  },
                  "options": {
                    "category": "tag"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "tag",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
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
                "end": 29
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 16,
                    "end": 19
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
                  "value": "tag",
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
                    "value": "tag"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 22,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 23
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
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "options": {
                        "category": "tag"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "tag",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "tag",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 16,
                  "end": 19
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
                "value": "tag",
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
                  "value": "tag"
                }
              },
              "sep": {
                "start": 20,
                "end": 21
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 22,
                  "end": 27
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 23
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
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "tag",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "options": {
                    "category": "tag"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "tag",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
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
                "end": 15
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
                  "value": "tag",
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
                    "value": "tag"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 10,
                    "end": 13
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 10,
                        "end": 13
                      },
                      "options": {
                        "category": "tag"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "tag",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 10,
                      "end": 13
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "tag",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
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
                "value": "tag",
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
                  "value": "tag"
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
                  "end": 13
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 10,
                      "end": 13
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "tag",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 10,
                    "end": 13
                  },
                  "options": {
                    "category": "tag"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "tag",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
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
                "end": 29
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 16,
                    "end": 19
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
                  "value": "tag",
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
                    "value": "tag"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 22,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 23
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
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "options": {
                        "category": "tag"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "tag",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "tag",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 16,
                  "end": 19
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
                "value": "tag",
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
                  "value": "tag"
                }
              },
              "sep": {
                "start": 20,
                "end": 21
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 22,
                  "end": 27
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 23
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
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "tag",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "options": {
                    "category": "tag"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "tag",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
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
              "end": 15
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
                "value": "tag",
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
                  "value": "tag"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 10,
                  "end": 13
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 10,
                      "end": 13
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "tag",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 10,
                    "end": 13
                  },
                  "options": {
                    "category": "tag"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "tag",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
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
              "value": "tag",
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
                "value": "tag"
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
                "end": 13
              },
              "children": [
                {
                  "type": "symbol",
                  "range": {
                    "start": 10,
                    "end": 13
                  },
                  "options": {
                    "category": "tag"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "tag",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              ],
              "inverted": false,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 10,
                  "end": 13
                },
                "options": {
                  "category": "tag"
                },
                "value": "foo",
                "symbol": {
                  "category": "tag",
                  "identifier": "foo",
                  "reference": [
                    {
                      "uri": ""
                    }
                  ]
                }
              }
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
              "end": 29
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 16,
                  "end": 19
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
                "value": "tag",
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
                  "value": "tag"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 22,
                  "end": 27
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 23
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
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "tag"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "tag",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "options": {
                    "category": "tag"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "tag",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 16,
                "end": 19
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
              "value": "tag",
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
                "value": "tag"
              }
            },
            "sep": {
              "start": 20,
              "end": 21
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 22,
                "end": 27
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 22,
                    "end": 23
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
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "options": {
                    "category": "tag"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "tag",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              ],
              "inverted": true,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "options": {
                  "category": "tag"
                },
                "value": "bar",
                "symbol": {
                  "category": "tag",
                  "identifier": "bar",
                  "reference": [
                    {
                      "uri": ""
                    }
                  ]
                }
              }
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
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ team = ! foo , team = ! bar , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 35
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
              "end": 35
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 18
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
                    "value": "team",
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
                      "value": "team"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 11,
                      "end": 16
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
                        "type": "symbol",
                        "range": {
                          "start": 13,
                          "end": 16
                        },
                        "options": {
                          "category": "team"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "team",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "symbol",
                      "range": {
                        "start": 13,
                        "end": 16
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "team",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
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
                  "value": "team",
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
                    "value": "team"
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
                    "end": 16
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
                      "type": "symbol",
                      "range": {
                        "start": 13,
                        "end": 16
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "team",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                },
                "end": {
                  "start": 17,
                  "end": 18
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 19,
                  "end": 33
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 19,
                      "end": 23
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
                    "value": "team",
                    "valueMap": {
                      "outerRange": {
                        "start": 19,
                        "end": 23
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
                      "value": "team"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 26,
                      "end": 31
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 26,
                          "end": 27
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
                        "type": "symbol",
                        "range": {
                          "start": 28,
                          "end": 31
                        },
                        "options": {
                          "category": "team"
                        },
                        "value": "bar",
                        "symbol": {
                          "category": "team",
                          "identifier": "bar",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "symbol",
                      "range": {
                        "start": 28,
                        "end": 31
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "team",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 19,
                    "end": 23
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
                  "value": "team",
                  "valueMap": {
                    "outerRange": {
                      "start": 19,
                      "end": 23
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
                    "value": "team"
                  }
                },
                "sep": {
                  "start": 24,
                  "end": 25
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 26,
                    "end": 31
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 26,
                        "end": 27
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
                      "type": "symbol",
                      "range": {
                        "start": 28,
                        "end": 31
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "team",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                },
                "end": {
                  "start": 32,
                  "end": 33
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 35
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 35
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 18
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
                  "value": "team",
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
                    "value": "team"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 16
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
                      "type": "symbol",
                      "range": {
                        "start": 13,
                        "end": 16
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "team",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
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
                "value": "team",
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
                  "value": "team"
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
                  "end": 16
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
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "team",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              },
              "end": {
                "start": 17,
                "end": 18
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 19,
                "end": 33
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 19,
                    "end": 23
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
                  "value": "team",
                  "valueMap": {
                    "outerRange": {
                      "start": 19,
                      "end": 23
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
                    "value": "team"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 26,
                    "end": 31
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 26,
                        "end": 27
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
                      "type": "symbol",
                      "range": {
                        "start": 28,
                        "end": 31
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "team",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 19,
                  "end": 23
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
                "value": "team",
                "valueMap": {
                  "outerRange": {
                    "start": 19,
                    "end": 23
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
                  "value": "team"
                }
              },
              "sep": {
                "start": 24,
                "end": 25
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 26,
                  "end": 31
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 26,
                      "end": 27
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
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "team",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              },
              "end": {
                "start": 32,
                "end": 33
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
            "end": 35
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 18
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
                  "value": "team",
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
                    "value": "team"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 16
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
                      "type": "symbol",
                      "range": {
                        "start": 13,
                        "end": 16
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "team",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
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
                "value": "team",
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
                  "value": "team"
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
                  "end": 16
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
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "team",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              },
              "end": {
                "start": 17,
                "end": 18
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 19,
                "end": 33
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 19,
                    "end": 23
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
                  "value": "team",
                  "valueMap": {
                    "outerRange": {
                      "start": 19,
                      "end": 23
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
                    "value": "team"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 26,
                    "end": 31
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 26,
                        "end": 27
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
                      "type": "symbol",
                      "range": {
                        "start": 28,
                        "end": 31
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "team",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 19,
                  "end": 23
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
                "value": "team",
                "valueMap": {
                  "outerRange": {
                    "start": 19,
                    "end": 23
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
                  "value": "team"
                }
              },
              "sep": {
                "start": 24,
                "end": 25
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 26,
                  "end": 31
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 26,
                      "end": 27
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
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "team",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              },
              "end": {
                "start": 32,
                "end": 33
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 35
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 35
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 18
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
                "value": "team",
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
                  "value": "team"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 16
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
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "team",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
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
              "value": "team",
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
                "value": "team"
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
                "end": 16
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
                  "type": "symbol",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "team",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              ],
              "inverted": true,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 13,
                  "end": 16
                },
                "options": {
                  "category": "team"
                },
                "value": "foo",
                "symbol": {
                  "category": "team",
                  "identifier": "foo",
                  "reference": [
                    {
                      "uri": ""
                    }
                  ]
                }
              }
            },
            "end": {
              "start": 17,
              "end": 18
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 19,
              "end": 33
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 19,
                  "end": 23
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
                "value": "team",
                "valueMap": {
                  "outerRange": {
                    "start": 19,
                    "end": 23
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
                  "value": "team"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 26,
                  "end": 31
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 26,
                      "end": 27
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
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "team",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 19,
                "end": 23
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
              "value": "team",
              "valueMap": {
                "outerRange": {
                  "start": 19,
                  "end": 23
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
                "value": "team"
              }
            },
            "sep": {
              "start": 24,
              "end": 25
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 26,
                "end": 31
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 26,
                    "end": 27
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
                  "type": "symbol",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "team",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              ],
              "inverted": true,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "options": {
                  "category": "team"
                },
                "value": "bar",
                "symbol": {
                  "category": "team",
                  "identifier": "bar",
                  "reference": [
                    {
                      "uri": ""
                    }
                  ]
                }
              }
            },
            "end": {
              "start": 32,
              "end": 33
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
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ team = foo , team = bar , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
                    "value": "team",
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
                      "value": "team"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 11,
                      "end": 14
                    },
                    "children": [
                      {
                        "type": "symbol",
                        "range": {
                          "start": 11,
                          "end": 14
                        },
                        "options": {
                          "category": "team"
                        },
                        "value": "foo",
                        "symbol": {
                          "category": "team",
                          "identifier": "foo",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "symbol",
                      "range": {
                        "start": 11,
                        "end": 14
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "team",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
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
                  "value": "team",
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
                    "value": "team"
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
                    "end": 14
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 11,
                        "end": 14
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "team",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 11,
                      "end": 14
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
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
                    "value": "team",
                    "valueMap": {
                      "outerRange": {
                        "start": 17,
                        "end": 21
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
                      "value": "team"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "children": [
                      {
                        "type": "symbol",
                        "range": {
                          "start": 24,
                          "end": 27
                        },
                        "options": {
                          "category": "team"
                        },
                        "value": "bar",
                        "symbol": {
                          "category": "team",
                          "identifier": "bar",
                          "reference": [
                            {
                              "uri": ""
                            }
                          ]
                        }
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "team",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 17,
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
                  "value": "team",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 21
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
                    "value": "team"
                  }
                },
                "sep": {
                  "start": 22,
                  "end": 23
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "team",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
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
                  "value": "team",
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
                    "value": "team"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 14
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 11,
                        "end": 14
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "team",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 11,
                      "end": 14
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
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
                "value": "team",
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
                  "value": "team"
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
                  "end": 14
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 11,
                      "end": 14
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 11,
                    "end": 14
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "team",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
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
                  "value": "team",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 21
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
                    "value": "team"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "team",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 17,
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
                "value": "team",
                "valueMap": {
                  "outerRange": {
                    "start": 17,
                    "end": 21
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
                  "value": "team"
                }
              },
              "sep": {
                "start": 22,
                "end": 23
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "team",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
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
                  "value": "team",
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
                    "value": "team"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 14
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 11,
                        "end": 14
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "foo",
                      "symbol": {
                        "category": "team",
                        "identifier": "foo",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 11,
                      "end": 14
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
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
                "value": "team",
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
                  "value": "team"
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
                  "end": 14
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 11,
                      "end": 14
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 11,
                    "end": 14
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "team",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
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
                  "value": "team",
                  "valueMap": {
                    "outerRange": {
                      "start": 17,
                      "end": 21
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
                    "value": "team"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "children": [
                    {
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "options": {
                        "category": "team"
                      },
                      "value": "bar",
                      "symbol": {
                        "category": "team",
                        "identifier": "bar",
                        "reference": [
                          {
                            "uri": ""
                          }
                        ]
                      }
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 17,
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
                "value": "team",
                "valueMap": {
                  "outerRange": {
                    "start": 17,
                    "end": 21
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
                  "value": "team"
                }
              },
              "sep": {
                "start": 22,
                "end": 23
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "team",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
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
                "value": "team",
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
                  "value": "team"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 14
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 11,
                      "end": 14
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "foo",
                    "symbol": {
                      "category": "team",
                      "identifier": "foo",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 11,
                    "end": 14
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "team",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
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
              "value": "team",
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
                "value": "team"
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
                "end": 14
              },
              "children": [
                {
                  "type": "symbol",
                  "range": {
                    "start": 11,
                    "end": 14
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "foo",
                  "symbol": {
                    "category": "team",
                    "identifier": "foo",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              ],
              "inverted": false,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 11,
                  "end": 14
                },
                "options": {
                  "category": "team"
                },
                "value": "foo",
                "symbol": {
                  "category": "team",
                  "identifier": "foo",
                  "reference": [
                    {
                      "uri": ""
                    }
                  ]
                }
              }
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
                "value": "team",
                "valueMap": {
                  "outerRange": {
                    "start": 17,
                    "end": 21
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
                  "value": "team"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "children": [
                  {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "options": {
                      "category": "team"
                    },
                    "value": "bar",
                    "symbol": {
                      "category": "team",
                      "identifier": "bar",
                      "reference": [
                        {
                          "uri": ""
                        }
                      ]
                    }
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "team",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 17,
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
              "value": "team",
              "valueMap": {
                "outerRange": {
                  "start": 17,
                  "end": 21
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
                "value": "team"
              }
            },
            "sep": {
              "start": 22,
              "end": 23
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 24,
                "end": 27
              },
              "children": [
                {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "options": {
                    "category": "team"
                  },
                  "value": "bar",
                  "symbol": {
                    "category": "team",
                    "identifier": "bar",
                    "reference": [
                      {
                        "uri": ""
                      }
                    ]
                  }
                }
              ],
              "inverted": false,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "options": {
                  "category": "team"
                },
                "value": "bar",
                "symbol": {
                  "category": "team",
                  "identifier": "bar",
                  "reference": [
                    {
                      "uri": ""
                    }
                  ]
                }
              }
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 17,
        "end": 21
      },
      "message": "Duplicate key “team”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ type = zombie ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
                  "end": 18
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
                    "value": "type",
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
                      "value": "type"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 11,
                          "end": 17
                        },
                        "options": {
                          "category": "entity_type",
                          "allowTag": true
                        },
                        "path": [
                          "zombie"
                        ]
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
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
                  "value": "type",
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
                    "value": "type"
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
                    "end": 17
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
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
                "end": 18
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
                  "value": "type",
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
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
                "value": "type",
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
                  "value": "type"
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
                  "end": 17
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
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
                "end": 18
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
                  "value": "type",
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
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
                "value": "type",
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
                  "value": "type"
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
                  "end": 17
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
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
              "end": 18
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
                "value": "type",
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
                  "value": "type"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 17
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
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
              "value": "type",
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
                "value": "type"
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
                "end": 17
              },
              "children": [
                {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 11,
                  "end": 17
                },
                "options": {
                  "category": "entity_type",
                  "allowTag": true
                },
                "path": [
                  "zombie"
                ]
              }
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 8
      },
      "message": "“type” is not applicable here",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ unknown = 1 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
                      "end": 11
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
                    "value": "unknown",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 11
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
                      "value": ""
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 11
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
                  "value": "unknown",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 11
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
                    "value": ""
                  }
                },
                "sep": {
                  "start": 12,
                  "end": 13
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
                    "end": 11
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
                  "value": "unknown",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 11
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
                    "value": ""
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 11
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
                "value": "unknown",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 11
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
                  "value": ""
                }
              },
              "sep": {
                "start": 12,
                "end": 13
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
                    "end": 11
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
                  "value": "unknown",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 11
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
                    "value": ""
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 11
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
                "value": "unknown",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 11
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
                  "value": ""
                }
              },
              "sep": {
                "start": 12,
                "end": 13
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
                  "end": 11
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
                "value": "unknown",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 11
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
                  "value": ""
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 11
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
              "value": "unknown",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 11
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
                "value": ""
              }
            },
            "sep": {
              "start": 12,
              "end": 13
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “advancements”, “x_rotation”, “y_rotation”, “predicate”, “distance”, “gamemode”, “scores”, “level”, “limit”, “name”, “sort”, “team”, “type”, “nbt”, “tag”, “dx”, “dy”, “dz”, “x”, “y”, or “z”",
      "severity": 3
    },
    {
      "range": {
        "start": 14,
        "end": 16
      },
      "message": "Expected a value",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ x = 0.0 , x = 0.0 , dz = 0.0, dz = 0.0 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 46
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
              "end": 46
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 13
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 5
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
                    "value": "x",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 5
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 1
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 1
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
                      "value": "x"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 8,
                      "end": 11
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 5
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 5
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                "sep": {
                  "start": 6,
                  "end": 7
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "value": 0
                },
                "end": {
                  "start": 12,
                  "end": 13
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 14,
                  "end": 23
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 14,
                      "end": 15
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
                    "value": "x",
                    "valueMap": {
                      "outerRange": {
                        "start": 14,
                        "end": 15
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 1
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 1
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
                      "value": "x"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 18,
                      "end": 21
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 14,
                    "end": 15
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 15
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                "sep": {
                  "start": 16,
                  "end": 17
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 18,
                    "end": 21
                  },
                  "value": 0
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
                  "end": 33
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 24,
                      "end": 26
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
                    "value": "dz",
                    "valueMap": {
                      "outerRange": {
                        "start": 24,
                        "end": 26
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 2
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 2
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
                      "value": "dz"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 29,
                      "end": 32
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 26
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 26
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                "sep": {
                  "start": 27,
                  "end": 28
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 29,
                    "end": 32
                  },
                  "value": 0
                },
                "end": {
                  "start": 32,
                  "end": 33
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 34,
                  "end": 44
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 34,
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
                    "value": "dz",
                    "valueMap": {
                      "outerRange": {
                        "start": 34,
                        "end": 36
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 2
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 2
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
                      "value": "dz"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 39,
                      "end": 42
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 34,
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                "sep": {
                  "start": 37,
                  "end": 38
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 39,
                    "end": 42
                  },
                  "value": 0
                },
                "end": {
                  "start": 43,
                  "end": 44
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 46
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 46
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 13
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 5
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 5
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 5
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 5
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              "sep": {
                "start": 6,
                "end": 7
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "value": 0
              },
              "end": {
                "start": 12,
                "end": 13
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 14,
                "end": 23
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 14,
                    "end": 15
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 15
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 18,
                    "end": 21
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 14,
                  "end": 15
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 14,
                    "end": 15
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              "sep": {
                "start": 16,
                "end": 17
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 18,
                  "end": 21
                },
                "value": 0
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
                "end": 33
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 26
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 26
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 29,
                    "end": 32
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 26
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 26
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              "sep": {
                "start": 27,
                "end": 28
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 29,
                  "end": 32
                },
                "value": 0
              },
              "end": {
                "start": 32,
                "end": 33
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 34,
                "end": 44
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 34,
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 39,
                    "end": 42
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 34,
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              "sep": {
                "start": 37,
                "end": 38
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 39,
                  "end": 42
                },
                "value": 0
              },
              "end": {
                "start": 43,
                "end": 44
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
            "end": 46
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 13
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 5
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 5
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 5
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 5
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              "sep": {
                "start": 6,
                "end": 7
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "value": 0
              },
              "end": {
                "start": 12,
                "end": 13
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 14,
                "end": 23
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 14,
                    "end": 15
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 15
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 18,
                    "end": 21
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 14,
                  "end": 15
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 14,
                    "end": 15
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              "sep": {
                "start": 16,
                "end": 17
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 18,
                  "end": 21
                },
                "value": 0
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
                "end": 33
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 26
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 26
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 29,
                    "end": 32
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 26
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 26
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              "sep": {
                "start": 27,
                "end": 28
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 29,
                  "end": 32
                },
                "value": 0
              },
              "end": {
                "start": 32,
                "end": 33
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 34,
                "end": 44
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 34,
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 39,
                    "end": 42
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 34,
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              "sep": {
                "start": 37,
                "end": 38
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 39,
                  "end": 42
                },
                "value": 0
              },
              "end": {
                "start": 43,
                "end": 44
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 46
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 46
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 13
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 5
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 5
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 5
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
              "value": "x",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 5
                },
                "innerRange": {
                  "start": 0,
                  "end": 1
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 1
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
                "value": "x"
              }
            },
            "sep": {
              "start": 6,
              "end": 7
            },
            "value": {
              "type": "float",
              "range": {
                "start": 8,
                "end": 11
              },
              "value": 0
            },
            "end": {
              "start": 12,
              "end": 13
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 14,
              "end": 23
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 14,
                  "end": 15
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 14,
                    "end": 15
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 18,
                  "end": 21
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 14,
                "end": 15
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
              "value": "x",
              "valueMap": {
                "outerRange": {
                  "start": 14,
                  "end": 15
                },
                "innerRange": {
                  "start": 0,
                  "end": 1
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 1
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
                "value": "x"
              }
            },
            "sep": {
              "start": 16,
              "end": 17
            },
            "value": {
              "type": "float",
              "range": {
                "start": 18,
                "end": 21
              },
              "value": 0
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
              "end": 33
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 26
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 26
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 29,
                  "end": 32
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 24,
                "end": 26
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
              "value": "dz",
              "valueMap": {
                "outerRange": {
                  "start": 24,
                  "end": 26
                },
                "innerRange": {
                  "start": 0,
                  "end": 2
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 2
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
                "value": "dz"
              }
            },
            "sep": {
              "start": 27,
              "end": 28
            },
            "value": {
              "type": "float",
              "range": {
                "start": 29,
                "end": 32
              },
              "value": 0
            },
            "end": {
              "start": 32,
              "end": 33
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 34,
              "end": 44
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 34,
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 39,
                  "end": 42
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 34,
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
              "value": "dz",
              "valueMap": {
                "outerRange": {
                  "start": 34,
                  "end": 36
                },
                "innerRange": {
                  "start": 0,
                  "end": 2
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 2
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
                "value": "dz"
              }
            },
            "sep": {
              "start": 37,
              "end": 38
            },
            "value": {
              "type": "float",
              "range": {
                "start": 39,
                "end": 42
              },
              "value": 0
            },
            "end": {
              "start": 43,
              "end": 44
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 14,
        "end": 15
      },
      "message": "Duplicate key “x”",
      "severity": 3
    },
    {
      "range": {
        "start": 34,
        "end": 36
      },
      "message": "Duplicate key “dz”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ x = 0.0 , y = 0.0 , z = 0.0 , dx = 0.0 , dy = 0.0 , dz = 0.0 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 68
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
              "end": 68
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 13
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 5
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
                    "value": "x",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 5
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 1
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 1
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
                      "value": "x"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 8,
                      "end": 11
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 5
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 5
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                "sep": {
                  "start": 6,
                  "end": 7
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "value": 0
                },
                "end": {
                  "start": 12,
                  "end": 13
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 14,
                  "end": 23
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 14,
                      "end": 15
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
                    "value": "y",
                    "valueMap": {
                      "outerRange": {
                        "start": 14,
                        "end": 15
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 1
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 1
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
                      "value": "y"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 18,
                      "end": 21
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 14,
                    "end": 15
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
                  "value": "y",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 15
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "y"
                  }
                },
                "sep": {
                  "start": 16,
                  "end": 17
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 18,
                    "end": 21
                  },
                  "value": 0
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
                  "end": 33
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 24,
                      "end": 25
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
                    "value": "z",
                    "valueMap": {
                      "outerRange": {
                        "start": 24,
                        "end": 25
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 1
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 1
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
                      "value": "z"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 25
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
                  "value": "z",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "z"
                  }
                },
                "sep": {
                  "start": 26,
                  "end": 27
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "value": 0
                },
                "end": {
                  "start": 32,
                  "end": 33
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 34,
                  "end": 44
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 34,
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
                    "value": "dx",
                    "valueMap": {
                      "outerRange": {
                        "start": 34,
                        "end": 36
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 2
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 2
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
                      "value": "dx"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 39,
                      "end": 42
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 34,
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
                  "value": "dx",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dx"
                  }
                },
                "sep": {
                  "start": 37,
                  "end": 38
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 39,
                    "end": 42
                  },
                  "value": 0
                },
                "end": {
                  "start": 43,
                  "end": 44
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 45,
                  "end": 55
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 45,
                      "end": 47
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
                    "value": "dy",
                    "valueMap": {
                      "outerRange": {
                        "start": 45,
                        "end": 47
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 2
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 2
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
                      "value": "dy"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 50,
                      "end": 53
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 45,
                    "end": 47
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
                  "value": "dy",
                  "valueMap": {
                    "outerRange": {
                      "start": 45,
                      "end": 47
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dy"
                  }
                },
                "sep": {
                  "start": 48,
                  "end": 49
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 50,
                    "end": 53
                  },
                  "value": 0
                },
                "end": {
                  "start": 54,
                  "end": 55
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 56,
                  "end": 66
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 56,
                      "end": 58
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
                    "value": "dz",
                    "valueMap": {
                      "outerRange": {
                        "start": 56,
                        "end": 58
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 2
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 2
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
                      "value": "dz"
                    }
                  },
                  {
                    "type": "float",
                    "range": {
                      "start": 61,
                      "end": 64
                    },
                    "value": 0
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 56,
                    "end": 58
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 56,
                      "end": 58
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                "sep": {
                  "start": 59,
                  "end": 60
                },
                "value": {
                  "type": "float",
                  "range": {
                    "start": 61,
                    "end": 64
                  },
                  "value": 0
                },
                "end": {
                  "start": 65,
                  "end": 66
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 68
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 68
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 13
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 5
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 5
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 5
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 5
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              "sep": {
                "start": 6,
                "end": 7
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "value": 0
              },
              "end": {
                "start": 12,
                "end": 13
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 14,
                "end": 23
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 14,
                    "end": 15
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
                  "value": "y",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 15
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "y"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 18,
                    "end": 21
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 14,
                  "end": 15
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
                "value": "y",
                "valueMap": {
                  "outerRange": {
                    "start": 14,
                    "end": 15
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "y"
                }
              },
              "sep": {
                "start": 16,
                "end": 17
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 18,
                  "end": 21
                },
                "value": 0
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
                "end": 33
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 25
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
                  "value": "z",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "z"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 25
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
                "value": "z",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 25
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "z"
                }
              },
              "sep": {
                "start": 26,
                "end": 27
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": 0
              },
              "end": {
                "start": 32,
                "end": 33
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 34,
                "end": 44
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 34,
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
                  "value": "dx",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dx"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 39,
                    "end": 42
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 34,
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
                "value": "dx",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dx"
                }
              },
              "sep": {
                "start": 37,
                "end": 38
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 39,
                  "end": 42
                },
                "value": 0
              },
              "end": {
                "start": 43,
                "end": 44
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 45,
                "end": 55
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 45,
                    "end": 47
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
                  "value": "dy",
                  "valueMap": {
                    "outerRange": {
                      "start": 45,
                      "end": 47
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dy"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 50,
                    "end": 53
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 45,
                  "end": 47
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
                "value": "dy",
                "valueMap": {
                  "outerRange": {
                    "start": 45,
                    "end": 47
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dy"
                }
              },
              "sep": {
                "start": 48,
                "end": 49
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 50,
                  "end": 53
                },
                "value": 0
              },
              "end": {
                "start": 54,
                "end": 55
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 56,
                "end": 66
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 56,
                    "end": 58
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 56,
                      "end": 58
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 61,
                    "end": 64
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 56,
                  "end": 58
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 56,
                    "end": 58
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              "sep": {
                "start": 59,
                "end": 60
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 61,
                  "end": 64
                },
                "value": 0
              },
              "end": {
                "start": 65,
                "end": 66
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
            "end": 68
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 13
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 5
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
                  "value": "x",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 5
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "x"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 5
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 5
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              "sep": {
                "start": 6,
                "end": 7
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "value": 0
              },
              "end": {
                "start": 12,
                "end": 13
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 14,
                "end": 23
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 14,
                    "end": 15
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
                  "value": "y",
                  "valueMap": {
                    "outerRange": {
                      "start": 14,
                      "end": 15
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "y"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 18,
                    "end": 21
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 14,
                  "end": 15
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
                "value": "y",
                "valueMap": {
                  "outerRange": {
                    "start": 14,
                    "end": 15
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "y"
                }
              },
              "sep": {
                "start": 16,
                "end": 17
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 18,
                  "end": 21
                },
                "value": 0
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
                "end": 33
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 25
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
                  "value": "z",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 25
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 1
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 1
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
                    "value": "z"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 25
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
                "value": "z",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 25
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "z"
                }
              },
              "sep": {
                "start": 26,
                "end": 27
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": 0
              },
              "end": {
                "start": 32,
                "end": 33
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 34,
                "end": 44
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 34,
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
                  "value": "dx",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 36
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dx"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 39,
                    "end": 42
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 34,
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
                "value": "dx",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dx"
                }
              },
              "sep": {
                "start": 37,
                "end": 38
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 39,
                  "end": 42
                },
                "value": 0
              },
              "end": {
                "start": 43,
                "end": 44
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 45,
                "end": 55
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 45,
                    "end": 47
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
                  "value": "dy",
                  "valueMap": {
                    "outerRange": {
                      "start": 45,
                      "end": 47
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dy"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 50,
                    "end": 53
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 45,
                  "end": 47
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
                "value": "dy",
                "valueMap": {
                  "outerRange": {
                    "start": 45,
                    "end": 47
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dy"
                }
              },
              "sep": {
                "start": 48,
                "end": 49
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 50,
                  "end": 53
                },
                "value": 0
              },
              "end": {
                "start": 54,
                "end": 55
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 56,
                "end": 66
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 56,
                    "end": 58
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
                  "value": "dz",
                  "valueMap": {
                    "outerRange": {
                      "start": 56,
                      "end": 58
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 2
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 2
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
                    "value": "dz"
                  }
                },
                {
                  "type": "float",
                  "range": {
                    "start": 61,
                    "end": 64
                  },
                  "value": 0
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 56,
                  "end": 58
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 56,
                    "end": 58
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              "sep": {
                "start": 59,
                "end": 60
              },
              "value": {
                "type": "float",
                "range": {
                  "start": 61,
                  "end": 64
                },
                "value": 0
              },
              "end": {
                "start": 65,
                "end": 66
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 68
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 68
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 13
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 5
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
                "value": "x",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 5
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "x"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 5
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
              "value": "x",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 5
                },
                "innerRange": {
                  "start": 0,
                  "end": 1
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 1
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
                "value": "x"
              }
            },
            "sep": {
              "start": 6,
              "end": 7
            },
            "value": {
              "type": "float",
              "range": {
                "start": 8,
                "end": 11
              },
              "value": 0
            },
            "end": {
              "start": 12,
              "end": 13
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 14,
              "end": 23
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 14,
                  "end": 15
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
                "value": "y",
                "valueMap": {
                  "outerRange": {
                    "start": 14,
                    "end": 15
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "y"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 18,
                  "end": 21
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 14,
                "end": 15
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
              "value": "y",
              "valueMap": {
                "outerRange": {
                  "start": 14,
                  "end": 15
                },
                "innerRange": {
                  "start": 0,
                  "end": 1
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 1
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
                "value": "y"
              }
            },
            "sep": {
              "start": 16,
              "end": 17
            },
            "value": {
              "type": "float",
              "range": {
                "start": 18,
                "end": 21
              },
              "value": 0
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
              "end": 33
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 25
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
                "value": "z",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 25
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 1
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 1
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
                  "value": "z"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 24,
                "end": 25
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
              "value": "z",
              "valueMap": {
                "outerRange": {
                  "start": 24,
                  "end": 25
                },
                "innerRange": {
                  "start": 0,
                  "end": 1
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 1
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
                "value": "z"
              }
            },
            "sep": {
              "start": 26,
              "end": 27
            },
            "value": {
              "type": "float",
              "range": {
                "start": 28,
                "end": 31
              },
              "value": 0
            },
            "end": {
              "start": 32,
              "end": 33
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 34,
              "end": 44
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 34,
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
                "value": "dx",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 36
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dx"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 39,
                  "end": 42
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 34,
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
              "value": "dx",
              "valueMap": {
                "outerRange": {
                  "start": 34,
                  "end": 36
                },
                "innerRange": {
                  "start": 0,
                  "end": 2
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 2
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
                "value": "dx"
              }
            },
            "sep": {
              "start": 37,
              "end": 38
            },
            "value": {
              "type": "float",
              "range": {
                "start": 39,
                "end": 42
              },
              "value": 0
            },
            "end": {
              "start": 43,
              "end": 44
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 45,
              "end": 55
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 45,
                  "end": 47
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
                "value": "dy",
                "valueMap": {
                  "outerRange": {
                    "start": 45,
                    "end": 47
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dy"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 50,
                  "end": 53
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 45,
                "end": 47
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
              "value": "dy",
              "valueMap": {
                "outerRange": {
                  "start": 45,
                  "end": 47
                },
                "innerRange": {
                  "start": 0,
                  "end": 2
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 2
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
                "value": "dy"
              }
            },
            "sep": {
              "start": 48,
              "end": 49
            },
            "value": {
              "type": "float",
              "range": {
                "start": 50,
                "end": 53
              },
              "value": 0
            },
            "end": {
              "start": 54,
              "end": 55
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 56,
              "end": 66
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 56,
                  "end": 58
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
                "value": "dz",
                "valueMap": {
                  "outerRange": {
                    "start": 56,
                    "end": 58
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 2
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 2
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
                  "value": "dz"
                }
              },
              {
                "type": "float",
                "range": {
                  "start": 61,
                  "end": 64
                },
                "value": 0
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 56,
                "end": 58
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
              "value": "dz",
              "valueMap": {
                "outerRange": {
                  "start": 56,
                  "end": 58
                },
                "innerRange": {
                  "start": 0,
                  "end": 2
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 2
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
                "value": "dz"
              }
            },
            "sep": {
              "start": 59,
              "end": 60
            },
            "value": {
              "type": "float",
              "range": {
                "start": 61,
                "end": 64
              },
              "value": 0
            },
            "end": {
              "start": 65,
              "end": 66
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
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ x_rotation = 179.9..-179.9 ,  x_rotation = 179.9..-179.9 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 64
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
              "end": 64
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 32
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 14
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
                    "value": "x_rotation",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 14
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 10
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 10
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
                      "value": "x_rotation"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:float_range",
                    "range": {
                      "start": 17,
                      "end": 30
                    },
                    "children": [
                      {
                        "type": "float",
                        "range": {
                          "start": 17,
                          "end": 22
                        },
                        "value": 179.9
                      },
                      {
                        "type": "literal",
                        "range": {
                          "start": 22,
                          "end": 24
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
                          "start": 24,
                          "end": 30
                        },
                        "value": -179.9
                      }
                    ],
                    "name": "",
                    "value": [
                      179.9,
                      -179.9
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 14
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 14
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                "sep": {
                  "start": 15,
                  "end": 16
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 17,
                    "end": 30
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 22
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 24
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
                        "start": 24,
                        "end": 30
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                },
                "end": {
                  "start": 31,
                  "end": 32
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 34,
                  "end": 62
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 34,
                      "end": 44
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
                    "value": "x_rotation",
                    "valueMap": {
                      "outerRange": {
                        "start": 34,
                        "end": 44
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 10
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 10
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
                      "value": "x_rotation"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:float_range",
                    "range": {
                      "start": 47,
                      "end": 60
                    },
                    "children": [
                      {
                        "type": "float",
                        "range": {
                          "start": 47,
                          "end": 52
                        },
                        "value": 179.9
                      },
                      {
                        "type": "literal",
                        "range": {
                          "start": 52,
                          "end": 54
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
                          "start": 54,
                          "end": 60
                        },
                        "value": -179.9
                      }
                    ],
                    "name": "",
                    "value": [
                      179.9,
                      -179.9
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 34,
                    "end": 44
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                "sep": {
                  "start": 45,
                  "end": 46
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 47,
                    "end": 60
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 47,
                        "end": 52
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 52,
                        "end": 54
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
                        "start": 54,
                        "end": 60
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                },
                "end": {
                  "start": 61,
                  "end": 62
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 64
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 64
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 32
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 14
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 14
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 17,
                    "end": 30
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 22
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 24
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
                        "start": 24,
                        "end": 30
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 14
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 14
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              "sep": {
                "start": 15,
                "end": 16
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 17,
                  "end": 30
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 22
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 24
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
                      "start": 24,
                      "end": 30
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              },
              "end": {
                "start": 31,
                "end": 32
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 34,
                "end": 62
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 34,
                    "end": 44
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 47,
                    "end": 60
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 47,
                        "end": 52
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 52,
                        "end": 54
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
                        "start": 54,
                        "end": 60
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 34,
                  "end": 44
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 44
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              "sep": {
                "start": 45,
                "end": 46
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 47,
                  "end": 60
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 47,
                      "end": 52
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 52,
                      "end": 54
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
                      "start": 54,
                      "end": 60
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              },
              "end": {
                "start": 61,
                "end": 62
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
            "end": 64
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 32
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 14
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 14
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 17,
                    "end": 30
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 22
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 24
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
                        "start": 24,
                        "end": 30
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 14
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 14
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              "sep": {
                "start": 15,
                "end": 16
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 17,
                  "end": 30
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 22
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 24
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
                      "start": 24,
                      "end": 30
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              },
              "end": {
                "start": 31,
                "end": 32
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 34,
                "end": 62
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 34,
                    "end": 44
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 47,
                    "end": 60
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 47,
                        "end": 52
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 52,
                        "end": 54
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
                        "start": 54,
                        "end": 60
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 34,
                  "end": 44
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 44
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              "sep": {
                "start": 45,
                "end": 46
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 47,
                  "end": 60
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 47,
                      "end": 52
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 52,
                      "end": 54
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
                      "start": 54,
                      "end": 60
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              },
              "end": {
                "start": 61,
                "end": 62
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 64
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 64
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 32
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 14
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 14
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 17,
                  "end": 30
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 22
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 24
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
                      "start": 24,
                      "end": 30
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 14
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
              "value": "x_rotation",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 14
                },
                "innerRange": {
                  "start": 0,
                  "end": 10
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 10
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
                "value": "x_rotation"
              }
            },
            "sep": {
              "start": 15,
              "end": 16
            },
            "value": {
              "type": "mcfunction:argument/minecraft:float_range",
              "range": {
                "start": 17,
                "end": 30
              },
              "children": [
                {
                  "type": "float",
                  "range": {
                    "start": 17,
                    "end": 22
                  },
                  "value": 179.9
                },
                {
                  "type": "literal",
                  "range": {
                    "start": 22,
                    "end": 24
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
                    "start": 24,
                    "end": 30
                  },
                  "value": -179.9
                }
              ],
              "name": "",
              "value": [
                179.9,
                -179.9
              ]
            },
            "end": {
              "start": 31,
              "end": 32
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 34,
              "end": 62
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 34,
                  "end": 44
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 44
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 47,
                  "end": 60
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 47,
                      "end": 52
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 52,
                      "end": 54
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
                      "start": 54,
                      "end": 60
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 34,
                "end": 44
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
              "value": "x_rotation",
              "valueMap": {
                "outerRange": {
                  "start": 34,
                  "end": 44
                },
                "innerRange": {
                  "start": 0,
                  "end": 10
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 10
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
                "value": "x_rotation"
              }
            },
            "sep": {
              "start": 45,
              "end": 46
            },
            "value": {
              "type": "mcfunction:argument/minecraft:float_range",
              "range": {
                "start": 47,
                "end": 60
              },
              "children": [
                {
                  "type": "float",
                  "range": {
                    "start": 47,
                    "end": 52
                  },
                  "value": 179.9
                },
                {
                  "type": "literal",
                  "range": {
                    "start": 52,
                    "end": 54
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
                    "start": 54,
                    "end": 60
                  },
                  "value": -179.9
                }
              ],
              "name": "",
              "value": [
                179.9,
                -179.9
              ]
            },
            "end": {
              "start": 61,
              "end": 62
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 34,
        "end": 44
      },
      "message": "Duplicate key “x_rotation”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ x_rotation = 179.9..-179.9 ,  y_rotation = 179.9..-179.9 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 64
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
              "end": 64
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 4,
                  "end": 32
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 4,
                      "end": 14
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
                    "value": "x_rotation",
                    "valueMap": {
                      "outerRange": {
                        "start": 4,
                        "end": 14
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 10
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 10
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
                      "value": "x_rotation"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:float_range",
                    "range": {
                      "start": 17,
                      "end": 30
                    },
                    "children": [
                      {
                        "type": "float",
                        "range": {
                          "start": 17,
                          "end": 22
                        },
                        "value": 179.9
                      },
                      {
                        "type": "literal",
                        "range": {
                          "start": 22,
                          "end": 24
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
                          "start": 24,
                          "end": 30
                        },
                        "value": -179.9
                      }
                    ],
                    "name": "",
                    "value": [
                      179.9,
                      -179.9
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 14
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 14
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                "sep": {
                  "start": 15,
                  "end": 16
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 17,
                    "end": 30
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 22
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 24
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
                        "start": 24,
                        "end": 30
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                },
                "end": {
                  "start": 31,
                  "end": 32
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 34,
                  "end": 62
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 34,
                      "end": 44
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
                    "value": "y_rotation",
                    "valueMap": {
                      "outerRange": {
                        "start": 34,
                        "end": 44
                      },
                      "innerRange": {
                        "start": 0,
                        "end": 10
                      },
                      "pairs": []
                    },
                    "valueNode": {
                      "type": "literal",
                      "range": {
                        "start": 0,
                        "end": 10
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
                      "value": "y_rotation"
                    }
                  },
                  {
                    "type": "mcfunction:argument/minecraft:float_range",
                    "range": {
                      "start": 47,
                      "end": 60
                    },
                    "children": [
                      {
                        "type": "float",
                        "range": {
                          "start": 47,
                          "end": 52
                        },
                        "value": 179.9
                      },
                      {
                        "type": "literal",
                        "range": {
                          "start": 52,
                          "end": 54
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
                          "start": 54,
                          "end": 60
                        },
                        "value": -179.9
                      }
                    ],
                    "name": "",
                    "value": [
                      179.9,
                      -179.9
                    ]
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 34,
                    "end": 44
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
                  "value": "y_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "y_rotation"
                  }
                },
                "sep": {
                  "start": 45,
                  "end": 46
                },
                "value": {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 47,
                    "end": 60
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 47,
                        "end": 52
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 52,
                        "end": 54
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
                        "start": 54,
                        "end": 60
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                },
                "end": {
                  "start": 61,
                  "end": 62
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 64
        },
        "type": "mcfunction:entity_selector",
        "variable": "a",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 64
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 32
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 14
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 14
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 17,
                    "end": 30
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 22
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 24
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
                        "start": 24,
                        "end": 30
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 14
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 14
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              "sep": {
                "start": 15,
                "end": 16
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 17,
                  "end": 30
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 22
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 24
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
                      "start": 24,
                      "end": 30
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              },
              "end": {
                "start": 31,
                "end": 32
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 34,
                "end": 62
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 34,
                    "end": 44
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
                  "value": "y_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "y_rotation"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 47,
                    "end": 60
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 47,
                        "end": 52
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 52,
                        "end": 54
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
                        "start": 54,
                        "end": 60
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 34,
                  "end": 44
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
                "value": "y_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 44
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "y_rotation"
                }
              },
              "sep": {
                "start": 45,
                "end": 46
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 47,
                  "end": 60
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 47,
                      "end": 52
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 52,
                      "end": 54
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
                      "start": 54,
                      "end": 60
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              },
              "end": {
                "start": 61,
                "end": 62
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
            "end": 64
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 32
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 4,
                    "end": 14
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
                  "value": "x_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 4,
                      "end": 14
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "x_rotation"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 17,
                    "end": 30
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 17,
                        "end": 22
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 24
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
                        "start": 24,
                        "end": 30
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 14
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 14
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              "sep": {
                "start": 15,
                "end": 16
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 17,
                  "end": 30
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 22
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 24
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
                      "start": 24,
                      "end": 30
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              },
              "end": {
                "start": 31,
                "end": 32
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 34,
                "end": 62
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 34,
                    "end": 44
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
                  "value": "y_rotation",
                  "valueMap": {
                    "outerRange": {
                      "start": 34,
                      "end": 44
                    },
                    "innerRange": {
                      "start": 0,
                      "end": 10
                    },
                    "pairs": []
                  },
                  "valueNode": {
                    "type": "literal",
                    "range": {
                      "start": 0,
                      "end": 10
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
                    "value": "y_rotation"
                  }
                },
                {
                  "type": "mcfunction:argument/minecraft:float_range",
                  "range": {
                    "start": 47,
                    "end": 60
                  },
                  "children": [
                    {
                      "type": "float",
                      "range": {
                        "start": 47,
                        "end": 52
                      },
                      "value": 179.9
                    },
                    {
                      "type": "literal",
                      "range": {
                        "start": 52,
                        "end": 54
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
                        "start": 54,
                        "end": 60
                      },
                      "value": -179.9
                    }
                  ],
                  "name": "",
                  "value": [
                    179.9,
                    -179.9
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 34,
                  "end": 44
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
                "value": "y_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 44
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "y_rotation"
                }
              },
              "sep": {
                "start": 45,
                "end": 46
              },
              "value": {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 47,
                  "end": 60
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 47,
                      "end": 52
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 52,
                      "end": 54
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
                      "start": 54,
                      "end": 60
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              },
              "end": {
                "start": 61,
                "end": 62
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 64
      },
      "type": "mcfunction:entity_selector",
      "variable": "a",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 64
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 4,
              "end": 32
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 14
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
                "value": "x_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 4,
                    "end": 14
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "x_rotation"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 17,
                  "end": 30
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 17,
                      "end": 22
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 24
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
                      "start": 24,
                      "end": 30
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 14
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
              "value": "x_rotation",
              "valueMap": {
                "outerRange": {
                  "start": 4,
                  "end": 14
                },
                "innerRange": {
                  "start": 0,
                  "end": 10
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 10
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
                "value": "x_rotation"
              }
            },
            "sep": {
              "start": 15,
              "end": 16
            },
            "value": {
              "type": "mcfunction:argument/minecraft:float_range",
              "range": {
                "start": 17,
                "end": 30
              },
              "children": [
                {
                  "type": "float",
                  "range": {
                    "start": 17,
                    "end": 22
                  },
                  "value": 179.9
                },
                {
                  "type": "literal",
                  "range": {
                    "start": 22,
                    "end": 24
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
                    "start": 24,
                    "end": 30
                  },
                  "value": -179.9
                }
              ],
              "name": "",
              "value": [
                179.9,
                -179.9
              ]
            },
            "end": {
              "start": 31,
              "end": 32
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 34,
              "end": 62
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 34,
                  "end": 44
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
                "value": "y_rotation",
                "valueMap": {
                  "outerRange": {
                    "start": 34,
                    "end": 44
                  },
                  "innerRange": {
                    "start": 0,
                    "end": 10
                  },
                  "pairs": []
                },
                "valueNode": {
                  "type": "literal",
                  "range": {
                    "start": 0,
                    "end": 10
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
                  "value": "y_rotation"
                }
              },
              {
                "type": "mcfunction:argument/minecraft:float_range",
                "range": {
                  "start": 47,
                  "end": 60
                },
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 47,
                      "end": 52
                    },
                    "value": 179.9
                  },
                  {
                    "type": "literal",
                    "range": {
                      "start": 52,
                      "end": 54
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
                      "start": 54,
                      "end": 60
                    },
                    "value": -179.9
                  }
                ],
                "name": "",
                "value": [
                  179.9,
                  -179.9
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 34,
                "end": 44
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
              "value": "y_rotation",
              "valueMap": {
                "outerRange": {
                  "start": 34,
                  "end": 44
                },
                "innerRange": {
                  "start": 0,
                  "end": 10
                },
                "pairs": []
              },
              "valueNode": {
                "type": "literal",
                "range": {
                  "start": 0,
                  "end": 10
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
                "value": "y_rotation"
              }
            },
            "sep": {
              "start": 45,
              "end": 46
            },
            "value": {
              "type": "mcfunction:argument/minecraft:float_range",
              "range": {
                "start": 47,
                "end": 60
              },
              "children": [
                {
                  "type": "float",
                  "range": {
                    "start": 47,
                    "end": 52
                  },
                  "value": 179.9
                },
                {
                  "type": "literal",
                  "range": {
                    "start": 52,
                    "end": 54
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
                    "start": 54,
                    "end": 60
                  },
                  "value": -179.9
                }
              ],
              "name": "",
              "value": [
                179.9,
                -179.9
              ]
            },
            "end": {
              "start": 61,
              "end": 62
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
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@e" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@e" with {"amount":"single"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "The selector contains multiple entities",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@e[ type = ! skeleton , type = ! zombie , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 43
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
              "end": 43
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
                    "value": "type",
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
                      "value": "type"
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
                        "type": "resource_location",
                        "range": {
                          "start": 13,
                          "end": 21
                        },
                        "options": {
                          "category": "entity_type",
                          "allowTag": true
                        },
                        "path": [
                          "skeleton"
                        ]
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "resource_location",
                      "range": {
                        "start": 13,
                        "end": 21
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "skeleton"
                      ]
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
                  "value": "type",
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
                    "value": "type"
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
                      "type": "resource_location",
                      "range": {
                        "start": 13,
                        "end": 21
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "skeleton"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 13,
                      "end": 21
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
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
                      "end": 28
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
                    "value": "type",
                    "valueMap": {
                      "outerRange": {
                        "start": 24,
                        "end": 28
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
                      "value": "type"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 31,
                      "end": 39
                    },
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 31,
                          "end": 32
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
                          "start": 33,
                          "end": 39
                        },
                        "options": {
                          "category": "entity_type",
                          "allowTag": true
                        },
                        "path": [
                          "zombie"
                        ]
                      }
                    ],
                    "inverted": true,
                    "value": {
                      "type": "resource_location",
                      "range": {
                        "start": 33,
                        "end": 39
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 24,
                    "end": 28
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
                  "value": "type",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 28
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
                    "value": "type"
                  }
                },
                "sep": {
                  "start": 29,
                  "end": 30
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 31,
                    "end": 39
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 31,
                        "end": 32
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
                        "start": 33,
                        "end": 39
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                },
                "end": {
                  "start": 40,
                  "end": 41
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 43
        },
        "type": "mcfunction:entity_selector",
        "variable": "e",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 43
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
                  "value": "type",
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
                    "value": "type"
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
                      "type": "resource_location",
                      "range": {
                        "start": 13,
                        "end": 21
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "skeleton"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 13,
                      "end": 21
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
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
                "value": "type",
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
                  "value": "type"
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
                    "type": "resource_location",
                    "range": {
                      "start": 13,
                      "end": 21
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 13,
                    "end": 21
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "skeleton"
                  ]
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
                    "end": 28
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
                  "value": "type",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 28
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 31,
                    "end": 39
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 31,
                        "end": 32
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
                        "start": 33,
                        "end": 39
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 28
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
                "value": "type",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 28
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
                  "value": "type"
                }
              },
              "sep": {
                "start": 29,
                "end": 30
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 31,
                  "end": 39
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 31,
                      "end": 32
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
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              },
              "end": {
                "start": 40,
                "end": 41
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": false,
        "predicates": [
          "Entity::isAlive"
        ],
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: 😅  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
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
            "end": 43
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
                  "value": "type",
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
                    "value": "type"
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
                      "type": "resource_location",
                      "range": {
                        "start": 13,
                        "end": 21
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "skeleton"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 13,
                      "end": 21
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
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
                "value": "type",
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
                  "value": "type"
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
                    "type": "resource_location",
                    "range": {
                      "start": 13,
                      "end": 21
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 13,
                    "end": 21
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "skeleton"
                  ]
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
                    "end": 28
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
                  "value": "type",
                  "valueMap": {
                    "outerRange": {
                      "start": 24,
                      "end": 28
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 31,
                    "end": 39
                  },
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 31,
                        "end": 32
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
                        "start": 33,
                        "end": 39
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 28
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
                "value": "type",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 28
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
                  "value": "type"
                }
              },
              "sep": {
                "start": 29,
                "end": 30
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 31,
                  "end": 39
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 31,
                      "end": 32
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
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              },
              "end": {
                "start": 40,
                "end": 41
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 43
      },
      "type": "mcfunction:entity_selector",
      "variable": "e",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 43
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
                "value": "type",
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
                  "value": "type"
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
                    "type": "resource_location",
                    "range": {
                      "start": 13,
                      "end": 21
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 13,
                    "end": 21
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "skeleton"
                  ]
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
              "value": "type",
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
                "value": "type"
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
                  "type": "resource_location",
                  "range": {
                    "start": 13,
                    "end": 21
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "skeleton"
                  ]
                }
              ],
              "inverted": true,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 13,
                  "end": 21
                },
                "options": {
                  "category": "entity_type",
                  "allowTag": true
                },
                "path": [
                  "skeleton"
                ]
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
                  "end": 28
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
                "value": "type",
                "valueMap": {
                  "outerRange": {
                    "start": 24,
                    "end": 28
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
                  "value": "type"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 31,
                  "end": 39
                },
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 31,
                      "end": 32
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
                      "start": 33,
                      "end": 39
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 24,
                "end": 28
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
              "value": "type",
              "valueMap": {
                "outerRange": {
                  "start": 24,
                  "end": 28
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
                "value": "type"
              }
            },
            "sep": {
              "start": 29,
              "end": 30
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 31,
                "end": 39
              },
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 31,
                    "end": 32
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
                    "start": 33,
                    "end": 39
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              ],
              "inverted": true,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 33,
                  "end": 39
                },
                "options": {
                  "category": "entity_type",
                  "allowTag": true
                },
                "path": [
                  "zombie"
                ]
              }
            },
            "end": {
              "start": 40,
              "end": 41
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": false,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: 😅  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
    },
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 24,
        "end": 28
      },
      "message": "“type” is not applicable here",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@e[ type = player ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
            "value": "@e"
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
                  "end": 18
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
                    "value": "type",
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
                      "value": "type"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 11,
                          "end": 17
                        },
                        "options": {
                          "category": "entity_type",
                          "allowTag": true
                        },
                        "path": [
                          "player"
                        ]
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "player"
                      ]
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
                  "value": "type",
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
                    "value": "type"
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
                    "end": 17
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "player"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "player"
                    ]
                  }
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
        "variable": "e",
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
                "end": 18
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
                  "value": "type",
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "player"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "player"
                    ]
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
                "value": "type",
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
                  "value": "type"
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
                  "end": 17
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "player"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "player"
                  ]
                }
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": true,
        "predicates": [
          "Entity::isAlive"
        ],
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
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
            "end": 19
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 18
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
                  "value": "type",
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "player"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "player"
                    ]
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
                "value": "type",
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
                  "value": "type"
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
                  "end": 17
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "player"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "player"
                  ]
                }
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
      "variable": "e",
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
              "end": 18
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
                "value": "type",
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
                  "value": "type"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 17
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 17
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "player"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "player"
                  ]
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
              "value": "type",
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
                "value": "type"
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
                "end": 17
              },
              "children": [
                {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 17
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "player"
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 11,
                  "end": 17
                },
                "options": {
                  "category": "entity_type",
                  "allowTag": true
                },
                "path": [
                  "player"
                ]
              }
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": true,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
    },
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@e[ type = skeleton , type = zombie , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 39
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
              "end": 39
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
                    "value": "type",
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
                      "value": "type"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 11,
                      "end": 19
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 11,
                          "end": 19
                        },
                        "options": {
                          "category": "entity_type",
                          "allowTag": true
                        },
                        "path": [
                          "skeleton"
                        ]
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 19
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "skeleton"
                      ]
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
                  "value": "type",
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
                    "value": "type"
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
                    "end": 19
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 19
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "skeleton"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 19
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
                  }
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
                  "end": 37
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 22,
                      "end": 26
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
                    "value": "type",
                    "valueMap": {
                      "outerRange": {
                        "start": 22,
                        "end": 26
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
                      "value": "type"
                    }
                  },
                  {
                    "type": "mcfunction:entity_selector/arguments/value/invertable",
                    "range": {
                      "start": 29,
                      "end": 35
                    },
                    "children": [
                      {
                        "type": "resource_location",
                        "range": {
                          "start": 29,
                          "end": 35
                        },
                        "options": {
                          "category": "entity_type",
                          "allowTag": true
                        },
                        "path": [
                          "zombie"
                        ]
                      }
                    ],
                    "inverted": false,
                    "value": {
                      "type": "resource_location",
                      "range": {
                        "start": 29,
                        "end": 35
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 22,
                    "end": 26
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
                  "value": "type",
                  "valueMap": {
                    "outerRange": {
                      "start": 22,
                      "end": 26
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
                    "value": "type"
                  }
                },
                "sep": {
                  "start": 27,
                  "end": 28
                },
                "value": {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 29,
                    "end": 35
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 29,
                        "end": 35
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 29,
                      "end": 35
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                },
                "end": {
                  "start": 36,
                  "end": 37
                }
              }
            ]
          }
        ],
        "range": {
          "start": 0,
          "end": 39
        },
        "type": "mcfunction:entity_selector",
        "variable": "e",
        "argument": {
          "type": "mcfunction:entity_selector/arguments",
          "range": {
            "start": 2,
            "end": 39
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
                  "value": "type",
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 19
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 19
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "skeleton"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 19
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
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
                "value": "type",
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
                  "value": "type"
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
                  "end": 19
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 19
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 19
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "skeleton"
                  ]
                }
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
                "end": 37
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 22,
                    "end": 26
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
                  "value": "type",
                  "valueMap": {
                    "outerRange": {
                      "start": 22,
                      "end": 26
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 29,
                    "end": 35
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 29,
                        "end": 35
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 29,
                      "end": 35
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 22,
                  "end": 26
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
                "value": "type",
                "valueMap": {
                  "outerRange": {
                    "start": 22,
                    "end": 26
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
                  "value": "type"
                }
              },
              "sep": {
                "start": 27,
                "end": 28
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 29,
                  "end": 35
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 29,
                      "end": 35
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 29,
                    "end": 35
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              },
              "end": {
                "start": 36,
                "end": 37
              }
            }
          ]
        },
        "currentEntity": false,
        "playersOnly": false,
        "predicates": [
          "Entity::isAlive"
        ],
        "single": false,
        "typeLimited": true,
        "hover": "**Performance**: 😅  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
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
            "end": 39
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
                  "value": "type",
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 19
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 19
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "skeleton"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 19
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
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
                "value": "type",
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
                  "value": "type"
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
                  "end": 19
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 19
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 19
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "skeleton"
                  ]
                }
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
                "end": 37
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 22,
                    "end": 26
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
                  "value": "type",
                  "valueMap": {
                    "outerRange": {
                      "start": 22,
                      "end": 26
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
                    "value": "type"
                  }
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 29,
                    "end": 35
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 29,
                        "end": 35
                      },
                      "options": {
                        "category": "entity_type",
                        "allowTag": true
                      },
                      "path": [
                        "zombie"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 29,
                      "end": 35
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 22,
                  "end": 26
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
                "value": "type",
                "valueMap": {
                  "outerRange": {
                    "start": 22,
                    "end": 26
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
                  "value": "type"
                }
              },
              "sep": {
                "start": 27,
                "end": 28
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 29,
                  "end": 35
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 29,
                      "end": 35
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 29,
                    "end": 35
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              },
              "end": {
                "start": 36,
                "end": 37
              }
            }
          ]
        }
      ],
      "range": {
        "start": 0,
        "end": 39
      },
      "type": "mcfunction:entity_selector",
      "variable": "e",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 39
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
                "value": "type",
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
                  "value": "type"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 19
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 19
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "skeleton"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 19
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "skeleton"
                  ]
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
              "value": "type",
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
                "value": "type"
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
                "end": 19
              },
              "children": [
                {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 19
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "skeleton"
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 11,
                  "end": 19
                },
                "options": {
                  "category": "entity_type",
                  "allowTag": true
                },
                "path": [
                  "skeleton"
                ]
              }
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
              "end": 37
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 22,
                  "end": 26
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
                "value": "type",
                "valueMap": {
                  "outerRange": {
                    "start": 22,
                    "end": 26
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
                  "value": "type"
                }
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 29,
                  "end": 35
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 29,
                      "end": 35
                    },
                    "options": {
                      "category": "entity_type",
                      "allowTag": true
                    },
                    "path": [
                      "zombie"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 29,
                    "end": 35
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 22,
                "end": 26
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
              "value": "type",
              "valueMap": {
                "outerRange": {
                  "start": 22,
                  "end": 26
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
                "value": "type"
              }
            },
            "sep": {
              "start": 27,
              "end": 28
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 29,
                "end": 35
              },
              "children": [
                {
                  "type": "resource_location",
                  "range": {
                    "start": 29,
                    "end": 35
                  },
                  "options": {
                    "category": "entity_type",
                    "allowTag": true
                  },
                  "path": [
                    "zombie"
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 29,
                  "end": 35
                },
                "options": {
                  "category": "entity_type",
                  "allowTag": true
                },
                "path": [
                  "zombie"
                ]
              }
            },
            "end": {
              "start": 36,
              "end": 37
            }
          }
        ]
      },
      "currentEntity": false,
      "playersOnly": false,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": false,
      "typeLimited": true,
      "hover": "**Performance**: 😅  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
    },
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 22,
        "end": 26
      },
      "message": "Duplicate key “type”",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "@s[ sort = arbitrary , sort = unknown , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
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
            "value": "@s"
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
                  "end": 22
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
                    "value": "sort",
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
                      "value": "sort"
                    }
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 20
                    },
                    "options": {
                      "unquotable": {},
                      "value": {
                        "type": "literal"
                      }
                    },
                    "value": "arbitrary",
                    "valueMap": {
                      "outerRange": {
                        "start": 11,
                        "end": 20
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
                          "arbitrary",
                          "furthest",
                          "nearest",
                          "random"
                        ]
                      },
                      "value": "arbitrary"
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
                  "value": "sort",
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
                    "value": "sort"
                  }
                },
                "sep": {
                  "start": 9,
                  "end": 10
                },
                "value": {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "arbitrary",
                  "valueMap": {
                    "outerRange": {
                      "start": 11,
                      "end": 20
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": "arbitrary"
                  }
                },
                "end": {
                  "start": 21,
                  "end": 22
                }
              },
              {
                "type": "pair",
                "range": {
                  "start": 23,
                  "end": 39
                },
                "children": [
                  {
                    "type": "string",
                    "range": {
                      "start": 23,
                      "end": 27
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
                    "value": "sort",
                    "valueMap": {
                      "outerRange": {
                        "start": 23,
                        "end": 27
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
                      "value": "sort"
                    }
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 30,
                      "end": 37
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
                        "start": 30,
                        "end": 37
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
                          "arbitrary",
                          "furthest",
                          "nearest",
                          "random"
                        ]
                      },
                      "value": ""
                    }
                  }
                ],
                "key": {
                  "type": "string",
                  "range": {
                    "start": 23,
                    "end": 27
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
                  "value": "sort",
                  "valueMap": {
                    "outerRange": {
                      "start": 23,
                      "end": 27
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
                    "value": "sort"
                  }
                },
                "sep": {
                  "start": 28,
                  "end": 29
                },
                "value": {
                  "type": "string",
                  "range": {
                    "start": 30,
                    "end": 37
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
                      "start": 30,
                      "end": 37
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": ""
                  }
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
        "variable": "s",
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
                "end": 22
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
                  "value": "sort",
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
                    "value": "sort"
                  }
                },
                {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "arbitrary",
                  "valueMap": {
                    "outerRange": {
                      "start": 11,
                      "end": 20
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": "arbitrary"
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
                "value": "sort",
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
                  "value": "sort"
                }
              },
              "sep": {
                "start": 9,
                "end": 10
              },
              "value": {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 20
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "arbitrary",
                "valueMap": {
                  "outerRange": {
                    "start": 11,
                    "end": 20
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": "arbitrary"
                }
              },
              "end": {
                "start": 21,
                "end": 22
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 23,
                "end": 39
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 23,
                    "end": 27
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
                  "value": "sort",
                  "valueMap": {
                    "outerRange": {
                      "start": 23,
                      "end": 27
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
                    "value": "sort"
                  }
                },
                {
                  "type": "string",
                  "range": {
                    "start": 30,
                    "end": 37
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
                      "start": 30,
                      "end": 37
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": ""
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 23,
                  "end": 27
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
                "value": "sort",
                "valueMap": {
                  "outerRange": {
                    "start": 23,
                    "end": 27
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
                  "value": "sort"
                }
              },
              "sep": {
                "start": 28,
                "end": 29
              },
              "value": {
                "type": "string",
                "range": {
                  "start": 30,
                  "end": 37
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
                    "start": 30,
                    "end": 37
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": ""
                }
              },
              "end": {
                "start": 38,
                "end": 39
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
            "end": 41
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 4,
                "end": 22
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
                  "value": "sort",
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
                    "value": "sort"
                  }
                },
                {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "options": {
                    "unquotable": {},
                    "value": {
                      "type": "literal"
                    }
                  },
                  "value": "arbitrary",
                  "valueMap": {
                    "outerRange": {
                      "start": 11,
                      "end": 20
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": "arbitrary"
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
                "value": "sort",
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
                  "value": "sort"
                }
              },
              "sep": {
                "start": 9,
                "end": 10
              },
              "value": {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 20
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "arbitrary",
                "valueMap": {
                  "outerRange": {
                    "start": 11,
                    "end": 20
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": "arbitrary"
                }
              },
              "end": {
                "start": 21,
                "end": 22
              }
            },
            {
              "type": "pair",
              "range": {
                "start": 23,
                "end": 39
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 23,
                    "end": 27
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
                  "value": "sort",
                  "valueMap": {
                    "outerRange": {
                      "start": 23,
                      "end": 27
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
                    "value": "sort"
                  }
                },
                {
                  "type": "string",
                  "range": {
                    "start": 30,
                    "end": 37
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
                      "start": 30,
                      "end": 37
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
                        "arbitrary",
                        "furthest",
                        "nearest",
                        "random"
                      ]
                    },
                    "value": ""
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 23,
                  "end": 27
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
                "value": "sort",
                "valueMap": {
                  "outerRange": {
                    "start": 23,
                    "end": 27
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
                  "value": "sort"
                }
              },
              "sep": {
                "start": 28,
                "end": 29
              },
              "value": {
                "type": "string",
                "range": {
                  "start": 30,
                  "end": 37
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
                    "start": 30,
                    "end": 37
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": ""
                }
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
      "variable": "s",
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
              "end": 22
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
                "value": "sort",
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
                  "value": "sort"
                }
              },
              {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 20
                },
                "options": {
                  "unquotable": {},
                  "value": {
                    "type": "literal"
                  }
                },
                "value": "arbitrary",
                "valueMap": {
                  "outerRange": {
                    "start": 11,
                    "end": 20
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": "arbitrary"
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
              "value": "sort",
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
                "value": "sort"
              }
            },
            "sep": {
              "start": 9,
              "end": 10
            },
            "value": {
              "type": "string",
              "range": {
                "start": 11,
                "end": 20
              },
              "options": {
                "unquotable": {},
                "value": {
                  "type": "literal"
                }
              },
              "value": "arbitrary",
              "valueMap": {
                "outerRange": {
                  "start": 11,
                  "end": 20
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
                    "arbitrary",
                    "furthest",
                    "nearest",
                    "random"
                  ]
                },
                "value": "arbitrary"
              }
            },
            "end": {
              "start": 21,
              "end": 22
            }
          },
          {
            "type": "pair",
            "range": {
              "start": 23,
              "end": 39
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 23,
                  "end": 27
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
                "value": "sort",
                "valueMap": {
                  "outerRange": {
                    "start": 23,
                    "end": 27
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
                  "value": "sort"
                }
              },
              {
                "type": "string",
                "range": {
                  "start": 30,
                  "end": 37
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
                    "start": 30,
                    "end": 37
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
                      "arbitrary",
                      "furthest",
                      "nearest",
                      "random"
                    ]
                  },
                  "value": ""
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 23,
                "end": 27
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
              "value": "sort",
              "valueMap": {
                "outerRange": {
                  "start": 23,
                  "end": 27
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
                "value": "sort"
              }
            },
            "sep": {
              "start": 28,
              "end": 29
            },
            "value": {
              "type": "string",
              "range": {
                "start": 30,
                "end": 37
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
                  "start": 30,
                  "end": 37
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
                    "arbitrary",
                    "furthest",
                    "nearest",
                    "random"
                  ]
                },
                "value": ""
              }
            },
            "end": {
              "start": 38,
              "end": 39
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
    "hover": "<test: score_holder>"
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 8
      },
      "message": "",
      "severity": 3
    },
    {
      "range": {
        "start": 30,
        "end": 30
      },
      "message": "Expected “arbitrary”, “furthest”, “nearest”, or “random”",
      "severity": 3
    },
    {
      "range": {
        "start": 23,
        "end": 27
      },
      "message": "Duplicate key “sort”",
      "severity": 3
    },
    {
      "range": {
        "start": 23,
        "end": 27
      },
      "message": "",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "Player" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "symbol",
        "range": {
          "start": 0,
          "end": 6
        },
        "options": {
          "category": "score_holder"
        },
        "value": "Player",
        "symbol": {
          "category": "score_holder",
          "identifier": "Player",
          "reference": [
            {
              "uri": ""
            }
          ]
        }
      }
    ],
    "name": "test",
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 6
      },
      "options": {
        "category": "score_holder"
      },
      "value": "Player",
      "symbol": {
        "category": "score_holder",
        "identifier": "Player",
        "reference": [
          {
            "uri": ""
          }
        ]
      }
    },
    "hover": "<test: score_holder>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "Player" with {"amount":"single"} 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:score_holder",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "symbol",
        "range": {
          "start": 0,
          "end": 6
        },
        "options": {
          "category": "score_holder"
        },
        "value": "Player",
        "symbol": {
          "category": "score_holder",
          "identifier": "Player",
          "reference": [
            {
              "uri": ""
            }
          ]
        }
      }
    ],
    "name": "test",
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 6
      },
      "options": {
        "category": "score_holder"
      },
      "value": "Player",
      "symbol": {
        "category": "score_holder",
        "identifier": "Player",
        "reference": [
          {
            "uri": ""
          }
        ]
      }
    },
    "hover": "<test: score_holder>"
  },
  "errors": []
}
