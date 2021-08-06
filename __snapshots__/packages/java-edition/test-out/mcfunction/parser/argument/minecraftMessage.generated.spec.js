exports['mcfunction argument minecraft:message Parse "@e" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:message",
    "range": {
      "start": 0,
      "end": 0
    },
    "name": "test",
    "children": [
      {
        "type": "mcfunction:entity_selector",
        "range": {
          "start": 0,
          "end": 2
        },
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "value": "@e"
          }
        ],
        "variable": "e",
        "currentEntity": false,
        "playersOnly": false,
        "predicates": [
          "Entity::isAlive"
        ],
        "single": false,
        "typeLimited": false,
        "hover": "**Performance**: 🤢  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `false`\n- `typeLimited`: `false`\n\n------\n**Predicates**: \n- `Entity::isAlive`"
      }
    ],
    "hover": "<test: message>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:message Parse "Hello @p :)" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:message",
    "range": {
      "start": 0,
      "end": 0
    },
    "name": "test",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 6
        },
        "value": "Hello ",
        "valueMap": [
          {
            "outer": {
              "start": 0,
              "end": 0
            },
            "inner": {
              "start": 0,
              "end": 0
            }
          }
        ]
      },
      {
        "type": "mcfunction:entity_selector",
        "range": {
          "start": 6,
          "end": 8
        },
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 6,
              "end": 8
            },
            "value": "@p"
          }
        ],
        "variable": "p",
        "currentEntity": false,
        "playersOnly": true,
        "single": true,
        "typeLimited": true,
        "hover": "**Performance**: Good  \n- `chunkLimited`: `false`\n- `dimensionLimited`: `false`\n- `playersOnly`: `true`\n- `typeLimited`: `false`"
      },
      {
        "type": "string",
        "range": {
          "start": 8,
          "end": 11
        },
        "value": " :)",
        "valueMap": [
          {
            "outer": {
              "start": 8,
              "end": 8
            },
            "inner": {
              "start": 0,
              "end": 0
            }
          }
        ]
      }
    ],
    "hover": "<test: message>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:message Parse "Hello world!" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:message",
    "range": {
      "start": 0,
      "end": 0
    },
    "name": "test",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 12
        },
        "value": "Hello world!",
        "valueMap": [
          {
            "outer": {
              "start": 0,
              "end": 0
            },
            "inner": {
              "start": 0,
              "end": 0
            }
          }
        ]
      }
    ],
    "hover": "<test: message>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:message Parse "foo" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:message",
    "range": {
      "start": 0,
      "end": 0
    },
    "name": "test",
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo",
        "valueMap": [
          {
            "outer": {
              "start": 0,
              "end": 0
            },
            "inner": {
              "start": 0,
              "end": 0
            }
          }
        ]
      }
    ],
    "hover": "<test: message>"
  },
  "errors": []
}
