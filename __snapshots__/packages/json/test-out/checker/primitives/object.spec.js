exports['JSON object object() Check "[2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 2
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 2
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 2
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an object",
      "severity": 3
    }
  ]
}

exports['JSON object object() Check "{ "a": 1 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "a",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "a",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object() Check "{ "a": 3, "b": "foo" }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "a",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "a",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3
        },
        "end": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 10,
          "end": 21
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "b",
            "valueMap": [
              {
                "outer": {
                  "start": 11,
                  "end": 11
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "foo",
            "valueMap": [
              {
                "outer": {
                  "start": 16,
                  "end": 16
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "b",
          "valueMap": [
            {
              "outer": {
                "start": 11,
                "end": 11
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 13,
          "end": 14
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "foo",
          "valueMap": [
            {
              "outer": {
                "start": 16,
                "end": 16
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object() Check "{ "b": 6 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "b",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "b",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object() Check "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object"
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object(string, () => int) Check "[2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 2
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 2
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 2
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "keys": [
          {
            "type": "json:string",
            "typedoc": "String"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an object",
      "severity": 3
    }
  ]
}

exports['JSON object object(string, () => int) Check "{ "a": 1 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "a",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "a",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "keys": [
          {
            "type": "json:string",
            "typedoc": "String"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object(string, () => int) Check "{ "a": 3, "b": "foo" }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "a",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "a",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        },
        "end": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 10,
          "end": 21
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "b",
            "valueMap": [
              {
                "outer": {
                  "start": 11,
                  "end": 11
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "foo",
            "valueMap": [
              {
                "outer": {
                  "start": 16,
                  "end": 16
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "b",
          "valueMap": [
            {
              "outer": {
                "start": 11,
                "end": 11
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        },
        "sep": {
          "start": 13,
          "end": 14
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "foo",
          "valueMap": [
            {
              "outer": {
                "start": 16,
                "end": 16
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "keys": [
          {
            "type": "json:string",
            "typedoc": "String"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 15,
        "end": 20
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON object object(string, () => int) Check "{ "b": 6 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "b",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "b",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "keys": [
          {
            "type": "json:string",
            "typedoc": "String"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object object(string, () => int) Check "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "keys": [
          {
            "type": "json:string",
            "typedoc": "String"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object record({ a: int }) Check "[2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 2
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 2
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 2
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an object",
      "severity": 3
    }
  ]
}

exports['JSON object record({ a: int }) Check "{ "a": 1 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "a",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "a",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "hover": "```typescript\n.a: Number\n```"
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object record({ a: int }) Check "{ "a": 3, "b": "foo" }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "a",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "a",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "hover": "```typescript\n.a: Number\n```"
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        },
        "end": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 10,
          "end": 21
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "b",
            "valueMap": [
              {
                "outer": {
                  "start": 11,
                  "end": 11
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "foo",
            "valueMap": [
              {
                "outer": {
                  "start": 16,
                  "end": 16
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "b",
          "valueMap": [
            {
              "outer": {
                "start": 11,
                "end": 11
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 13,
          "end": 14
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "foo",
          "valueMap": [
            {
              "outer": {
                "start": 16,
                "end": 16
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 10,
        "end": 13
      },
      "message": "Unknown property “b”",
      "severity": 2
    }
  ]
}

exports['JSON object record({ a: int }) Check "{ "b": 6 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "b",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "b",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Missing property “a”",
      "severity": 3
    },
    {
      "range": {
        "start": 2,
        "end": 5
      },
      "message": "Unknown property “b”",
      "severity": 2
    }
  ]
}

exports['JSON object record({ a: int }) Check "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Missing property “a”",
      "severity": 3
    }
  ]
}

exports['JSON object record({ a: opt(int) }) Check "[2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 2
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 2
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 2
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ],
            "opt": true
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected an object",
      "severity": 3
    }
  ]
}

exports['JSON object record({ a: opt(int) }) Check "{ "a": 1 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "a",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 1,
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "a",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "hover": "```typescript\n.a: Number\n```"
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 1,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ],
            "opt": true
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON object record({ a: opt(int) }) Check "{ "a": 3, "b": "foo" }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "a",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ],
            "hover": "```typescript\n.a: Number\n```"
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 3,
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "a",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ],
          "hover": "```typescript\n.a: Number\n```"
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 3,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        },
        "end": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 10,
          "end": 21
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 10,
              "end": 13
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "b",
            "valueMap": [
              {
                "outer": {
                  "start": 11,
                  "end": 11
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:string",
            "range": {
              "start": 15,
              "end": 20
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "foo",
            "valueMap": [
              {
                "outer": {
                  "start": 16,
                  "end": 16
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 10,
            "end": 13
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "b",
          "valueMap": [
            {
              "outer": {
                "start": 11,
                "end": 11
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 13,
          "end": 14
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 15,
            "end": 20
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "foo",
          "valueMap": [
            {
              "outer": {
                "start": 16,
                "end": 16
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ],
            "opt": true
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 10,
        "end": 13
      },
      "message": "Unknown property “b”",
      "severity": 2
    }
  ]
}

exports['JSON object record({ a: opt(int) }) Check "{ "b": 6 }" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 2,
              "end": 5
            },
            "options": {
              "escapable": {
                "characters": [
                  "b",
                  "f",
                  "n",
                  "r",
                  "t"
                ],
                "unicode": true
              },
              "quotes": [
                "\""
              ]
            },
            "value": "b",
            "valueMap": [
              {
                "outer": {
                  "start": 3,
                  "end": 3
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 2,
            "end": 5
          },
          "options": {
            "escapable": {
              "characters": [
                "b",
                "f",
                "n",
                "r",
                "t"
              ],
              "unicode": true
            },
            "quotes": [
              "\""
            ]
          },
          "value": "b",
          "valueMap": [
            {
              "outer": {
                "start": 3,
                "end": 3
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6
        }
      }
    ],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ],
            "opt": true
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 2,
        "end": 5
      },
      "message": "Unknown property “b”",
      "severity": 2
    }
  ]
}

exports['JSON object record({ a: opt(int) }) Check "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [],
    "expectation": [
      {
        "type": "json:object",
        "typedoc": "Object",
        "fields": [
          {
            "key": "a",
            "value": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ],
            "opt": true
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}
