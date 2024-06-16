exports['JSON object parser object() Parse "" 1'] = {
  "node": {
    "type": "json:object",
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
      "message": "Expected “{”",
      "severity": 3
    }
  ]
}

exports['JSON object parser object() Parse "{"1": "2", "3": "4"}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 20
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 10
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 4
            },
            "value": "1",
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
            ],
            "quote": "\""
          },
          {
            "type": "json:string",
            "range": {
              "start": 6,
              "end": 9
            },
            "value": "2",
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
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 4
          },
          "value": "1",
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
          ],
          "quote": "\""
        },
        "sep": {
          "start": 4,
          "end": 5
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 6,
            "end": 9
          },
          "value": "2",
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
            }
          ],
          "quote": "\""
        },
        "end": {
          "start": 9,
          "end": 10
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 11,
          "end": 19
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 11,
              "end": 14
            },
            "value": "3",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 12,
                  "end": 12
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "json:string",
            "range": {
              "start": 16,
              "end": 19
            },
            "value": "4",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 17,
                  "end": 17
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 11,
            "end": 14
          },
          "value": "3",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 12,
                "end": 12
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 14,
          "end": 15
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 16,
            "end": 19
          },
          "value": "4",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 17,
                "end": 17
              }
            }
          ],
          "quote": "\""
        }
      }
    ]
  },
  "errors": []
}

exports['JSON object parser object() Parse "{"1": "2"}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 9
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 4
            },
            "value": "1",
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
            ],
            "quote": "\""
          },
          {
            "type": "json:string",
            "range": {
              "start": 6,
              "end": 9
            },
            "value": "2",
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
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 4
          },
          "value": "1",
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
          ],
          "quote": "\""
        },
        "sep": {
          "start": 4,
          "end": 5
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 6,
            "end": 9
          },
          "value": "2",
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
            }
          ],
          "quote": "\""
        }
      }
    ]
  },
  "errors": []
}

exports['JSON object parser object() Parse "{"1": {"2": "3"}, {"4": "5"}}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 28
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 17
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 4
            },
            "value": "1",
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
            ],
            "quote": "\""
          },
          {
            "type": "json:object",
            "range": {
              "start": 6,
              "end": 16
            },
            "children": [
              {
                "type": "pair",
                "range": {
                  "start": 7,
                  "end": 15
                },
                "children": [
                  {
                    "type": "json:string",
                    "range": {
                      "start": 7,
                      "end": 10
                    },
                    "value": "2",
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
                    ],
                    "quote": "\""
                  },
                  {
                    "type": "json:string",
                    "range": {
                      "start": 12,
                      "end": 15
                    },
                    "value": "3",
                    "valueMap": [
                      {
                        "inner": {
                          "start": 0,
                          "end": 0
                        },
                        "outer": {
                          "start": 13,
                          "end": 13
                        }
                      }
                    ],
                    "quote": "\""
                  }
                ],
                "key": {
                  "type": "json:string",
                  "range": {
                    "start": 7,
                    "end": 10
                  },
                  "value": "2",
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
                  ],
                  "quote": "\""
                },
                "sep": {
                  "start": 10,
                  "end": 11
                },
                "value": {
                  "type": "json:string",
                  "range": {
                    "start": 12,
                    "end": 15
                  },
                  "value": "3",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 13,
                        "end": 13
                      }
                    }
                  ],
                  "quote": "\""
                }
              }
            ]
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 4
          },
          "value": "1",
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
          ],
          "quote": "\""
        },
        "sep": {
          "start": 4,
          "end": 5
        },
        "value": {
          "type": "json:object",
          "range": {
            "start": 6,
            "end": 16
          },
          "children": [
            {
              "type": "pair",
              "range": {
                "start": 7,
                "end": 15
              },
              "children": [
                {
                  "type": "json:string",
                  "range": {
                    "start": 7,
                    "end": 10
                  },
                  "value": "2",
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
                  ],
                  "quote": "\""
                },
                {
                  "type": "json:string",
                  "range": {
                    "start": 12,
                    "end": 15
                  },
                  "value": "3",
                  "valueMap": [
                    {
                      "inner": {
                        "start": 0,
                        "end": 0
                      },
                      "outer": {
                        "start": 13,
                        "end": 13
                      }
                    }
                  ],
                  "quote": "\""
                }
              ],
              "key": {
                "type": "json:string",
                "range": {
                  "start": 7,
                  "end": 10
                },
                "value": "2",
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
                ],
                "quote": "\""
              },
              "sep": {
                "start": 10,
                "end": 11
              },
              "value": {
                "type": "json:string",
                "range": {
                  "start": 12,
                  "end": 15
                },
                "value": "3",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 13,
                      "end": 13
                    }
                  }
                ],
                "quote": "\""
              }
            }
          ]
        },
        "end": {
          "start": 16,
          "end": 17
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 27
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 24,
              "end": 27
            },
            "value": "5",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 25,
                  "end": 25
                }
              }
            ],
            "quote": "\""
          }
        ],
        "sep": {
          "start": 22,
          "end": 23
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 24,
            "end": 27
          },
          "value": "5",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 25,
                "end": 25
              }
            }
          ],
          "quote": "\""
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 18,
        "end": 22
      },
      "message": "Expected a key",
      "severity": 3
    }
  ]
}

exports['JSON object parser object() Parse "{"hey": "there"}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 15
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
            ],
            "quote": "\""
          },
          {
            "type": "json:string",
            "range": {
              "start": 8,
              "end": 15
            },
            "value": "there",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 9,
                  "end": 9
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
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
          ],
          "quote": "\""
        },
        "sep": {
          "start": 6,
          "end": 7
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 8,
            "end": 15
          },
          "value": "there",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 9,
                "end": 9
              }
            }
          ],
          "quote": "\""
        }
      }
    ]
  },
  "errors": []
}

exports['JSON object parser object() Parse "{"test": "⧵u1z34"}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 18
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 17
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 7
            },
            "value": "test",
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
            ],
            "quote": "\""
          },
          {
            "type": "json:string",
            "range": {
              "start": 9,
              "end": 17
            },
            "value": "u1z34",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 10,
                  "end": 10
                }
              },
              {
                "inner": {
                  "start": 0,
                  "end": 1
                },
                "outer": {
                  "start": 10,
                  "end": 12
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 7
          },
          "value": "test",
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
          ],
          "quote": "\""
        },
        "sep": {
          "start": 7,
          "end": 8
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 9,
            "end": 17
          },
          "value": "u1z34",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 10,
                "end": 10
              }
            },
            {
              "inner": {
                "start": 0,
                "end": 1
              },
              "outer": {
                "start": 10,
                "end": 12
              }
            }
          ],
          "quote": "\""
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 12,
        "end": 16
      },
      "message": "Hexadecimal digit expected",
      "severity": 3
    }
  ]
}

exports['JSON object parser object() Parse "{"⧵"": "⧵u1234"}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 15
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
            ],
            "quote": "\""
          },
          {
            "type": "json:string",
            "range": {
              "start": 7,
              "end": 15
            },
            "value": "ሴ",
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
              },
              {
                "inner": {
                  "start": 0,
                  "end": 1
                },
                "outer": {
                  "start": 8,
                  "end": 14
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
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
          ],
          "quote": "\""
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 7,
            "end": 15
          },
          "value": "ሴ",
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
            },
            {
              "inner": {
                "start": 0,
                "end": 1
              },
              "outer": {
                "start": 8,
                "end": 14
              }
            }
          ],
          "quote": "\""
        }
      }
    ]
  },
  "errors": []
}

exports['JSON object parser object() Parse "{"⧵z": "ermm"}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 14
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 13
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
            ],
            "quote": "\""
          },
          {
            "type": "json:string",
            "range": {
              "start": 7,
              "end": 13
            },
            "value": "ermm",
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
            ],
            "quote": "\""
          }
        ],
        "key": {
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
          ],
          "quote": "\""
        },
        "sep": {
          "start": 5,
          "end": 6
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 7,
            "end": 13
          },
          "value": "ermm",
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
          ],
          "quote": "\""
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

exports['JSON object parser object() Parse "{1: 2}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 5
        },
        "children": [
          {
            "type": "json:number",
            "children": [
              {
                "type": "long",
                "range": {
                  "start": 4,
                  "end": 5
                },
                "value": "2"
              }
            ],
            "value": {
              "type": "long",
              "range": {
                "start": 4,
                "end": 5
              },
              "value": "2"
            },
            "range": {
              "start": 4,
              "end": 5
            }
          }
        ],
        "sep": {
          "start": 2,
          "end": 3
        },
        "value": {
          "type": "json:number",
          "children": [
            {
              "type": "long",
              "range": {
                "start": 4,
                "end": 5
              },
              "value": "2"
            }
          ],
          "value": {
            "type": "long",
            "range": {
              "start": 4,
              "end": 5
            },
            "value": "2"
          },
          "range": {
            "start": 4,
            "end": 5
          }
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 2
      },
      "message": "Expected a key",
      "severity": 3
    }
  ]
}

exports['JSON object parser object() Parse "{}" 1'] = {
  "node": {
    "type": "json:object",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": []
  },
  "errors": []
}
