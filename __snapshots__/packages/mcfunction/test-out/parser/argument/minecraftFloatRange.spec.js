exports['mcfunction argument minecraft:float_range Parse "-100.76.." 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:float_range",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 7
        },
        "value": -100.76
      },
      {
        "type": "literal",
        "range": {
          "start": 7,
          "end": 9
        },
        "options": {
          "pool": [
            ".."
          ],
          "colorTokenType": "keyword"
        },
        "value": ".."
      }
    ],
    "name": "test",
    "value": [
      -100.76,
      null
    ],
    "hover": "<test: float_range>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:float_range Parse "-5.4" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:float_range",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": -5.4
      }
    ],
    "name": "test",
    "value": [
      -5.4,
      -5.4
    ],
    "hover": "<test: float_range>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:float_range Parse ".." 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcfunction argument minecraft:float_range Parse "..100" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:float_range",
    "range": {
      "start": 0,
      "end": 5
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 0,
          "end": 2
        },
        "options": {
          "pool": [
            ".."
          ],
          "colorTokenType": "keyword"
        },
        "value": ".."
      },
      {
        "type": "float",
        "range": {
          "start": 2,
          "end": 5
        },
        "value": 100
      }
    ],
    "name": "test",
    "value": [
      null,
      100
    ],
    "hover": "<test: float_range>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:float_range Parse "0" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:float_range",
    "range": {
      "start": 0,
      "end": 1
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 0
      }
    ],
    "name": "test",
    "value": [
      0,
      0
    ],
    "hover": "<test: float_range>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:float_range Parse "0..5.2" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:float_range",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 0
      },
      {
        "type": "literal",
        "range": {
          "start": 1,
          "end": 3
        },
        "options": {
          "pool": [
            ".."
          ],
          "colorTokenType": "keyword"
        },
        "value": ".."
      },
      {
        "type": "float",
        "range": {
          "start": 3,
          "end": 6
        },
        "value": 5.2
      }
    ],
    "name": "test",
    "value": [
      0,
      5.2
    ],
    "hover": "<test: float_range>"
  },
  "errors": []
}
