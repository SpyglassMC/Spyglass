exports['describesClause() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['describesClause() Parse "Foo describes [];" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "nodes": [
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "Foo"
          }
        ],
        "range": {
          "start": 0,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 13
        },
        "text": "describes"
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 14,
          "end": 14
        },
        "namespace": "",
        "path": []
      },
      {
        "type": "nbtdoc:literal",
        "text": "[",
        "range": {
          "start": 14,
          "end": 15
        }
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 15,
          "end": 15
        },
        "namespace": "",
        "path": []
      },
      {
        "type": "nbtdoc:literal",
        "text": "]",
        "range": {
          "start": 15,
          "end": 16
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 16,
          "end": 17
        }
      }
    ],
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "text": "Foo"
        }
      ],
      "range": {
        "start": 0,
        "end": 3
      }
    },
    "registry": {
      "type": "nbtdoc:minecraft_identifier",
      "range": {
        "start": 14,
        "end": 14
      },
      "namespace": "",
      "path": []
    },
    "objects": [
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 15,
          "end": 15
        },
        "namespace": "",
        "path": []
      }
    ],
    "range": {
      "start": 0,
      "end": 17
    }
  },
  "errors": [
    {
      "range": {
        "start": 14,
        "end": 14
      },
      "message": "Expected the colon (“:”) of Minecraft identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 15,
        "end": 15
      },
      "message": "Expected the colon (“:”) of Minecraft identifier",
      "severity": 3
    }
  ]
}

exports['describesClause() Parse "Foo describes minecraft:item" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "nodes": [
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "Foo"
          }
        ],
        "range": {
          "start": 0,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 13
        },
        "text": "describes"
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 14,
          "end": 28
        },
        "namespace": "minecraft",
        "path": [
          "item"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": "",
        "range": {
          "start": 28,
          "end": 28
        }
      }
    ],
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "text": "Foo"
        }
      ],
      "range": {
        "start": 0,
        "end": 3
      }
    },
    "registry": {
      "type": "nbtdoc:minecraft_identifier",
      "range": {
        "start": 14,
        "end": 28
      },
      "namespace": "minecraft",
      "path": [
        "item"
      ]
    },
    "objects": null,
    "range": {
      "start": 0,
      "end": 28
    }
  },
  "errors": [
    {
      "range": {
        "start": 28,
        "end": 28
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['describesClause() Parse "Foo describes minecraft:item; something else;" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "nodes": [
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "Foo"
          }
        ],
        "range": {
          "start": 0,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 13
        },
        "text": "describes"
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 14,
          "end": 28
        },
        "namespace": "minecraft",
        "path": [
          "item"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 28,
          "end": 29
        }
      }
    ],
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "text": "Foo"
        }
      ],
      "range": {
        "start": 0,
        "end": 3
      }
    },
    "registry": {
      "type": "nbtdoc:minecraft_identifier",
      "range": {
        "start": 14,
        "end": 28
      },
      "namespace": "minecraft",
      "path": [
        "item"
      ]
    },
    "objects": null,
    "range": {
      "start": 0,
      "end": 29
    }
  },
  "errors": []
}

exports['describesClause() Parse "Foo describes minecraft:item;" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "nodes": [
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "Foo"
          }
        ],
        "range": {
          "start": 0,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 13
        },
        "text": "describes"
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 14,
          "end": 28
        },
        "namespace": "minecraft",
        "path": [
          "item"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 28,
          "end": 29
        }
      }
    ],
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "text": "Foo"
        }
      ],
      "range": {
        "start": 0,
        "end": 3
      }
    },
    "registry": {
      "type": "nbtdoc:minecraft_identifier",
      "range": {
        "start": 14,
        "end": 28
      },
      "namespace": "minecraft",
      "path": [
        "item"
      ]
    },
    "objects": null,
    "range": {
      "start": 0,
      "end": 29
    }
  },
  "errors": []
}

exports['describesClause() Parse "Foo describes minecraft:item[];" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "nodes": [
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "Foo"
          }
        ],
        "range": {
          "start": 0,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 13
        },
        "text": "describes"
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 14,
          "end": 28
        },
        "namespace": "minecraft",
        "path": [
          "item"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": "[",
        "range": {
          "start": 28,
          "end": 29
        }
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 29,
          "end": 29
        },
        "namespace": "",
        "path": []
      },
      {
        "type": "nbtdoc:literal",
        "text": "]",
        "range": {
          "start": 29,
          "end": 30
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 30,
          "end": 31
        }
      }
    ],
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "text": "Foo"
        }
      ],
      "range": {
        "start": 0,
        "end": 3
      }
    },
    "registry": {
      "type": "nbtdoc:minecraft_identifier",
      "range": {
        "start": 14,
        "end": 28
      },
      "namespace": "minecraft",
      "path": [
        "item"
      ]
    },
    "objects": [
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 29,
          "end": 29
        },
        "namespace": "",
        "path": []
      }
    ],
    "range": {
      "start": 0,
      "end": 31
    }
  },
  "errors": [
    {
      "range": {
        "start": 29,
        "end": 29
      },
      "message": "Expected the colon (“:”) of Minecraft identifier",
      "severity": 3
    }
  ]
}

exports['describesClause() Parse "Foo describes minecraft:item[minecraft:stone];" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "nodes": [
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "Foo"
          }
        ],
        "range": {
          "start": 0,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 13
        },
        "text": "describes"
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 14,
          "end": 28
        },
        "namespace": "minecraft",
        "path": [
          "item"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": "[",
        "range": {
          "start": 28,
          "end": 29
        }
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 29,
          "end": 44
        },
        "namespace": "minecraft",
        "path": [
          "stone"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": "]",
        "range": {
          "start": 44,
          "end": 45
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 45,
          "end": 46
        }
      }
    ],
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "text": "Foo"
        }
      ],
      "range": {
        "start": 0,
        "end": 3
      }
    },
    "registry": {
      "type": "nbtdoc:minecraft_identifier",
      "range": {
        "start": 14,
        "end": 28
      },
      "namespace": "minecraft",
      "path": [
        "item"
      ]
    },
    "objects": [
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 29,
          "end": 44
        },
        "namespace": "minecraft",
        "path": [
          "stone"
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 46
    }
  },
  "errors": []
}

exports['describesClause() Parse "Foo describes minecraft:item[↓⮀minecraft:stone,↓⮀minecraft:grass_block,↓];" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "nodes": [
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "Foo"
          }
        ],
        "range": {
          "start": 0,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 13
        },
        "text": "describes"
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 14,
          "end": 28
        },
        "namespace": "minecraft",
        "path": [
          "item"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": "[",
        "range": {
          "start": 28,
          "end": 29
        }
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 31,
          "end": 46
        },
        "namespace": "minecraft",
        "path": [
          "stone"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": ",",
        "range": {
          "start": 46,
          "end": 47
        }
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 49,
          "end": 70
        },
        "namespace": "minecraft",
        "path": [
          "grass_block"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": ",",
        "range": {
          "start": 70,
          "end": 71
        }
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 72,
          "end": 72
        },
        "namespace": "",
        "path": []
      },
      {
        "type": "nbtdoc:literal",
        "text": "]",
        "range": {
          "start": 72,
          "end": 73
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 73,
          "end": 74
        }
      }
    ],
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "text": "Foo"
        }
      ],
      "range": {
        "start": 0,
        "end": 3
      }
    },
    "registry": {
      "type": "nbtdoc:minecraft_identifier",
      "range": {
        "start": 14,
        "end": 28
      },
      "namespace": "minecraft",
      "path": [
        "item"
      ]
    },
    "objects": [
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 31,
          "end": 46
        },
        "namespace": "minecraft",
        "path": [
          "stone"
        ]
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 49,
          "end": 70
        },
        "namespace": "minecraft",
        "path": [
          "grass_block"
        ]
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 72,
          "end": 72
        },
        "namespace": "",
        "path": []
      }
    ],
    "range": {
      "start": 0,
      "end": 74
    }
  },
  "errors": [
    {
      "range": {
        "start": 72,
        "end": 72
      },
      "message": "Expected the colon (“:”) of Minecraft identifier",
      "severity": 3
    }
  ]
}

exports['describesClause() Parse "Foo describes minecraft:item[↓⮀minecraft:stone,↓⮀minecraft:grass_block↓];" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "nodes": [
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "Foo"
          }
        ],
        "range": {
          "start": 0,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 4,
          "end": 13
        },
        "text": "describes"
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 14,
          "end": 28
        },
        "namespace": "minecraft",
        "path": [
          "item"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": "[",
        "range": {
          "start": 28,
          "end": 29
        }
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 31,
          "end": 46
        },
        "namespace": "minecraft",
        "path": [
          "stone"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": ",",
        "range": {
          "start": 46,
          "end": 47
        }
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 49,
          "end": 70
        },
        "namespace": "minecraft",
        "path": [
          "grass_block"
        ]
      },
      {
        "type": "nbtdoc:literal",
        "text": "]",
        "range": {
          "start": 71,
          "end": 72
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 72,
          "end": 73
        }
      }
    ],
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "text": "Foo"
        }
      ],
      "range": {
        "start": 0,
        "end": 3
      }
    },
    "registry": {
      "type": "nbtdoc:minecraft_identifier",
      "range": {
        "start": 14,
        "end": 28
      },
      "namespace": "minecraft",
      "path": [
        "item"
      ]
    },
    "objects": [
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 31,
          "end": 46
        },
        "namespace": "minecraft",
        "path": [
          "stone"
        ]
      },
      {
        "type": "nbtdoc:minecraft_identifier",
        "range": {
          "start": 49,
          "end": 70
        },
        "namespace": "minecraft",
        "path": [
          "grass_block"
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 73
    }
  },
  "errors": []
}
