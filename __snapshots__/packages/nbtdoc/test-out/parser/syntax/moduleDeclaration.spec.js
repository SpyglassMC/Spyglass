exports['moduleDeclaration() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['moduleDeclaration() Parse "m" 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "type": "nbtdoc:identifier",
        "range": {
          "start": 1,
          "end": 1
        },
        "value": ""
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
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 1,
        "end": 1
      },
      "value": ""
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

exports['moduleDeclaration() Parse "mod zombie" 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "value": "zombie"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 10,
          "end": 10
        },
        "value": ""
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "value": "zombie"
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

exports['moduleDeclaration() Parse "mod zombie;" 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "value": "zombie"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 10,
          "end": 11
        },
        "value": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "value": "zombie"
    }
  },
  "errors": []
}

exports['moduleDeclaration() Parse "mod zombie;// Trailing comment." 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "value": "zombie"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 10,
          "end": 11
        },
        "value": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "value": "zombie"
    }
  },
  "errors": []
}

exports['moduleDeclaration() Parse "mod zombie;syntax test." 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "value": "zombie"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 10,
          "end": 11
        },
        "value": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "value": "zombie"
    }
  },
  "errors": []
}

exports['moduleDeclaration() Parse "mod zombie↓syntax test." 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 4,
          "end": 10
        },
        "value": "zombie"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 11,
          "end": 11
        },
        "value": ""
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 4,
        "end": 10
      },
      "value": "zombie"
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

exports['moduleDeclaration() Parse "mod" 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
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
        "value": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 3,
          "end": 3
        },
        "value": ""
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
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 3,
        "end": 3
      },
      "value": ""
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

exports['moduleDeclaration() Parse "mod// Comment.↓zombie ;" 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 23
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "mod"
      },
      {
        "type": "comment",
        "range": {
          "start": 3,
          "end": 14
        },
        "comment": " Comment."
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 15,
          "end": 21
        },
        "value": "zombie"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 22,
          "end": 23
        },
        "value": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 15,
        "end": 21
      },
      "value": "zombie"
    }
  },
  "errors": []
}

exports['moduleDeclaration() Parse "mod/// Doc Comment.↓zombie ;" 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 28
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "mod"
      },
      {
        "type": "comment",
        "range": {
          "start": 3,
          "end": 19
        },
        "comment": "/ Doc Comment."
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 20,
          "end": 26
        },
        "value": "zombie"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 27,
          "end": 28
        },
        "value": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 20,
        "end": 26
      },
      "value": "zombie"
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

exports['moduleDeclaration() Parse "modzombie;" 1'] = {
  "node": {
    "type": "nbtdoc:module_declaration",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "mod"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 3,
          "end": 9
        },
        "value": "zombie"
      },
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 9,
          "end": 10
        },
        "value": ";"
      }
    ],
    "identifier": {
      "type": "nbtdoc:identifier",
      "range": {
        "start": 3,
        "end": 9
      },
      "value": "zombie"
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
