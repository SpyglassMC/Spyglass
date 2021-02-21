exports['ModuleDeclarationParser parse() Should parse \'\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 0
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 0
        },
        "text": ""
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 0,
          "end": 0
        },
        "text": ""
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 0
        },
        "text": ""
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 0,
        "end": 0
      },
      "text": ""
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected “mod”",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an identifier",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected “;”",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Cannot find the keyword “mod”",
      "severity": 4
    }
  ]
}

exports['ModuleDeclarationParser parse() Should parse \'m\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 1
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 0
        },
        "text": ""
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 0,
          "end": 1
        },
        "text": "m"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 1,
          "end": 1
        },
        "text": ""
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 0,
        "end": 1
      },
      "text": "m"
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected “mod”",
      "severity": 3
    },
    {
      "range": {
        "start": 1,
        "end": 2
      },
      "message": "Expected “;”",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Cannot find the keyword “mod”",
      "severity": 4
    }
  ]
}

exports['ModuleDeclarationParser parse() Should parse \'mod zombie\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 10
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "text": "zombie"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 10,
          "end": 10
        },
        "text": ""
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    }
  },
  "errors": [
    {
      "range": {
        "start": 10,
        "end": 11
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['ModuleDeclarationParser parse() Should parse \'mod zombie;\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 11
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "text": "zombie"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 10,
          "end": 11
        },
        "text": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    }
  },
  "errors": []
}

exports['ModuleDeclarationParser parse() Should parse \'mod zombie;// Trailing comment.\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 11
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "text": "zombie"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 10,
          "end": 11
        },
        "text": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    }
  },
  "errors": []
}

exports['ModuleDeclarationParser parse() Should parse \'mod zombie;syntax test.\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 11
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "text": "zombie"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 10,
          "end": 11
        },
        "text": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    }
  },
  "errors": []
}

exports['ModuleDeclarationParser parse() Should parse \'mod zombie↓syntax test.\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 11
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "text": "zombie"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 11,
          "end": 11
        },
        "text": ""
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    }
  },
  "errors": [
    {
      "range": {
        "start": 11,
        "end": 12
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['ModuleDeclarationParser parse() Should parse \'mod\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 3
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 3,
          "end": 3
        },
        "text": ""
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 3,
          "end": 3
        },
        "text": ""
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 3,
        "end": 3
      },
      "text": ""
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
        "end": 4
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['ModuleDeclarationParser parse() Should parse \'mod// Comment.↓zombie ;\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 23
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "comment",
        "range": {
          "start": 3,
          "end": 14
        }
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 15,
          "end": 21
        },
        "text": "zombie"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 22,
          "end": 23
        },
        "text": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 15,
        "end": 21
      },
      "text": "zombie"
    }
  },
  "errors": []
}

exports['ModuleDeclarationParser parse() Should parse \'mod/// Doc Comment.↓zombie ;\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 28
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "comment",
        "range": {
          "start": 3,
          "end": 19
        }
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 20,
          "end": 26
        },
        "text": "zombie"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 27,
          "end": 28
        },
        "text": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 20,
        "end": 26
      },
      "text": "zombie"
    }
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 19
      },
      "message": "Doc comments are not allowed here; you might want to replace the three slashes with two slashes",
      "severity": 3
    }
  ]
}

exports['ModuleDeclarationParser parse() Should parse \'modzombie;\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 10
    },
    "nodes": [
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 3,
          "end": 9
        },
        "text": "zombie"
      },
      {
        "type": "nbtdoc:keyword",
        "range": {
          "start": 9,
          "end": 10
        },
        "text": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 3,
        "end": 9
      },
      "text": "zombie"
    }
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 4
      },
      "message": "Expected a separation",
      "severity": 3
    }
  ]
}
