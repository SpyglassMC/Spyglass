exports['nbt path() Parse "" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [],
    "range": {
      "start": 0,
      "end": 0
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a compound filter or a key but got the end of path",
      "severity": 3
    }
  ]
}

exports['nbt path() Parse ""foo"" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 5
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 1,
              "end": 4
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 5
    }
  },
  "errors": []
}

exports['nbt path() Parse "\'foo\'" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 5
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 1,
              "end": 4
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 5
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Only “\"” can be used to quote strings here",
      "severity": 3
    }
  ]
}

exports['nbt path() Parse "[ ]" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "nbt:path/index",
        "range": {
          "start": 0,
          "end": 3
        }
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
        "start": 0,
        "end": 0
      },
      "message": "Expected a compound filter or a key but got an index",
      "severity": 3
    }
  ]
}

exports['nbt path() Parse "foo" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['nbt path() Parse "foo.[ ]" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:path/index",
        "range": {
          "start": 4,
          "end": 7
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": []
}

exports['nbt path() Parse "foo.bar" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "string",
        "range": {
          "start": 4,
          "end": 7
        },
        "value": "bar",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 4,
              "end": 7
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": []
}

exports['nbt path() Parse "foo.{ }" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:compound",
        "range": {
          "start": 4,
          "end": 7
        },
        "children": []
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": [
    {
      "range": {
        "start": 4,
        "end": 4
      },
      "message": "Expected an index or a key but got a compound filter",
      "severity": 3
    }
  ]
}

exports['nbt path() Parse "foo[ 0 ]" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:path/index",
        "children": [
          {
            "type": "integer",
            "range": {
              "start": 5,
              "end": 6
            },
            "value": 0
          }
        ],
        "range": {
          "start": 3,
          "end": 8
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 8
    }
  },
  "errors": []
}

exports['nbt path() Parse "foo[ ]" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:path/index",
        "range": {
          "start": 3,
          "end": 6
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 6
    }
  },
  "errors": []
}

exports['nbt path() Parse "foo[ ].[ ]" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:path/index",
        "range": {
          "start": 3,
          "end": 6
        }
      },
      {
        "type": "nbt:path/index",
        "range": {
          "start": 7,
          "end": 10
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['nbt path() Parse "foo[ ].bar" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:path/index",
        "range": {
          "start": 3,
          "end": 6
        }
      },
      {
        "type": "string",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "bar",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 7,
              "end": 10
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['nbt path() Parse "foo[ ][ ]" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:path/index",
        "range": {
          "start": 3,
          "end": 6
        }
      },
      {
        "type": "nbt:path/index",
        "range": {
          "start": 6,
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

exports['nbt path() Parse "foo[ { } ]" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:path/index",
        "children": [
          {
            "type": "nbt:compound",
            "range": {
              "start": 5,
              "end": 8
            },
            "children": []
          }
        ],
        "range": {
          "start": 3,
          "end": 10
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['nbt path() Parse "foo{ }" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 3
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      },
      {
        "type": "nbt:compound",
        "range": {
          "start": 3,
          "end": 6
        },
        "children": []
      }
    ],
    "range": {
      "start": 0,
      "end": 6
    }
  },
  "errors": []
}

exports['nbt path() Parse "{ }" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "nbt:compound",
        "range": {
          "start": 0,
          "end": 3
        },
        "children": []
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['nbt path() Parse "{ }.foo" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "nbt:compound",
        "range": {
          "start": 0,
          "end": 3
        },
        "children": []
      },
      {
        "type": "string",
        "range": {
          "start": 4,
          "end": 7
        },
        "value": "foo",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 4,
              "end": 7
            },
            "innerRange": {
              "start": 0,
              "end": 3
            },
            "pairs": []
          }
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": []
}

exports['nbt path() Parse "文字" 1'] = {
  "node": {
    "type": "nbt:path",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 2
        },
        "value": "文字",
        "childrenMaps": [
          {
            "outerRange": {
              "start": 0,
              "end": 2
            },
            "innerRange": {
              "start": 0,
              "end": 2
            },
            "pairs": []
          }
        ]
      }
    ],
    "range": {
      "start": 0,
      "end": 2
    }
  },
  "errors": []
}
