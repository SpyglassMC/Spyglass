exports['mcfunction parser command() Parse "" 1'] = {
  "node": {
    "type": "mcfunction:command",
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
      "message": "Expected execute|say",
      "severity": 3
    }
  ]
}

exports['mcfunction parser command() Parse "execute if true if true run say hi" 1'] = {
  "node": {
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
  },
  "errors": []
}

exports['mcfunction parser command() Parse "s" 1'] = {
  "node": {
    "type": "mcfunction:command",
    "range": {
      "start": 0,
      "end": 1
    },
    "children": [
      {
        "type": "mcfunction:command_child",
        "range": {
          "start": 0,
          "end": 1
        },
        "children": [
          {
            "type": "mcfunction:command_child/literal",
            "range": {
              "start": 0,
              "end": 1
            },
            "value": "s"
          }
        ],
        "path": [
          "s"
        ]
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected “execute” or “say”",
      "severity": 3
    }
  ]
}

exports['mcfunction parser command() Parse "say " 1'] = {
  "node": {
    "type": "mcfunction:command",
    "range": {
      "start": 0,
      "end": 4
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
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected hi",
      "severity": 3
    }
  ]
}

exports['mcfunction parser command() Parse "say hi " 1'] = {
  "node": {
    "type": "mcfunction:command",
    "range": {
      "start": 0,
      "end": 7
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
  "errors": []
}

exports['mcfunction parser command() Parse "say hi garbage text" 1'] = {
  "node": {
    "type": "mcfunction:command",
    "range": {
      "start": 0,
      "end": 19
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
      },
      {
        "type": "mcfunction:command_child",
        "range": {
          "start": 7,
          "end": 19
        },
        "children": [
          {
            "type": "mcfunction:command_child/trailing",
            "range": {
              "start": 7,
              "end": 19
            },
            "value": "garbage text"
          }
        ],
        "path": []
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 7,
        "end": 19
      },
      "message": "Trailing data encountered: “garbage text”",
      "severity": 3
    }
  ]
}

exports['mcfunction parser command() Parse "say hi" 1'] = {
  "node": {
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
  "errors": []
}

exports['mcfunction parser command() Parse "say" 1'] = {
  "node": {
    "type": "mcfunction:command",
    "range": {
      "start": 0,
      "end": 3
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
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected more arguments",
      "severity": 3
    }
  ]
}

exports['mcfunction parser command() Should not exceed max call stack 1'] = {
  "node": "OMITTED",
  "errors": [
    {
      "range": {
        "start": 80012,
        "end": 80012
      },
      "message": "Expected execute|say",
      "severity": 3
    }
  ]
}
