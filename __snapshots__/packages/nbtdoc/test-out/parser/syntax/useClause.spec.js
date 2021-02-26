exports['useClause() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['useClause() Parse "e" 1'] = {
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected “export”",
      "severity": 3
    }
  ]
}

exports['useClause() Parse "export use foo::bar;// Trailing comment." 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "range": {
      "start": 0,
      "end": 20
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "export"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "use"
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 11,
              "end": 14
            },
            "value": "foo"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 16,
              "end": 19
            },
            "value": "bar"
          }
        ],
        "range": {
          "start": 11,
          "end": 19
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 19,
          "end": 20
        },
        "value": ";"
      }
    ],
    "isExport": true,
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 11,
            "end": 14
          },
          "value": "foo"
        },
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 16,
            "end": 19
          },
          "value": "bar"
        }
      ],
      "range": {
        "start": 11,
        "end": 19
      }
    }
  },
  "errors": []
}

exports['useClause() Parse "export use foo;" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "range": {
      "start": 0,
      "end": 15
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "export"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "use"
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 11,
              "end": 14
            },
            "value": "foo"
          }
        ],
        "range": {
          "start": 11,
          "end": 14
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 14,
          "end": 15
        },
        "value": ";"
      }
    ],
    "isExport": true,
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 11,
            "end": 14
          },
          "value": "foo"
        }
      ],
      "range": {
        "start": 11,
        "end": 14
      }
    }
  },
  "errors": []
}

exports['useClause() Parse "export use super::foo::bar; something else;" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "range": {
      "start": 0,
      "end": 27
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "export"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "use"
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 11,
              "end": 16
            },
            "value": "super"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 18,
              "end": 21
            },
            "value": "foo"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 23,
              "end": 26
            },
            "value": "bar"
          }
        ],
        "range": {
          "start": 11,
          "end": 26
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 26,
          "end": 27
        },
        "value": ";"
      }
    ],
    "isExport": true,
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:literal",
          "range": {
            "start": 11,
            "end": 16
          },
          "value": "super"
        },
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 18,
            "end": 21
          },
          "value": "foo"
        },
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 23,
            "end": 26
          },
          "value": "bar"
        }
      ],
      "range": {
        "start": 11,
        "end": 26
      }
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
    "range": {
      "start": 0,
      "end": 13
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "export"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 6,
          "end": 9
        },
        "value": "use"
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 9,
              "end": 12
            },
            "value": "foo"
          }
        ],
        "range": {
          "start": 9,
          "end": 12
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 12,
          "end": 13
        },
        "value": ";"
      }
    ],
    "isExport": true,
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 9,
            "end": 12
          },
          "value": "foo"
        }
      ],
      "range": {
        "start": 9,
        "end": 12
      }
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
  "node": {
    "type": "nbtdoc:use_clause",
    "range": {
      "start": 0,
      "end": 1
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": ""
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 1,
              "end": 1
            },
            "value": ""
          }
        ],
        "range": {
          "start": 1,
          "end": 1
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 1,
          "end": 1
        },
        "value": ""
      }
    ],
    "isExport": false,
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 1,
            "end": 1
          },
          "value": ""
        }
      ],
      "range": {
        "start": 1,
        "end": 1
      }
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected “use”",
      "severity": 3
    },
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 1,
        "end": 1
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['useClause() Parse "use foo" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "range": {
      "start": 0,
      "end": 7
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "use"
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 7
            },
            "value": "foo"
          }
        ],
        "range": {
          "start": 4,
          "end": 7
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 7,
          "end": 7
        },
        "value": ""
      }
    ],
    "isExport": false,
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 7
          },
          "value": "foo"
        }
      ],
      "range": {
        "start": 4,
        "end": 7
      }
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
    "range": {
      "start": 0,
      "end": 8
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "use"
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 7
            },
            "value": "foo"
          }
        ],
        "range": {
          "start": 4,
          "end": 7
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 7,
          "end": 8
        },
        "value": ";"
      }
    ],
    "isExport": false,
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 7
          },
          "value": "foo"
        }
      ],
      "range": {
        "start": 4,
        "end": 7
      }
    }
  },
  "errors": []
}

exports['useClause() Parse "use" 1'] = {
  "node": {
    "type": "nbtdoc:use_clause",
    "range": {
      "start": 0,
      "end": 3
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "use"
      },
      {
        "type": "nbtdoc:ident_path",
        "fromGlobalRoot": false,
        "path": [
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 3,
              "end": 3
            },
            "value": ""
          }
        ],
        "range": {
          "start": 3,
          "end": 3
        }
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 3,
          "end": 3
        },
        "value": ""
      }
    ],
    "isExport": false,
    "path": {
      "type": "nbtdoc:ident_path",
      "fromGlobalRoot": false,
      "path": [
        {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 3,
            "end": 3
          },
          "value": ""
        }
      ],
      "range": {
        "start": 3,
        "end": 3
      }
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
