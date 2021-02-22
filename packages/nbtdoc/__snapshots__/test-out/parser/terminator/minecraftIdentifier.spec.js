exports['minecraftIdentifier() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:minecraft_identifier",
    "range": {
      "start": 0,
      "end": 0
    },
    "namespace": "",
    "path": []
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a colon; namespaces of Minecraft identifiers can not be omitted in nbtdoc files",
      "severity": 3
    }
  ]
}

exports['minecraftIdentifier() Parse ":/" 1'] = {
  "node": {
    "type": "nbtdoc:minecraft_identifier",
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

exports['minecraftIdentifier() Parse "foo" 1'] = {
  "node": {
    "type": "nbtdoc:minecraft_identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "namespace": "foo",
    "path": []
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected a colon; namespaces of Minecraft identifiers can not be omitted in nbtdoc files",
      "severity": 3
    }
  ]
}

exports['minecraftIdentifier() Parse "foo:" 1'] = {
  "node": {
    "type": "nbtdoc:minecraft_identifier",
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

exports['minecraftIdentifier() Parse "foo:bar" 1'] = {
  "node": {
    "type": "nbtdoc:minecraft_identifier",
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

exports['minecraftIdentifier() Parse "foo:bar/baz" 1'] = {
  "node": {
    "type": "nbtdoc:minecraft_identifier",
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

exports['minecraftIdentifier() Parse "foo:bar:baz" 1'] = {
  "node": {
    "type": "nbtdoc:minecraft_identifier",
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

exports['minecraftIdentifier() Parse "foo:bar↓something else;" 1'] = {
  "node": {
    "type": "nbtdoc:minecraft_identifier",
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
