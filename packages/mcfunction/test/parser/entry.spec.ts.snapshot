exports[`mcfunction parser entry() > Parse '# this is a comment \\ ↓ still a comment' 1`] = `
{
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
          "end": 39
        },
        "comment": " this is a comment still a comment",
        "prefix": "#"
      }
    ]
  },
  "errors": []
}
`;

exports[`mcfunction parser entry() > Parse '# this is a comment' 1`] = `
{
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
        "comment": " this is a comment",
        "prefix": "#"
      }
    ]
  },
  "errors": []
}
`;

exports[`mcfunction parser entry() > Parse '# this is a comment↓say hi↓$this is a $(macro) ↓' 1`] = `
{
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 48
    },
    "children": [
      {
        "type": "comment",
        "range": {
          "start": 0,
          "end": 19
        },
        "comment": " this is a comment",
        "prefix": "#"
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
        "type": "mcfunction:macro",
        "range": {
          "start": 27,
          "end": 47
        },
        "children": [
          {
            "type": "mcfunction:macro/prefix",
            "range": {
              "start": 27,
              "end": 28
            }
          },
          {
            "type": "mcfunction:macro/other",
            "range": {
              "start": 28,
              "end": 38
            },
            "value": "this is a "
          },
          {
            "type": "mcfunction:macro/argument",
            "range": {
              "start": 38,
              "end": 46
            },
            "value": "macro"
          },
          {
            "type": "mcfunction:macro/other",
            "range": {
              "start": 46,
              "end": 47
            },
            "value": " "
          }
        ]
      }
    ]
  },
  "errors": []
}
`;

exports[`mcfunction parser entry() > Parse '$this is a $(macro) \\ ↓ this is $(still) a macro' 1`] = `
{
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 48
    },
    "children": [
      {
        "type": "mcfunction:macro",
        "range": {
          "start": 0,
          "end": 48
        },
        "children": [
          {
            "type": "mcfunction:macro/prefix",
            "range": {
              "start": 0,
              "end": 1
            }
          },
          {
            "type": "mcfunction:macro/other",
            "range": {
              "start": 1,
              "end": 11
            },
            "value": "this is a "
          },
          {
            "type": "mcfunction:macro/argument",
            "range": {
              "start": 11,
              "end": 19
            },
            "value": "macro"
          },
          {
            "type": "mcfunction:macro/other",
            "range": {
              "start": 19,
              "end": 32
            },
            "value": " this is "
          },
          {
            "type": "mcfunction:macro/argument",
            "range": {
              "start": 32,
              "end": 40
            },
            "value": "still"
          },
          {
            "type": "mcfunction:macro/other",
            "range": {
              "start": 40,
              "end": 48
            },
            "value": " a macro"
          }
        ]
      }
    ]
  },
  "errors": []
}
`;

exports[`mcfunction parser entry() > Parse '$this is a $(macro) command' 1`] = `
{
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 27
    },
    "children": [
      {
        "type": "mcfunction:macro",
        "range": {
          "start": 0,
          "end": 27
        },
        "children": [
          {
            "type": "mcfunction:macro/prefix",
            "range": {
              "start": 0,
              "end": 1
            }
          },
          {
            "type": "mcfunction:macro/other",
            "range": {
              "start": 1,
              "end": 11
            },
            "value": "this is a "
          },
          {
            "type": "mcfunction:macro/argument",
            "range": {
              "start": 11,
              "end": 19
            },
            "value": "macro"
          },
          {
            "type": "mcfunction:macro/other",
            "range": {
              "start": 19,
              "end": 27
            },
            "value": " command"
          }
        ]
      }
    ]
  },
  "errors": []
}
`;

exports[`mcfunction parser entry() > Parse '$this is a macro command $(with_args)' without macro support 1`] = `
{
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 37
    },
    "children": [
      {
        "type": "error",
        "range": {
          "start": 0,
          "end": 37
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 37
      },
      "message": "Macro lines are only supported since 1.20.2",
      "severity": 3
    }
  ]
}
`;

exports[`mcfunction parser entry() > Parse '$this is a macro command' without macro support 1`] = `
{
  "node": {
    "type": "mcfunction:entry",
    "range": {
      "start": 0,
      "end": 24
    },
    "children": [
      {
        "type": "error",
        "range": {
          "start": 0,
          "end": 24
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 24
      },
      "message": "Macro lines are only supported since 1.20.2",
      "severity": 3
    }
  ]
}
`;

exports[`mcfunction parser entry() > Parse '' 1`] = `
{
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
`;

exports[`mcfunction parser entry() > Parse 'execute if true if true run say hi' 1`] = `
{
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
`;

exports[`mcfunction parser entry() > Parse 'sa\\  ↓  y \\ ↓ hi' 1`] = `
{
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
`;

exports[`mcfunction parser entry() > Parse 'sa\\  ↓  y \\ ↓ hi' without backslash continuation 1`] = `
{
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
          "end": 5
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
                "value": "sa\\\\"
              }
            ],
            "path": [
              "sa\\\\"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 3,
              "end": 5
            },
            "children": [
              {
                "type": "mcfunction:command_child/trailing",
                "range": {
                  "start": 3,
                  "end": 5
                },
                "value": "  "
              }
            ],
            "path": []
          }
        ]
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 8,
          "end": 12
        },
        "children": [
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 8,
              "end": 9
            },
            "children": [
              {
                "type": "mcfunction:command_child/literal",
                "range": {
                  "start": 8,
                  "end": 9
                },
                "value": "y"
              }
            ],
            "path": [
              "y"
            ]
          },
          {
            "type": "mcfunction:command_child",
            "range": {
              "start": 9,
              "end": 12
            },
            "children": [
              {
                "type": "mcfunction:command_child/trailing",
                "range": {
                  "start": 9,
                  "end": 12
                },
                "value": " \\\\ "
              }
            ],
            "path": []
          }
        ]
      },
      {
        "type": "mcfunction:command",
        "range": {
          "start": 14,
          "end": 16
        },
        "children": [
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
        "start": 0,
        "end": 3
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    },
    {
      "range": {
        "start": 3,
        "end": 5
      },
      "message": "Trailing data encountered: “  ”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 9
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    },
    {
      "range": {
        "start": 9,
        "end": 12
      },
      "message": "Trailing data encountered: “ \\\\ ”",
      "severity": 3
    },
    {
      "range": {
        "start": 14,
        "end": 16
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    }
  ]
}
`;

exports[`mcfunction parser entry() > Parse 'say \\↓ hi ↓ # comment start \\↓ end ↓ say hi' 1`] = `
{
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
          "end": 35
        },
        "comment": " comment start end ",
        "prefix": "#"
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
  "errors": []
}
`;

exports[`mcfunction parser entry() > Parse 'say hi' 1`] = `
{
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
`;

exports[`mcfunction parser entry() > Parse 'say hi' without backslash continuation 1`] = `
{
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
`;

exports[`mcfunction parser entry() > Parse 'say hi↓say hi' 1`] = `
{
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
`;

exports[`mcfunction parser entry() > Parse 'say hi↓say hi' without backslash continuation 1`] = `
{
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
`;

exports[`mcfunction parser entry() > Parse 'say trailing \\↓ data' 1`] = `
{
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
          "end": 20
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
              "end": 20
            },
            "children": [
              {
                "type": "mcfunction:command_child/trailing",
                "range": {
                  "start": 12,
                  "end": 20
                },
                "value": " data"
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
        "start": 4,
        "end": 12
      },
      "message": "Expected “hi”",
      "severity": 3
    },
    {
      "range": {
        "start": 12,
        "end": 20
      },
      "message": "Trailing data encountered: “ data”",
      "severity": 3
    }
  ]
}
`;

exports[`mcfunction parser entry() > Parse 'say trailing \\↓ data' without backslash continuation 1`] = `
{
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
                "value": " \\\\"
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
      "message": "Trailing data encountered: “ \\\\”",
      "severity": 3
    },
    {
      "range": {
        "start": 16,
        "end": 20
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    }
  ]
}
`;
