exports['mcfunction argument minecraft:component Parse """" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:component",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "",
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
    ],
    "name": "test",
    "hover": "<test: component>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse ""hello world"" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:component",
    "range": {
      "start": 0,
      "end": 13
    },
    "value": "hello world",
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
    ],
    "name": "test",
    "hover": "<test: component>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse "[""]" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:component",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "item",
        "range": {
          "start": 1,
          "end": 3
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 3
            },
            "value": "",
            "valueMap": [
              {
                "outer": {
                  "start": 2,
                  "end": 2
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          }
        ],
        "value": {
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 3
          },
          "value": "",
          "valueMap": [
            {
              "outer": {
                "start": 2,
                "end": 2
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
    "hover": "<test: component>"
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse "{"text":"hello world"}" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:component",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "type": "pair",
        "range": {
          "start": 1,
          "end": 21
        },
        "children": [
          {
            "type": "json:string",
            "range": {
              "start": 1,
              "end": 7
            },
            "value": "text",
            "valueMap": [
              {
                "outer": {
                  "start": 2,
                  "end": 2
                },
                "inner": {
                  "start": 0,
                  "end": 0
                }
              }
            ]
          },
          {
            "type": "json:string",
            "range": {
              "start": 8,
              "end": 21
            },
            "value": "hello world",
            "valueMap": [
              {
                "outer": {
                  "start": 9,
                  "end": 9
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
          "type": "json:string",
          "range": {
            "start": 1,
            "end": 7
          },
          "value": "text",
          "valueMap": [
            {
              "outer": {
                "start": 2,
                "end": 2
              },
              "inner": {
                "start": 0,
                "end": 0
              }
            }
          ]
        },
        "sep": {
          "start": 7,
          "end": 8
        },
        "value": {
          "type": "json:string",
          "range": {
            "start": 8,
            "end": 21
          },
          "value": "hello world",
          "valueMap": [
            {
              "outer": {
                "start": 9,
                "end": 9
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
    "hover": "<test: component>"
  },
  "errors": []
}
