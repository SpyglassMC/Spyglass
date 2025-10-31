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
        "value": "",
        "colorTokenType": "type"
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

exports['mcdoc enum_ Parse "enum (double) Foo {↓⮀⮀⮀⮀⮀/// Bar doc↓⮀⮀⮀⮀⮀Bar = 1.2,↓⮀⮀⮀⮀⮀/// Boo doc↓⮀⮀⮀⮀⮀/// Another line↓⮀⮀⮀⮀⮀Boo = 4.2d,↓⮀⮀⮀⮀⮀/// Qux doc↓⮀⮀⮀⮀⮀Qux = 12e3,↓⮀⮀⮀⮀}" 1'] = {
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
        "value": "double",
        "colorTokenType": "type"
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
                "type": "mcdoc:doc_comments",
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 25,
                      "end": 37
                    },
                    "comment": " Bar doc\n",
                    "prefix": "///"
                  }
                ],
                "range": {
                  "start": 25,
                  "end": 42
                }
              },
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 42,
                  "end": 45
                },
                "value": "Bar"
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 48,
                      "end": 51
                    },
                    "value": 1.2
                  }
                ],
                "range": {
                  "start": 48,
                  "end": 51
                }
              }
            ],
            "range": {
              "start": 25,
              "end": 51
            }
          },
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:doc_comments",
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 58,
                      "end": 70
                    },
                    "comment": " Boo doc\n",
                    "prefix": "///"
                  },
                  {
                    "type": "comment",
                    "range": {
                      "start": 75,
                      "end": 92
                    },
                    "comment": " Another line\n",
                    "prefix": "///"
                  }
                ],
                "range": {
                  "start": 58,
                  "end": 97
                }
              },
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 97,
                  "end": 100
                },
                "value": "Boo"
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 103,
                      "end": 106
                    },
                    "value": 4.2
                  },
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 106,
                      "end": 107
                    },
                    "value": "d",
                    "colorTokenType": "keyword"
                  }
                ],
                "range": {
                  "start": 103,
                  "end": 107
                }
              }
            ],
            "range": {
              "start": 58,
              "end": 107
            }
          },
          {
            "type": "mcdoc:enum/field",
            "children": [
              {
                "type": "mcdoc:doc_comments",
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 114,
                      "end": 126
                    },
                    "comment": " Qux doc\n",
                    "prefix": "///"
                  }
                ],
                "range": {
                  "start": 114,
                  "end": 131
                }
              },
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 131,
                  "end": 134
                },
                "value": "Qux"
              },
              {
                "type": "mcdoc:typed_number",
                "children": [
                  {
                    "type": "float",
                    "range": {
                      "start": 137,
                      "end": 141
                    },
                    "value": 12000
                  }
                ],
                "range": {
                  "start": 137,
                  "end": 141
                }
              }
            ],
            "range": {
              "start": 114,
              "end": 141
            }
          }
        ],
        "range": {
          "start": 18,
          "end": 148
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 148
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
        "value": "int",
        "colorTokenType": "type"
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
        "value": "int",
        "colorTokenType": "type"
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
        "value": "int",
        "colorTokenType": "type"
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
        "value": "int",
        "colorTokenType": "type"
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
        "value": "Foo",
        "colorTokenType": "type"
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
        "value": "",
        "colorTokenType": "type"
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
