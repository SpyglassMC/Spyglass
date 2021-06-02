exports['mcfunction argument minecraft:component Parse """" 1'] = {
  "node": {
    "type": "mcfunction:argument/minecraft:component",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "",
    "childrenMaps": [
      {
        "outerRange": {
          "start": 1,
          "end": 1
        },
        "innerRange": {
          "start": 0,
          "end": 0
        },
        "pairs": []
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
    "childrenMaps": [
      {
        "outerRange": {
          "start": 1,
          "end": 12
        },
        "innerRange": {
          "start": 0,
          "end": 11
        },
        "pairs": []
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 2,
                  "end": 2
                },
                "innerRange": {
                  "start": 0,
                  "end": 0
                },
                "pairs": []
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
          "childrenMaps": [
            {
              "outerRange": {
                "start": 2,
                "end": 2
              },
              "innerRange": {
                "start": 0,
                "end": 0
              },
              "pairs": []
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 2,
                  "end": 6
                },
                "innerRange": {
                  "start": 0,
                  "end": 4
                },
                "pairs": []
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
            "childrenMaps": [
              {
                "outerRange": {
                  "start": 9,
                  "end": 20
                },
                "innerRange": {
                  "start": 0,
                  "end": 11
                },
                "pairs": []
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
          "childrenMaps": [
            {
              "outerRange": {
                "start": 2,
                "end": 6
              },
              "innerRange": {
                "start": 0,
                "end": 4
              },
              "pairs": []
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
          "childrenMaps": [
            {
              "outerRange": {
                "start": 9,
                "end": 20
              },
              "innerRange": {
                "start": 0,
                "end": 11
              },
              "pairs": []
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
