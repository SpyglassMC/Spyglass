exports['mcfunction argument minecraft:time Parse "0" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:time",
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
    "value": 0,
    "hover": "<test: time>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:time Parse "0d" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:time",
    "range": {
      "start": 0,
      "end": 2
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
          "end": 2
        },
        "options": {
          "pool": [
            "t",
            "s",
            "d",
            ""
          ]
        },
        "value": "d"
      }
    ],
    "name": "test",
    "value": 0,
    "unit": "d",
    "hover": "<test: time>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:time Parse "0foo" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:time",
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
    "value": 0,
    "hover": "<test: time>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:time Parse "0s" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:time",
    "range": {
      "start": 0,
      "end": 2
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
          "end": 2
        },
        "options": {
          "pool": [
            "t",
            "s",
            "d",
            ""
          ]
        },
        "value": "s"
      }
    ],
    "name": "test",
    "value": 0,
    "unit": "s",
    "hover": "<test: time>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:time Parse "0t" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:time",
    "range": {
      "start": 0,
      "end": 2
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
          "end": 2
        },
        "options": {
          "pool": [
            "t",
            "s",
            "d",
            ""
          ]
        },
        "value": "t"
      }
    ],
    "name": "test",
    "value": 0,
    "unit": "t",
    "hover": "<test: time>"
  },
  "errors": []
}
