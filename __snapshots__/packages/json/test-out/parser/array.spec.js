exports['JSON array parser array() Parse "" 1'] = {
  "node": {
    "type": "json:array",
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
      "message": "Expected “[”",
      "severity": 3
    }
  ]
}

exports['JSON array parser array() Parse "["hey","there"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 15
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 7
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 6
            },
            "value": "hey",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 6
          },
          "value": "hey",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            }
          ]
        },
        "sep": {
          "start": 6,
          "end": 7
        }
      },
      {
        "type": "item",
        "range": {
          "start": 7,
          "end": 14
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 7,
              "end": 14
            },
            "value": "there",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 8,
                  "end": 8
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 7,
            "end": 14
          },
          "value": "there",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 8,
                "end": 8
              }
            }
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['JSON array parser array() Parse "["⧵"","⧵u1234"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 15
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 6
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 5
            },
            "value": "\"",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              },
              {
                "inner": {
                  "start": 0,
                  "end": 1
                },
                "outer": {
                  "start": 2,
                  "end": 4
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 5
          },
          "value": "\"",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            },
            {
              "inner": {
                "start": 0,
                "end": 1
              },
              "outer": {
                "start": 2,
                "end": 4
              }
            }
          ]
        },
        "sep": {
          "start": 5,
          "end": 6
        }
      },
      {
        "type": "item",
        "range": {
          "start": 6,
          "end": 14
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 6,
              "end": 14
            },
            "value": "ሴ",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 7,
                  "end": 7
                }
              },
              {
                "inner": {
                  "start": 0,
                  "end": 1
                },
                "outer": {
                  "start": 7,
                  "end": 13
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 6,
            "end": 14
          },
          "value": "ሴ",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 7,
                "end": 7
              }
            },
            {
              "inner": {
                "start": 0,
                "end": 1
              },
              "outer": {
                "start": 7,
                "end": 13
              }
            }
          ]
        }
      }
    ]
  },
  "errors": []
}

exports['JSON array parser array() Parse "["⧵u1z34"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 9
            },
            "value": "u1z34",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              },
              {
                "inner": {
                  "start": 0,
                  "end": 1
                },
                "outer": {
                  "start": 2,
                  "end": 4
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 9
          },
          "value": "u1z34",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            },
            {
              "inner": {
                "start": 0,
                "end": 1
              },
              "outer": {
                "start": 2,
                "end": 4
              }
            }
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 8
      },
      "message": "Hexadecimal digit expected",
      "severity": 3
    }
  ]
}

exports['JSON array parser array() Parse "["⧵z"]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 5
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 5
            },
            "value": "z",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 2,
                  "end": 2
                }
              },
              {
                "inner": {
                  "start": 0,
                  "end": 1
                },
                "outer": {
                  "start": 2,
                  "end": 4
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 5
          },
          "value": "z",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 2,
                "end": 2
              }
            },
            {
              "inner": {
                "start": 0,
                "end": 1
              },
              "outer": {
                "start": 2,
                "end": 4
              }
            }
          ]
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 4
      },
      "message": "Unexpected escape character “z”",
      "severity": 3
    }
  ]
}

exports['JSON array parser array() Parse "[1,2,]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 3
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 1
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 1
        },
        "sep": {
          "start": 2,
          "end": 3
        }
      },
      {
        "type": "item",
        "range": {
          "start": 3,
          "end": 5
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 3,
              "end": 4
            },
            "value": 2
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 3,
            "end": 4
          },
          "value": 2
        },
        "sep": {
          "start": 4,
          "end": 5
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 5
      },
      "message": "Trailing separation",
      "severity": 3
    }
  ]
}

exports['JSON array parser array() Parse "[1,2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 5
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 3
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 1
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 1
        },
        "sep": {
          "start": 2,
          "end": 3
        }
      },
      {
        "type": "item",
        "range": {
          "start": 3,
          "end": 4
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 3,
              "end": 4
            },
            "value": 2
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 3,
            "end": 4
          },
          "value": 2
        }
      }
    ]
  },
  "errors": []
}

exports['JSON array parser array() Parse "[1]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 2
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 1,
              "end": 2
            },
            "value": 1
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 1,
            "end": 2
          },
          "value": 1
        }
      }
    ]
  },
  "errors": []
}

exports['JSON array parser array() Parse "[[1],2]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 7
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 5
        },
        "children": [
          {
            "type": "json:array",
            "range": {
              "start": 1,
              "end": 4
            },
            "children": [
              {
                "type": "item",
                "range": {
                  "start": 2,
                  "end": 3
                },
                "children": [
                  {
                    "type": "json:number",
                    "range": {
                      "start": 2,
                      "end": 3
                    },
                    "value": 1
                  }
                ],
                "value": {
                  "type": "json:number",
                  "range": {
                    "start": 2,
                    "end": 3
                  },
                  "value": 1
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:array",
          "range": {
            "start": 1,
            "end": 4
          },
          "children": [
            {
              "type": "item",
              "range": {
                "start": 2,
                "end": 3
              },
              "children": [
                {
                  "type": "json:number",
                  "range": {
                    "start": 2,
                    "end": 3
                  },
                  "value": 1
                }
              ],
              "value": {
                "type": "json:number",
                "range": {
                  "start": 2,
                  "end": 3
                },
                "value": 1
              }
            }
          ]
        },
        "sep": {
          "start": 4,
          "end": 5
        }
      },
      {
        "type": "item",
        "range": {
          "start": 5,
          "end": 6
        },
        "children": [
          {
            "type": "json:number",
            "range": {
              "start": 5,
              "end": 6
            },
            "value": 2
          }
        ],
        "value": {
          "type": "json:number",
          "range": {
            "start": 5,
            "end": 6
          },
          "value": 2
        }
      }
    ]
  },
  "errors": []
}

exports['JSON array parser array() Parse "[]" 1'] = {
  "node": {
    "type": "json:array",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": []
  },
  "errors": []
}
