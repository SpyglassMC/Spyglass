exports['mcdoc struct Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “struct” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc struct Parse "other" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected “struct” but got “other”",
      "severity": 3
    }
  ]
}

exports['mcdoc struct Parse "struct Foo {" 1'] = {
  "node": {
    "type": "mcdoc:struct",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "struct",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "Foo"
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
                  "start": 12,
                  "end": 12
                },
                "value": ""
              },
              {
                "type": "mcdoc:type/path",
                "children": [
                  {
                    "type": "mcdoc:path",
                    "children": [
                      {
                        "type": "mcdoc:identifier",
                        "range": {
                          "start": 12,
                          "end": 12
                        },
                        "value": ""
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
      "message": "Expected “:” but got “”",
      "severity": 3
    },
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
      "message": "Expected “}” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc struct Parse "struct Foo {}" 1'] = {
  "node": {
    "type": "mcdoc:struct",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "struct",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "Foo"
      },
      {
        "type": "mcdoc:struct/block",
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

exports['mcdoc struct Parse "struct Foo {↓⮀⮀⮀⮀⮀/// Hello world.↓⮀⮀⮀⮀⮀Bar: boolean,↓⮀⮀⮀⮀⮀Boo: struct Duh { Ha: any },↓⮀⮀⮀⮀⮀UUID: #[uuid] int[] @ 4,↓⮀⮀⮀⮀⮀#[meh]↓⮀⮀⮀⮀⮀Qux: enum (int) {},↓⮀⮀⮀⮀⮀...Lol,↓⮀⮀⮀⮀}" 1'] = {
  "node": {
    "type": "mcdoc:struct",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "struct",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "Foo"
      },
      {
        "type": "mcdoc:struct/block",
        "children": [
          {
            "type": "mcdoc:struct/field/pair",
            "children": [
              {
                "type": "mcdoc:doc_comments",
                "children": [
                  {
                    "type": "comment",
                    "range": {
                      "start": 18,
                      "end": 35
                    },
                    "comment": " Hello world.\n"
                  }
                ],
                "range": {
                  "start": 18,
                  "end": 40
                }
              },
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 40,
                  "end": 43
                },
                "value": "Bar"
              },
              {
                "type": "mcdoc:type/boolean",
                "children": [
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 45,
                      "end": 52
                    },
                    "value": "boolean",
                    "colorTokenType": "type"
                  }
                ],
                "range": {
                  "start": 45,
                  "end": 52
                }
              }
            ],
            "range": {
              "start": 18,
              "end": 52
            }
          },
          {
            "type": "mcdoc:struct/field/pair",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 59,
                  "end": 62
                },
                "value": "Boo"
              },
              {
                "type": "mcdoc:struct",
                "children": [
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 64,
                      "end": 70
                    },
                    "value": "struct",
                    "colorTokenType": "keyword"
                  },
                  {
                    "type": "mcdoc:identifier",
                    "range": {
                      "start": 71,
                      "end": 74
                    },
                    "value": "Duh"
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
                              "start": 77,
                              "end": 79
                            },
                            "value": "Ha"
                          },
                          {
                            "type": "mcdoc:type/any",
                            "children": [
                              {
                                "type": "mcdoc:literal",
                                "range": {
                                  "start": 81,
                                  "end": 84
                                },
                                "value": "any",
                                "colorTokenType": "type"
                              }
                            ],
                            "range": {
                              "start": 81,
                              "end": 85
                            }
                          }
                        ],
                        "range": {
                          "start": 77,
                          "end": 85
                        }
                      }
                    ],
                    "range": {
                      "start": 75,
                      "end": 86
                    }
                  }
                ],
                "range": {
                  "start": 64,
                  "end": 86
                }
              }
            ],
            "range": {
              "start": 59,
              "end": 86
            }
          },
          {
            "type": "mcdoc:struct/field/pair",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 93,
                  "end": 97
                },
                "value": "UUID"
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
                          "start": 101,
                          "end": 105
                        },
                        "value": "uuid"
                      }
                    ],
                    "range": {
                      "start": 99,
                      "end": 106
                    }
                  },
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 107,
                      "end": 110
                    },
                    "value": "int"
                  },
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 110,
                      "end": 112
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
                          "start": 115,
                          "end": 116
                        },
                        "value": 4
                      }
                    ],
                    "range": {
                      "start": 115,
                      "end": 116
                    }
                  }
                ],
                "range": {
                  "start": 99,
                  "end": 116
                }
              }
            ],
            "range": {
              "start": 93,
              "end": 116
            }
          },
          {
            "type": "mcdoc:struct/field/pair",
            "children": [
              {
                "type": "mcdoc:attribute",
                "children": [
                  {
                    "type": "mcdoc:identifier",
                    "range": {
                      "start": 125,
                      "end": 128
                    },
                    "value": "meh"
                  }
                ],
                "range": {
                  "start": 123,
                  "end": 129
                }
              },
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 135,
                  "end": 138
                },
                "value": "Qux"
              },
              {
                "type": "mcdoc:enum",
                "children": [
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 140,
                      "end": 144
                    },
                    "value": "enum",
                    "colorTokenType": "keyword"
                  },
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 146,
                      "end": 149
                    },
                    "value": "int"
                  },
                  {
                    "type": "mcdoc:enum/block",
                    "children": [],
                    "range": {
                      "start": 151,
                      "end": 153
                    }
                  }
                ],
                "range": {
                  "start": 140,
                  "end": 153
                }
              }
            ],
            "range": {
              "start": 123,
              "end": 153
            }
          },
          {
            "type": "mcdoc:struct/field/spread",
            "children": [
              {
                "type": "mcdoc:type/path",
                "children": [
                  {
                    "type": "mcdoc:path",
                    "children": [
                      {
                        "type": "mcdoc:identifier",
                        "range": {
                          "start": 163,
                          "end": 166
                        },
                        "value": "Lol"
                      }
                    ],
                    "range": {
                      "start": 163,
                      "end": 166
                    }
                  }
                ],
                "range": {
                  "start": 163,
                  "end": 166
                }
              }
            ],
            "range": {
              "start": 160,
              "end": 166
            }
          }
        ],
        "range": {
          "start": 11,
          "end": 173
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 173
    }
  },
  "errors": []
}

exports['mcdoc struct Parse "struct Foo" 1'] = {
  "node": {
    "type": "mcdoc:struct",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "struct",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "Foo"
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
                  "start": 10,
                  "end": 10
                },
                "value": ""
              },
              {
                "type": "mcdoc:type/path",
                "children": [
                  {
                    "type": "mcdoc:path",
                    "children": [
                      {
                        "type": "mcdoc:identifier",
                        "range": {
                          "start": 10,
                          "end": 10
                        },
                        "value": ""
                      }
                    ],
                    "range": {
                      "start": 10,
                      "end": 10
                    }
                  }
                ],
                "range": {
                  "start": 10,
                  "end": 10
                }
              }
            ],
            "range": {
              "start": 10,
              "end": 10
            }
          }
        ],
        "range": {
          "start": 10,
          "end": 10
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": [
    {
      "range": {
        "start": 10,
        "end": 10
      },
      "message": "Expected “{” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 10,
        "end": 10
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 10,
        "end": 10
      },
      "message": "Expected “:” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 10,
        "end": 10
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 10,
        "end": 10
      },
      "message": "Expected “}” but got “”",
      "severity": 3
    }
  ]
}

exports['mcdoc struct Parse "struct {}" 1'] = {
  "node": {
    "type": "mcdoc:struct",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "struct",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:struct/block",
        "children": [],
        "range": {
          "start": 7,
          "end": 9
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

exports['mcdoc struct Parse "struct" 1'] = {
  "node": {
    "type": "mcdoc:struct",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 6
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
                  "start": 6,
                  "end": 6
                },
                "value": ""
              },
              {
                "type": "mcdoc:type/path",
                "children": [
                  {
                    "type": "mcdoc:path",
                    "children": [
                      {
                        "type": "mcdoc:identifier",
                        "range": {
                          "start": 6,
                          "end": 6
                        },
                        "value": ""
                      }
                    ],
                    "range": {
                      "start": 6,
                      "end": 6
                    }
                  }
                ],
                "range": {
                  "start": 6,
                  "end": 6
                }
              }
            ],
            "range": {
              "start": 6,
              "end": 6
            }
          }
        ],
        "range": {
          "start": 6,
          "end": 6
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 6
    }
  },
  "errors": [
    {
      "range": {
        "start": 6,
        "end": 6
      },
      "message": "Expected “{” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 6,
        "end": 6
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 6,
        "end": 6
      },
      "message": "Expected “:” but got “”",
      "severity": 3
    },
    {
      "range": {
        "start": 6,
        "end": 6
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 6,
        "end": 6
      },
      "message": "Expected “}” but got “”",
      "severity": 3
    }
  ]
}
