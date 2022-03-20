exports['mcfunction argument minecraft:resource Parse "012" with {"registry":"bossbar"} 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 3
    },
    "path": [
      "012"
    ],
    "symbol": {
      "category": "bossbar",
      "identifier": "minecraft:012",
      "path": [
        "minecraft:012"
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

exports['mcfunction argument minecraft:resource Parse "foo" with {"registry":"bossbar"} 1'] = {
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
      "category": "bossbar",
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

exports['mcfunction argument minecraft:resource Parse "foo:bar" with {"registry":"bossbar"} 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 7
    },
    "namespace": "foo",
    "path": [
      "bar"
    ],
    "symbol": {
      "category": "bossbar",
      "identifier": "foo:bar",
      "path": [
        "foo:bar"
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
