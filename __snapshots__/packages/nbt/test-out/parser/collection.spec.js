exports['nbt byteArray() Parse "" 1'] = {
  "node": {
    "type": "nbt:byte_array",
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
      "message": "Expected “[B;”",
      "severity": 3
    }
  ]
}

exports['nbt byteArray() Parse "[B; true, 1b, 2]" 1'] = {
  "node": {
    "type": "nbt:byte_array",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 9
        },
        "children": [
          {
            "type": "nbt:byte",
            "range": {
              "start": 4,
              "end": 8
            },
            "value": "1"
          }
        ],
        "value": {
          "type": "nbt:byte",
          "range": {
            "start": 4,
            "end": 8
          },
          "value": "1"
        },
        "sep": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "item",
        "range": {
          "start": 10,
          "end": 13
        },
        "children": [
          {
            "type": "nbt:byte",
            "range": {
              "start": 10,
              "end": 12
            },
            "value": "1"
          }
        ],
        "value": {
          "type": "nbt:byte",
          "range": {
            "start": 10,
            "end": 12
          },
          "value": "1"
        },
        "sep": {
          "start": 12,
          "end": 13
        }
      },
      {
        "type": "item",
        "range": {
          "start": 14,
          "end": 15
        },
        "children": [
          {
            "type": "nbt:int",
            "range": {
              "start": 14,
              "end": 15
            },
            "value": "2"
          }
        ],
        "value": {
          "type": "nbt:int",
          "range": {
            "start": 14,
            "end": 15
          },
          "value": "2"
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 14,
        "end": 15
      },
      "message": "Expected a byte tag but got an int tag",
      "severity": 3
    }
  ]
}

exports['nbt byteArray() Parse "[B; true, 1b]" 1'] = {
  "node": {
    "type": "nbt:byte_array",
    "range": {
      "start": 0,
      "end": 13
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 9
        },
        "children": [
          {
            "type": "nbt:byte",
            "range": {
              "start": 4,
              "end": 8
            },
            "value": "1"
          }
        ],
        "value": {
          "type": "nbt:byte",
          "range": {
            "start": 4,
            "end": 8
          },
          "value": "1"
        },
        "sep": {
          "start": 8,
          "end": 9
        }
      },
      {
        "type": "item",
        "range": {
          "start": 10,
          "end": 12
        },
        "children": [
          {
            "type": "nbt:byte",
            "range": {
              "start": 10,
              "end": 12
            },
            "value": "1"
          }
        ],
        "value": {
          "type": "nbt:byte",
          "range": {
            "start": 10,
            "end": 12
          },
          "value": "1"
        }
      }
    ]
  },
  "errors": []
}

exports['nbt byteArray() Parse "[B;]" 1'] = {
  "node": {
    "type": "nbt:byte_array",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": []
  },
  "errors": []
}

exports['nbt intArray() Parse "" 1'] = {
  "node": {
    "type": "nbt:int_array",
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
      "message": "Expected “[I;”",
      "severity": 3
    }
  ]
}

exports['nbt intArray() Parse "[I; 0, 1.]" 1'] = {
  "node": {
    "type": "nbt:int_array",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 6
        },
        "children": [
          {
            "type": "nbt:int",
            "range": {
              "start": 4,
              "end": 5
            },
            "value": "0"
          }
        ],
        "value": {
          "type": "nbt:int",
          "range": {
            "start": 4,
            "end": 5
          },
          "value": "0"
        },
        "sep": {
          "start": 5,
          "end": 6
        }
      },
      {
        "type": "item",
        "range": {
          "start": 7,
          "end": 9
        },
        "children": [
          {
            "type": "nbt:double",
            "range": {
              "start": 7,
              "end": 9
            },
            "value": 1
          }
        ],
        "value": {
          "type": "nbt:double",
          "range": {
            "start": 7,
            "end": 9
          },
          "value": 1
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 7,
        "end": 9
      },
      "message": "Expected an int tag but got a double tag",
      "severity": 3
    }
  ]
}

exports['nbt intArray() Parse "[I; 0, 1]" 1'] = {
  "node": {
    "type": "nbt:int_array",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 6
        },
        "children": [
          {
            "type": "nbt:int",
            "range": {
              "start": 4,
              "end": 5
            },
            "value": "0"
          }
        ],
        "value": {
          "type": "nbt:int",
          "range": {
            "start": 4,
            "end": 5
          },
          "value": "0"
        },
        "sep": {
          "start": 5,
          "end": 6
        }
      },
      {
        "type": "item",
        "range": {
          "start": 7,
          "end": 8
        },
        "children": [
          {
            "type": "nbt:int",
            "range": {
              "start": 7,
              "end": 8
            },
            "value": "1"
          }
        ],
        "value": {
          "type": "nbt:int",
          "range": {
            "start": 7,
            "end": 8
          },
          "value": "1"
        }
      }
    ]
  },
  "errors": []
}

exports['nbt intArray() Parse "[I;]" 1'] = {
  "node": {
    "type": "nbt:int_array",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": []
  },
  "errors": []
}

exports['nbt list() Parse "" 1'] = {
  "node": {
    "type": "nbt:list",
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

exports['nbt list() Parse "["string", 1b]" 1'] = {
  "node": {
    "type": "nbt:list",
    "range": {
      "start": 0,
      "end": 14
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 10
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 1,
              "end": 9
            },
            "value": "string",
            "valueMap": {
              "outerRange": {
                "start": 2,
                "end": 8
              },
              "innerRange": {
                "start": 0,
                "end": 6
              },
              "pairs": []
            }
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 1,
            "end": 9
          },
          "value": "string",
          "valueMap": {
            "outerRange": {
              "start": 2,
              "end": 8
            },
            "innerRange": {
              "start": 0,
              "end": 6
            },
            "pairs": []
          }
        },
        "sep": {
          "start": 9,
          "end": 10
        }
      },
      {
        "type": "item",
        "range": {
          "start": 11,
          "end": 13
        },
        "children": [
          {
            "type": "nbt:byte",
            "range": {
              "start": 11,
              "end": 13
            },
            "value": "1"
          }
        ],
        "value": {
          "type": "nbt:byte",
          "range": {
            "start": 11,
            "end": 13
          },
          "value": "1"
        }
      }
    ],
    "valueType": "string"
  },
  "errors": [
    {
      "range": {
        "start": 11,
        "end": 13
      },
      "message": "Expected a string tag but got a byte tag",
      "severity": 3
    }
  ]
}

exports['nbt list() Parse "["string"]" 1'] = {
  "node": {
    "type": "nbt:list",
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
            "type": "string",
            "range": {
              "start": 1,
              "end": 9
            },
            "value": "string",
            "valueMap": {
              "outerRange": {
                "start": 2,
                "end": 8
              },
              "innerRange": {
                "start": 0,
                "end": 6
              },
              "pairs": []
            }
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 1,
            "end": 9
          },
          "value": "string",
          "valueMap": {
            "outerRange": {
              "start": 2,
              "end": 8
            },
            "innerRange": {
              "start": 0,
              "end": 6
            },
            "pairs": []
          }
        }
      }
    ],
    "valueType": "string"
  },
  "errors": []
}

exports['nbt list() Parse "[]" 1'] = {
  "node": {
    "type": "nbt:list",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": []
  },
  "errors": []
}

exports['nbt longArray() Parse "" 1'] = {
  "node": {
    "type": "nbt:long_array",
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
      "message": "Expected “[L;”",
      "severity": 3
    }
  ]
}

exports['nbt longArray() Parse "[L; 0L, 1L]" 1'] = {
  "node": {
    "type": "nbt:long_array",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 7
        },
        "children": [
          {
            "type": "nbt:long",
            "range": {
              "start": 4,
              "end": 6
            },
            "value": "0"
          }
        ],
        "value": {
          "type": "nbt:long",
          "range": {
            "start": 4,
            "end": 6
          },
          "value": "0"
        },
        "sep": {
          "start": 6,
          "end": 7
        }
      },
      {
        "type": "item",
        "range": {
          "start": 8,
          "end": 10
        },
        "children": [
          {
            "type": "nbt:long",
            "range": {
              "start": 8,
              "end": 10
            },
            "value": "1"
          }
        ],
        "value": {
          "type": "nbt:long",
          "range": {
            "start": 8,
            "end": 10
          },
          "value": "1"
        }
      }
    ]
  },
  "errors": []
}

exports['nbt longArray() Parse "[L; 0L, 2, "string"]" 1'] = {
  "node": {
    "type": "nbt:long_array",
    "range": {
      "start": 0,
      "end": 20
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 4,
          "end": 7
        },
        "children": [
          {
            "type": "nbt:long",
            "range": {
              "start": 4,
              "end": 6
            },
            "value": "0"
          }
        ],
        "value": {
          "type": "nbt:long",
          "range": {
            "start": 4,
            "end": 6
          },
          "value": "0"
        },
        "sep": {
          "start": 6,
          "end": 7
        }
      },
      {
        "type": "item",
        "range": {
          "start": 8,
          "end": 10
        },
        "children": [
          {
            "type": "nbt:int",
            "range": {
              "start": 8,
              "end": 9
            },
            "value": "2"
          }
        ],
        "value": {
          "type": "nbt:int",
          "range": {
            "start": 8,
            "end": 9
          },
          "value": "2"
        },
        "sep": {
          "start": 9,
          "end": 10
        }
      },
      {
        "type": "item",
        "range": {
          "start": 11,
          "end": 19
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 11,
              "end": 19
            },
            "value": "string",
            "valueMap": {
              "outerRange": {
                "start": 12,
                "end": 18
              },
              "innerRange": {
                "start": 0,
                "end": 6
              },
              "pairs": []
            }
          }
        ],
        "value": {
          "type": "string",
          "range": {
            "start": 11,
            "end": 19
          },
          "value": "string",
          "valueMap": {
            "outerRange": {
              "start": 12,
              "end": 18
            },
            "innerRange": {
              "start": 0,
              "end": 6
            },
            "pairs": []
          }
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 8,
        "end": 9
      },
      "message": "Expected a long tag but got an int tag",
      "severity": 3
    },
    {
      "range": {
        "start": 11,
        "end": 19
      },
      "message": "Expected a long tag but got a string tag",
      "severity": 3
    }
  ]
}

exports['nbt longArray() Parse "[L;]" 1'] = {
  "node": {
    "type": "nbt:long_array",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": []
  },
  "errors": []
}
