exports['mcdoc dispatcherType Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc dispatcherType Parse ":entity[]" 1'] = {
  "node": {
    "type": "mcdoc:type/dispatcher",
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 7
        },
        "namespace": "",
        "path": [
          "entity"
        ],
        "symbol": {
          "category": "mcdoc/dispatcher",
          "identifier": "minecraft:entity",
          "path": [
            "minecraft:entity"
          ],
          "reference": [
            {
              "uri": ""
            }
          ]
        }
      },
      {
        "type": "mcdoc:index_body",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 8,
              "end": 8
            },
            "value": ""
          }
        ],
        "range": {
          "start": 7,
          "end": 9
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 9
    }
  },
  "errors": [
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['mcdoc dispatcherType Parse "entity[cow]" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcdoc dispatcherType Parse "minecraft:entity[cow,[%parent.id],sheep]" 1'] = {
  "node": {
    "type": "mcdoc:type/dispatcher",
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 16
        },
        "namespace": "minecraft",
        "path": [
          "entity"
        ],
        "symbol": {
          "category": "mcdoc/dispatcher",
          "identifier": "minecraft:entity",
          "path": [
            "minecraft:entity"
          ],
          "reference": [
            {
              "uri": ""
            }
          ]
        }
      },
      {
        "type": "mcdoc:index_body",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 17,
              "end": 20
            },
            "value": "cow"
          },
          {
            "type": "mcdoc:dynamic_index",
            "children": [
              {
                "type": "mcdoc:literal",
                "range": {
                  "start": 22,
                  "end": 29
                },
                "value": "%parent"
              },
              {
                "type": "mcdoc:identifier",
                "range": {
                  "start": 30,
                  "end": 32
                },
                "value": "id"
              }
            ],
            "range": {
              "start": 21,
              "end": 33
            }
          },
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 34,
              "end": 39
            },
            "value": "sheep"
          }
        ],
        "range": {
          "start": 16,
          "end": 40
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 40
    }
  },
  "errors": []
}
