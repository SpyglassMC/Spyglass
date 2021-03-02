exports['SymbolUtil enter() Should enter multiple symbols 1'] = [
  {
    "nbtdoc": {
      "test": {
        "category": "nbtdoc",
        "identifier": "test",
        "visibility": 1,
        "definition": [
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
        "definition": [
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

exports['SymbolUtil open() Should remove all URIs of the file before opening 1'] = {
  "nbtdoc": {
    "test": {
      "category": "nbtdoc",
      "identifier": "test",
      "visibility": 2,
      "definition": [
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
