exports['mcdoc enum_ Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “enum” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc enum_ Parse "enum () Foo" 1'] = {
  "node": {
    "type": "mcdoc:enum",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 6,
          "end": 6
        },
        "value": ""
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 8,
          "end": 11
        },
        "value": "Foo"
      },
      {
        "type": "mcdoc:enum/block",
        "children": [
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 11,
                  "end": 11
                },
                "value": ""
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 11,
                      "end": 11
                    },
                    "value": 0
                  }
                ],
                "range": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "range": {
              "start": 11,
              "end": 11
            }
          }
        ],
        "range": {
          "start": 11,
          "end": 11
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 11
    }
  },
  "errors": [
    {
      "range": {
        "start": 6,
        "end": 6
      },
      "message": "Expected “byte”, “short”, “int”, “long”, “string”, “float”, or “double” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “{” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “=” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected a float",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “}” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc enum_ Parse "enum (double) Foo {↓⮀⮀⮀⮀⮀Bar = 1.2,↓⮀⮀⮀⮀⮀Boo = 4.2d,↓⮀⮀⮀⮀⮀Qux = 12e3,↓⮀⮀⮀⮀}" 1'] = {
  "node": {
    "type": "mcdoc:enum",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 6,
          "end": 12
        },
        "value": "double"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 14,
          "end": 17
        },
        "value": "Foo"
      },
      {
        "type": "mcdoc:enum/block",
        "children": [
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 25,
                  "end": 28
                },
                "value": "Bar"
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 31,
                      "end": 34
                    },
                    "value": 1.2
                  }
                ],
                "range": {
                  "start": 31,
                  "end": 34
                }
              }
            ],
            "range": {
              "start": 25,
              "end": 34
            }
          },
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 41,
                  "end": 44
                },
                "value": "Boo"
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 47,
                      "end": 50
                    },
                    "value": 4.2
                  },
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 50,
                      "end": 51
                    },
                    "value": "d",
                    "colorTokenType": "keyword"
                  }
                ],
                "range": {
                  "start": 47,
                  "end": 51
                }
              }
            ],
            "range": {
              "start": 41,
              "end": 51
            }
          },
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 58,
                  "end": 61
                },
                "value": "Qux"
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 64,
                      "end": 68
                    },
                    "value": 12000
                  }
                ],
                "range": {
                  "start": 64,
                  "end": 68
                }
              }
            ],
            "range": {
              "start": 58,
              "end": 68
            }
          }
        ],
        "range": {
          "start": 18,
          "end": 75
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 75
    }
  },
  "errors": []
}

exports['mcdoc enum_ Parse "enum (int) Foo {}" 1'] = {
  "node": {
    "type": "mcdoc:enum",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 6,
          "end": 9
        },
        "value": "int"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 11,
          "end": 14
        },
        "value": "Foo"
      },
      {
        "type": "mcdoc:enum/block",
        "children": [],
        "range": {
          "start": 15,
          "end": 17
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 17
    }
  },
  "errors": []
}

exports['mcdoc enum_ Parse "enum (int) Foo" 1'] = {
  "node": {
    "type": "mcdoc:enum",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 6,
          "end": 9
        },
        "value": "int"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 11,
          "end": 14
        },
        "value": "Foo"
      },
      {
        "type": "mcdoc:enum/block",
        "children": [
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 14,
                  "end": 14
                },
                "value": ""
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 14,
                      "end": 14
                    },
                    "value": 0
                  }
                ],
                "range": {
                  "start": 14,
                  "end": 14
                }
              }
            ],
            "range": {
              "start": 14,
              "end": 14
            }
          }
        ],
        "range": {
          "start": 14,
          "end": 14
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 14
    }
  },
  "errors": [
    {
      "range": {
        "start": 14,
        "end": 14
      },
      "message": "Expected “{” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 14,
        "end": 14
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 14,
        "end": 14
      },
      "message": "Expected “=” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 14,
        "end": 14
      },
      "message": "Expected a float",
      "severity": 3
    },
    {
      "range": {
        "start": 14,
        "end": 14
      },
      "message": "Expected “}” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc enum_ Parse "enum (int) {" 1'] = {
  "node": {
    "type": "mcdoc:enum",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 6,
          "end": 9
        },
        "value": "int"
      },
      {
        "type": "mcdoc:enum/block",
        "children": [
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 12,
                  "end": 12
                },
                "value": ""
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 12,
                      "end": 12
                    },
                    "value": 0
                  }
                ],
                "range": {
                  "start": 12,
                  "end": 12
                }
              }
            ],
            "range": {
              "start": 12,
              "end": 12
            }
          }
        ],
        "range": {
          "start": 11,
          "end": 12
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 12
    }
  },
  "errors": [
    {
      "range": {
        "start": 12,
        "end": 12
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 12,
        "end": 12
      },
      "message": "Expected “=” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 12,
        "end": 12
      },
      "message": "Expected a float",
      "severity": 3
    },
    {
      "range": {
        "start": 12,
        "end": 12
      },
      "message": "Expected “}” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc enum_ Parse "enum (int) {}" 1'] = {
  "node": {
    "type": "mcdoc:enum",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 6,
          "end": 9
        },
        "value": "int"
      },
      {
        "type": "mcdoc:enum/block",
        "children": [],
        "range": {
          "start": 11,
          "end": 13
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 13
    }
  },
  "errors": []
}

exports['mcdoc enum_ Parse "enum Foo" 1'] = {
  "node": {
    "type": "mcdoc:enum",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 5,
          "end": 8
        },
        "value": "Foo"
      },
      {
        "type": "mcdoc:enum/block",
        "children": [
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 8,
                  "end": 8
                },
                "value": ""
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 8,
                      "end": 8
                    },
                    "value": 0
                  }
                ],
                "range": {
                  "start": 8,
                  "end": 8
                }
              }
            ],
            "range": {
              "start": 8,
              "end": 8
            }
          }
        ],
        "range": {
          "start": 8,
          "end": 8
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 8
    }
  },
  "errors": [
    {
      "range": {
        "start": 5,
        "end": 5
      },
      "message": "Expected “(” but got “F”",
      "severity": 3
    },
    {
      "range": {
        "start": 5,
        "end": 8
      },
      "message": "Expected “byte”, “short”, “int”, “long”, “string”, “float”, or “double” but got “Foo”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “)” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “{” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “=” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected a float",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “}” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc enum_ Parse "enum" 1'] = {
  "node": {
    "type": "mcdoc:enum",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": "enum",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 4,
          "end": 4
        },
        "value": ""
      },
      {
        "type": "mcdoc:enum/block",
        "children": [
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 4,
                  "end": 4
                },
                "value": ""
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 4,
                      "end": 4
                    },
                    "value": 0
                  }
                ],
                "range": {
                  "start": 4,
                  "end": 4
                }
              }
            ],
            "range": {
              "start": 4,
              "end": 4
            }
          }
        ],
        "range": {
          "start": 4,
          "end": 4
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 4
    }
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “(” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “byte”, “short”, “int”, “long”, “string”, “float”, or “double” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “)” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “{” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “=” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected a float",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “}” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc enum_ Parse "other" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected “enum” but got “other”",
      "severity": 3
    }
  ]
}
