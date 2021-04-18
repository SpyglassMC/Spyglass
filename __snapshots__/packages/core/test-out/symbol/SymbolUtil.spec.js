exports['SymbolUtil clear() Should clear all 1'] = {
  "nbtdoc": {
    "ShouldBeKept1": {
      "category": "nbtdoc",
      "identifier": "ShouldBeKept1",
      "definition": [
        {
          "uri": "file:///another_test.nbtdoc",
          "posRange": {
            "start": {
              "line": 0,
              "character": 0
            },
            "end": {
              "line": 0,
              "character": 0
            }
          },
          "range": {
            "start": 0,
            "end": 0
          }
        }
      ],
      "members": {
        "ShouldBeKept2": {
          "category": "nbtdoc",
          "identifier": "ShouldBeKept2",
          "reference": [
            {
              "uri": "file:///another_test.nbtdoc",
              "posRange": {
                "start": {
                  "line": 0,
                  "character": 0
                },
                "end": {
                  "line": 0,
                  "character": 0
                }
              },
              "range": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "ShouldBeKept3": {
          "category": "nbtdoc",
          "identifier": "ShouldBeKept3",
          "definition": [
            {
              "uri": "file:///another_test.nbtdoc",
              "posRange": {
                "start": {
                  "line": 0,
                  "character": 0
                },
                "end": {
                  "line": 0,
                  "character": 0
                }
              },
              "range": {
                "start": 0,
                "end": 0
              }
            }
          ]
        }
      }
    }
  }
}

exports['SymbolUtil enter() Should enter multiple symbols 1'] = [
  {
    "nbtdoc": {
      "test": {
        "category": "nbtdoc",
        "identifier": "test",
        "visibility": 1,
        "definition": [
          {
            "uri": "file:///test.nbtdoc",
            "range": {
              "start": 5,
              "end": 5
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 5
              },
              "end": {
                "line": 0,
                "character": 5
              }
            }
          }
        ]
      }
    }
  },
  {},
  {
    "nbtdoc": {
      "test": {
        "category": "nbtdoc",
        "identifier": "test",
        "visibility": 0,
        "definition": [
          {
            "uri": "file:///test.nbtdoc",
            "range": {
              "start": 4,
              "end": 4
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 4
              },
              "end": {
                "line": 0,
                "character": 4
              }
            }
          }
        ]
      }
    }
  }
]

exports['SymbolUtil enter() Should enter multiple symbols 2'] = {
  "nbtdoc": {
    "test": {
      "category": "nbtdoc",
      "identifier": "test",
      "visibility": 3,
      "definition": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 1,
            "end": 1
          },
          "posRange": {
            "start": {
              "line": 0,
              "character": 1
            },
            "end": {
              "line": 0,
              "character": 1
            }
          }
        },
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 6,
            "end": 6
          },
          "posRange": {
            "start": {
              "line": 0,
              "character": 6
            },
            "end": {
              "line": 0,
              "character": 6
            }
          }
        }
      ],
      "reference": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 2,
            "end": 2
          },
          "posRange": {
            "start": {
              "line": 0,
              "character": 2
            },
            "end": {
              "line": 0,
              "character": 2
            }
          }
        },
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 3,
            "end": 3
          },
          "posRange": {
            "start": {
              "line": 0,
              "character": 3
            },
            "end": {
              "line": 0,
              "character": 3
            }
          }
        }
      ],
      "visibilityRestriction": [
        "spgoding:**"
      ]
    },
    "test2": {
      "category": "nbtdoc",
      "identifier": "test2",
      "visibility": 2,
      "definition": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 7,
            "end": 7
          },
          "posRange": {
            "start": {
              "line": 0,
              "character": 7
            },
            "end": {
              "line": 0,
              "character": 7
            }
          }
        }
      ]
    }
  }
}
