exports['mcfunction argument minecraft:nbt_compound_tag Parse "{foo:bar}" 1'] = {
  "node": {
    "type": "mcfunction:nbt",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
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
                "type": "nbt:string",
                "range": {
                  "start": 1,
                  "end": 4
                },
                "value": "foo",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 1,
                      "end": 1
                    }
                  }
                ]
              },
              {
                "type": "nbt:string",
                "range": {
                  "start": 5,
                  "end": 8
                },
                "value": "bar",
                "valueMap": [
                  {
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 5,
                      "end": 5
                    }
                  }
                ]
              }
            ],
            "key": {
              "type": "nbt:string",
              "range": {
                "start": 1,
                "end": 4
              },
              "value": "foo",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 1,
                    "end": 1
                  }
                }
              ]
            },
            "sep": {
              "start": 4,
              "end": 5
            },
            "value": {
              "type": "nbt:string",
              "range": {
                "start": 5,
                "end": 8
              },
              "value": "bar",
              "valueMap": [
                {
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 5,
                    "end": 5
                  }
                }
              ]
            }
          }
        ],
        "innerRange": {
          "start": 1,
          "end": 8
        }
      }
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:nbt_compound_tag Parse "{}" 1'] = {
  "node": {
    "type": "mcfunction:nbt",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "type": "nbt:compound",
        "range": {
          "start": 0,
          "end": 2
        },
        "children": [],
        "innerRange": {
          "start": 1,
          "end": 1
        }
      }
    ]
  },
  "errors": []
}
