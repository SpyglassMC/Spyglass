exports['record() record(no trailing comma) Parse "" 1'] = {
  "node": {
    "type": "record",
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

exports['record() record(no trailing comma) Parse "{ "foo" : "bar"   "baz" : "qux" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 33
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 18
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 18,
          "end": 32
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 19,
                  "end": 19
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 27,
                  "end": 27
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 19,
                "end": 19
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 27,
                "end": 27
              }
            }
          ],
          "quote": "\""
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 32
    }
  },
  "errors": [
    {
      "range": {
        "start": 18,
        "end": 18
      },
      "message": "Expected “,”",
      "severity": 3
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ "foo" : "bar" , "baz" : "qux" , }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 35
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
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
          "end": 33
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 19,
                  "end": 19
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 27,
                  "end": 27
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 19,
                "end": 19
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 27,
                "end": 27
              }
            }
          ],
          "quote": "\""
        },
        "end": {
          "start": 32,
          "end": 33
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 34
    }
  },
  "errors": [
    {
      "range": {
        "start": 32,
        "end": 33
      },
      "message": "Trailing separation",
      "severity": 3,
      "info": {
        "codeAction": {
          "title": "Remove trailing separation",
          "isPreferred": true,
          "changes": [
            {
              "type": "edit",
              "range": {
                "start": 32,
                "end": 33
              },
              "text": ""
            }
          ]
        }
      }
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ "foo" : "bar" , "baz" : "qux" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 33
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
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
          "end": 32
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 19,
                  "end": 19
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 27,
                  "end": 27
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 19,
                "end": 19
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 27,
                "end": 27
              }
            }
          ],
          "quote": "\""
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 32
    }
  },
  "errors": []
}

exports['record() record(no trailing comma) Parse "{ "foo" : "bar" , "baz" : }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 27
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
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
          "end": 26
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 19,
                  "end": 19
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 26
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 26,
                  "end": 26
                }
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 19,
                "end": 19
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 26
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 26,
                "end": 26
              }
            }
          ]
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 26
    }
  },
  "errors": [
    {
      "range": {
        "start": 26,
        "end": 26
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ "foo" : "bar" , "baz" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 25
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
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
          "end": 24
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 19,
                  "end": 19
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 24,
              "end": 24
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 24,
                  "end": 24
                }
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 19,
                "end": 19
              }
            }
          ],
          "quote": "\""
        },
        "value": {
          "type": "string",
          "range": {
            "start": 24,
            "end": 24
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 24,
                "end": 24
              }
            }
          ]
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 24
    }
  },
  "errors": [
    {
      "range": {
        "start": 24,
        "end": 24
      },
      "message": "Expected “:”",
      "severity": 3
    },
    {
      "range": {
        "start": 24,
        "end": 24
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ "foo" : "bar" , }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
        },
        "end": {
          "start": 16,
          "end": 17
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 18
    }
  },
  "errors": [
    {
      "range": {
        "start": 16,
        "end": 17
      },
      "message": "Trailing separation",
      "severity": 3,
      "info": {
        "codeAction": {
          "title": "Remove trailing separation",
          "isPreferred": true,
          "changes": [
            {
              "type": "edit",
              "range": {
                "start": 16,
                "end": 17
              },
              "text": ""
            }
          ]
        }
      }
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ "foo" : "bar" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 16
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 16
    }
  },
  "errors": []
}

exports['record() record(no trailing comma) Parse "{ "foo" : }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 10
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 10
            },
            "value": "",
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
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 10
          },
          "value": "",
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
            }
          ]
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 10
    }
  },
  "errors": [
    {
      "range": {
        "start": 10,
        "end": 10
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ "foo" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 8
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": "",
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
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "value": {
          "type": "string",
          "range": {
            "start": 8,
            "end": 8
          },
          "value": "",
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
    ],
    "innerRange": {
      "start": 1,
      "end": 8
    }
  },
  "errors": [
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “:”",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ , "foo" : "bar" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 3
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 2
            },
            "value": "",
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
            "type": "string",
            "range": {
              "start": 2,
              "end": 2
            },
            "value": "",
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
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 2
          },
          "value": "",
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
        "value": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 2
          },
          "value": "",
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
        "end": {
          "start": 2,
          "end": 3
        }
      },
      {
        "type": "pair",
        "range": {
          "start": 4,
          "end": 18
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 4,
              "end": 9
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 5,
                  "end": 5
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 12,
              "end": 17
            },
            "value": "bar",
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
          "type": "string",
          "range": {
            "start": 4,
            "end": 9
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 5,
                "end": 5
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
          "type": "string",
          "range": {
            "start": 12,
            "end": 17
          },
          "value": "bar",
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
    ],
    "innerRange": {
      "start": 1,
      "end": 18
    }
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “\"”",
      "severity": 3
    },
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “:”",
      "severity": 3
    },
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ : "bar" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 10
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 2
            },
            "value": "",
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
            "type": "string",
            "range": {
              "start": 4,
              "end": 9
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 5,
                  "end": 5
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 2
          },
          "value": "",
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
          "start": 2,
          "end": 3
        },
        "value": {
          "type": "string",
          "range": {
            "start": 4,
            "end": 9
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 5,
                "end": 5
              }
            }
          ],
          "quote": "\""
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 10
    }
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ : }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 5
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 4
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 2
            },
            "value": "",
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
            "type": "string",
            "range": {
              "start": 4,
              "end": 4
            },
            "value": "",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 4,
                  "end": 4
                }
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 2
          },
          "value": "",
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
          "start": 2,
          "end": 3
        },
        "value": {
          "type": "string",
          "range": {
            "start": 4,
            "end": 4
          },
          "value": "",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 4,
                "end": 4
              }
            }
          ]
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 4
    }
  },
  "errors": [
    {
      "range": {
        "start": 2,
        "end": 2
      },
      "message": "Expected “\"”",
      "severity": 3
    },
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected “\"”",
      "severity": 3
    }
  ]
}

exports['record() record(no trailing comma) Parse "{ }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": [],
    "innerRange": {
      "start": 1,
      "end": 2
    }
  },
  "errors": []
}

exports['record() record(no trailing comma) Parse "{" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 1
    },
    "children": [],
    "innerRange": {
      "start": 1,
      "end": 1
    }
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected “}”",
      "severity": 3
    }
  ]
}

exports['record() record(trailing comma) Parse "{ "foo" : "bar" , "baz" : "qux" , }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 35
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
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
          "end": 33
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 19,
                  "end": 19
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 27,
                  "end": 27
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 19,
                "end": 19
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 27,
                "end": 27
              }
            }
          ],
          "quote": "\""
        },
        "end": {
          "start": 32,
          "end": 33
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 34
    }
  },
  "errors": []
}

exports['record() record(trailing comma) Parse "{ "foo" : "bar" , "baz" : "qux" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 33
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
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
          "end": 32
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 18,
              "end": 23
            },
            "value": "baz",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 19,
                  "end": 19
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 26,
              "end": 31
            },
            "value": "qux",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 27,
                  "end": 27
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 18,
            "end": 23
          },
          "value": "baz",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 19,
                "end": 19
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 24,
          "end": 25
        },
        "value": {
          "type": "string",
          "range": {
            "start": 26,
            "end": 31
          },
          "value": "qux",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 27,
                "end": 27
              }
            }
          ],
          "quote": "\""
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 32
    }
  },
  "errors": []
}

exports['record() record(trailing comma) Parse "{ "foo" : "bar" , }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 19
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 17
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
        },
        "end": {
          "start": 16,
          "end": 17
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 18
    }
  },
  "errors": []
}

exports['record() record(trailing comma) Parse "{ "foo" : "bar" }" 1'] = {
  "node": {
    "type": "record",
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 2,
          "end": 16
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 2,
              "end": 7
            },
            "value": "foo",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 3,
                  "end": 3
                }
              }
            ],
            "quote": "\""
          },
          {
            "type": "string",
            "range": {
              "start": 10,
              "end": 15
            },
            "value": "bar",
            "valueMap": [
              {
                "inner": {
                  "start": 0,
                  "end": 0
                },
                "outer": {
                  "start": 11,
                  "end": 11
                }
              }
            ],
            "quote": "\""
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 2,
            "end": 7
          },
          "value": "foo",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 3,
                "end": 3
              }
            }
          ],
          "quote": "\""
        },
        "sep": {
          "start": 8,
          "end": 9
        },
        "value": {
          "type": "string",
          "range": {
            "start": 10,
            "end": 15
          },
          "value": "bar",
          "valueMap": [
            {
              "inner": {
                "start": 0,
                "end": 0
              },
              "outer": {
                "start": 11,
                "end": 11
              }
            }
          ],
          "quote": "\""
        }
      }
    ],
    "innerRange": {
      "start": 1,
      "end": 16
    }
  },
  "errors": []
}
