exports['identifierPath() Test "" 1'] = {
  "node": {
    "type": "nbtdoc:identifier_path",
    "fromGlobalRoot": false,
    "path": [
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 0,
          "end": 0
        },
        "text": ""
      }
    ],
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
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['identifierPath() Test "::foo::bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier_path",
    "fromGlobalRoot": true,
    "path": [
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 2,
          "end": 5
        },
        "text": "foo"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "text": "bar"
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['identifierPath() Test "foo" 1'] = {
  "node": {
    "type": "nbtdoc:identifier_path",
    "fromGlobalRoot": false,
    "path": [
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "foo"
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['identifierPath() Test "foo::bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier_path",
    "fromGlobalRoot": false,
    "path": [
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 0,
          "end": 3
        },
        "text": "foo"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 5,
          "end": 8
        },
        "text": "bar"
      }
    ],
    "range": {
      "start": 0,
      "end": 8
    }
  },
  "errors": []
}

exports['identifierPath() Test "super::foo something else;" 1'] = {
  "node": {
    "type": "nbtdoc:identifier_path",
    "fromGlobalRoot": false,
    "path": [
      "super",
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "text": "foo"
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['identifierPath() Test "super::foo" 1'] = {
  "node": {
    "type": "nbtdoc:identifier_path",
    "fromGlobalRoot": false,
    "path": [
      "super",
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "text": "foo"
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['identifierPath() Test "super::foo::bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier_path",
    "fromGlobalRoot": false,
    "path": [
      "super",
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "text": "foo"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 12,
          "end": 15
        },
        "text": "bar"
      }
    ],
    "range": {
      "start": 0,
      "end": 15
    }
  },
  "errors": []
}
