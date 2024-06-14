exports['mcfunction argument minecraft:component Parse """" 1'] = {
  "node": {
    "type": "mcfunction:json",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "type": "json:string",
        "range": {
          "start": 0,
          "end": 2
        },
        "value": "",
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
      }
    ],
    "typeRef": "::java::server::util::text::Text"
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse ""hello world"" 1'] = {
  "node": {
    "type": "mcfunction:json",
    "range": {
      "start": 0,
      "end": 13
    },
    "children": [
      {
        "type": "json:string",
        "range": {
          "start": 0,
          "end": 13
        },
        "value": "hello world",
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
      }
    ],
    "typeRef": "::java::server::util::text::Text"
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse "[""]" 1'] = {
  "node": {
    "type": "mcfunction:json",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "json:array",
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
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 2,
                      "end": 2
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 2,
                    "end": 2
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    "typeRef": "::java::server::util::text::Text"
  },
  "errors": []
}

exports['mcfunction argument minecraft:component Parse "{"text":"hello world"}" 1'] = {
  "node": {
    "type": "mcfunction:json",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "type": "json:object",
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
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 2,
                      "end": 2
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
                    "inner": {
                      "start": 0,
                      "end": 0
                    },
                    "outer": {
                      "start": 9,
                      "end": 9
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 2,
                    "end": 2
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
                  "inner": {
                    "start": 0,
                    "end": 0
                  },
                  "outer": {
                    "start": 9,
                    "end": 9
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    "typeRef": "::java::server::util::text::Text"
  },
  "errors": []
}
