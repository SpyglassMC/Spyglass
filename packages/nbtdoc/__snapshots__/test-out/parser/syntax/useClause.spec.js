exports['useClause() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['useClause() Parse "e" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['useClause() Parse "export use foo::bar;// Trailing comment." 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "nodes": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "text": "export"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 7,
          "end": 10
        },
        "text": "use"
      },
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 11,
              "end": 14
            },
            "text": "foo"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 16,
              "end": 19
            },
            "text": "bar"
          }
        ],
        "range": {
          "start": 11,
          "end": 19
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 19,
          "end": 20
        }
      }
    ],
    "isExport": true,
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 11,
            "end": 14
          },
          "text": "foo"
        },
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 16,
            "end": 19
          },
          "text": "bar"
        }
      ],
      "range": {
        "start": 11,
        "end": 19
      }
    },
    "range": {
      "start": 0,
      "end": 20
    }
  },
  "errors": []
}

exports['useClause() Parse "export use foo;" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "nodes": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "text": "export"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 7,
          "end": 10
        },
        "text": "use"
      },
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 11,
              "end": 14
            },
            "text": "foo"
          }
        ],
        "range": {
          "start": 11,
          "end": 14
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 14,
          "end": 15
        }
      }
    ],
    "isExport": true,
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 11,
            "end": 14
          },
          "text": "foo"
        }
      ],
      "range": {
        "start": 11,
        "end": 14
      }
    },
    "range": {
      "start": 0,
      "end": 15
    }
  },
  "errors": []
}

exports['useClause() Parse "export use super::foo::bar; something else;" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "nodes": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "text": "export"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 7,
          "end": 10
        },
        "text": "use"
      },
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          "super",
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 18,
              "end": 21
            },
            "text": "foo"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 23,
              "end": 26
            },
            "text": "bar"
          }
        ],
        "range": {
          "start": 11,
          "end": 26
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 26,
          "end": 27
        }
      }
    ],
    "isExport": true,
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        "super",
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 18,
            "end": 21
          },
          "text": "foo"
        },
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 23,
            "end": 26
          },
          "text": "bar"
        }
      ],
      "range": {
        "start": 11,
        "end": 26
      }
    },
    "range": {
      "start": 0,
      "end": 27
    }
  },
  "errors": []
}

exports['useClause() Parse "export" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['useClause() Parse "exportusefoo;" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "nodes": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "text": "export"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 6,
          "end": 9
        },
        "text": "use"
      },
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 9,
              "end": 12
            },
            "text": "foo"
          }
        ],
        "range": {
          "start": 9,
          "end": 12
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 12,
          "end": 13
        }
      }
    ],
    "isExport": true,
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 9,
            "end": 12
          },
          "text": "foo"
        }
      ],
      "range": {
        "start": 9,
        "end": 12
      }
    },
    "range": {
      "start": 0,
      "end": 13
    }
  },
  "errors": [
    {
      "range": {
        "start": 6,
        "end": 6
      },
      "message": "Expected a separation",
      "severity": 3
    },
    {
      "range": {
        "start": 9,
        "end": 9
      },
      "message": "Expected a separation",
      "severity": 3
    }
  ]
}

exports['useClause() Parse "u" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['useClause() Parse "use foo" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "nodes": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "use"
      },
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 7
            },
            "text": "foo"
          }
        ],
        "range": {
          "start": 4,
          "end": 7
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": "",
        "range": {
          "start": 7,
          "end": 7
        }
      }
    ],
    "isExport": false,
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 7
          },
          "text": "foo"
        }
      ],
      "range": {
        "start": 4,
        "end": 7
      }
    },
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": [
    {
      "range": {
        "start": 7,
        "end": 7
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['useClause() Parse "use foo;" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "nodes": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "use"
      },
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 7
            },
            "text": "foo"
          }
        ],
        "range": {
          "start": 4,
          "end": 7
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": ";",
        "range": {
          "start": 7,
          "end": 8
        }
      }
    ],
    "isExport": false,
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 7
          },
          "text": "foo"
        }
      ],
      "range": {
        "start": 4,
        "end": 7
      }
    },
    "range": {
      "start": 0,
      "end": 8
    }
  },
  "errors": []
}

exports['useClause() Parse "use" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "nodes": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "use"
      },
      {
        "type": "nbtdoc:identifier_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 3,
              "end": 3
            },
            "text": ""
          }
        ],
        "range": {
          "start": 3,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "text": "",
        "range": {
          "start": 3,
          "end": 3
        }
      }
    ],
    "isExport": false,
    "path": {
      "type": "nbtdoc:identifier_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 3,
            "end": 3
          },
          "text": ""
        }
      ],
      "range": {
        "start": 3,
        "end": 3
      }
    },
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}
