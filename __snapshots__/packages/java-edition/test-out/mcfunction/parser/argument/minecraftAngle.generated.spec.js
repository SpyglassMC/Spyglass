exports['mcfunction argument minecraft:angle Parse "0" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:angle",
    "notation": "",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 0,
    "name": "test",
    "hover": "<test: angle>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:angle Parse "^" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:angle",
    "notation": "^",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 0,
    "name": "test",
    "hover": "<test: angle>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Local coordinates disallowed",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:angle Parse "~" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:angle",
    "notation": "~",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 0,
    "name": "test",
    "hover": "<test: angle>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:angle Parse "~-0.5" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:angle",
    "notation": "~",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": -0.5,
    "name": "test",
    "hover": "<test: angle>"
  },
  "errors": []
}
