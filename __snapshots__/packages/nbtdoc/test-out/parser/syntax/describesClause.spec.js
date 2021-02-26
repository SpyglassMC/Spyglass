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
    "range": {
      "start": 0,
      "end": 17
    },
    "children": [
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "Foo"
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
        "value": "describes"
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
        "range": {
          "start": 14,
          "end": 15
        },
        "value": "["
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
        "range": {
          "start": 15,
          "end": 16
        },
        "value": "]"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 16,
          "end": 17
        },
        "value": ";"
      }
    ],
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "children": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "value": "Foo"
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
    ]
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
    "range": {
      "start": 0,
      "end": 28
    },
    "children": [
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "Foo"
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
        "value": "describes"
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
        "range": {
          "start": 28,
          "end": 28
        },
        "value": ""
      }
    ],
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "children": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "value": "Foo"
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
    "objects": null
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
    "range": {
      "start": 0,
      "end": 29
    },
    "children": [
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "Foo"
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
        "value": "describes"
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
        "range": {
          "start": 28,
          "end": 29
        },
        "value": ";"
      }
    ],
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "children": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "value": "Foo"
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
    "objects": null
  },
  "errors": []
}

exports['describesClause() Parse "Foo describes minecraft:item;" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "range": {
      "start": 0,
      "end": 29
    },
    "children": [
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "Foo"
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
        "value": "describes"
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
        "range": {
          "start": 28,
          "end": 29
        },
        "value": ";"
      }
    ],
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "children": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "value": "Foo"
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
    "objects": null
  },
  "errors": []
}

exports['describesClause() Parse "Foo describes minecraft:item[];" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "range": {
      "start": 0,
      "end": 31
    },
    "children": [
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "Foo"
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
        "value": "describes"
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
        "range": {
          "start": 28,
          "end": 29
        },
        "value": "["
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
        "range": {
          "start": 29,
          "end": 30
        },
        "value": "]"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 30,
          "end": 31
        },
        "value": ";"
      }
    ],
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "children": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "value": "Foo"
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
    ]
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
    "range": {
      "start": 0,
      "end": 46
    },
    "children": [
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "Foo"
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
        "value": "describes"
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
        "range": {
          "start": 28,
          "end": 29
        },
        "value": "["
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
        "range": {
          "start": 44,
          "end": 45
        },
        "value": "]"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 45,
          "end": 46
        },
        "value": ";"
      }
    ],
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "children": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "value": "Foo"
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
    ]
  },
  "errors": []
}

exports['describesClause() Parse "Foo describes minecraft:item[↓⮀minecraft:stone,↓⮀minecraft:grass_block,↓];" 1'] = {
  "node": {
    "type": "nbtdoc:describes_clause",
    "range": {
      "start": 0,
      "end": 74
    },
    "children": [
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "Foo"
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
        "value": "describes"
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
        "range": {
          "start": 28,
          "end": 29
        },
        "value": "["
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
        "range": {
          "start": 46,
          "end": 47
        },
        "value": ","
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
        "range": {
          "start": 70,
          "end": 71
        },
        "value": ","
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
        "range": {
          "start": 72,
          "end": 73
        },
        "value": "]"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 73,
          "end": 74
        },
        "value": ";"
      }
    ],
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "children": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "value": "Foo"
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
    ]
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
    "range": {
      "start": 0,
      "end": 73
    },
    "children": [
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "children": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "Foo"
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
        "value": "describes"
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
        "range": {
          "start": 28,
          "end": 29
        },
        "value": "["
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
        "range": {
          "start": 46,
          "end": 47
        },
        "value": ","
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
        "range": {
          "start": 71,
          "end": 72
        },
        "value": "]"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 72,
          "end": 73
        },
        "value": ";"
      }
    ],
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "children": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 0,
            "end": 3
          },
          "value": "Foo"
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
    ]
  },
  "errors": []
}
