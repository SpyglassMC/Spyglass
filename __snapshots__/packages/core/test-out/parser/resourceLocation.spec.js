exports['resourceLocation() Parse "" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
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
      "message": "Expected a resource location",
      "severity": 3
    }
  ]
}

exports['resourceLocation() Parse "#tick" with function, false 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 5
    },
    "isTag": true,
    "path": [
      "tick"
    ],
    "symbol": {
      "category": "tag/function",
      "identifier": "minecraft:tick",
      "path": [
        "minecraft:tick"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Tags are not allowed here",
      "severity": 3
    }
  ]
}

exports['resourceLocation() Parse "#tick" with function, true 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 5
    },
    "isTag": true,
    "path": [
      "tick"
    ],
    "symbol": {
      "category": "tag/function",
      "identifier": "minecraft:tick",
      "path": [
        "minecraft:tick"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse ":" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 1
    },
    "namespace": "",
    "path": [
      ""
    ],
    "symbol": {
      "category": "function",
      "identifier": "minecraft:",
      "path": [
        "minecraft:"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse ":/" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 2
    },
    "namespace": "",
    "path": [
      "",
      ""
    ],
    "symbol": {
      "category": "function",
      "identifier": "minecraft:/",
      "path": [
        "minecraft:/"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse ":foo" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 4
    },
    "namespace": "",
    "path": [
      "foo"
    ],
    "symbol": {
      "category": "function",
      "identifier": "minecraft:foo",
      "path": [
        "minecraft:foo"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse ":foo/bar" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 8
    },
    "namespace": "",
    "path": [
      "foo",
      "bar"
    ],
    "symbol": {
      "category": "function",
      "identifier": "minecraft:foo/bar",
      "path": [
        "minecraft:foo/bar"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse "foo # can you stop before here?" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 3
    },
    "path": [
      "foo"
    ],
    "symbol": {
      "category": "function",
      "identifier": "minecraft:foo",
      "path": [
        "minecraft:foo"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse "foo" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 3
    },
    "path": [
      "foo"
    ],
    "symbol": {
      "category": "function",
      "identifier": "minecraft:foo",
      "path": [
        "minecraft:foo"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse "foo/bar" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 7
    },
    "path": [
      "foo",
      "bar"
    ],
    "symbol": {
      "category": "function",
      "identifier": "minecraft:foo/bar",
      "path": [
        "minecraft:foo/bar"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse "minecraft:foo/bar" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 17
    },
    "namespace": "minecraft",
    "path": [
      "foo",
      "bar"
    ],
    "symbol": {
      "category": "function",
      "identifier": "minecraft:foo/bar",
      "path": [
        "minecraft:foo/bar"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}

exports['resourceLocation() Parse "spg/:foo:qux/H/42" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 17
    },
    "namespace": "spg/",
    "path": [
      "foo:qux",
      "H",
      "42"
    ],
    "symbol": {
      "category": "function",
      "identifier": "spg/:foo:qux/H/42",
      "path": [
        "spg/:foo:qux/H/42"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 17
      },
      "message": "Illegal character(s): “/”, “:”, and “H”",
      "severity": 3
    }
  ]
}

exports['resourceLocation() Parse "spgoding:foo/bar" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 16
    },
    "namespace": "spgoding",
    "path": [
      "foo",
      "bar"
    ],
    "symbol": {
      "category": "function",
      "identifier": "spgoding:foo/bar",
      "path": [
        "spgoding:foo/bar"
      ],
      "reference": [
        {
          "uri": ""
        }
      ]
    }
  },
  "errors": []
}
