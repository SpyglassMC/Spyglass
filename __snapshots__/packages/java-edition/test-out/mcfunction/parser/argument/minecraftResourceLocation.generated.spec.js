exports['mcfunction argument minecraft:resource_location Parse "012" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 3
    },
    "path": [
      "012"
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:resource_location Parse "012" with {"category":"bossbar"} 1'] = {
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

exports['mcfunction argument minecraft:resource_location Parse "foo" 1'] = {
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

exports['mcfunction argument minecraft:resource_location Parse "foo" with {"category":"bossbar"} 1'] = {
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

exports['mcfunction argument minecraft:resource_location Parse "foo:bar" 1'] = {
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

exports['mcfunction argument minecraft:resource_location Parse "foo:bar" with {"category":"bossbar"} 1'] = {
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
