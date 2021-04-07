exports['resourceLocation() Parse "" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 0
    },
    "category": "function"
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
    "category": "function",
    "isTag": true,
    "path": [
      "tick"
    ]
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
    "category": "function",
    "isTag": true,
    "path": [
      "tick"
    ]
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
    "category": "function",
    "namespace": "",
    "path": [
      ""
    ]
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
    "category": "function",
    "namespace": "",
    "path": [
      "",
      ""
    ]
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
    "category": "function",
    "namespace": "",
    "path": [
      "foo"
    ]
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
    "category": "function",
    "namespace": "",
    "path": [
      "foo",
      "bar"
    ]
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
    "category": "function",
    "path": [
      "foo"
    ]
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
    "category": "function",
    "path": [
      "foo"
    ]
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
    "category": "function",
    "path": [
      "foo",
      "bar"
    ]
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
    "category": "function",
    "namespace": "minecraft",
    "path": [
      "foo",
      "bar"
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse "spg!:foo:qux/@#$%%ehh/42" with function, undefined 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 24
    },
    "category": "function",
    "namespace": "spg!",
    "path": [
      "foo:qux",
      "@#$%%ehh",
      "42"
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 24
      },
      "message": "Illegal character(s): “!”, “:”, “@”, “#”, “$”, and “%”",
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
    "category": "function",
    "namespace": "spgoding",
    "path": [
      "foo",
      "bar"
    ]
  },
  "errors": []
}
