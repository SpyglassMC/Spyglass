exports['resourceLocation() Parse "" 1'] = {
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

exports['resourceLocation() Parse ":" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 1
    },
    "namespace": "",
    "path": [
      ""
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse ":/" 1'] = {
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
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse ":foo" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 4
    },
    "namespace": "",
    "path": [
      "foo"
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse ":foo/bar" 1'] = {
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
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse "foo # can you stop before here?" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 3
    },
    "path": [
      "foo"
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse "foo" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 3
    },
    "path": [
      "foo"
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse "foo/bar" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 7
    },
    "path": [
      "foo",
      "bar"
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse "minecraft:foo/bar" 1'] = {
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
    ]
  },
  "errors": []
}

exports['resourceLocation() Parse "spg!:foo:qux/@#$%%ehh/42" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 24
    },
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
      "message": "Illegal character(s) in namespace: “!”",
      "severity": 3
    },
    {
      "range": {
        "start": 0,
        "end": 24
      },
      "message": "Illegal character(s) in path: “:”, “@”, “#”, “$”, and “%”",
      "severity": 3
    }
  ]
}

exports['resourceLocation() Parse "spgoding:foo/bar" 1'] = {
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
    ]
  },
  "errors": []
}
