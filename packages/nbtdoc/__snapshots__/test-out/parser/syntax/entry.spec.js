exports['entry() Test "" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "nodes": [],
    "range": {
      "start": 0,
      "end": 0
    }
  },
  "errors": []
}

exports['entry() Test "mod describes minecraft:block;" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "nodes": [
      {
        "type": "nbtdoc:describes_clause",
        "nodes": [
          {
            "type": "nbtdoc:identifier_path",
            "fromGlobalRoot": false,
            "path": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 0,
                  "end": 3
                },
                "text": "mod"
              }
            ],
            "range": {
              "start": 0,
              "end": 3
            }
          },
          {
            "type": "nbtdoc:keyword",
            "range": {
              "start": 4,
              "end": 13
            },
            "text": "describes"
          },
          {
            "type": "nbtdoc:minecraft_identifier",
            "range": {
              "start": 14,
              "end": 29
            },
            "namespace": "minecraft",
            "path": [
              "block"
            ]
          },
          {
            "type": "nbtdoc:punctuation",
            "text": ";",
            "range": {
              "start": 29,
              "end": 30
            }
          }
        ],
        "path": {
          "type": "nbtdoc:identifier_path",
          "fromGlobalRoot": false,
          "path": [
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 0,
                "end": 3
              },
              "text": "mod"
            }
          ],
          "range": {
            "start": 0,
            "end": 3
          }
        },
        "registry": {
          "type": "nbtdoc:minecraft_identifier",
          "range": {
            "start": 14,
            "end": 29
          },
          "namespace": "minecraft",
          "path": [
            "block"
          ]
        },
        "objects": null,
        "range": {
          "start": 0,
          "end": 30
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 30
    }
  },
  "errors": []
}

exports['entry() Test "mod describes;" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "nodes": [
      {
        "type": "nbtdoc:module_declaration",
        "nodes": [
          {
            "type": "nbtdoc:keyword",
            "range": {
              "start": 0,
              "end": 3
            },
            "text": "mod"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 13
            },
            "text": "describes"
          },
          {
            "type": "nbtdoc:punctuation",
            "text": ";",
            "range": {
              "start": 13,
              "end": 14
            }
          }
        ],
        "identifier": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 13
          },
          "text": "describes"
        },
        "range": {
          "start": 0,
          "end": 14
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 14
    }
  },
  "errors": []
}
