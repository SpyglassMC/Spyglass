exports[`mcdoc parser > attribute > Parse \"#[\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 2
        },
        "value": ""
      }
    ],
    "range": {
      "start": 0,
      "end": 2
    }
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “]” but got “”",
      "severity": 3
    }
  ]
}
`;

exports[`mcdoc parser > attribute > Parse \"#[]\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 2
        },
        "value": ""
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}
`;

exports[`mcdoc parser > attribute > Parse \"#[advancement_criterion=(type=definition,id=test)]\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 23
        },
        "value": "advancement_criterion"
      },
      {
        "type": "mcdoc:attribute/tree",
        "range": {
          "start": 25,
          "end": 48
        },
        "children": [
          {
            "type": "mcdoc:attribute/tree/named",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 25,
                  "end": 29
                },
                "value": "type"
              },
              {
                "type": "mcdoc:type/reference",
                "children": [
                  {
                    "type": "mcdoc:path",
                    "children": [
                      {
                        "type": "mcdoc:identifier",
                        "range": {
                          "start": 30,
                          "end": 40
                        },
                        "value": "definition"
                      }
                    ],
                    "range": {
                      "start": 30,
                      "end": 40
                    }
                  }
                ],
                "range": {
                  "start": 30,
                  "end": 40
                }
              },
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 41,
                  "end": 43
                },
                "value": "id"
              },
              {
                "type": "mcdoc:type/reference",
                "children": [
                  {
                    "type": "mcdoc:path",
                    "children": [
                      {
                        "type": "mcdoc:identifier",
                        "range": {
                          "start": 44,
                          "end": 48
                        },
                        "value": "test"
                      }
                    ],
                    "range": {
                      "start": 44,
                      "end": 48
                    }
                  }
                ],
                "range": {
                  "start": 44,
                  "end": 48
                }
              }
            ],
            "range": {
              "start": 25,
              "end": 48
            }
          }
        ],
        "delim": "("
      }
    ],
    "range": {
      "start": 0,
      "end": 50
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > attribute > Parse \"#[bitfield(enum (int) {})]\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 10
        },
        "value": "bitfield"
      },
      {
        "type": "mcdoc:attribute/tree",
        "range": {
          "start": 11,
          "end": 24
        },
        "children": [
          {
            "type": "mcdoc:attribute/tree/pos",
            "children": [
              {
                "type": "mcdoc:enum",
                "children": [
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 11,
                      "end": 15
                    },
                    "value": "enum",
                    "colorTokenType": "keyword"
                  },
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 17,
                      "end": 20
                    },
                    "value": "int",
                    "colorTokenType": "type"
                  },
                  {
                    "type": "mcdoc:enum/block",
                    "children": [],
                    "range": {
                      "start": 22,
                      "end": 24
                    }
                  }
                ],
                "range": {
                  "start": 11,
                  "end": 24
                }
              }
            ],
            "range": {
              "start": 11,
              "end": 24
            }
          }
        ],
        "delim": "("
      }
    ],
    "range": {
      "start": 0,
      "end": 26
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > attribute > Parse \"#[bitfield=enum (int) {↓⮀⮀⮀⮀⮀Foo = 1,↓⮀⮀⮀⮀⮀Bar = 2,↓⮀⮀⮀⮀⮀Qux = 3,↓⮀⮀⮀⮀}]\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 10
        },
        "value": "bitfield"
      },
      {
        "type": "mcdoc:enum",
        "children": [
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 11,
              "end": 15
            },
            "value": "enum",
            "colorTokenType": "keyword"
          },
          {
            "type": "mcdoc:literal",
            "range": {
              "start": 17,
              "end": 20
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
                      "start": 29,
                      "end": 32
                    },
                    "value": "Foo"
                  },
                  {
                    "type": "mcdoc:typed_number",
                    "children": [
                      {
                        "type": "integer",
                        "range": {
                          "start": 35,
                          "end": 36
                        },
                        "value": 1
                      }
                    ],
                    "range": {
                      "start": 35,
                      "end": 36
                    }
                  }
                ],
                "range": {
                  "start": 29,
                  "end": 36
                }
              },
              {
                "type": "mcdoc:enum/field",
                "children": [
                  {
                    "type": "mcdoc:identifier",
                    "range": {
                      "start": 43,
                      "end": 46
                    },
                    "value": "Bar"
                  },
                  {
                    "type": "mcdoc:typed_number",
                    "children": [
                      {
                        "type": "integer",
                        "range": {
                          "start": 49,
                          "end": 50
                        },
                        "value": 2
                      }
                    ],
                    "range": {
                      "start": 49,
                      "end": 50
                    }
                  }
                ],
                "range": {
                  "start": 43,
                  "end": 50
                }
              },
              {
                "type": "mcdoc:enum/field",
                "children": [
                  {
                    "type": "mcdoc:identifier",
                    "range": {
                      "start": 57,
                      "end": 60
                    },
                    "value": "Qux"
                  },
                  {
                    "type": "mcdoc:typed_number",
                    "children": [
                      {
                        "type": "integer",
                        "range": {
                          "start": 63,
                          "end": 64
                        },
                        "value": 3
                      }
                    ],
                    "range": {
                      "start": 63,
                      "end": 64
                    }
                  }
                ],
                "range": {
                  "start": 57,
                  "end": 64
                }
              }
            ],
            "range": {
              "start": 22,
              "end": 71
            }
          }
        ],
        "range": {
          "start": 11,
          "end": 71
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 72
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > attribute > Parse \"#[color=composite_rgb]\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 7
        },
        "value": "color"
      },
      {
        "type": "mcdoc:type/reference",
        "children": [
          {
            "type": "mcdoc:path",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 8,
                  "end": 21
                },
                "value": "composite_rgb"
              }
            ],
            "range": {
              "start": 8,
              "end": 21
            }
          }
        ],
        "range": {
          "start": 8,
          "end": 21
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 22
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > attribute > Parse \"#[since=1.17]\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 7
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
                  "start": 8,
                  "end": 12
                },
                "value": 1.17
              }
            ],
            "range": {
              "start": 8,
              "end": 12
            }
          }
        ],
        "range": {
          "start": 8,
          "end": 12
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
`;

exports[`mcdoc parser > attribute > Parse \"#[uuid]\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 6
        },
        "value": "uuid"
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > attribute > Parse \"#[vector(dimension=3,integer=true)]\" 1`] = `
{
  "node": {
    "type": "mcdoc:attribute",
    "children": [
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 2,
          "end": 8
        },
        "value": "vector"
      },
      {
        "type": "mcdoc:attribute/tree",
        "range": {
          "start": 9,
          "end": 33
        },
        "children": [
          {
            "type": "mcdoc:attribute/tree/named",
            "children": [
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 9,
                  "end": 18
                },
                "value": "dimension"
              },
              {
                "type": "mcdoc:type/literal",
                "children": [
                  {
                    "type": "mcdoc:typed_number",
                    "children": [
                      {
                        "type": "integer",
                        "range": {
                          "start": 19,
                          "end": 20
                        },
                        "value": 3
                      }
                    ],
                    "range": {
                      "start": 19,
                      "end": 20
                    }
                  }
                ],
                "range": {
                  "start": 19,
                  "end": 20
                }
              },
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 21,
                  "end": 28
                },
                "value": "integer"
              },
              {
                "type": "mcdoc:type/literal",
                "children": [
                  {
                    "type": "mcdoc:literal",
                    "range": {
                      "start": 29,
                      "end": 33
                    },
                    "value": "true",
                    "colorTokenType": "type"
                  }
                ],
                "range": {
                  "start": 29,
                  "end": 33
                }
              }
            ],
            "range": {
              "start": 9,
              "end": 33
            }
          }
        ],
        "delim": "("
      }
    ],
    "range": {
      "start": 0,
      "end": 35
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > attribute > Parse \"\" 1`] = `
{
  "node": "FAILURE",
  "errors": []
}
`;
