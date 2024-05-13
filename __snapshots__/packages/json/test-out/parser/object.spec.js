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
            ]
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
          ]
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
          ]
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
            ]
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
            ]
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
          ]
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
          ]
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
            ]
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
          ]
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
          ]
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
            ]
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
                    ]
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
                    ]
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
                  ]
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
                  ]
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
          ]
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
                  ]
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
                  ]
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
                ]
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
                ]
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
            ]
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
          ]
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
            ]
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
            ]
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
          ]
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
          ]
        }
      }
    ]
  },
  "errors": []
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
            ]
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
            ]
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
          ]
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
          ]
        }
      }
    ]
  },
  "errors": []
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
            "range": {
              "start": 4,
              "end": 5
            },
            "value": 2
          }
        ],
        "sep": {
          "start": 2,
          "end": 3
        },
        "value": {
          "type": "json:number",
          "range": {
            "start": 4,
            "end": 5
          },
          "value": 2
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
