exports['mcfunction parser entry() Parse "" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 0
    },
    "children": []
  },
  "errors": []
}

exports['mcfunction parser entry() Parse "# this is a comment ⧵ ↓ still a comment" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 39
    },
    "children": [
      {
        "type": "comment",
        "range": {
          "start": 0,
          "end": 22
        },
        "comment": " this is a comment \\ "
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 24,
          "end": 39
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 24,
              "end": 29
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 24,
                  "end": 29
                },
                "value": "still"
              }
            ],
            "path": [
              "still"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 29,
              "end": 39
            },
            "children": [
              {
                "type": "mcfunction:command_child/trailing",
                "range": {
                  "start": 29,
                  "end": 39
                },
                "value": " a comment"
              }
            ],
            "path": []
          }
        ]
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 24,
        "end": 29
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    },
    {
      "range": {
        "start": 29,
        "end": 39
      },
      "message": "Trailing data encountered: “ a comment”",
      "severity": 3
    }
  ]
}

exports['mcfunction parser entry() Parse "# this is a comment" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "comment",
        "range": {
          "start": 0,
          "end": 19
        },
        "comment": " this is a comment"
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser entry() Parse "# this is a comment↓say hi↓$this is a macro ↓" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 45
    },
    "children": [
      {
        "type": "comment",
        "range": {
          "start": 0,
          "end": 19
        },
        "comment": " this is a comment"
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 20,
          "end": 26
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 20,
              "end": 23
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 20,
                  "end": 23
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 24,
              "end": 26
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 24,
                  "end": 26
                },
                "value": "hi"
              }
            ],
            "path": [
              "say",
              "hi"
            ]
          }
        ]
      },
      {
        "type": "mcfunction:command_macro",
        "range": {
          "start": 27,
          "end": 44
        }
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser entry() Parse "$ this is a macro command" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 25
    },
    "children": [
      {
        "type": "mcfunction:command_macro",
        "range": {
          "start": 0,
          "end": 25
        }
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser entry() Parse "$ this is a macro ⧵ ↓ this is still a macro" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 43
    },
    "children": [
      {
        "type": "mcfunction:command_macro",
        "range": {
          "start": 0,
          "end": 20
        }
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 22,
          "end": 43
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 22,
              "end": 26
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 22,
                  "end": 26
                },
                "value": "this"
              }
            ],
            "path": [
              "this"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 26,
              "end": 43
            },
            "children": [
              {
                "type": "mcfunction:command_child/trailing",
                "range": {
                  "start": 26,
                  "end": 43
                },
                "value": " is still a macro"
              }
            ],
            "path": []
          }
        ]
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 22,
        "end": 26
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    },
    {
      "range": {
        "start": 26,
        "end": 43
      },
      "message": "Trailing data encountered: “ is still a macro”",
      "severity": 3
    }
  ]
}

exports['mcfunction parser entry() Parse "execute if true if true run say hi" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 34
    },
    "children": [
      {
        "type": "mcfunction:command",
        "range": {
          "start": 0,
          "end": 34
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 0,
              "end": 7
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 0,
                  "end": 7
                },
                "value": "execute"
              }
            ],
            "path": [
              "execute"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 8,
              "end": 10
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 8,
                  "end": 10
                },
                "value": "if"
              }
            ],
            "path": [
              "execute",
              "if"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 11,
              "end": 15
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 11,
                  "end": 15
                },
                "value": "true"
              }
            ],
            "path": [
              "execute",
              "if",
              "true"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 16,
              "end": 18
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 16,
                  "end": 18
                },
                "value": "if"
              }
            ],
            "path": [
              "execute",
              "if"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 19,
              "end": 23
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 19,
                  "end": 23
                },
                "value": "true"
              }
            ],
            "path": [
              "execute",
              "if",
              "true"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 24,
              "end": 27
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "value": "run"
              }
            ],
            "path": [
              "execute",
              "run"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 28,
              "end": 31
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 28,
                  "end": 31
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 32,
              "end": 34
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 32,
                  "end": 34
                },
                "value": "hi"
              }
            ],
            "path": [
              "say",
              "hi"
            ]
          }
        ]
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser entry() Parse "say hi" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "mcfunction:command",
        "range": {
          "start": 0,
          "end": 6
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 0,
              "end": 3
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 0,
                  "end": 3
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 4,
              "end": 6
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 4,
                  "end": 6
                },
                "value": "hi"
              }
            ],
            "path": [
              "say",
              "hi"
            ]
          }
        ]
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser entry() Parse "say hi↓say hi" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 13
    },
    "children": [
      {
        "type": "mcfunction:command",
        "range": {
          "start": 0,
          "end": 6
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 0,
              "end": 3
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 0,
                  "end": 3
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 4,
              "end": 6
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 4,
                  "end": 6
                },
                "value": "hi"
              }
            ],
            "path": [
              "say",
              "hi"
            ]
          }
        ]
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 7,
          "end": 13
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 7,
              "end": 10
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 7,
                  "end": 10
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 11,
              "end": 13
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 11,
                  "end": 13
                },
                "value": "hi"
              }
            ],
            "path": [
              "say",
              "hi"
            ]
          }
        ]
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser entry() Parse "say trailing ⧵↓ data" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 20
    },
    "children": [
      {
        "type": "mcfunction:command",
        "range": {
          "start": 0,
          "end": 14
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 0,
              "end": 3
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 0,
                  "end": 3
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 4,
              "end": 12
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 4,
                  "end": 12
                },
                "value": "trailing"
              }
            ],
            "path": [
              "say",
              "trailing"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 12,
              "end": 14
            },
            "children": [
              {
                "type": "mcfunction:command_child/trailing",
                "range": {
                  "start": 12,
                  "end": 14
                },
                "value": " \\"
              }
            ],
            "path": []
          }
        ]
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 16,
          "end": 20
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 16,
              "end": 20
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 16,
                  "end": 20
                },
                "value": "data"
              }
            ],
            "path": [
              "data"
            ]
          }
        ]
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 12
      },
      "message": "Expected “hi”",
      "severity": 3
    },
    {
      "range": {
        "start": 12,
        "end": 14
      },
      "message": "Trailing data encountered: “ \\”",
      "severity": 3
    },
    {
      "range": {
        "start": 16,
        "end": 20
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    },
    {
      "range": {
        "start": 20,
        "end": 20
      },
      "message": "Expected more arguments",
      "severity": 3
    }
  ]
}

exports['mcfunction parser entry() Parse "say ⧵↓ hi ↓ # comment start ⧵↓ end ↓ say hi" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 43
    },
    "children": [
      {
        "type": "mcfunction:command",
        "range": {
          "start": 0,
          "end": 10
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 0,
              "end": 3
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 0,
                  "end": 3
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 7,
              "end": 9
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 7,
                  "end": 9
                },
                "value": "hi"
              }
            ],
            "path": [
              "say",
              "hi"
            ]
          }
        ]
      },
      {
        "type": "comment",
        "range": {
          "start": 12,
          "end": 29
        },
        "comment": " comment start \\"
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 31,
          "end": 35
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 31,
              "end": 34
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 31,
                  "end": 34
                },
                "value": "end"
              }
            ],
            "path": [
              "end"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 34,
              "end": 35
            },
            "children": [
              {
                "type": "mcfunction:command_child/trailing",
                "range": {
                  "start": 34,
                  "end": 35
                },
                "value": " "
              }
            ],
            "path": []
          }
        ]
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 37,
          "end": 43
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 37,
              "end": 40
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 37,
                  "end": 40
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 41,
              "end": 43
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 41,
                  "end": 43
                },
                "value": "hi"
              }
            ],
            "path": [
              "say",
              "hi"
            ]
          }
        ]
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 31,
        "end": 34
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    },
    {
      "range": {
        "start": 34,
        "end": 35
      },
      "message": "Trailing data encountered: “ ”",
      "severity": 3
    }
  ]
}

exports['mcfunction parser entry() Parse "sa⧵  ↓  y ⧵ ↓ hi" 1'] = {
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "type": "mcfunction:command",
        "range": {
          "start": 0,
          "end": 16
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 0,
              "end": 9
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 0,
                  "end": 9
                },
                "value": "say"
              }
            ],
            "path": [
              "say"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 14,
              "end": 16
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 14,
                  "end": 16
                },
                "value": "hi"
              }
            ],
            "path": [
              "say",
              "hi"
            ]
          }
        ]
      }
    ]
  },
  "errors": []
}
