exports['mcdoc resLoc() Parse "" 1'] = {
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
    },
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected the colon (“:”) of resource locations",
      "severity": 3
    }
  ]
}

exports['mcdoc resLoc() Parse ":/" 1'] = {
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

exports['mcdoc resLoc() Parse "foo" 1'] = {
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
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "Expected the colon (“:”) of resource locations",
      "severity": 3
    }
  ]
}

exports['mcdoc resLoc() Parse "foo:" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 4
    },
    "namespace": "foo",
    "path": [
      ""
    ]
  },
  "errors": []
}

exports['mcdoc resLoc() Parse "foo:bar" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 7
    },
    "namespace": "foo",
    "path": [
      "bar"
    ]
  },
  "errors": []
}

exports['mcdoc resLoc() Parse "foo:bar/baz" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 11
    },
    "namespace": "foo",
    "path": [
      "bar",
      "baz"
    ]
  },
  "errors": []
}

exports['mcdoc resLoc() Parse "foo:bar:baz" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 11
    },
    "namespace": "foo",
    "path": [
      "bar:baz"
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 11
      },
      "message": "Illegal character(s): “:”",
      "severity": 3
    }
  ]
}

exports['mcdoc resLoc() Parse "foo:bar↓something else;" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 7
    },
    "namespace": "foo",
    "path": [
      "bar"
    ]
  },
  "errors": []
}
