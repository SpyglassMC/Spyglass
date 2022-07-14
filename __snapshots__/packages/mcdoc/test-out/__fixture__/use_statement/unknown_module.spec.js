exports['mcdoc __fixture__ use statement/unknown module 1'] = {
  "global": {
    "mcdoc": {
      "::client": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///client.mcdoc",
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
        ],
        "data": {
          "nextAnonymousIndex": 0
        }
      }
    }
  },
  "nodes": {
    "file:///client.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 17
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [
            {
              "type": "mcdoc:use_statement",
              "children": [
                {
                  "type": "mcdoc:literal",
                  "range": {
                    "start": 0,
                    "end": 3
                  },
                  "value": "use",
                  "colorTokenType": "keyword"
                },
                {
                  "type": "mcdoc:path",
                  "children": [
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 6,
                        "end": 12
                      },
                      "value": "module"
                    },
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 14,
                        "end": 17
                      },
                      "value": "Foo",
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::client::Foo"
                        ]
                      }
                    }
                  ],
                  "range": {
                    "start": 6,
                    "end": 17
                  },
                  "isAbsolute": true
                }
              ],
              "range": {
                "start": 0,
                "end": 17
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 17
          }
        }
      ],
      "locals": {
        "mcdoc": {
          "::client::Foo": {
            "category": "mcdoc",
            "identifier": "::client::Foo",
            "path": [
              "::client::Foo"
            ],
            "subcategory": "use_statement_binding",
            "visibility": 1,
            "definition": [
              {
                "uri": "file:///client.mcdoc",
                "range": {
                  "start": 14,
                  "end": 17
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 14
                  },
                  "end": {
                    "line": 0,
                    "character": 17
                  }
                },
                "fullRange": {
                  "start": 0,
                  "end": 17
                },
                "fullPosRange": {
                  "start": {
                    "line": 0,
                    "character": 0
                  },
                  "end": {
                    "line": 0,
                    "character": 17
                  }
                },
                "contributor": "binder"
              }
            ]
          }
        }
      },
      "parserErrors": [],
      "binderErrors": [
        {
          "range": {
            "start": 6,
            "end": 17
          },
          "message": "Module “::module” does not exist",
          "severity": 2
        }
      ]
    }
  }
}
