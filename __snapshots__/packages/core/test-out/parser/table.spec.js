exports['table() table(no trailing comma) Parse "" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 0
    },
    "children": []
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “{”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ "foo" : "bar"   "baz" : "qux" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 33
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 18
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 32
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
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
          ]
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
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
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 18,
        "end": 18
      },
      "message": "Expected “,”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ "foo" : "bar" , "baz" : "qux" , }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 35
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 33
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
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
          ]
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
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
          ]
        },
        "end": {
          "start": 32,
          "end": 33
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 32,
        "end": 33
      },
      "message": "Trailing separation",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ "foo" : "bar" , "baz" : "qux" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 33
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 32
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
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
          ]
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
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
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['table() table(no trailing comma) Parse "{ "foo" : "bar" , "baz" : }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 27
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 26
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 26
            },
            "value": "",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
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
          ]
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 26
          },
          "value": "",
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
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 26,
        "end": 26
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ "foo" : "bar" , "baz" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 25
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 24
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 24,
              "end": 24
            },
            "value": "",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
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
          ]
        },
        "value": {
          "type": "string",
          "range": {
            "start": 24,
            "end": 24
          },
          "value": "",
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
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 24,
        "end": 24
      },
      "message": "Expected “:”",
      "severity": 3
    },
    {
      "range": {
        "start": 24,
        "end": 24
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ "foo" : "bar" , }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 16,
        "end": 17
      },
      "message": "Trailing separation",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ "foo" : "bar" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 16
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['table() table(no trailing comma) Parse "{ "foo" : }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 10
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 10
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 10,
                  "end": 10
                }
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 10
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 10,
                "end": 10
              }
            }
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 10,
        "end": 10
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ "foo" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 8
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 8,
                  "end": 8
                }
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "value": {
          "type": "string",
          "range": {
            "start": 8,
            "end": 8
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 8,
                "end": 8
              }
            }
          ]
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
      "message": "Expected “:”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ , "foo" : "bar" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 3
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 2
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              }
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 2
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 2
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            }
          ]
        },
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 2
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            }
          ]
        },
        "end": {
          "start": 2,
          "end": 3
        }
      },
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
              "end": 9
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 5,
                  "end": 5
                }
              }
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 12,
              "end": 17
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 13,
                  "end": 13
                }
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 4,
            "end": 9
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 5,
                "end": 5
              }
            }
          ]
        },
        "sep": {
          "start": 10,
          "end": 11
        },
        "value": {
          "type": "string",
          "range": {
            "start": 12,
            "end": 17
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 13,
                "end": 13
              }
            }
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “\"”",
      "severity": 3
    },
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “:”",
      "severity": 3
    },
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ : "bar" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 10
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 2
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              }
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 4,
              "end": 9
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 5,
                  "end": 5
                }
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 2
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            }
          ]
        },
        "sep": {
          "start": 2,
          "end": 3
        },
        "value": {
          "type": "string",
          "range": {
            "start": 4,
            "end": 9
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 5,
                "end": 5
              }
            }
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ : }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 5
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 4
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 2
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              }
            ]
          },
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 2
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            }
          ]
        },
        "sep": {
          "start": 2,
          "end": 3
        },
        "value": {
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
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “\"”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['table() table(no trailing comma) Parse "{ }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": []
  },
  "errors": []
}

exports['table() table(no trailing comma) Parse "{" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 1
    },
    "children": []
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected “}”",
      "severity": 3
    }
  ]
}

exports['table() table(trailing comma) Parse "{ "foo" : "bar" , "baz" : "qux" , }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 35
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 33
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
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
          ]
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
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
          ]
        },
        "end": {
          "start": 32,
          "end": 33
        }
      }
    ]
  },
  "errors": []
}

exports['table() table(trailing comma) Parse "{ "foo" : "bar" , "baz" : "qux" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 33
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 32
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
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
          ]
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
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
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['table() table(trailing comma) Parse "{ "foo" : "bar" , }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      }
    ]
  },
  "errors": []
}

exports['table() table(trailing comma) Parse "{ "foo" : "bar" }" 1'] = {
  "node": {
    "type": "table",
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 16
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
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
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
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
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
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
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
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
          ]
        }
      }
    ]
  },
  "errors": []
}
