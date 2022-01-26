exports['mcfunction argument minecraft:uuid Parse "1-1-1-1-1" 1'] = {
  "node": {
    "type": "mcfunction:uuid",
    "range": {
      "start": 0,
      "end": 9
    },
    "bits": [
      "4295032833",
      "281474976710657"
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:uuid Parse "42" 1'] = {
  "node": {
    "type": "mcfunction:uuid",
    "range": {
      "start": 0,
      "end": 2
    },
    "bits": [
      "0",
      "0"
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Invalid UUID format",
      "severity": 3
    }
  ]
}

exports['mcfunction argument minecraft:uuid Parse "dd12be42-52a9-4a91-a8a1-11c01849e498" 1'] = {
  "node": {
    "type": "mcfunction:uuid",
    "range": {
      "start": 0,
      "end": 36
    },
    "bits": [
      "-2516740049682740591",
      "-6295731287348353896"
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:uuid Parse "fffffffffffffff-1-1-1-1" 1'] = {
  "node": {
    "type": "mcfunction:uuid",
    "range": {
      "start": 0,
      "end": 23
    },
    "bits": [
      "-4294901759",
      "281474976710657"
    ]
  },
  "errors": []
}

exports['mcfunction argument minecraft:uuid Parse "ffffffffffffffff-1-1-1-1" 1'] = {
  "node": {
    "type": "mcfunction:uuid",
    "range": {
      "start": 0,
      "end": 24
    },
    "bits": [
      "0",
      "0"
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 24
      },
      "message": "Invalid UUID format",
      "severity": 3
    }
  ]
}
