exports['mcfunction argument minecraft:score_holder Parse "*" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 1
    },
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 1
      },
      "value": "*"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "*" with {"amount":"single"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 1
    },
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 1
      },
      "value": "*"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "0123" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 4
    },
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 4
      },
      "value": "0123"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "0123" with {"amount":"single"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 4
    },
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 4
      },
      "value": "0123"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ = 1 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 11
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 11
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 4
                      },
                      "value": ""
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 4
                },
                "value": "",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 4
                    },
                    "value": ""
                  }
                ]
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
      "variable": "a",
      "arguments": {
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
                "value": "",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 4
                    },
                    "value": ""
                  }
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 4
              },
              "value": "",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 4
                  },
                  "value": ""
                }
              ]
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 32
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 32
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "scores",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 10
                      },
                      "value": "scores"
                    }
                  ]
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
                          "value": "foo"
                        },
                        {
                          "type": "mcfunction:int_range",
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
                              "value": ".."
                            }
                          ],
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
                        "value": "foo"
                      },
                      "sep": {
                        "start": 19,
                        "end": 20
                      },
                      "value": {
                        "type": "mcfunction:int_range",
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
                            "value": ".."
                          }
                        ],
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
                "value": "scores",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 10
                    },
                    "value": "scores"
                  }
                ]
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
                        "value": "foo"
                      },
                      {
                        "type": "mcfunction:int_range",
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
                            "value": ".."
                          }
                        ],
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
                      "value": "foo"
                    },
                    "sep": {
                      "start": 19,
                      "end": 20
                    },
                    "value": {
                      "type": "mcfunction:int_range",
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
                          "value": ".."
                        }
                      ],
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
      "variable": "a",
      "arguments": {
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
                "value": "scores",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 10
                    },
                    "value": "scores"
                  }
                ]
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
                        "value": "foo"
                      },
                      {
                        "type": "mcfunction:int_range",
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
                            "value": ".."
                          }
                        ],
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
                      "value": "foo"
                    },
                    "sep": {
                      "start": 19,
                      "end": 20
                    },
                    "value": {
                      "type": "mcfunction:int_range",
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
                          "value": ".."
                        }
                      ],
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
              "value": "scores",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 10
                  },
                  "value": "scores"
                }
              ]
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
                      "value": "foo"
                    },
                    {
                      "type": "mcfunction:int_range",
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
                          "value": ".."
                        }
                      ],
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
                    "value": "foo"
                  },
                  "sep": {
                    "start": 19,
                    "end": 20
                  },
                  "value": {
                    "type": "mcfunction:int_range",
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
                        "value": ".."
                      }
                    ],
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ scores = { } , scores = { } , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 35
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 35
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "scores",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 10
                      },
                      "value": "scores"
                    }
                  ]
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
                "value": "scores",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 10
                    },
                    "value": "scores"
                  }
                ]
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
                  "value": "scores",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 19,
                        "end": 19
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 19,
                        "end": 25
                      },
                      "value": "scores"
                    }
                  ]
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
                "value": "scores",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 19,
                      "end": 19
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 19,
                      "end": 25
                    },
                    "value": "scores"
                  }
                ]
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
      "variable": "a",
      "arguments": {
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
                "value": "scores",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 10
                    },
                    "value": "scores"
                  }
                ]
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
              "value": "scores",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 10
                  },
                  "value": "scores"
                }
              ]
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
                "value": "scores",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 19,
                      "end": 19
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 19,
                      "end": 25
                    },
                    "value": "scores"
                  }
                ]
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
              "value": "scores",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 19,
                    "end": 19
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 19,
                    "end": 25
                  },
                  "value": "scores"
                }
              ]
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 24
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 24
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "sort",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "sort"
                    }
                  ]
                },
                {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "value": "arbitrary",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 11,
                        "end": 11
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 11,
                        "end": 20
                      },
                      "value": "arbitrary"
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "value": "sort",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "sort"
                  }
                ]
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
                "value": "arbitrary",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 11,
                      "end": 11
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 11,
                      "end": 20
                    },
                    "value": "arbitrary"
                  }
                ]
              },
              "end": {
                "start": 21,
                "end": 22
              }
            }
          ]
        }
      ],
      "variable": "a",
      "arguments": {
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
                "value": "sort",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "sort"
                  }
                ]
              },
              {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 20
                },
                "value": "arbitrary",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 11,
                      "end": 11
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 11,
                      "end": 20
                    },
                    "value": "arbitrary"
                  }
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 8
              },
              "value": "sort",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "sort"
                }
              ]
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
              "value": "arbitrary",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 11,
                    "end": 11
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "value": "arbitrary"
                }
              ]
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ tag = foo , tag = ! bar , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 31
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 31
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "tag",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 7
                      },
                      "value": "tag"
                    }
                  ]
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
                      "value": "foo"
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 10,
                      "end": 13
                    },
                    "value": "foo"
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 7
                },
                "value": "tag",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 7
                    },
                    "value": "tag"
                  }
                ]
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
                    "value": "foo"
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 10,
                    "end": 13
                  },
                  "value": "foo"
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
                  "value": "tag",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 16,
                        "end": 16
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 16,
                        "end": 19
                      },
                      "value": "tag"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "symbol",
                      "range": {
                        "start": 24,
                        "end": 27
                      },
                      "value": "bar"
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "value": "bar"
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 16,
                  "end": 19
                },
                "value": "tag",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 16,
                      "end": 16
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 16,
                      "end": 19
                    },
                    "value": "tag"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "value": "bar"
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "value": "bar"
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
      "variable": "a",
      "arguments": {
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
                "value": "tag",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 7
                    },
                    "value": "tag"
                  }
                ]
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
                    "value": "foo"
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 10,
                    "end": 13
                  },
                  "value": "foo"
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 7
              },
              "value": "tag",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 7
                  },
                  "value": "tag"
                }
              ]
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
                  "value": "foo"
                }
              ],
              "inverted": false,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 10,
                  "end": 13
                },
                "value": "foo"
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
                "value": "tag",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 16,
                      "end": 16
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 16,
                      "end": 19
                    },
                    "value": "tag"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "value": "bar"
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "value": "bar"
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 16,
                "end": 19
              },
              "value": "tag",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 16,
                    "end": 16
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 16,
                    "end": 19
                  },
                  "value": "tag"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "value": "bar"
                }
              ],
              "inverted": true,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "value": "bar"
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ team = ! foo , team = ! bar , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 35
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 35
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "team",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "team"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "symbol",
                      "range": {
                        "start": 13,
                        "end": 16
                      },
                      "value": "foo"
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "value": "foo"
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "value": "team",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "team"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "value": "foo"
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "value": "foo"
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
                  "value": "team",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 19,
                        "end": 19
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 19,
                        "end": 23
                      },
                      "value": "team"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "symbol",
                      "range": {
                        "start": 28,
                        "end": 31
                      },
                      "value": "bar"
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "value": "bar"
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 19,
                  "end": 23
                },
                "value": "team",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 19,
                      "end": 19
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 19,
                      "end": 23
                    },
                    "value": "team"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "value": "bar"
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "value": "bar"
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
      "variable": "a",
      "arguments": {
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
                "value": "team",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "team"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "symbol",
                    "range": {
                      "start": 13,
                      "end": 16
                    },
                    "value": "foo"
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "value": "foo"
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 8
              },
              "value": "team",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "team"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "symbol",
                  "range": {
                    "start": 13,
                    "end": 16
                  },
                  "value": "foo"
                }
              ],
              "inverted": true,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 13,
                  "end": 16
                },
                "value": "foo"
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
                "value": "team",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 19,
                      "end": 19
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 19,
                      "end": 23
                    },
                    "value": "team"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "symbol",
                    "range": {
                      "start": 28,
                      "end": 31
                    },
                    "value": "bar"
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "value": "bar"
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 19,
                "end": 23
              },
              "value": "team",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 19,
                    "end": 19
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 19,
                    "end": 23
                  },
                  "value": "team"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "symbol",
                  "range": {
                    "start": 28,
                    "end": 31
                  },
                  "value": "bar"
                }
              ],
              "inverted": true,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": "bar"
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ team = foo , team = bar , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 31
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 31
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "team",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "team"
                    }
                  ]
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
                      "value": "foo"
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 11,
                      "end": 14
                    },
                    "value": "foo"
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "value": "team",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "team"
                  }
                ]
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
                    "value": "foo"
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 11,
                    "end": 14
                  },
                  "value": "foo"
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
                  "value": "team",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 17,
                        "end": 17
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 17,
                        "end": 21
                      },
                      "value": "team"
                    }
                  ]
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
                      "value": "bar"
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "symbol",
                    "range": {
                      "start": 24,
                      "end": 27
                    },
                    "value": "bar"
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 17,
                  "end": 21
                },
                "value": "team",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 17,
                      "end": 17
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 17,
                      "end": 21
                    },
                    "value": "team"
                  }
                ]
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
                    "value": "bar"
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "value": "bar"
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
      "variable": "a",
      "arguments": {
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
                "value": "team",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "team"
                  }
                ]
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
                    "value": "foo"
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 11,
                    "end": 14
                  },
                  "value": "foo"
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 8
              },
              "value": "team",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "team"
                }
              ]
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
                  "value": "foo"
                }
              ],
              "inverted": false,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 11,
                  "end": 14
                },
                "value": "foo"
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
                "value": "team",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 17,
                      "end": 17
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 17,
                      "end": 21
                    },
                    "value": "team"
                  }
                ]
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
                    "value": "bar"
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "symbol",
                  "range": {
                    "start": 24,
                    "end": 27
                  },
                  "value": "bar"
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 17,
                "end": 21
              },
              "value": "team",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 17,
                    "end": 17
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 17,
                    "end": 21
                  },
                  "value": "team"
                }
              ]
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
                  "value": "bar"
                }
              ],
              "inverted": false,
              "value": {
                "type": "symbol",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "value": "bar"
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 19
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 19
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "type"
                    }
                  ]
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
                  "path": [
                    "zombie"
                  ]
                }
              }
            }
          ]
        }
      ],
      "variable": "a",
      "arguments": {
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "type"
                }
              ]
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 19
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 19
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "unknown",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 4
                      },
                      "value": ""
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 11
                },
                "value": "unknown",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 4
                    },
                    "value": ""
                  }
                ]
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
      "variable": "a",
      "arguments": {
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
                "value": "unknown",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 4
                    },
                    "value": ""
                  }
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 11
              },
              "value": "unknown",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 4
                  },
                  "value": ""
                }
              ]
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 46
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 46
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "x",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 5
                      },
                      "value": "x"
                    }
                  ]
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
                "value": "x",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 5
                    },
                    "value": "x"
                  }
                ]
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
                  "value": "x",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 14,
                        "end": 14
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 14,
                        "end": 15
                      },
                      "value": "x"
                    }
                  ]
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
                "value": "x",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 14,
                      "end": 14
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 14,
                      "end": 15
                    },
                    "value": "x"
                  }
                ]
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
                  "value": "dz",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 24,
                        "end": 24
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 24,
                        "end": 26
                      },
                      "value": "dz"
                    }
                  ]
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
                "value": "dz",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 24,
                      "end": 24
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 24,
                      "end": 26
                    },
                    "value": "dz"
                  }
                ]
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
                  "value": "dz",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 34,
                        "end": 34
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 34,
                        "end": 36
                      },
                      "value": "dz"
                    }
                  ]
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
                "value": "dz",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 34,
                      "end": 34
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 36
                    },
                    "value": "dz"
                  }
                ]
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
      "variable": "a",
      "arguments": {
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
                "value": "x",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 5
                    },
                    "value": "x"
                  }
                ]
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
              "value": "x",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 5
                  },
                  "value": "x"
                }
              ]
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
                "value": "x",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 14,
                      "end": 14
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 14,
                      "end": 15
                    },
                    "value": "x"
                  }
                ]
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
              "value": "x",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 14,
                    "end": 14
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 14,
                    "end": 15
                  },
                  "value": "x"
                }
              ]
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
                "value": "dz",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 24,
                      "end": 24
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 24,
                      "end": 26
                    },
                    "value": "dz"
                  }
                ]
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
              "value": "dz",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 24,
                    "end": 24
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 24,
                    "end": 26
                  },
                  "value": "dz"
                }
              ]
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
                "value": "dz",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 34,
                      "end": 34
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 36
                    },
                    "value": "dz"
                  }
                ]
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
              "value": "dz",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 34,
                    "end": 34
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 34,
                    "end": 36
                  },
                  "value": "dz"
                }
              ]
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
      "hover": "**Performance**: Great\n- `chunkLimited`: `false`\n- `dimensionLimited`: `true`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 68
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 68
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "x",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 5
                      },
                      "value": "x"
                    }
                  ]
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
                "value": "x",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 5
                    },
                    "value": "x"
                  }
                ]
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
                  "value": "y",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 14,
                        "end": 14
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 14,
                        "end": 15
                      },
                      "value": "y"
                    }
                  ]
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
                "value": "y",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 14,
                      "end": 14
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 14,
                      "end": 15
                    },
                    "value": "y"
                  }
                ]
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
                  "value": "z",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 24,
                        "end": 24
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 24,
                        "end": 25
                      },
                      "value": "z"
                    }
                  ]
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
                "value": "z",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 24,
                      "end": 24
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 24,
                      "end": 25
                    },
                    "value": "z"
                  }
                ]
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
                  "value": "dx",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 34,
                        "end": 34
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 34,
                        "end": 36
                      },
                      "value": "dx"
                    }
                  ]
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
                "value": "dx",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 34,
                      "end": 34
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 36
                    },
                    "value": "dx"
                  }
                ]
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
                  "value": "dy",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 45,
                        "end": 45
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 45,
                        "end": 47
                      },
                      "value": "dy"
                    }
                  ]
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
                "value": "dy",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 45,
                      "end": 45
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 45,
                      "end": 47
                    },
                    "value": "dy"
                  }
                ]
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
                  "value": "dz",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 56,
                        "end": 56
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 56,
                        "end": 58
                      },
                      "value": "dz"
                    }
                  ]
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
                "value": "dz",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 56,
                      "end": 56
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 56,
                      "end": 58
                    },
                    "value": "dz"
                  }
                ]
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
      "variable": "a",
      "arguments": {
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
                "value": "x",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 5
                    },
                    "value": "x"
                  }
                ]
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
              "value": "x",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 5
                  },
                  "value": "x"
                }
              ]
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
                "value": "y",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 14,
                      "end": 14
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 14,
                      "end": 15
                    },
                    "value": "y"
                  }
                ]
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
              "value": "y",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 14,
                    "end": 14
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 14,
                    "end": 15
                  },
                  "value": "y"
                }
              ]
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
                "value": "z",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 24,
                      "end": 24
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 24,
                      "end": 25
                    },
                    "value": "z"
                  }
                ]
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
              "value": "z",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 24,
                    "end": 24
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 24,
                    "end": 25
                  },
                  "value": "z"
                }
              ]
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
                "value": "dx",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 34,
                      "end": 34
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 36
                    },
                    "value": "dx"
                  }
                ]
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
              "value": "dx",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 34,
                    "end": 34
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 34,
                    "end": 36
                  },
                  "value": "dx"
                }
              ]
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
                "value": "dy",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 45,
                      "end": 45
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 45,
                      "end": 47
                    },
                    "value": "dy"
                  }
                ]
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
              "value": "dy",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 45,
                    "end": 45
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 45,
                    "end": 47
                  },
                  "value": "dy"
                }
              ]
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
                "value": "dz",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 56,
                      "end": 56
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 56,
                      "end": 58
                    },
                    "value": "dz"
                  }
                ]
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
              "value": "dz",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 56,
                    "end": 56
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 56,
                    "end": 58
                  },
                  "value": "dz"
                }
              ]
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
      "hover": "**Performance**: Great\n- `chunkLimited`: `false`\n- `dimensionLimited`: `true`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@a[ x_rotation = 179.9..-179.9 ,  x_rotation = 179.9..-179.9 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 64
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 64
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "x_rotation",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 14
                      },
                      "value": "x_rotation"
                    }
                  ]
                },
                {
                  "type": "mcfunction:float_range",
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
                "value": "x_rotation",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 14
                    },
                    "value": "x_rotation"
                  }
                ]
              },
              "sep": {
                "start": 15,
                "end": 16
              },
              "value": {
                "type": "mcfunction:float_range",
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
                  "value": "x_rotation",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 34,
                        "end": 34
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 34,
                        "end": 44
                      },
                      "value": "x_rotation"
                    }
                  ]
                },
                {
                  "type": "mcfunction:float_range",
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
                "value": "x_rotation",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 34,
                      "end": 34
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 44
                    },
                    "value": "x_rotation"
                  }
                ]
              },
              "sep": {
                "start": 45,
                "end": 46
              },
              "value": {
                "type": "mcfunction:float_range",
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
      "variable": "a",
      "arguments": {
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
                "value": "x_rotation",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 14
                    },
                    "value": "x_rotation"
                  }
                ]
              },
              {
                "type": "mcfunction:float_range",
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
              "value": "x_rotation",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 14
                  },
                  "value": "x_rotation"
                }
              ]
            },
            "sep": {
              "start": 15,
              "end": 16
            },
            "value": {
              "type": "mcfunction:float_range",
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
                "value": "x_rotation",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 34,
                      "end": 34
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 44
                    },
                    "value": "x_rotation"
                  }
                ]
              },
              {
                "type": "mcfunction:float_range",
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
              "value": "x_rotation",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 34,
                    "end": 34
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 34,
                    "end": 44
                  },
                  "value": "x_rotation"
                }
              ]
            },
            "sep": {
              "start": 45,
              "end": 46
            },
            "value": {
              "type": "mcfunction:float_range",
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 64
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 64
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "x_rotation",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 14
                      },
                      "value": "x_rotation"
                    }
                  ]
                },
                {
                  "type": "mcfunction:float_range",
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
                "value": "x_rotation",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 14
                    },
                    "value": "x_rotation"
                  }
                ]
              },
              "sep": {
                "start": 15,
                "end": 16
              },
              "value": {
                "type": "mcfunction:float_range",
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
                  "value": "y_rotation",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 34,
                        "end": 34
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 34,
                        "end": 44
                      },
                      "value": "y_rotation"
                    }
                  ]
                },
                {
                  "type": "mcfunction:float_range",
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
                "value": "y_rotation",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 34,
                      "end": 34
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 44
                    },
                    "value": "y_rotation"
                  }
                ]
              },
              "sep": {
                "start": 45,
                "end": 46
              },
              "value": {
                "type": "mcfunction:float_range",
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
      "variable": "a",
      "arguments": {
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
                "value": "x_rotation",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 14
                    },
                    "value": "x_rotation"
                  }
                ]
              },
              {
                "type": "mcfunction:float_range",
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
              "value": "x_rotation",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 14
                  },
                  "value": "x_rotation"
                }
              ]
            },
            "sep": {
              "start": 15,
              "end": 16
            },
            "value": {
              "type": "mcfunction:float_range",
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
                "value": "y_rotation",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 34,
                      "end": 34
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 34,
                      "end": 44
                    },
                    "value": "y_rotation"
                  }
                ]
              },
              {
                "type": "mcfunction:float_range",
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
              "value": "y_rotation",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 34,
                    "end": 34
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 34,
                    "end": 44
                  },
                  "value": "y_rotation"
                }
              ]
            },
            "sep": {
              "start": 45,
              "end": 46
            },
            "value": {
              "type": "mcfunction:float_range",
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@e" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 2
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 2
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "value": "@e"
        }
      ],
      "variable": "e",
      "currentEntity": false,
      "playersOnly": false,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": false,
      "typeLimited": false,
      "hover": "**Performance**: 🤢\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**:\n- `Entity::isAlive`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@e" with {"amount":"single"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 2
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 2
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "value": "@e"
        }
      ],
      "variable": "e",
      "currentEntity": false,
      "playersOnly": false,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": false,
      "typeLimited": false,
      "hover": "**Performance**: 🤢\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**:\n- `Entity::isAlive`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 43
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 43
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "type"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 13,
                        "end": 21
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 13,
                      "end": 21
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
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 24,
                        "end": 24
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 24,
                        "end": 28
                      },
                      "value": "type"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 33,
                        "end": 39
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 24,
                      "end": 24
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 24,
                      "end": 28
                    },
                    "value": "type"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 33,
                      "end": 39
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
      "variable": "e",
      "arguments": {
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 13,
                      "end": 21
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
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "type"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "resource_location",
                  "range": {
                    "start": 13,
                    "end": 21
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 24,
                      "end": 24
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 24,
                      "end": 28
                    },
                    "value": "type"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 33,
                      "end": 39
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
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 24,
                    "end": 24
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 24,
                    "end": 28
                  },
                  "value": "type"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "resource_location",
                  "range": {
                    "start": 33,
                    "end": 39
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
      "typeLimited": false,
      "hover": "**Performance**: 🤢\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**:\n- `Entity::isAlive`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@e[ type = #tag1 , type = #tag2 , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 35
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 35
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
          },
          "value": "@e"
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
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "type"
                    }
                  ]
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 11,
                    "end": 16
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 11,
                        "end": 16
                      },
                      "isTag": true,
                      "path": [
                        "tag1"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 16
                    },
                    "isTag": true,
                    "path": [
                      "tag1"
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 16
                    },
                    "isTag": true,
                    "path": [
                      "tag1"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 16
                  },
                  "isTag": true,
                  "path": [
                    "tag1"
                  ]
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
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 19,
                        "end": 19
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 19,
                        "end": 23
                      },
                      "value": "type"
                    }
                  ]
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 26,
                    "end": 31
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 26,
                        "end": 31
                      },
                      "isTag": true,
                      "path": [
                        "tag2"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 26,
                      "end": 31
                    },
                    "isTag": true,
                    "path": [
                      "tag2"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 19,
                  "end": 23
                },
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 19,
                      "end": 19
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 19,
                      "end": 23
                    },
                    "value": "type"
                  }
                ]
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
                    "type": "resource_location",
                    "range": {
                      "start": 26,
                      "end": 31
                    },
                    "isTag": true,
                    "path": [
                      "tag2"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 26,
                    "end": 31
                  },
                  "isTag": true,
                  "path": [
                    "tag2"
                  ]
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
      "variable": "e",
      "arguments": {
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 11,
                  "end": 16
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 11,
                      "end": 16
                    },
                    "isTag": true,
                    "path": [
                      "tag1"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 16
                  },
                  "isTag": true,
                  "path": [
                    "tag1"
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
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "type"
                }
              ]
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
                  "type": "resource_location",
                  "range": {
                    "start": 11,
                    "end": 16
                  },
                  "isTag": true,
                  "path": [
                    "tag1"
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 11,
                  "end": 16
                },
                "isTag": true,
                "path": [
                  "tag1"
                ]
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 19,
                      "end": 19
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 19,
                      "end": 23
                    },
                    "value": "type"
                  }
                ]
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 26,
                  "end": 31
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 26,
                      "end": 31
                    },
                    "isTag": true,
                    "path": [
                      "tag2"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 26,
                    "end": 31
                  },
                  "isTag": true,
                  "path": [
                    "tag2"
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 19,
                "end": 23
              },
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 19,
                    "end": 19
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 19,
                    "end": 23
                  },
                  "value": "type"
                }
              ]
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
                  "type": "resource_location",
                  "range": {
                    "start": 26,
                    "end": 31
                  },
                  "isTag": true,
                  "path": [
                    "tag2"
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 26,
                  "end": 31
                },
                "isTag": true,
                "path": [
                  "tag2"
                ]
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
      "playersOnly": false,
      "predicates": [
        "Entity::isAlive"
      ],
      "single": false,
      "typeLimited": false,
      "hover": "**Performance**: 🤢\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**:\n- `Entity::isAlive`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@e[ type = player ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 19
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 19
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "type"
                    }
                  ]
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
                  "path": [
                    "player"
                  ]
                }
              }
            }
          ]
        }
      ],
      "variable": "e",
      "arguments": {
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "type"
                }
              ]
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
      "hover": "**Performance**: Good\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`\n\n------\n**Predicates**:\n- `Entity::isAlive`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "@e[ type = skeleton , type = zombie , ]" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 39
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 39
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "type"
                    }
                  ]
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 22,
                        "end": 22
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 22,
                        "end": 26
                      },
                      "value": "type"
                    }
                  ]
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 22,
                      "end": 22
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 26
                    },
                    "value": "type"
                  }
                ]
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
      "variable": "e",
      "arguments": {
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "type"
                  }
                ]
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
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "type"
                }
              ]
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
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 22,
                      "end": 22
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 22,
                      "end": 26
                    },
                    "value": "type"
                  }
                ]
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
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 22,
                    "end": 22
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 22,
                    "end": 26
                  },
                  "value": "type"
                }
              ]
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
      "hover": "**Performance**: 😅\n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**:\n- `Entity::isAlive`"
    }
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
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 41
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 41
      },
      "children": [
        {
          "type": "literal",
          "range": {
            "start": 0,
            "end": 2
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
                  "value": "sort",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 4,
                        "end": 4
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 4,
                        "end": 8
                      },
                      "value": "sort"
                    }
                  ]
                },
                {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "value": "arbitrary",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 11,
                        "end": 11
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 11,
                        "end": 20
                      },
                      "value": "arbitrary"
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 8
                },
                "value": "sort",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "sort"
                  }
                ]
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
                "value": "arbitrary",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 11,
                      "end": 11
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 11,
                      "end": 20
                    },
                    "value": "arbitrary"
                  }
                ]
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
                  "value": "sort",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 23,
                        "end": 23
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 23,
                        "end": 27
                      },
                      "value": "sort"
                    }
                  ]
                },
                {
                  "type": "string",
                  "range": {
                    "start": 30,
                    "end": 37
                  },
                  "value": "unknown",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 30,
                        "end": 30
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 30,
                        "end": 30
                      },
                      "value": ""
                    }
                  ]
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 23,
                  "end": 27
                },
                "value": "sort",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 23,
                      "end": 23
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 23,
                      "end": 27
                    },
                    "value": "sort"
                  }
                ]
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
                "value": "unknown",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 30,
                      "end": 30
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 30,
                      "end": 30
                    },
                    "value": ""
                  }
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
      "variable": "s",
      "arguments": {
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
                "value": "sort",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 4,
                      "end": 4
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 4,
                      "end": 8
                    },
                    "value": "sort"
                  }
                ]
              },
              {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 20
                },
                "value": "arbitrary",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 11,
                      "end": 11
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 11,
                      "end": 20
                    },
                    "value": "arbitrary"
                  }
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 8
              },
              "value": "sort",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 4,
                    "end": 4
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 4,
                    "end": 8
                  },
                  "value": "sort"
                }
              ]
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
              "value": "arbitrary",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 11,
                    "end": 11
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 11,
                    "end": 20
                  },
                  "value": "arbitrary"
                }
              ]
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
                "value": "sort",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 23,
                      "end": 23
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 23,
                      "end": 27
                    },
                    "value": "sort"
                  }
                ]
              },
              {
                "type": "string",
                "range": {
                  "start": 30,
                  "end": 37
                },
                "value": "unknown",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 30,
                      "end": 30
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 30,
                      "end": 30
                    },
                    "value": ""
                  }
                ]
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 23,
                "end": 27
              },
              "value": "sort",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 23,
                    "end": 23
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 23,
                    "end": 27
                  },
                  "value": "sort"
                }
              ]
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
              "value": "unknown",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 30,
                    "end": 30
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 30,
                    "end": 30
                  },
                  "value": ""
                }
              ]
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
      "hover": "**Performance**: 😌👌\n- `currentEntity`: `true`"
    }
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 8
      },
      "message": "“sort” is not applicable here",
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
      "message": "“sort” is not applicable here",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:score_holder Parse "Player" with {"amount":"multiple"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 6
    },
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 6
      },
      "value": "Player"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:score_holder Parse "Player" with {"amount":"single"} 1'] = {
  "node": {
    "type": "mcfunction:score_holder",
    "range": {
      "start": 0,
      "end": 6
    },
    "fakeName": {
      "type": "symbol",
      "range": {
        "start": 0,
        "end": 6
      },
      "value": "Player"
    }
  },
  "errors": []
}
