exports['SymbolTableUtil enter() Should enter multiple symbols 1'] = [
  {
    "nbtdoc": {
      "test": {
        "category": "nbtdoc",
        "identifier": "test",
        "visibility": 1,
        "def": [
          {
            "uri": "file:///test.nbtdoc",
            "range": {
              "start": 5,
              "end": 5
            }
          }
        ]
      }
    }
  },
  {},
  {
    "nbtdoc": {
      "test": {
        "category": "nbtdoc",
        "identifier": "test",
        "visibility": 0,
        "def": [
          {
            "uri": "file:///test.nbtdoc",
            "range": {
              "start": 4,
              "end": 4
            }
          }
        ]
      }
    }
  }
]

exports['SymbolTableUtil enter() Should enter multiple symbols 2'] = {
  "nbtdoc": {
    "test": {
      "category": "nbtdoc",
      "identifier": "test",
      "visibility": 2,
      "def": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 1,
            "end": 1
          }
        },
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 6,
            "end": 6
          }
        }
      ],
      "ref": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 2,
            "end": 2
          }
        },
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 3,
            "end": 3
          }
        }
      ]
    },
    "test2": {
      "category": "nbtdoc",
      "identifier": "test2",
      "visibility": 2,
      "def": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 7,
            "end": 7
          }
        }
      ]
    }
  }
}

exports['SymbolTableUtil open() Should remove all URIs of the file before opening 1'] = {
  "nbtdoc": {
    "test": {
      "category": "nbtdoc",
      "identifier": "test",
      "visibility": 2,
      "def": [
        {
          "uri": "file:///another_test.nbtdoc",
          "range": {
            "start": 1,
            "end": 1
          }
        }
      ]
    }
  }
}
