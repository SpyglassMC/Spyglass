exports['IndexMapping create() Should create correctly create 1'] = {
  "name": "create",
  "behavior": [
    {
      "expect": {
        "start": {
          "line": 0,
          "character": 0
        },
        "merges": []
      }
    },
    {
      "given": {},
      "expect": {
        "start": {
          "line": 0,
          "character": 0
        },
        "merges": []
      }
    },
    {
      "given": {
        "start": {
          "line": 1,
          "character": 2
        }
      },
      "expect": {
        "start": {
          "line": 1,
          "character": 2
        },
        "merges": []
      }
    },
    {
      "given": {
        "merges": [
          {
            "from": {
              "line": 1,
              "character": 3
            },
            "to": {
              "line": 1,
              "character": 4
            }
          }
        ]
      },
      "expect": {
        "start": {
          "line": 0,
          "character": 0
        },
        "merges": [
          {
            "from": {
              "line": 1,
              "character": 3
            },
            "to": {
              "line": 1,
              "character": 4
            }
          }
        ]
      }
    },
    {
      "given": {
        "start": {
          "line": 1,
          "character": 2
        },
        "merges": [
          {
            "from": {
              "line": 1,
              "character": 3
            },
            "to": {
              "line": 1,
              "character": 4
            }
          }
        ]
      },
      "expect": {
        "start": {
          "line": 1,
          "character": 2
        },
        "merges": [
          {
            "from": {
              "line": 1,
              "character": 3
            },
            "to": {
              "line": 1,
              "character": 4
            }
          }
        ]
      }
    }
  ]
}
