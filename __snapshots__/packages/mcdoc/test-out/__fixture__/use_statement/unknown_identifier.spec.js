exports['mcdoc __fixture__ use statement/unknown identifier 1'] = {
  "global": {
    "mcdoc": {
      "::module": {
        "subcategory": "module",
        "definition": [
          {
            "uri": "file:///module.mcdoc",
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
        },
        "reference": [
          {
            "uri": "file:///client.mcdoc",
            "range": {
              "start": 11,
              "end": 17
            },
            "posRange": {
              "start": {
                "line": 0,
                "character": 11
              },
              "end": {
                "line": 0,
                "character": 17
              }
            },
            "fullRange": {
              "start": 4,
              "end": 22
            },
            "fullPosRange": {
              "start": {
                "line": 0,
                "character": 4
              },
              "end": {
                "line": 0,
                "character": 22
              }
            },
            "contributor": "binder",
            "skipRenaming": false
          }
        ]
      },
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
    "file:///module.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 0
      },
      "children": [
        {
          "type": "mcdoc:module",
          "children": [],
          "range": {
            "start": 0,
            "end": 0
          }
        }
      ],
      "locals": {},
      "parserErrors": [],
      "binderErrors": []
    },
    "file:///client.mcdoc": {
      "type": "file",
      "range": {
        "start": 0,
        "end": 22
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
                      "type": "mcdoc:literal",
                      "range": {
                        "start": 4,
                        "end": 9
                      },
                      "value": "super"
                    },
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 11,
                        "end": 17
                      },
                      "value": "module",
                      "symbol": {
                        "category": "mcdoc",
                        "path": [
                          "::module"
                        ]
                      }
                    },
                    {
                      "type": "mcdoc:identifier",
                      "range": {
                        "start": 19,
                        "end": 22
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
                    "start": 4,
                    "end": 22
                  }
                }
              ],
              "range": {
                "start": 0,
                "end": 22
              }
            }
          ],
          "range": {
            "start": 0,
            "end": 22
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
            "data": {
              "target": [
                "module",
                "Foo"
              ]
            },
            "definition": [
              {
                "uri": "file:///client.mcdoc",
                "range": {
                  "start": 19,
                  "end": 22
                },
                "posRange": {
                  "start": {
                    "line": 0,
                    "character": 19
                  },
                  "end": {
                    "line": 0,
                    "character": 22
                  }
                },
                "fullRange": {
                  "start": 0,
                  "end": 22
                },
                "fullPosRange": {
                  "start": {
                    "line": 0,
                    "character": 0
                  },
                  "end": {
                    "line": 0,
                    "character": 22
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
            "start": 4,
            "end": 22
          },
          "message": "Identifier “Foo” does not exist in module “::module”",
          "severity": 2
        }
      ]
    }
  }
}
