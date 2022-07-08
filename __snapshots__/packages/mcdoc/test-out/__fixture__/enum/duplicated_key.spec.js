exports['mcdoc __fixture__ enum/duplicated key 1'] = {
  "global": {
    "mcdoc": {
      "::test": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 0,
              "end": 0
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 0,
                "character": 0
              }
            },
            "contributor": "uri_binder"
          }
        ]
      },
      "::test::DuplicatedKey": {
        "data": {
          "typeDef": {
            "kind": "enum",
            "enumKind": "byte",
            "values": [
              {
                "identifier": "Naughty",
                "value": 42
              },
              {
                "identifier": "Naughty",
                "value": 91
              }
            ]
          }
        },
        "subcategory": "enum",
        "definition": [
          {
            "uri": "file:///test.mcdoc",
            "range": {
              "start": 12,
              "end": 25
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 12
              },
              "end": {
                "line": 0,
                "character": 25
              }
            },
            "fullRange": {
              "start": 0,
              "end": 61
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 0
              },
              "end": {
                "line": 3,
                "character": 1
              }
            },
            "contributor": "binder"
          }
        ]
      }
    }
  },
  "nodes": {
    "file:///test.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 61
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:enum",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 0,
                    "end": 4
                  },
                  "value": "enum",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 6,
                    "end": 10
                  },
                  "value": "byte",
                  "colorTokenType": "type"
                },
                {
                  "type": "mcdoc:identifier",
                  "range": {
                    "start": 12,
                    "end": 25
                  },
                  "value": "DuplicatedKey",
                  "symbol": {
                    "category": "mcdoc",
                    "path": [
                      "::test::DuplicatedKey"
                    ]
                  }
                },
                {
                  "type": "mcdoc:enum/block",
                  "children": [
                    {
                      "type": "mcdoc:enum/field",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 29,
                            "end": 36
                          },
                          "value": "Naughty"
                        },
                        {
                          "type": "mcdoc:typed_number",
                          "children": [
                            {
                              "type": "float",
                              "range": {
                                "start": 39,
                                "end": 41
                              },
                              "value": 42
                            },
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 41,
                                "end": 42
                              },
                              "value": "b",
                              "colorTokenType": "keyword"
                            }
                          ],
                          "range": {
                            "start": 39,
                            "end": 42
                          }
                        }
                      ],
                      "range": {
                        "start": 29,
                        "end": 42
                      }
                    },
                    {
                      "type": "mcdoc:enum/field",
                      "children": [
                        {
                          "type": "mcdoc:identifier",
                          "range": {
                            "start": 45,
                            "end": 52
                          },
                          "value": "Naughty"
                        },
                        {
                          "type": "mcdoc:typed_number",
                          "children": [
                            {
                              "type": "float",
                              "range": {
                                "start": 55,
                                "end": 57
                              },
                              "value": 91
                            },
                            {
                              "type": "mcdoc:literal",
                              "range": {
                                "start": 57,
                                "end": 58
                              },
                              "value": "b",
                              "colorTokenType": "keyword"
                            }
                          ],
                          "range": {
                            "start": 55,
                            "end": 58
                          }
                        }
                      ],
                      "range": {
                        "start": 45,
                        "end": 58
                      }
                    }
                  ],
                  "range": {
                    "start": 26,
                    "end": 61
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 61
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 61
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    }
  }
}
