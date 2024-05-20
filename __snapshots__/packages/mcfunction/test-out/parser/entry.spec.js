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
