exports['moduleDeclaration() Should parse \'\' 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['moduleDeclaration() Should parse \'m\' 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['moduleDeclaration() Should parse \'mod zombie\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "type": "nbtdoc:punctuation",
        "text": "",
        "range": {
          "start": 10,
          "end": 10
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    },
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": [
    {
      "range": {
        "start": 10,
        "end": 10
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['moduleDeclaration() Should parse \'mod zombie;\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "type": "nbtdoc:punctuation",
        "text": ";",
        "range": {
          "start": 10,
          "end": 11
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    },
    "range": {
      "start": 0,
      "end": 11
    }
  },
  "errors": []
}

exports['moduleDeclaration() Should parse \'mod zombie;// Trailing comment.\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "type": "nbtdoc:punctuation",
        "text": ";",
        "range": {
          "start": 10,
          "end": 11
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    },
    "range": {
      "start": 0,
      "end": 11
    }
  },
  "errors": []
}

exports['moduleDeclaration() Should parse \'mod zombie;syntax test.\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "type": "nbtdoc:punctuation",
        "text": ";",
        "range": {
          "start": 10,
          "end": 11
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    },
    "range": {
      "start": 0,
      "end": 11
    }
  },
  "errors": []
}

exports['moduleDeclaration() Should parse \'mod zombie↓syntax test.\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "type": "nbtdoc:punctuation",
        "text": "",
        "range": {
          "start": 11,
          "end": 11
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "text": "zombie"
    },
    "range": {
      "start": 0,
      "end": 11
    }
  },
  "errors": [
    {
      "range": {
        "start": 11,
        "end": 11
      },
      "message": "Expected “;”",
      "severity": 3
    }
  ]
}

exports['moduleDeclaration() Should parse \'mod\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "type": "nbtdoc:punctuation",
        "text": "",
        "range": {
          "start": 3,
          "end": 3
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 3,
        "end": 3
      },
      "text": ""
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

exports['moduleDeclaration() Should parse \'mod// Comment.↓zombie ;\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        },
        "comment": "// Comment."
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
        "type": "nbtdoc:punctuation",
        "text": ";",
        "range": {
          "start": 22,
          "end": 23
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 15,
        "end": 21
      },
      "text": "zombie"
    },
    "range": {
      "start": 0,
      "end": 23
    }
  },
  "errors": []
}

exports['moduleDeclaration() Should parse \'mod/// Doc Comment.↓zombie ;\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        },
        "comment": "/// Doc Comment."
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
        "type": "nbtdoc:punctuation",
        "text": ";",
        "range": {
          "start": 27,
          "end": 28
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 20,
        "end": 26
      },
      "text": "zombie"
    },
    "range": {
      "start": 0,
      "end": 28
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

exports['moduleDeclaration() Should parse \'modzombie;\' 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "type": "nbtdoc:punctuation",
        "text": ";",
        "range": {
          "start": 9,
          "end": 10
        }
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 3,
        "end": 9
      },
      "text": "zombie"
    },
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected a separation",
      "severity": 3
    }
  ]
}
