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
          "line": 2,
          "character": 2
        }
      },
      "expect": {
        "start": {
          "line": 2,
          "character": 2
        },
        "merges": []
      }
    },
    {
      "given": {
        "merges": [
          {
            "start": {
              "line": 1,
              "character": 3
            },
            "end": {
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
            "start": {
              "line": 1,
              "character": 3
            },
            "end": {
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
            "start": {
              "line": 1,
              "character": 3
            },
            "end": {
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
            "start": {
              "line": 1,
              "character": 3
            },
            "end": {
              "line": 1,
              "character": 4
            }
          }
        ]
      }
    }
  ]
}
