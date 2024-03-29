exports['mcdoc unionType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc unionType Parse "(" 1'] = {
  "node": {
    "type": "mcdoc:type/union",
    "children": [
      {
        "type": "mcdoc:type/reference",
        "children": [
          {
            "type": "mcdoc:path",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 1,
                  "end": 1
                },
                "value": ""
              }
            ],
            "range": {
              "start": 1,
              "end": 1
            }
          }
        ],
        "range": {
          "start": 1,
          "end": 1
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected “)” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc unionType Parse "()" 1'] = {
  "node": {
    "type": "mcdoc:type/union",
    "children": [],
    "range": {
      "start": 0,
      "end": 2
    }
  },
  "errors": []
}

exports['mcdoc unionType Parse "(boolean | string | )" 1'] = {
  "node": {
    "type": "mcdoc:type/union",
    "children": [
      {
        "type": "mcdoc:type/boolean",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 1,
              "end": 8
            },
            "value": "boolean",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 1,
          "end": 9
        }
      },
      {
        "type": "mcdoc:type/string",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 11,
              "end": 17
            },
            "value": "string",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 11,
          "end": 18
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 21
    }
  },
  "errors": []
}

exports['mcdoc unionType Parse "(boolean | string)" 1'] = {
  "node": {
    "type": "mcdoc:type/union",
    "children": [
      {
        "type": "mcdoc:type/boolean",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 1,
              "end": 8
            },
            "value": "boolean",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 1,
          "end": 9
        }
      },
      {
        "type": "mcdoc:type/string",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 11,
              "end": 17
            },
            "value": "string",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 11,
          "end": 17
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 18
    }
  },
  "errors": []
}

exports['mcdoc unionType Parse "(boolean)" 1'] = {
  "node": {
    "type": "mcdoc:type/union",
    "children": [
      {
        "type": "mcdoc:type/boolean",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 1,
              "end": 8
            },
            "value": "boolean",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 1,
          "end": 8
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 9
    }
  },
  "errors": []
}

exports['mcdoc unionType Parse "(↓⮀⮀⮀⮀⮀#[until=1.16]↓⮀⮀⮀⮀⮀#[uuid] string |↓⮀⮀⮀⮀⮀#[since=1.16]↓⮀⮀⮀⮀⮀#[uuid] int[] @ 4 |↓⮀⮀⮀⮀)" 1'] = {
  "node": {
    "type": "mcdoc:type/union",
    "children": [
      {
        "type": "mcdoc:type/string",
        "children": [
          {
            "type": "mcdoc:attribute",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 9,
                  "end": 14
                },
                "value": "until"
              },
              {
                "type": "mcdoc:type/literal",
                "children": [
                  {
                    "type": "mcdoc:typed_number",
                    "children": [
                      {
                        "type": "float",
                        "range": {
                          "start": 15,
                          "end": 19
                        },
                        "value": 1.16
                      }
                    ],
                    "range": {
                      "start": 15,
                      "end": 19
                    }
                  }
                ],
                "range": {
                  "start": 15,
                  "end": 19
                }
              }
            ],
            "range": {
              "start": 7,
              "end": 26
            }
          },
          {
            "type": "mcdoc:attribute",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 28,
                  "end": 32
                },
                "value": "uuid"
              }
            ],
            "range": {
              "start": 26,
              "end": 33
            }
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 34,
              "end": 40
            },
            "value": "string",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 7,
          "end": 41
        }
      },
      {
        "type": "mcdoc:type/primitive_array",
        "children": [
          {
            "type": "mcdoc:attribute",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 50,
                  "end": 55
                },
                "value": "since"
              },
              {
                "type": "mcdoc:type/literal",
                "children": [
                  {
                    "type": "mcdoc:typed_number",
                    "children": [
                      {
                        "type": "float",
                        "range": {
                          "start": 56,
                          "end": 60
                        },
                        "value": 1.16
                      }
                    ],
                    "range": {
                      "start": 56,
                      "end": 60
                    }
                  }
                ],
                "range": {
                  "start": 56,
                  "end": 60
                }
              }
            ],
            "range": {
              "start": 48,
              "end": 67
            }
          },
          {
            "type": "mcdoc:attribute",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 69,
                  "end": 73
                },
                "value": "uuid"
              }
            ],
            "range": {
              "start": 67,
              "end": 74
            }
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 75,
              "end": 78
            },
            "value": "int"
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 78,
              "end": 80
            },
            "value": "[]",
            "colorTokenType": "type"
          },
          {
            "type": "mcdoc:int_range",
            "children": [
              {
                "type": "integer",
                "range": {
                  "start": 83,
                  "end": 84
                },
                "value": 4
              }
            ],
            "range": {
              "start": 83,
              "end": 84
            }
          }
        ],
        "range": {
          "start": 48,
          "end": 85
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 92
    }
  },
  "errors": []
}

exports['mcdoc unionType Parse "(↓⮀⮀⮀⮀⮀int |↓⮀⮀⮀⮀⮀[int, int] |↓⮀⮀⮀⮀⮀struct {↓⮀⮀⮀⮀⮀⮀min: int,↓⮀⮀⮀⮀⮀⮀max: int,↓⮀⮀⮀⮀⮀} |↓⮀⮀⮀⮀)" 1'] = {
  "node": {
    "type": "mcdoc:type/union",
    "children": [
      {
        "type": "mcdoc:type/numeric_type",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 7,
              "end": 10
            },
            "value": "int",
            "colorTokenType": "type"
          }
        ],
        "range": {
          "start": 7,
          "end": 11
        }
      },
      {
        "type": "mcdoc:type/tuple",
        "children": [
          {
            "type": "mcdoc:type/numeric_type",
            "children": [
              {
                "type": "mcdoc:literal",
                "range": {
                  "start": 19,
                  "end": 22
                },
                "value": "int",
                "colorTokenType": "type"
              }
            ],
            "range": {
              "start": 19,
              "end": 22
            }
          },
          {
            "type": "mcdoc:type/numeric_type",
            "children": [
              {
                "type": "mcdoc:literal",
                "range": {
                  "start": 24,
                  "end": 27
                },
                "value": "int",
                "colorTokenType": "type"
              }
            ],
            "range": {
              "start": 24,
              "end": 27
            }
          }
        ],
        "range": {
          "start": 18,
          "end": 29
        }
      },
      {
        "type": "mcdoc:struct",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 36,
              "end": 42
            },
            "value": "struct",
            "colorTokenType": "keyword"
          },
          {
            "type": "mcdoc:struct/block",
            "children": [
              {
                "type": "mcdoc:struct/field/pair",
                "children": [
                  {
                    "type": "mcdoc:identifier",
                    "range": {
                      "start": 51,
                      "end": 54
                    },
                    "value": "min"
                  },
                  {
                    "type": "mcdoc:type/numeric_type",
                    "children": [
                      {
                        "type": "mcdoc:literal",
                        "range": {
                          "start": 56,
                          "end": 59
                        },
                        "value": "int",
                        "colorTokenType": "type"
                      }
                    ],
                    "range": {
                      "start": 56,
                      "end": 59
                    }
                  }
                ],
                "range": {
                  "start": 51,
                  "end": 59
                }
              },
              {
                "type": "mcdoc:struct/field/pair",
                "children": [
                  {
                    "type": "mcdoc:identifier",
                    "range": {
                      "start": 67,
                      "end": 70
                    },
                    "value": "max"
                  },
                  {
                    "type": "mcdoc:type/numeric_type",
                    "children": [
                      {
                        "type": "mcdoc:literal",
                        "range": {
                          "start": 72,
                          "end": 75
                        },
                        "value": "int",
                        "colorTokenType": "type"
                      }
                    ],
                    "range": {
                      "start": 72,
                      "end": 75
                    }
                  }
                ],
                "range": {
                  "start": 67,
                  "end": 75
                }
              }
            ],
            "range": {
              "start": 43,
              "end": 84
            }
          }
        ],
        "range": {
          "start": 36,
          "end": 84
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 91
    }
  },
  "errors": []
}
