exports['mcfunction argument minecraft:function Parse "#foo" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:function",
    "range": {
      "start": 0,
      "end": 4
    },
    "options": {
      "category": "function",
      "allowTag": true
    },
    "isTag": true,
    "path": [
      "foo"
    ],
    "name": "test",
    "hover": "<test: function>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:function Parse "foo" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:function",
    "range": {
      "start": 0,
      "end": 3
    },
    "options": {
      "category": "function",
      "allowTag": true
    },
    "path": [
      "foo"
    ],
    "name": "test",
    "hover": "<test: function>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:function Parse "foo:bar" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:function",
    "range": {
      "start": 0,
      "end": 7
    },
    "options": {
      "category": "function",
      "allowTag": true
    },
    "namespace": "foo",
    "path": [
      "bar"
    ],
    "name": "test",
    "hover": "<test: function>"
  },
  "errors": []
}
