exports['list() list(no trailing comma) Parse "" 1'] = {
  "node": {
    "type": "list",
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
      "message": "Expected “[”",
      "severity": 3
    }
  ]
}

exports['list() list(no trailing comma) Parse "[ "foo"   "bar" ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "type": "item",
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        }
      },
      {
        "type": "item",
        "range": {
          "start": 10,
          "end": 16
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 11,
                  "end": 14
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 11,
                "end": 14
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
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
      "message": "Expected “,”",
      "severity": 3
    }
  ]
}

exports['list() list(no trailing comma) Parse "[ "foo" , "bar" , ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "item",
        "range": {
          "start": 10,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 11,
                  "end": 14
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 11,
                "end": 14
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
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

exports['list() list(no trailing comma) Parse "[ "foo" , "bar" ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "item",
        "range": {
          "start": 10,
          "end": 16
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 11,
                  "end": 14
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 11,
                "end": 14
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['list() list(no trailing comma) Parse "[ "foo" , ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 8,
        "end": 9
      },
      "message": "Trailing separation",
      "severity": 3
    }
  ]
}

exports['list() list(no trailing comma) Parse "[ "foo" ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "item",
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['list() list(no trailing comma) Parse "[ , "foo" ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 2,
          "end": 3
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
          "end": 10
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 4,
              "end": 9
            },
            "value": "foo",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 5,
                  "end": 8
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 4,
            "end": 9
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 5,
                "end": 8
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
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
      "message": "Expected a value",
      "severity": 3
    }
  ]
}

exports['list() list(no trailing comma) Parse "[ , ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 5
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 2,
          "end": 3
        },
        "sep": {
          "start": 2,
          "end": 3
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
      "message": "Expected a value",
      "severity": 3
    },
    {
      "range": {
        "start": 2,
        "end": 3
      },
      "message": "Trailing separation",
      "severity": 3
    }
  ]
}

exports['list() list(no trailing comma) Parse "[ ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": []
  },
  "errors": []
}

exports['list() list(no trailing comma) Parse "[" 1'] = {
  "node": {
    "type": "list",
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
      "message": "Expected “]”",
      "severity": 3
    }
  ]
}

exports['list() list(trailing comma) Parse "[ "foo" , "bar" , ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "item",
        "range": {
          "start": 10,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 11,
                  "end": 14
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 11,
                "end": 14
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
          "start": 16,
          "end": 17
        }
      }
    ]
  },
  "errors": []
}

exports['list() list(trailing comma) Parse "[ "foo" , "bar" ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "item",
        "range": {
          "start": 10,
          "end": 16
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 11,
                  "end": 14
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 11,
                "end": 14
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['list() list(trailing comma) Parse "[ "foo" , ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 2,
          "end": 9
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
          "start": 8,
          "end": 9
        }
      }
    ]
  },
  "errors": []
}

exports['list() list(trailing comma) Parse "[ "foo" ]" 1'] = {
  "node": {
    "type": "list",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "item",
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 3,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 3,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        }
      }
    ]
  },
  "errors": []
}
