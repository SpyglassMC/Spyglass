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
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 0,
              "end": 2
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@e"
          }
        ],
        "range": {
          "start": 0,
          "end": 2
        },
        "type": "mcfunction:entity_selector",
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
        "options": {
          "unquotable": {}
        },
        "value": "Hello ",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 6
          },
          "innerRange": {
            "start": 0,
            "end": 6
          },
          "pairs": []
        }
      },
      {
        "isSequenceUtil": true,
        "children": [
          {
            "type": "literal",
            "range": {
              "start": 6,
              "end": 8
            },
            "options": {
              "pool": [
                "@p",
                "@a",
                "@r",
                "@s",
                "@e"
              ],
              "colorTokenType": "keyword"
            },
            "value": "@p"
          }
        ],
        "range": {
          "start": 6,
          "end": 8
        },
        "type": "mcfunction:entity_selector",
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
        "options": {
          "unquotable": {}
        },
        "value": " :)",
        "valueMap": {
          "outerRange": {
            "start": 8,
            "end": 11
          },
          "innerRange": {
            "start": 0,
            "end": 3
          },
          "pairs": []
        }
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
        "options": {
          "unquotable": {}
        },
        "value": "Hello world!",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 12
          },
          "innerRange": {
            "start": 0,
            "end": 12
          },
          "pairs": []
        }
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
        "options": {
          "unquotable": {}
        },
        "value": "foo",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 3
          },
          "innerRange": {
            "start": 0,
            "end": 3
          },
          "pairs": []
        }
      }
    ],
    "hover": "<test: message>"
  },
  "errors": []
}
