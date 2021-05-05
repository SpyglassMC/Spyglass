exports['mcfunction argument minecraft:game_profile Parse "0123" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:game_profile",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 4
        },
        "options": {
          "escapable": {},
          "quotes": [
            "\"",
            "'"
          ],
          "unquotable": {}
        },
        "value": "0123",
        "valueMap": {
          "outerRange": {
            "start": 0,
            "end": 4
          },
          "innerRange": {
            "start": 0,
            "end": 4
          },
          "pairs": []
        }
      }
    ],
    "name": "test",
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 4
      },
      "options": {
        "escapable": {},
        "quotes": [
          "\"",
          "'"
        ],
        "unquotable": {}
      },
      "value": "0123",
      "valueMap": {
        "outerRange": {
          "start": 0,
          "end": 4
        },
        "innerRange": {
          "start": 0,
          "end": 4
        },
        "pairs": []
      }
    },
    "hover": "<test: game_profile>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:game_profile Parse "@e" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:game_profile",
    "range": {
      "start": 0,
      "end": 2
    },
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
    "name": "test",
    "selector": {
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
    },
    "hover": "<test: game_profile>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "The selector contains non-player entities",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:game_profile Parse "Player" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:game_profile",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "string",
        "range": {
          "start": 0,
          "end": 6
        },
        "options": {
          "escapable": {},
          "quotes": [
            "\"",
            "'"
          ],
          "unquotable": {}
        },
        "value": "Player",
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
      }
    ],
    "name": "test",
    "playerName": {
      "type": "string",
      "range": {
        "start": 0,
        "end": 6
      },
      "options": {
        "escapable": {},
        "quotes": [
          "\"",
          "'"
        ],
        "unquotable": {}
      },
      "value": "Player",
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
    "hover": "<test: game_profile>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:game_profile Parse "dd12be42-52a9-4a91-a8a1-11c01849e498" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:game_profile",
    "range": {
      "start": 0,
      "end": 36
    },
    "children": [
      {
        "type": "mcfunction:argument/minecraft:uuid",
        "range": {
          "start": 0,
          "end": 36
        },
        "name": "",
        "bits": [
          "-2516740049682740591",
          "-6295731287348353896"
        ]
      }
    ],
    "name": "test",
    "uuid": {
      "type": "mcfunction:argument/minecraft:uuid",
      "range": {
        "start": 0,
        "end": 36
      },
      "name": "",
      "bits": [
        "-2516740049682740591",
        "-6295731287348353896"
      ]
    },
    "hover": "<test: game_profile>"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 36
      },
      "message": "The selector contains non-player entities",
      "severity": 3
    }
  ]
}
