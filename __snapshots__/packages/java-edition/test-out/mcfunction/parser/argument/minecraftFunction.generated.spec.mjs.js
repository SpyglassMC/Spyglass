exports['mcfunction argument minecraft:function Parse "#foo" 1'] = {
  "node": {
    "type": "resource_location",
    "range": {
      "start": 0,
      "end": 4
    },
    "isTag": true,
    "path": [
      "foo"
    ],
    "symbol": {
      "category": "tag/function",
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

exports['mcfunction argument minecraft:function Parse "foo" 1'] = {
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

exports['mcfunction argument minecraft:function Parse "foo:bar" 1'] = {
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
      "category": "function",
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
