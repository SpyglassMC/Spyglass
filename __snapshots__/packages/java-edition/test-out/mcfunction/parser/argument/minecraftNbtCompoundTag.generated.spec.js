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
            "valueMap": [
              {
                "outer": {
                  "start": 1,
                  "end": 1
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
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
            "valueMap": [
              {
                "outer": {
                  "start": 5,
                  "end": 5
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
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
          "valueMap": [
            {
              "outer": {
                "start": 1,
                "end": 1
              },
              "inner": {
                "start": 0,
                "end": 0
              }
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
          "valueMap": [
            {
              "outer": {
                "start": 5,
                "end": 5
              },
              "inner": {
                "start": 0,
                "end": 0
              }
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
