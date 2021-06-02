exports['mcfunction argument minecraft:nbt_compound_tag Parse "{foo:bar}" 1'] = {
  "node": {
    "type": "nbt:compound",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 8
        },
        "children": [
          {
            "type": "string",
            "range": {
              "start": 1,
              "end": 4
            },
            "value": "foo",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 1,
                  "end": 4
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          },
          {
            "type": "string",
            "range": {
              "start": 5,
              "end": 8
            },
            "value": "bar",
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 5,
                  "end": 8
                },
                "innerRange": {
                  "start": 0,
                  "end": 3
                },
                "pairs": []
              }
            ]
          }
        ],
        "key": {
          "type": "string",
          "range": {
            "start": 1,
            "end": 4
          },
          "value": "foo",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 1,
                "end": 4
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        },
        "sep": {
          "start": 4,
          "end": 5
        },
        "value": {
          "type": "string",
          "range": {
            "start": 5,
            "end": 8
          },
          "value": "bar",
          "childrenMaps": [
            {
              "outerRange": {
                "start": 5,
                "end": 8
              },
              "innerRange": {
                "start": 0,
                "end": 3
              },
              "pairs": []
            }
          ]
        }
      }
    ],
    "name": "test",
    "hover": "<test: nbt_compound_tag>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:nbt_compound_tag Parse "{}" 1'] = {
  "node": {
    "type": "nbt:compound",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [],
    "name": "test",
    "hover": "<test: nbt_compound_tag>"
  },
  "errors": []
}
