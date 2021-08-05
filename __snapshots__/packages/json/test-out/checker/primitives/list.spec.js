exports['JSON list listOf(int) Check "5" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 5,
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:number",
            "typedoc": "Number"
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
      "message": "Expected an array",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(int) Check "["foo", "bar"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 14
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 7
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 6
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
            "valueMap": {
              "outerRange": {
                "start": 2,
                "end": 5
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            },
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 6
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
          "valueMap": {
            "outerRange": {
              "start": 2,
              "end": 5
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          },
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        },
        "sep": {
          "start": 6,
          "end": 7
        }
      },
      {
        "type": "item",
        "range": {
          "start": 8,
          "end": 13
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 8,
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
            "value": "bar",
            "valueMap": {
              "outerRange": {
                "start": 9,
                "end": 12
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            },
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 8,
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
          "value": "bar",
          "valueMap": {
            "outerRange": {
              "start": 9,
              "end": 12
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          },
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
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:number",
            "typedoc": "Number"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 1,
        "end": 6
      },
      "message": "Expected an integer",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 13
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(int) Check "[1, 4, 6]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 3
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
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
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 1,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        },
        "sep": {
          "start": 2,
          "end": 3
        }
      },
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 6
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 4,
              "end": 5
            },
            "value": 4,
            "expectation": [
              {
                "type": "json:number",
                "typedoc": "Number"
              }
            ]
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 4,
            "end": 5
          },
          "value": 4,
          "expectation": [
            {
              "type": "json:number",
              "typedoc": "Number"
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        }
      },
      {
        "type": "item",
        "range": {
          "start": 7,
          "end": 8
        },
        "children": [
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
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:number",
            "typedoc": "Number"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON list listOf(int) Check "[[4, 6]]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 8
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 7
        },
        "children": [
          {
            "type": "json:array",
            "range": {
              "start": 1,
              "end": 7
            },
            "children": [
              {
                "type": "item",
                "range": {
                  "start": 2,
                  "end": 4
                },
                "children": [
                  {
                    "type": "json:number",
                    "range": {
                      "start": 2,
                      "end": 3
                    },
                    "value": 4
                  }
                ],
                "value": {
                  "type": "json:number",
                  "range": {
                    "start": 2,
                    "end": 3
                  },
                  "value": 4
                },
                "sep": {
                  "start": 3,
                  "end": 4
                }
              },
              {
                "type": "item",
                "range": {
                  "start": 5,
                  "end": 6
                },
                "children": [
                  {
                    "type": "json:number",
                    "range": {
                      "start": 5,
                      "end": 6
                    },
                    "value": 6
                  }
                ],
                "value": {
                  "type": "json:number",
                  "range": {
                    "start": 5,
                    "end": 6
                  },
                  "value": 6
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
        "value": {
          "type": "json:array",
          "range": {
            "start": 1,
            "end": 7
          },
          "children": [
            {
              "type": "item",
              "range": {
                "start": 2,
                "end": 4
              },
              "children": [
                {
                  "type": "json:number",
                  "range": {
                    "start": 2,
                    "end": 3
                  },
                  "value": 4
                }
              ],
              "value": {
                "type": "json:number",
                "range": {
                  "start": 2,
                  "end": 3
                },
                "value": 4
              },
              "sep": {
                "start": 3,
                "end": 4
              }
            },
            {
              "type": "item",
              "range": {
                "start": 5,
                "end": 6
              },
              "children": [
                {
                  "type": "json:number",
                  "range": {
                    "start": 5,
                    "end": 6
                  },
                  "value": 6
                }
              ],
              "value": {
                "type": "json:number",
                "range": {
                  "start": 5,
                  "end": 6
                },
                "value": 6
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
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:number",
            "typedoc": "Number"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 1,
        "end": 7
      },
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(int) Check "[]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:number",
            "typedoc": "Number"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON list listOf(listOf(int)) Check "5" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 5,
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:array",
            "typedoc": "Array"
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
      "message": "Expected an array",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(listOf(int)) Check "["foo", "bar"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 14
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 7
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 6
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
            "valueMap": {
              "outerRange": {
                "start": 2,
                "end": 5
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            },
            "expectation": [
              {
                "type": "json:array",
                "typedoc": "Array",
                "items": [
                  {
                    "type": "json:number",
                    "typedoc": "Number"
                  }
                ]
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 6
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
          "valueMap": {
            "outerRange": {
              "start": 2,
              "end": 5
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          },
          "expectation": [
            {
              "type": "json:array",
              "typedoc": "Array",
              "items": [
                {
                  "type": "json:number",
                  "typedoc": "Number"
                }
              ]
            }
          ]
        },
        "sep": {
          "start": 6,
          "end": 7
        }
      },
      {
        "type": "item",
        "range": {
          "start": 8,
          "end": 13
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 8,
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
            "value": "bar",
            "valueMap": {
              "outerRange": {
                "start": 9,
                "end": 12
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            },
            "expectation": [
              {
                "type": "json:array",
                "typedoc": "Array",
                "items": [
                  {
                    "type": "json:number",
                    "typedoc": "Number"
                  }
                ]
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 8,
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
          "value": "bar",
          "valueMap": {
            "outerRange": {
              "start": 9,
              "end": 12
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          },
          "expectation": [
            {
              "type": "json:array",
              "typedoc": "Array",
              "items": [
                {
                  "type": "json:number",
                  "typedoc": "Number"
                }
              ]
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:array",
            "typedoc": "Array"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 1,
        "end": 6
      },
      "message": "Expected an array",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 13
      },
      "message": "Expected an array",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(listOf(int)) Check "[1, 4, 6]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 3
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 1,
            "expectation": [
              {
                "type": "json:array",
                "typedoc": "Array",
                "items": [
                  {
                    "type": "json:number",
                    "typedoc": "Number"
                  }
                ]
              }
            ]
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 1,
          "expectation": [
            {
              "type": "json:array",
              "typedoc": "Array",
              "items": [
                {
                  "type": "json:number",
                  "typedoc": "Number"
                }
              ]
            }
          ]
        },
        "sep": {
          "start": 2,
          "end": 3
        }
      },
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 6
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 4,
              "end": 5
            },
            "value": 4,
            "expectation": [
              {
                "type": "json:array",
                "typedoc": "Array",
                "items": [
                  {
                    "type": "json:number",
                    "typedoc": "Number"
                  }
                ]
              }
            ]
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 4,
            "end": 5
          },
          "value": 4,
          "expectation": [
            {
              "type": "json:array",
              "typedoc": "Array",
              "items": [
                {
                  "type": "json:number",
                  "typedoc": "Number"
                }
              ]
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        }
      },
      {
        "type": "item",
        "range": {
          "start": 7,
          "end": 8
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "expectation": [
              {
                "type": "json:array",
                "typedoc": "Array",
                "items": [
                  {
                    "type": "json:number",
                    "typedoc": "Number"
                  }
                ]
              }
            ]
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "expectation": [
            {
              "type": "json:array",
              "typedoc": "Array",
              "items": [
                {
                  "type": "json:number",
                  "typedoc": "Number"
                }
              ]
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:array",
            "typedoc": "Array"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": [
    {
      "range": {
        "start": 1,
        "end": 2
      },
      "message": "Expected an array",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 5
      },
      "message": "Expected an array",
      "severity": 3
    },
    {
      "range": {
        "start": 7,
        "end": 8
      },
      "message": "Expected an array",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(listOf(int)) Check "[[4, 6]]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 8
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 7
        },
        "children": [
          {
            "type": "json:array",
            "range": {
              "start": 1,
              "end": 7
            },
            "children": [
              {
                "type": "item",
                "range": {
                  "start": 2,
                  "end": 4
                },
                "children": [
                  {
                    "type": "json:number",
                    "range": {
                      "start": 2,
                      "end": 3
                    },
                    "value": 4,
                    "expectation": [
                      {
                        "type": "json:number",
                        "typedoc": "Number"
                      }
                    ]
                  }
                ],
                "value": {
                  "type": "json:number",
                  "range": {
                    "start": 2,
                    "end": 3
                  },
                  "value": 4,
                  "expectation": [
                    {
                      "type": "json:number",
                      "typedoc": "Number"
                    }
                  ]
                },
                "sep": {
                  "start": 3,
                  "end": 4
                }
              },
              {
                "type": "item",
                "range": {
                  "start": 5,
                  "end": 6
                },
                "children": [
                  {
                    "type": "json:number",
                    "range": {
                      "start": 5,
                      "end": 6
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
                "value": {
                  "type": "json:number",
                  "range": {
                    "start": 5,
                    "end": 6
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
                "type": "json:array",
                "typedoc": "Array",
                "items": [
                  {
                    "type": "json:number",
                    "typedoc": "Number"
                  }
                ]
              }
            ]
          }
        ],
        "value": {
          "type": "json:array",
          "range": {
            "start": 1,
            "end": 7
          },
          "children": [
            {
              "type": "item",
              "range": {
                "start": 2,
                "end": 4
              },
              "children": [
                {
                  "type": "json:number",
                  "range": {
                    "start": 2,
                    "end": 3
                  },
                  "value": 4,
                  "expectation": [
                    {
                      "type": "json:number",
                      "typedoc": "Number"
                    }
                  ]
                }
              ],
              "value": {
                "type": "json:number",
                "range": {
                  "start": 2,
                  "end": 3
                },
                "value": 4,
                "expectation": [
                  {
                    "type": "json:number",
                    "typedoc": "Number"
                  }
                ]
              },
              "sep": {
                "start": 3,
                "end": 4
              }
            },
            {
              "type": "item",
              "range": {
                "start": 5,
                "end": 6
              },
              "children": [
                {
                  "type": "json:number",
                  "range": {
                    "start": 5,
                    "end": 6
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
              "value": {
                "type": "json:number",
                "range": {
                  "start": 5,
                  "end": 6
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
              "type": "json:array",
              "typedoc": "Array",
              "items": [
                {
                  "type": "json:number",
                  "typedoc": "Number"
                }
              ]
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:array",
            "typedoc": "Array"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON list listOf(listOf(int)) Check "[]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
          {
            "type": "json:array",
            "typedoc": "Array"
          }
        ]
      }
    ]
  },
  "parserErrors": [],
  "checkerErrors": []
}

exports['JSON list listOf(string) Check "5" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 5,
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
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
        "end": 1
      },
      "message": "Expected an array",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(string) Check "["foo", "bar"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 14
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 7
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 6
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
            "valueMap": {
              "outerRange": {
                "start": 2,
                "end": 5
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            },
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 6
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
          "valueMap": {
            "outerRange": {
              "start": 2,
              "end": 5
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          },
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        },
        "sep": {
          "start": 6,
          "end": 7
        }
      },
      {
        "type": "item",
        "range": {
          "start": 8,
          "end": 13
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 8,
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
            "value": "bar",
            "valueMap": {
              "outerRange": {
                "start": 9,
                "end": 12
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            },
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 8,
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
          "value": "bar",
          "valueMap": {
            "outerRange": {
              "start": 9,
              "end": 12
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          },
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
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

exports['JSON list listOf(string) Check "[1, 4, 6]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 3
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 1,
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 1,
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        },
        "sep": {
          "start": 2,
          "end": 3
        }
      },
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 6
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 4,
              "end": 5
            },
            "value": 4,
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 4,
            "end": 5
          },
          "value": 4,
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
        }
      },
      {
        "type": "item",
        "range": {
          "start": 7,
          "end": 8
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": 6,
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": 6,
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
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
        "start": 1,
        "end": 2
      },
      "message": "Expected a string",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 5
      },
      "message": "Expected a string",
      "severity": 3
    },
    {
      "range": {
        "start": 7,
        "end": 8
      },
      "message": "Expected a string",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(string) Check "[[4, 6]]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 8
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 7
        },
        "children": [
          {
            "type": "json:array",
            "range": {
              "start": 1,
              "end": 7
            },
            "children": [
              {
                "type": "item",
                "range": {
                  "start": 2,
                  "end": 4
                },
                "children": [
                  {
                    "type": "json:number",
                    "range": {
                      "start": 2,
                      "end": 3
                    },
                    "value": 4
                  }
                ],
                "value": {
                  "type": "json:number",
                  "range": {
                    "start": 2,
                    "end": 3
                  },
                  "value": 4
                },
                "sep": {
                  "start": 3,
                  "end": 4
                }
              },
              {
                "type": "item",
                "range": {
                  "start": 5,
                  "end": 6
                },
                "children": [
                  {
                    "type": "json:number",
                    "range": {
                      "start": 5,
                      "end": 6
                    },
                    "value": 6
                  }
                ],
                "value": {
                  "type": "json:number",
                  "range": {
                    "start": 5,
                    "end": 6
                  },
                  "value": 6
                }
              }
            ],
            "expectation": [
              {
                "type": "json:string",
                "typedoc": "String"
              }
            ]
          }
        ],
        "value": {
          "type": "json:array",
          "range": {
            "start": 1,
            "end": 7
          },
          "children": [
            {
              "type": "item",
              "range": {
                "start": 2,
                "end": 4
              },
              "children": [
                {
                  "type": "json:number",
                  "range": {
                    "start": 2,
                    "end": 3
                  },
                  "value": 4
                }
              ],
              "value": {
                "type": "json:number",
                "range": {
                  "start": 2,
                  "end": 3
                },
                "value": 4
              },
              "sep": {
                "start": 3,
                "end": 4
              }
            },
            {
              "type": "item",
              "range": {
                "start": 5,
                "end": 6
              },
              "children": [
                {
                  "type": "json:number",
                  "range": {
                    "start": 5,
                    "end": 6
                  },
                  "value": 6
                }
              ],
              "value": {
                "type": "json:number",
                "range": {
                  "start": 5,
                  "end": 6
                },
                "value": 6
              }
            }
          ],
          "expectation": [
            {
              "type": "json:string",
              "typedoc": "String"
            }
          ]
        }
      }
    ],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
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
        "start": 1,
        "end": 7
      },
      "message": "Expected a string",
      "severity": 3
    }
  ]
}

exports['JSON list listOf(string) Check "[]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [],
    "expectation": [
      {
        "type": "json:array",
        "typedoc": "Array",
        "items": [
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
