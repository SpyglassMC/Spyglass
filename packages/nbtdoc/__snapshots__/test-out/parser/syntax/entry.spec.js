exports['entry() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "range": {
      "start": 0,
      "end": 0
    },
    "nodes": []
  },
  "errors": []
}

exports['entry() Parse "mod describes minecraft:block;" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "range": {
      "start": 0,
      "end": 30
    },
    "nodes": [
      {
        "type": "nbtdoc:describes_clause",
        "range": {
          "start": 0,
          "end": 30
        },
        "nodes": [
          {
            "type": "nbtdoc:ident_path",
            "fromGlobalRoot": false,
            "path": [
              {
                "type": "nbtdoc:identifier",
                "range": {
                  "start": 0,
                  "end": 3
                },
                "value": "mod"
              }
            ],
            "range": {
              "start": 0,
              "end": 3
            }
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 4,
              "end": 13
            },
            "value": "describes"
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
            "type": "nbtdoc:literal",
            "range": {
              "start": 29,
              "end": 30
            },
            "value": ";"
          }
        ],
        "path": {
          "type": "nbtdoc:ident_path",
          "fromGlobalRoot": false,
          "path": [
            {
              "type": "nbtdoc:identifier",
              "range": {
                "start": 0,
                "end": 3
              },
              "value": "mod"
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
        "objects": null
      }
    ]
  },
  "errors": []
}

exports['entry() Parse "mod describes;" 1'] = {
  "node": {
    "type": "nbtdoc:main",
    "range": {
      "start": 0,
      "end": 14
    },
    "nodes": [
      {
        "type": "nbtdoc:module_declaration",
        "range": {
          "start": 0,
          "end": 14
        },
        "nodes": [
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 0,
              "end": 3
            },
            "value": "mod"
          },
          {
            "type": "nbtdoc:identifier",
            "range": {
              "start": 4,
              "end": 13
            },
            "value": "describes"
          },
          {
            "type": "nbtdoc:literal",
            "range": {
              "start": 13,
              "end": 14
            },
            "value": ";"
          }
        ],
        "identifier": {
          "type": "nbtdoc:identifier",
          "range": {
            "start": 4,
            "end": 13
          },
          "value": "describes"
        }
      }
    ]
  },
  "errors": []
}
