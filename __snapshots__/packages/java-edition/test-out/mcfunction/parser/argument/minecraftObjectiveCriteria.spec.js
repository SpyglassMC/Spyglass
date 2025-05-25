exports['mcfunction argument minecraft:objective_criteria Parse "dummy" 1'] = {
  "node": {
    "type": "mcfunction:objective_criteria",
    "range": {
      "start": 0,
      "end": 5
    },
    "simpleValue": "dummy"
  },
  "errors": []
}

exports['mcfunction argument minecraft:objective_criteria Parse "minecraft.used:minecraft.spyglass" 1'] = {
  "node": {
    "type": "mcfunction:objective_criteria",
    "range": {
      "start": 0,
      "end": 33
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 14
        },
        "namespace": "minecraft",
        "path": [
          "used"
        ]
      },
      {
        "type": "resource_location",
        "range": {
          "start": 15,
          "end": 33
        },
        "namespace": "minecraft",
        "path": [
          "spyglass"
        ]
      }
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:objective_criteria Parse "teamkill.aqua" 1'] = {
  "node": {
    "type": "mcfunction:objective_criteria",
    "range": {
      "start": 0,
      "end": 13
    },
    "simpleValue": "teamkill.aqua"
  },
  "errors": []
}

exports['mcfunction argument minecraft:objective_criteria Parse "used:spyglass" 1'] = {
  "node": {
    "type": "mcfunction:objective_criteria",
    "range": {
      "start": 0,
      "end": 13
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 4
        },
        "path": [
          "used"
        ]
      },
      {
        "type": "resource_location",
        "range": {
          "start": 5,
          "end": 13
        },
        "path": [
          "spyglass"
        ]
      }
    ]
  },
  "errors": []
}
