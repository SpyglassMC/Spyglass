exports['SymbolUtil clear() Should clear all 1'] = {
  "nbtdoc": {
    "ShouldBeKept1": {
      "category": "nbtdoc",
      "identifier": "ShouldBeKept1",
      "definition": [
        {
          "uri": "spyglassmc://another_test_file"
        }
      ],
      "members": {
        "ShouldBeKept2": {
          "category": "nbtdoc",
          "identifier": "ShouldBeKept2",
          "reference": [
            {
              "uri": "spyglassmc://another_test_file"
            }
          ]
        },
        "ShouldBeKept3": {
          "category": "nbtdoc",
          "identifier": "ShouldBeKept3",
          "definition": [
            {
              "uri": "spyglassmc://another_test_file"
            }
          ]
        }
      }
    }
  }
}

exports['SymbolUtil getStack() Should create a new stack 1'] = [
  {}
]

exports['SymbolUtil getStack() Should get the existing stack 1'] = [
  {},
  {
    "advancement": {
      "Foo": {
        "category": "advancement",
        "identifier": "Foo",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ]
      }
    }
  }
]

exports['SymbolUtil lookup() Should return correctly for “Foo.Bar.Qux.Xer” 1'] = {
  "parentSymbol": {
    "category": "advancement",
    "identifier": "Qux",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ]
  },
  "map": null,
  "symbol": null
}

exports['SymbolUtil lookup() Should return correctly for “Foo.Bar.Qux” 1'] = {
  "parentSymbol": {
    "category": "advancement",
    "identifier": "Bar",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ],
    "members": {
      "Qux": {
        "category": "advancement",
        "identifier": "Qux",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ]
      }
    }
  },
  "map": {
    "Qux": {
      "category": "advancement",
      "identifier": "Qux",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ]
    }
  },
  "symbol": {
    "category": "advancement",
    "identifier": "Qux",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ]
  }
}

exports['SymbolUtil lookup() Should return correctly for “Foo.Bar.Unknown” 1'] = {
  "parentSymbol": {
    "category": "advancement",
    "identifier": "Bar",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ],
    "members": {
      "Qux": {
        "category": "advancement",
        "identifier": "Qux",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ]
      }
    }
  },
  "map": {
    "Qux": {
      "category": "advancement",
      "identifier": "Qux",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ]
    }
  },
  "symbol": null
}

exports['SymbolUtil lookup() Should return correctly for “Foo.Bar” 1'] = {
  "parentSymbol": {
    "category": "advancement",
    "identifier": "Foo",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ],
    "members": {
      "Bar": {
        "category": "advancement",
        "identifier": "Bar",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ],
        "members": {
          "Qux": {
            "category": "advancement",
            "identifier": "Qux",
            "definition": [
              {
                "uri": "spyglassmc://test_file"
              }
            ]
          }
        }
      }
    }
  },
  "map": {
    "Bar": {
      "category": "advancement",
      "identifier": "Bar",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ],
      "members": {
        "Qux": {
          "category": "advancement",
          "identifier": "Qux",
          "definition": [
            {
              "uri": "spyglassmc://test_file"
            }
          ]
        }
      }
    }
  },
  "symbol": {
    "category": "advancement",
    "identifier": "Bar",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ],
    "members": {
      "Qux": {
        "category": "advancement",
        "identifier": "Qux",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ]
      }
    }
  }
}

exports['SymbolUtil lookup() Should return correctly for “Foo.Baz.Xer” 1'] = {
  "parentSymbol": {
    "category": "advancement",
    "identifier": "Baz",
    "doc": "STACK",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ]
  },
  "map": null,
  "symbol": null
}

exports['SymbolUtil lookup() Should return correctly for “Foo.Baz” 1'] = {
  "parentSymbol": {
    "category": "advancement",
    "identifier": "Foo",
    "doc": "STACK",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ],
    "members": {
      "Baz": {
        "category": "advancement",
        "identifier": "Baz",
        "doc": "STACK",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ]
      }
    }
  },
  "map": {
    "Baz": {
      "category": "advancement",
      "identifier": "Baz",
      "doc": "STACK",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ]
    }
  },
  "symbol": {
    "category": "advancement",
    "identifier": "Baz",
    "doc": "STACK",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ]
  }
}

exports['SymbolUtil lookup() Should return correctly for “Foo.Unknown” 1'] = {
  "parentSymbol": {
    "category": "advancement",
    "identifier": "Foo",
    "doc": "STACK",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ],
    "members": {
      "Baz": {
        "category": "advancement",
        "identifier": "Baz",
        "doc": "STACK",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ]
      }
    }
  },
  "map": {
    "Baz": {
      "category": "advancement",
      "identifier": "Baz",
      "doc": "STACK",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ]
    }
  },
  "symbol": null
}

exports['SymbolUtil lookup() Should return correctly for “Foo” 1'] = {
  "parentSymbol": null,
  "map": {
    "Foo": {
      "category": "advancement",
      "identifier": "Foo",
      "doc": "STACK",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ],
      "members": {
        "Baz": {
          "category": "advancement",
          "identifier": "Baz",
          "doc": "STACK",
          "definition": [
            {
              "uri": "spyglassmc://test_file"
            }
          ]
        }
      }
    }
  },
  "symbol": {
    "category": "advancement",
    "identifier": "Foo",
    "doc": "STACK",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ],
    "members": {
      "Baz": {
        "category": "advancement",
        "identifier": "Baz",
        "doc": "STACK",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ]
      }
    }
  }
}

exports['SymbolUtil lookup() Should return correctly for “Unknown” 1'] = {
  "parentSymbol": null,
  "map": {
    "Foo": {
      "category": "advancement",
      "identifier": "Foo",
      "doc": "STACK",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ],
      "members": {
        "Baz": {
          "category": "advancement",
          "identifier": "Baz",
          "doc": "STACK",
          "definition": [
            {
              "uri": "spyglassmc://test_file"
            }
          ]
        }
      }
    }
  },
  "symbol": null
}

exports['SymbolUtil lookup() Should return correctly for “” 1'] = {
  "parentSymbol": null,
  "map": {
    "Foo": {
      "category": "advancement",
      "identifier": "Foo",
      "doc": "STACK",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ],
      "members": {
        "Baz": {
          "category": "advancement",
          "identifier": "Baz",
          "doc": "STACK",
          "definition": [
            {
              "uri": "spyglassmc://test_file"
            }
          ]
        }
      }
    }
  },
  "symbol": null
}

exports['SymbolUtil lookup() Should return correctly when URI is not specified 1'] = {
  "parentSymbol": null,
  "map": {
    "Foo": {
      "category": "advancement",
      "identifier": "Foo",
      "definition": [
        {
          "uri": "spyglassmc://test_file"
        }
      ],
      "members": {
        "Bar": {
          "category": "advancement",
          "identifier": "Bar",
          "definition": [
            {
              "uri": "spyglassmc://test_file"
            }
          ],
          "members": {
            "Qux": {
              "category": "advancement",
              "identifier": "Qux",
              "definition": [
                {
                  "uri": "spyglassmc://test_file"
                }
              ]
            }
          }
        }
      }
    }
  },
  "symbol": {
    "category": "advancement",
    "identifier": "Foo",
    "definition": [
      {
        "uri": "spyglassmc://test_file"
      }
    ],
    "members": {
      "Bar": {
        "category": "advancement",
        "identifier": "Bar",
        "definition": [
          {
            "uri": "spyglassmc://test_file"
          }
        ],
        "members": {
          "Qux": {
            "category": "advancement",
            "identifier": "Qux",
            "definition": [
              {
                "uri": "spyglassmc://test_file"
              }
            ]
          }
        }
      }
    }
  }
}

exports['SymbolUtil uriBinding Should execute correctly 1'] = {
  "test": {
    "BeforeBinding2": {
      "category": "test",
      "identifier": "BeforeBinding2",
      "doc": "Entered before URI binding w/ references.",
      "reference": [
        {
          "uri": "spyglassmc://test_file"
        }
      ]
    },
    "Bound": {
      "category": "test",
      "identifier": "Bound",
      "doc": "This symbol is URI bound.",
      "reference": [
        {
          "uri": "spyglassmc://test_file",
          "isUriBound": true
        }
      ]
    },
    "AfterBinding": {
      "category": "test",
      "identifier": "AfterBinding",
      "doc": "Entered after URI binding w/ references.",
      "reference": [
        {
          "uri": "spyglassmc://test_file"
        }
      ]
    }
  }
}
