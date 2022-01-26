exports['mcfunction argument minecraft:entity Parse "0123" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 4
    },
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 4
      },
      "value": "0123",
      "valueMap": [
        {
          "inner": {
            "start": 0,
            "end": 0
          },
          "outer": {
            "start": 0,
            "end": 0
          }
        }
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "0123" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 4
    },
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 4
      },
      "value": "0123",
      "valueMap": [
        {
          "inner": {
            "start": 0,
            "end": 0
          },
          "outer": {
            "start": 0,
            "end": 0
          }
        }
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 5
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 5
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
            "end": 5
          },
          "children": []
        }
      ],
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ advancements = { minecraft:foo = true , minecraft:bar = { qux = true , } , } , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 84
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 84
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
                  "value": "advancements",
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
                        "end": 16
                      },
                      "value": "advancements"
                    }
                  ]
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
                                  "value": "qux",
                                  "valueMap": [
                                    {
                                      "inner": {
                                        "start": 0,
                                        "end": 0
                                      },
                                      "outer": {
                                        "start": 62,
                                        "end": 62
                                      }
                                    }
                                  ]
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
                                "value": "qux",
                                "valueMap": [
                                  {
                                    "inner": {
                                      "start": 0,
                                      "end": 0
                                    },
                                    "outer": {
                                      "start": 62,
                                      "end": 62
                                    }
                                  }
                                ]
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
                                "value": "qux",
                                "valueMap": [
                                  {
                                    "inner": {
                                      "start": 0,
                                      "end": 0
                                    },
                                    "outer": {
                                      "start": 62,
                                      "end": 62
                                    }
                                  }
                                ]
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
                              "value": "qux",
                              "valueMap": [
                                {
                                  "inner": {
                                    "start": 0,
                                    "end": 0
                                  },
                                  "outer": {
                                    "start": 62,
                                    "end": 62
                                  }
                                }
                              ]
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
                "value": "advancements",
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
                      "end": 16
                    },
                    "value": "advancements"
                  }
                ]
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
                                "value": "qux",
                                "valueMap": [
                                  {
                                    "inner": {
                                      "start": 0,
                                      "end": 0
                                    },
                                    "outer": {
                                      "start": 62,
                                      "end": 62
                                    }
                                  }
                                ]
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
                              "value": "qux",
                              "valueMap": [
                                {
                                  "inner": {
                                    "start": 0,
                                    "end": 0
                                  },
                                  "outer": {
                                    "start": 62,
                                    "end": 62
                                  }
                                }
                              ]
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
                              "value": "qux",
                              "valueMap": [
                                {
                                  "inner": {
                                    "start": 0,
                                    "end": 0
                                  },
                                  "outer": {
                                    "start": 62,
                                    "end": 62
                                  }
                                }
                              ]
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
                            "value": "qux",
                            "valueMap": [
                              {
                                "inner": {
                                  "start": 0,
                                  "end": 0
                                },
                                "outer": {
                                  "start": 62,
                                  "end": 62
                                }
                              }
                            ]
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
                "value": "advancements",
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
                      "end": 16
                    },
                    "value": "advancements"
                  }
                ]
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
                                "value": "qux",
                                "valueMap": [
                                  {
                                    "inner": {
                                      "start": 0,
                                      "end": 0
                                    },
                                    "outer": {
                                      "start": 62,
                                      "end": 62
                                    }
                                  }
                                ]
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
                              "value": "qux",
                              "valueMap": [
                                {
                                  "inner": {
                                    "start": 0,
                                    "end": 0
                                  },
                                  "outer": {
                                    "start": 62,
                                    "end": 62
                                  }
                                }
                              ]
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
                              "value": "qux",
                              "valueMap": [
                                {
                                  "inner": {
                                    "start": 0,
                                    "end": 0
                                  },
                                  "outer": {
                                    "start": 62,
                                    "end": 62
                                  }
                                }
                              ]
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
                            "value": "qux",
                            "valueMap": [
                              {
                                "inner": {
                                  "start": 0,
                                  "end": 0
                                },
                                "outer": {
                                  "start": 62,
                                  "end": 62
                                }
                              }
                            ]
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
              "value": "advancements",
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
                    "end": 16
                  },
                  "value": "advancements"
                }
              ]
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
                              "value": "qux",
                              "valueMap": [
                                {
                                  "inner": {
                                    "start": 0,
                                    "end": 0
                                  },
                                  "outer": {
                                    "start": 62,
                                    "end": 62
                                  }
                                }
                              ]
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
                            "value": "qux",
                            "valueMap": [
                              {
                                "inner": {
                                  "start": 0,
                                  "end": 0
                                },
                                "outer": {
                                  "start": 62,
                                  "end": 62
                                }
                              }
                            ]
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
                            "value": "qux",
                            "valueMap": [
                              {
                                "inner": {
                                  "start": 0,
                                  "end": 0
                                },
                                "outer": {
                                  "start": 62,
                                  "end": 62
                                }
                              }
                            ]
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
                          "value": "qux",
                          "valueMap": [
                            {
                              "inner": {
                                "start": 0,
                                "end": 0
                              },
                              "outer": {
                                "start": 62,
                                "end": 62
                              }
                            }
                          ]
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ advancements = { } , advancements = { } , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 47
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 47
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
                  "value": "advancements",
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
                        "end": 16
                      },
                      "value": "advancements"
                    }
                  ]
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
                "value": "advancements",
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
                      "end": 16
                    },
                    "value": "advancements"
                  }
                ]
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
                  "value": "advancements",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 25,
                        "end": 25
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 25,
                        "end": 37
                      },
                      "value": "advancements"
                    }
                  ]
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
                "value": "advancements",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 25,
                      "end": 25
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 25,
                      "end": 37
                    },
                    "value": "advancements"
                  }
                ]
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
                "value": "advancements",
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
                      "end": 16
                    },
                    "value": "advancements"
                  }
                ]
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
              "value": "advancements",
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
                    "end": 16
                  },
                  "value": "advancements"
                }
              ]
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
                "value": "advancements",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 25,
                      "end": 25
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 25,
                      "end": 37
                    },
                    "value": "advancements"
                  }
                ]
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
              "value": "advancements",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 25,
                    "end": 25
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 25,
                    "end": 37
                  },
                  "value": "advancements"
                }
              ]
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
    "type": "mcfunction:entity",
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
                  "value": "distance",
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
                        "end": 12
                      },
                      "value": "distance"
                    }
                  ]
                },
                {
                  "type": "mcfunction:float_range",
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
                "value": "distance",
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
                      "end": 12
                    },
                    "value": "distance"
                  }
                ]
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:float_range",
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
                  "value": "distance",
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
                        "end": 30
                      },
                      "value": "distance"
                    }
                  ]
                },
                {
                  "type": "mcfunction:float_range",
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
                "value": "distance",
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
                      "end": 30
                    },
                    "value": "distance"
                  }
                ]
              },
              "sep": {
                "start": 31,
                "end": 32
              },
              "value": {
                "type": "mcfunction:float_range",
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
                "value": "distance",
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
                      "end": 12
                    },
                    "value": "distance"
                  }
                ]
              },
              {
                "type": "mcfunction:float_range",
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
              "value": "distance",
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
                    "end": 12
                  },
                  "value": "distance"
                }
              ]
            },
            "sep": {
              "start": 13,
              "end": 14
            },
            "value": {
              "type": "mcfunction:float_range",
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
                "value": "distance",
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
                      "end": 30
                    },
                    "value": "distance"
                  }
                ]
              },
              {
                "type": "mcfunction:float_range",
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
              "value": "distance",
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
                    "end": 30
                  },
                  "value": "distance"
                }
              ]
            },
            "sep": {
              "start": 31,
              "end": 32
            },
            "value": {
              "type": "mcfunction:float_range",
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
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 22
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 22
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
                  "value": "distance",
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
                        "end": 12
                      },
                      "value": "distance"
                    }
                  ]
                },
                {
                  "type": "mcfunction:float_range",
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
                "value": "distance",
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
                      "end": 12
                    },
                    "value": "distance"
                  }
                ]
              },
              "sep": {
                "start": 13,
                "end": 14
              },
              "value": {
                "type": "mcfunction:float_range",
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
                "value": "distance",
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
                      "end": 12
                    },
                    "value": "distance"
                  }
                ]
              },
              {
                "type": "mcfunction:float_range",
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
              "value": "distance",
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
                    "end": 12
                  },
                  "value": "distance"
                }
              ]
            },
            "sep": {
              "start": 13,
              "end": 14
            },
            "value": {
              "type": "mcfunction:float_range",
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ gamemode = ! creative , gamemode = ! adventure , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 54
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 54
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
                  "value": "gamemode",
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
                        "end": 12
                      },
                      "value": "gamemode"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 17,
                        "end": 25
                      },
                      "value": "creative",
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
                            "end": 25
                          },
                          "value": "creative"
                        }
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "value": "creative",
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
                          "end": 25
                        },
                        "value": "creative"
                      }
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "value": "gamemode",
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
                      "end": 12
                    },
                    "value": "gamemode"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "value": "creative",
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
                          "end": 25
                        },
                        "value": "creative"
                      }
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 25
                  },
                  "value": "creative",
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
                        "end": 25
                      },
                      "value": "creative"
                    }
                  ]
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
                  "value": "gamemode",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 28,
                        "end": 28
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 28,
                        "end": 36
                      },
                      "value": "gamemode"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 41,
                        "end": 50
                      },
                      "value": "adventure",
                      "valueMap": [
                        {
                          "inner": {
                            "start": 0,
                            "end": 0
                          },
                          "outer": {
                            "start": 41,
                            "end": 41
                          }
                        }
                      ],
                      "children": [
                        {
                          "type": "literal",
                          "range": {
                            "start": 41,
                            "end": 50
                          },
                          "value": "adventure"
                        }
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "value": "adventure",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 41,
                          "end": 41
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 41,
                          "end": 50
                        },
                        "value": "adventure"
                      }
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 28,
                  "end": 36
                },
                "value": "gamemode",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 28,
                      "end": 28
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 28,
                      "end": 36
                    },
                    "value": "gamemode"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "value": "adventure",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 41,
                          "end": 41
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 41,
                          "end": 50
                        },
                        "value": "adventure"
                      }
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 41,
                    "end": 50
                  },
                  "value": "adventure",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 41,
                        "end": 41
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 41,
                        "end": 50
                      },
                      "value": "adventure"
                    }
                  ]
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
                "value": "gamemode",
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
                      "end": 12
                    },
                    "value": "gamemode"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 17,
                      "end": 25
                    },
                    "value": "creative",
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
                          "end": 25
                        },
                        "value": "creative"
                      }
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 25
                  },
                  "value": "creative",
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
                        "end": 25
                      },
                      "value": "creative"
                    }
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 12
              },
              "value": "gamemode",
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
                    "end": 12
                  },
                  "value": "gamemode"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 17,
                    "end": 25
                  },
                  "value": "creative",
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
                        "end": 25
                      },
                      "value": "creative"
                    }
                  ]
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 17,
                  "end": 25
                },
                "value": "creative",
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
                      "end": 25
                    },
                    "value": "creative"
                  }
                ]
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
                "value": "gamemode",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 28,
                      "end": 28
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 28,
                      "end": 36
                    },
                    "value": "gamemode"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "value": "adventure",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 41,
                          "end": 41
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 41,
                          "end": 50
                        },
                        "value": "adventure"
                      }
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 41,
                    "end": 50
                  },
                  "value": "adventure",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 41,
                        "end": 41
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 41,
                        "end": 50
                      },
                      "value": "adventure"
                    }
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 28,
                "end": 36
              },
              "value": "gamemode",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 28,
                    "end": 28
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 28,
                    "end": 36
                  },
                  "value": "gamemode"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 41,
                    "end": 50
                  },
                  "value": "adventure",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 41,
                        "end": 41
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 41,
                        "end": 50
                      },
                      "value": "adventure"
                    }
                  ]
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 41,
                  "end": 50
                },
                "value": "adventure",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 41,
                      "end": 41
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 41,
                      "end": 50
                    },
                    "value": "adventure"
                  }
                ]
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ gamemode = creative , gamemode = unknown , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 48
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 48
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
                  "value": "gamemode",
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
                        "end": 12
                      },
                      "value": "gamemode"
                    }
                  ]
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
                      "value": "creative",
                      "valueMap": [
                        {
                          "inner": {
                            "start": 0,
                            "end": 0
                          },
                          "outer": {
                            "start": 15,
                            "end": 15
                          }
                        }
                      ],
                      "children": [
                        {
                          "type": "literal",
                          "range": {
                            "start": 15,
                            "end": 23
                          },
                          "value": "creative"
                        }
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "value": "creative",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 15,
                          "end": 15
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 15,
                          "end": 23
                        },
                        "value": "creative"
                      }
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "value": "gamemode",
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
                      "end": 12
                    },
                    "value": "gamemode"
                  }
                ]
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
                    "value": "creative",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 15,
                          "end": 15
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 15,
                          "end": 23
                        },
                        "value": "creative"
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "value": "creative",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 15,
                        "end": 15
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 23
                      },
                      "value": "creative"
                    }
                  ]
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
                  "value": "gamemode",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 26,
                        "end": 26
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 26,
                        "end": 34
                      },
                      "value": "gamemode"
                    }
                  ]
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
                      "value": "unknown",
                      "valueMap": [
                        {
                          "inner": {
                            "start": 0,
                            "end": 0
                          },
                          "outer": {
                            "start": 37,
                            "end": 37
                          }
                        }
                      ],
                      "children": [
                        {
                          "type": "literal",
                          "range": {
                            "start": 37,
                            "end": 37
                          },
                          "value": ""
                        }
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 44
                    },
                    "value": "unknown",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 37,
                          "end": 37
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 37,
                          "end": 37
                        },
                        "value": ""
                      }
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 26,
                  "end": 34
                },
                "value": "gamemode",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 26,
                      "end": 26
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 26,
                      "end": 34
                    },
                    "value": "gamemode"
                  }
                ]
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
                    "value": "unknown",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 37,
                          "end": 37
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 37,
                          "end": 37
                        },
                        "value": ""
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "value": "unknown",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 37,
                        "end": 37
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 37,
                        "end": 37
                      },
                      "value": ""
                    }
                  ]
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
                "value": "gamemode",
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
                      "end": 12
                    },
                    "value": "gamemode"
                  }
                ]
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
                    "value": "creative",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 15,
                          "end": 15
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 15,
                          "end": 23
                        },
                        "value": "creative"
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 15,
                    "end": 23
                  },
                  "value": "creative",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 15,
                        "end": 15
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 23
                      },
                      "value": "creative"
                    }
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 4,
                "end": 12
              },
              "value": "gamemode",
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
                    "end": 12
                  },
                  "value": "gamemode"
                }
              ]
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
                  "value": "creative",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 15,
                        "end": 15
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 15,
                        "end": 23
                      },
                      "value": "creative"
                    }
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 15,
                  "end": 23
                },
                "value": "creative",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 15,
                      "end": 15
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 15,
                      "end": 23
                    },
                    "value": "creative"
                  }
                ]
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
                "value": "gamemode",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 26,
                      "end": 26
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 26,
                      "end": 34
                    },
                    "value": "gamemode"
                  }
                ]
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
                    "value": "unknown",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 37,
                          "end": 37
                        }
                      }
                    ],
                    "children": [
                      {
                        "type": "literal",
                        "range": {
                          "start": 37,
                          "end": 37
                        },
                        "value": ""
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 44
                  },
                  "value": "unknown",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 37,
                        "end": 37
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 37,
                        "end": 37
                      },
                      "value": ""
                    }
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 26,
                "end": 34
              },
              "value": "gamemode",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 26,
                    "end": 26
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 26,
                    "end": 34
                  },
                  "value": "gamemode"
                }
              ]
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
                  "value": "unknown",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 37,
                        "end": 37
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 37,
                        "end": 37
                      },
                      "value": ""
                    }
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 37,
                  "end": 44
                },
                "value": "unknown",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 37,
                      "end": 37
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 37,
                      "end": 37
                    },
                    "value": ""
                  }
                ]
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
    "type": "mcfunction:entity",
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
                    "end": 9
                  },
                  "value": "level",
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
                        "end": 9
                      },
                      "value": "level"
                    }
                  ]
                },
                {
                  "type": "mcfunction:int_range",
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
                "value": "level",
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
                      "end": 9
                    },
                    "value": "level"
                  }
                ]
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "mcfunction:int_range",
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
                  "value": "level",
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
                        "end": 22
                      },
                      "value": "level"
                    }
                  ]
                },
                {
                  "type": "mcfunction:int_range",
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
                "value": "level",
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
                      "end": 22
                    },
                    "value": "level"
                  }
                ]
              },
              "sep": {
                "start": 23,
                "end": 24
              },
              "value": {
                "type": "mcfunction:int_range",
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
                "value": "level",
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
                      "end": 9
                    },
                    "value": "level"
                  }
                ]
              },
              {
                "type": "mcfunction:int_range",
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
              "value": "level",
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
                    "end": 9
                  },
                  "value": "level"
                }
              ]
            },
            "sep": {
              "start": 10,
              "end": 11
            },
            "value": {
              "type": "mcfunction:int_range",
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
                "value": "level",
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
                      "end": 22
                    },
                    "value": "level"
                  }
                ]
              },
              {
                "type": "mcfunction:int_range",
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
              "value": "level",
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
                    "end": 22
                  },
                  "value": "level"
                }
              ]
            },
            "sep": {
              "start": 23,
              "end": 24
            },
            "value": {
              "type": "mcfunction:int_range",
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
    "type": "mcfunction:entity",
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
                    "end": 9
                  },
                  "value": "level",
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
                        "end": 9
                      },
                      "value": "level"
                    }
                  ]
                },
                {
                  "type": "mcfunction:int_range",
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
                "type": "string",
                "range": {
                  "start": 4,
                  "end": 9
                },
                "value": "level",
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
                      "end": 9
                    },
                    "value": "level"
                  }
                ]
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "mcfunction:int_range",
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
                    "value": ".."
                  }
                ],
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
                "value": "level",
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
                      "end": 9
                    },
                    "value": "level"
                  }
                ]
              },
              {
                "type": "mcfunction:int_range",
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
              "type": "string",
              "range": {
                "start": 4,
                "end": 9
              },
              "value": "level",
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
                    "end": 9
                  },
                  "value": "level"
                }
              ]
            },
            "sep": {
              "start": 10,
              "end": 11
            },
            "value": {
              "type": "mcfunction:int_range",
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
                  "value": ".."
                }
              ],
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ limit = 1 , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 17
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 17
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
                  "value": "limit",
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
                        "end": 9
                      },
                      "value": "limit"
                    }
                  ]
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
                "value": "limit",
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
                      "end": 9
                    },
                    "value": "limit"
                  }
                ]
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
                "value": "limit",
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
                      "end": 9
                    },
                    "value": "limit"
                  }
                ]
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
              "value": "limit",
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
                    "end": 9
                  },
                  "value": "limit"
                }
              ]
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ name = ! "SPGoding" , "name" = ! Misode , \'name\' = ! , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 60
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 60
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
                  "value": "name",
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
                      "value": "name"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 13,
                        "end": 23
                      },
                      "value": "SPGoding",
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
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "value": "SPGoding",
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
                "value": "name",
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
                    "value": "name"
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
                  "end": 23
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
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "value": "SPGoding",
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
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 13,
                    "end": 23
                  },
                  "value": "SPGoding",
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
                  ]
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
                  "value": "name",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 27,
                        "end": 27
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 27,
                        "end": 31
                      },
                      "value": "name"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 37,
                        "end": 43
                      },
                      "value": "Misode",
                      "valueMap": [
                        {
                          "inner": {
                            "start": 0,
                            "end": 0
                          },
                          "outer": {
                            "start": 37,
                            "end": 37
                          }
                        }
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "value": "Misode",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 37,
                          "end": 37
                        }
                      }
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 26,
                  "end": 32
                },
                "value": "name",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 27,
                      "end": 27
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 27,
                      "end": 31
                    },
                    "value": "name"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "value": "Misode",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 37,
                          "end": 37
                        }
                      }
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 43
                  },
                  "value": "Misode",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 37,
                        "end": 37
                      }
                    }
                  ]
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
                  "value": "name",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 47,
                        "end": 47
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 47,
                        "end": 51
                      },
                      "value": "name"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "string",
                      "range": {
                        "start": 57,
                        "end": 57
                      },
                      "value": "",
                      "valueMap": [
                        {
                          "inner": {
                            "start": 0,
                            "end": 0
                          },
                          "outer": {
                            "start": 57,
                            "end": 57
                          }
                        }
                      ]
                    }
                  ],
                  "inverted": true,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "value": "",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 57,
                          "end": 57
                        }
                      }
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 46,
                  "end": 52
                },
                "value": "name",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 47,
                      "end": 47
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 47,
                      "end": 51
                    },
                    "value": "name"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "value": "",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 57,
                          "end": 57
                        }
                      }
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 57,
                    "end": 57
                  },
                  "value": "",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 57,
                        "end": 57
                      }
                    }
                  ]
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
                "value": "name",
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
                    "value": "name"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 13,
                      "end": 23
                    },
                    "value": "SPGoding",
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
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 13,
                    "end": 23
                  },
                  "value": "SPGoding",
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
              "value": "name",
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
                  "value": "name"
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
                "end": 23
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
                  "type": "string",
                  "range": {
                    "start": 13,
                    "end": 23
                  },
                  "value": "SPGoding",
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
                  ]
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 13,
                  "end": 23
                },
                "value": "SPGoding",
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
                ]
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
                "value": "name",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 27,
                      "end": 27
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 27,
                      "end": 31
                    },
                    "value": "name"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 37,
                      "end": 43
                    },
                    "value": "Misode",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 37,
                          "end": 37
                        }
                      }
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 43
                  },
                  "value": "Misode",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 37,
                        "end": 37
                      }
                    }
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 26,
                "end": 32
              },
              "value": "name",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 27,
                    "end": 27
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 27,
                    "end": 31
                  },
                  "value": "name"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 37,
                    "end": 43
                  },
                  "value": "Misode",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 37,
                        "end": 37
                      }
                    }
                  ]
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 37,
                  "end": 43
                },
                "value": "Misode",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 37,
                      "end": 37
                    }
                  }
                ]
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
                "value": "name",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 47,
                      "end": 47
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 47,
                      "end": 51
                    },
                    "value": "name"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "string",
                    "range": {
                      "start": 57,
                      "end": 57
                    },
                    "value": "",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 57,
                          "end": 57
                        }
                      }
                    ]
                  }
                ],
                "inverted": true,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 57,
                    "end": 57
                  },
                  "value": "",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 57,
                        "end": 57
                      }
                    }
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 46,
                "end": 52
              },
              "value": "name",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 47,
                    "end": 47
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 47,
                    "end": 51
                  },
                  "value": "name"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "string",
                  "range": {
                    "start": 57,
                    "end": 57
                  },
                  "value": "",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 57,
                        "end": 57
                      }
                    }
                  ]
                }
              ],
              "inverted": true,
              "value": {
                "type": "string",
                "range": {
                  "start": 57,
                  "end": 57
                },
                "value": "",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 57,
                      "end": 57
                    }
                  }
                ]
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ name = "SPGoding" , "name" = Misode , \'name\' = , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 54
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 54
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
                  "value": "name",
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
                      "value": "name"
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
                      "type": "string",
                      "range": {
                        "start": 11,
                        "end": 21
                      },
                      "value": "SPGoding",
                      "valueMap": [
                        {
                          "inner": {
                            "start": 0,
                            "end": 0
                          },
                          "outer": {
                            "start": 12,
                            "end": 12
                          }
                        }
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "value": "SPGoding",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 12,
                          "end": 12
                        }
                      }
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
                "value": "name",
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
                    "value": "name"
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
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "value": "SPGoding",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 12,
                          "end": 12
                        }
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "value": "SPGoding",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 12,
                        "end": 12
                      }
                    }
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
                    "end": 30
                  },
                  "value": "name",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 25,
                        "end": 25
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 25,
                        "end": 29
                      },
                      "value": "name"
                    }
                  ]
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
                      "value": "Misode",
                      "valueMap": [
                        {
                          "inner": {
                            "start": 0,
                            "end": 0
                          },
                          "outer": {
                            "start": 33,
                            "end": 33
                          }
                        }
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 33,
                      "end": 39
                    },
                    "value": "Misode",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 33,
                          "end": 33
                        }
                      }
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 24,
                  "end": 30
                },
                "value": "name",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 25,
                      "end": 25
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 25,
                      "end": 29
                    },
                    "value": "name"
                  }
                ]
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
                    "value": "Misode",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 33,
                          "end": 33
                        }
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "value": "Misode",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 33,
                        "end": 33
                      }
                    }
                  ]
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
                  "value": "name",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 43,
                        "end": 43
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 43,
                        "end": 47
                      },
                      "value": "name"
                    }
                  ]
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
                      "value": "",
                      "valueMap": [
                        {
                          "inner": {
                            "start": 0,
                            "end": 0
                          },
                          "outer": {
                            "start": 51,
                            "end": 51
                          }
                        }
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "string",
                    "range": {
                      "start": 51,
                      "end": 51
                    },
                    "value": "",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 51,
                          "end": 51
                        }
                      }
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 42,
                  "end": 48
                },
                "value": "name",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 43,
                      "end": 43
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 43,
                      "end": 47
                    },
                    "value": "name"
                  }
                ]
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
                    "value": "",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 51,
                          "end": 51
                        }
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "value": "",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 51,
                        "end": 51
                      }
                    }
                  ]
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
                "value": "name",
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
                    "value": "name"
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
                    "type": "string",
                    "range": {
                      "start": 11,
                      "end": 21
                    },
                    "value": "SPGoding",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 12,
                          "end": 12
                        }
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "value": "SPGoding",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 12,
                        "end": 12
                      }
                    }
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
              "value": "name",
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
                  "value": "name"
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
                  "type": "string",
                  "range": {
                    "start": 11,
                    "end": 21
                  },
                  "value": "SPGoding",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 12,
                        "end": 12
                      }
                    }
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 11,
                  "end": 21
                },
                "value": "SPGoding",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 12,
                      "end": 12
                    }
                  }
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
                  "end": 30
                },
                "value": "name",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 25,
                      "end": 25
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 25,
                      "end": 29
                    },
                    "value": "name"
                  }
                ]
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
                    "value": "Misode",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 33,
                          "end": 33
                        }
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 33,
                    "end": 39
                  },
                  "value": "Misode",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 33,
                        "end": 33
                      }
                    }
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 24,
                "end": 30
              },
              "value": "name",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 25,
                    "end": 25
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 25,
                    "end": 29
                  },
                  "value": "name"
                }
              ]
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
                  "value": "Misode",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 33,
                        "end": 33
                      }
                    }
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 33,
                  "end": 39
                },
                "value": "Misode",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 33,
                      "end": 33
                    }
                  }
                ]
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
                "value": "name",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 43,
                      "end": 43
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 43,
                      "end": 47
                    },
                    "value": "name"
                  }
                ]
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
                    "value": "",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 51,
                          "end": 51
                        }
                      }
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "string",
                  "range": {
                    "start": 51,
                    "end": 51
                  },
                  "value": "",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 51,
                        "end": 51
                      }
                    }
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 42,
                "end": 48
              },
              "value": "name",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 43,
                    "end": 43
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 43,
                    "end": 47
                  },
                  "value": "name"
                }
              ]
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
                  "value": "",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 51,
                        "end": 51
                      }
                    }
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "string",
                "range": {
                  "start": 51,
                  "end": 51
                },
                "value": "",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 51,
                      "end": 51
                    }
                  }
                ]
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
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 16
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 16
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
                  "value": "nbt",
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
                      "value": "nbt"
                    }
                  ]
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
                "value": "nbt",
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
                    "value": "nbt"
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
                "value": "nbt",
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
                    "value": "nbt"
                  }
                ]
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
              "value": "nbt",
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
                  "value": "nbt"
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[ predicate = spgoding:foo , predicate = ! spgoding:bar , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 61
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 61
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
                  "value": "predicate",
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
                        "end": 13
                      },
                      "value": "predicate"
                    }
                  ]
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
                "value": "predicate",
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
                      "end": 13
                    },
                    "value": "predicate"
                  }
                ]
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
                  "value": "predicate",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 31,
                        "end": 31
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 31,
                        "end": 40
                      },
                      "value": "predicate"
                    }
                  ]
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
                      "value": "!"
                    },
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 45,
                        "end": 57
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
                "value": "predicate",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 31,
                      "end": 31
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 31,
                      "end": 40
                    },
                    "value": "predicate"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 45,
                      "end": 57
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
                "value": "predicate",
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
                      "end": 13
                    },
                    "value": "predicate"
                  }
                ]
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
              "value": "predicate",
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
                    "end": 13
                  },
                  "value": "predicate"
                }
              ]
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
                "value": "predicate",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 31,
                      "end": 31
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 31,
                      "end": 40
                    },
                    "value": "predicate"
                  }
                ]
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
                    "value": "!"
                  },
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 45,
                      "end": 57
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
              "value": "predicate",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 31,
                    "end": 31
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 31,
                    "end": 40
                  },
                  "value": "predicate"
                }
              ]
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
                  "value": "!"
                },
                {
                  "type": "resource_location",
                  "range": {
                    "start": 45,
                    "end": 57
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@a[limit=1]" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
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
                  "value": "limit",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 3,
                        "end": 3
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 3,
                        "end": 8
                      },
                      "value": "limit"
                    }
                  ]
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
                "value": "limit",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 3,
                      "end": 3
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 3,
                      "end": 8
                    },
                    "value": "limit"
                  }
                ]
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
                "value": "limit",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 3,
                      "end": 3
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 3,
                      "end": 8
                    },
                    "value": "limit"
                  }
                ]
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
              "value": "limit",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 3,
                    "end": 3
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 3,
                    "end": 8
                  },
                  "value": "limit"
                }
              ]
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@e" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
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
      "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@e" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
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
      "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
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
    "type": "mcfunction:entity",
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
                  "value": "limit",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 3,
                        "end": 3
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 3,
                        "end": 8
                      },
                      "value": "limit"
                    }
                  ]
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
                "value": "limit",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 3,
                      "end": 3
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 3,
                      "end": 8
                    },
                    "value": "limit"
                  }
                ]
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
                "value": "limit",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 3,
                      "end": 3
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 3,
                      "end": 8
                    },
                    "value": "limit"
                  }
                ]
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
              "value": "limit",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 3,
                    "end": 3
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 3,
                    "end": 8
                  },
                  "value": "limit"
                }
              ]
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
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 12
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 12
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
            "end": 12
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 3,
                "end": 11
              },
              "children": [
                {
                  "type": "string",
                  "range": {
                    "start": 3,
                    "end": 7
                  },
                  "value": "type",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 3,
                        "end": 3
                      }
                    }
                  ],
                  "children": [
                    {
                      "type": "literal",
                      "range": {
                        "start": 3,
                        "end": 7
                      },
                      "value": "type"
                    }
                  ]
                },
                {
                  "type": "mcfunction:entity_selector/arguments/value/invertable",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "children": [
                    {
                      "type": "resource_location",
                      "range": {
                        "start": 8,
                        "end": 11
                      },
                      "path": [
                        "foo"
                      ]
                    }
                  ],
                  "inverted": false,
                  "value": {
                    "type": "resource_location",
                    "range": {
                      "start": 8,
                      "end": 11
                    },
                    "path": [
                      "foo"
                    ]
                  }
                }
              ],
              "key": {
                "type": "string",
                "range": {
                  "start": 3,
                  "end": 7
                },
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 3,
                      "end": 3
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 3,
                      "end": 7
                    },
                    "value": "type"
                  }
                ]
              },
              "sep": {
                "start": 7,
                "end": 8
              },
              "value": {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 8,
                      "end": 11
                    },
                    "path": [
                      "foo"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "path": [
                    "foo"
                  ]
                }
              }
            }
          ]
        }
      ],
      "variable": "e",
      "argument": {
        "type": "mcfunction:entity_selector/arguments",
        "range": {
          "start": 2,
          "end": 12
        },
        "children": [
          {
            "type": "pair",
            "range": {
              "start": 3,
              "end": 11
            },
            "children": [
              {
                "type": "string",
                "range": {
                  "start": 3,
                  "end": 7
                },
                "value": "type",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 3,
                      "end": 3
                    }
                  }
                ],
                "children": [
                  {
                    "type": "literal",
                    "range": {
                      "start": 3,
                      "end": 7
                    },
                    "value": "type"
                  }
                ]
              },
              {
                "type": "mcfunction:entity_selector/arguments/value/invertable",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "children": [
                  {
                    "type": "resource_location",
                    "range": {
                      "start": 8,
                      "end": 11
                    },
                    "path": [
                      "foo"
                    ]
                  }
                ],
                "inverted": false,
                "value": {
                  "type": "resource_location",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "path": [
                    "foo"
                  ]
                }
              }
            ],
            "key": {
              "type": "string",
              "range": {
                "start": 3,
                "end": 7
              },
              "value": "type",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 3,
                    "end": 3
                  }
                }
              ],
              "children": [
                {
                  "type": "literal",
                  "range": {
                    "start": 3,
                    "end": 7
                  },
                  "value": "type"
                }
              ]
            },
            "sep": {
              "start": 7,
              "end": 8
            },
            "value": {
              "type": "mcfunction:entity_selector/arguments/value/invertable",
              "range": {
                "start": 8,
                "end": 11
              },
              "children": [
                {
                  "type": "resource_location",
                  "range": {
                    "start": 8,
                    "end": 11
                  },
                  "path": [
                    "foo"
                  ]
                }
              ],
              "inverted": false,
              "value": {
                "type": "resource_location",
                "range": {
                  "start": 8,
                  "end": 11
                },
                "path": [
                  "foo"
                ]
              }
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
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@r" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
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
          "value": "@r"
        }
      ],
      "variable": "r",
      "currentEntity": false,
      "playersOnly": true,
      "single": true,
      "typeLimited": true,
      "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "@s[ limit = 0 , limit = 0 , ]" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 29
    },
    "selector": {
      "type": "mcfunction:entity_selector",
      "range": {
        "start": 0,
        "end": 29
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
                  "value": "limit",
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
                        "end": 9
                      },
                      "value": "limit"
                    }
                  ]
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
                "value": "limit",
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
                      "end": 9
                    },
                    "value": "limit"
                  }
                ]
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
                  "value": "limit",
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
                        "end": 21
                      },
                      "value": "limit"
                    }
                  ]
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
                "value": "limit",
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
                      "end": 21
                    },
                    "value": "limit"
                  }
                ]
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
                "value": "limit",
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
                      "end": 9
                    },
                    "value": "limit"
                  }
                ]
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
              "value": "limit",
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
                    "end": 9
                  },
                  "value": "limit"
                }
              ]
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
                "value": "limit",
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
                      "end": 21
                    },
                    "value": "limit"
                  }
                ]
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
              "value": "limit",
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
                    "end": 21
                  },
                  "value": "limit"
                }
              ]
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
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 6
    },
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 6
      },
      "value": "Player",
      "valueMap": [
        {
          "inner": {
            "start": 0,
            "end": 0
          },
          "outer": {
            "start": 0,
            "end": 0
          }
        }
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "Player" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 6
    },
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 6
      },
      "value": "Player",
      "valueMap": [
        {
          "inner": {
            "start": 0,
            "end": 0
          },
          "outer": {
            "start": 0,
            "end": 0
          }
        }
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "dd12be42-52a9-4a91-a8a1-11c01849e498" with {"amount":"multiple","type":"entities"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 36
    },
    "uuid": {
      "type": "mcfunction:uuid",
      "range": {
        "start": 0,
        "end": 36
      },
      "bits": [
        "-2516740049682740591",
        "-6295731287348353896"
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:entity Parse "dd12be42-52a9-4a91-a8a1-11c01849e498" with {"amount":"single","type":"players"} 1'] = {
  "node": {
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 36
    },
    "uuid": {
      "type": "mcfunction:uuid",
      "range": {
        "start": 0,
        "end": 36
      },
      "bits": [
        "-2516740049682740591",
        "-6295731287348353896"
      ]
    }
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
    "type": "mcfunction:entity",
    "range": {
      "start": 0,
      "end": 32
    },
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 32
      },
      "value": "this_is_a_super_long_player_name",
      "valueMap": [
        {
          "inner": {
            "start": 0,
            "end": 0
          },
          "outer": {
            "start": 0,
            "end": 0
          }
        }
      ]
    }
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
