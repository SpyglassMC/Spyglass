exports['mcfunction parser macro() Parse "$say $() bar" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 12
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 5
        },
        "value": "say "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 5,
          "end": 8
        },
        "value": ""
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 8,
          "end": 12
        },
        "value": " bar"
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 5,
        "end": 8
      },
      "message": "Expected a macro key",
      "severity": 3
    }
  ]
}

exports['mcfunction parser macro() Parse "$say $(foo bar" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 15
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 5
        },
        "value": "say "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 5,
          "end": 15
        },
        "value": "foo bar"
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 7,
        "end": 14
      },
      "message": "Expected “)”",
      "severity": 3
    },
    {
      "range": {
        "start": 7,
        "end": 14
      },
      "message": "Illegal key character: “ ”",
      "severity": 3
    }
  ]
}

exports['mcfunction parser macro() Parse "$say $(invalid.key) bar" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 23
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 5
        },
        "value": "say "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 5,
          "end": 19
        },
        "value": "invalid.key"
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 19,
          "end": 23
        },
        "value": " bar"
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 7,
        "end": 18
      },
      "message": "Illegal key character: “.”",
      "severity": 3
    }
  ]
}

exports['mcfunction parser macro() Parse "$say $(message)" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 15
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 5
        },
        "value": "say "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 5,
          "end": 15
        },
        "value": "message"
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser macro() Parse "$say no macro argument specified" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 32
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 32
        },
        "value": "say no macro argument specified"
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 1,
        "end": 32
      },
      "message": "Expected at least one macro argument",
      "severity": 3
    }
  ]
}

exports['mcfunction parser macro() Parse "$scoreboard players set $mode settings $(value)" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 47
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 39
        },
        "value": "scoreboard players set $mode settings "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 39,
          "end": 47
        },
        "value": "value"
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser macro() Parse "$summon cow $(x).1 $(y)30.0 $(z).0" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 34
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 12
        },
        "value": "summon cow "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 12,
          "end": 16
        },
        "value": "x"
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 16,
          "end": 19
        },
        "value": ".1 "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 19,
          "end": 23
        },
        "value": "y"
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 23,
          "end": 28
        },
        "value": "30.0 "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 28,
          "end": 32
        },
        "value": "z"
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 32,
          "end": 34
        },
        "value": ".0"
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser macro() Parse "$tag @s add $(tag)_40" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 21
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 12
        },
        "value": "tag @s add "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 12,
          "end": 18
        },
        "value": "tag"
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 18,
          "end": 21
        },
        "value": "_40"
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser macro() Parse "$tellraw $(player) $(text)" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 26
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 9
        },
        "value": "tellraw "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 9,
          "end": 18
        },
        "value": "player"
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 18,
          "end": 19
        },
        "value": " "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 19,
          "end": 26
        },
        "value": "text"
      }
    ]
  },
  "errors": []
}

exports['mcfunction parser macro() Parse "$tellraw $(players) ["$ Hello everyone! $"]" 1'] = {
  "node": {
    "type": "mcfunction:macro",
    "range": {
      "start": 0,
      "end": 43
    },
    "children": [
      {
        "type": "mcfunction:macro/prefix",
        "range": {
          "start": 0,
          "end": 1
        }
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 1,
          "end": 9
        },
        "value": "tellraw "
      },
      {
        "type": "mcfunction:macro/argument",
        "range": {
          "start": 9,
          "end": 19
        },
        "value": "players"
      },
      {
        "type": "mcfunction:macro/other",
        "range": {
          "start": 19,
          "end": 43
        },
        "value": " [\"$ Hello everyone! $\"]"
      }
    ]
  },
  "errors": []
}
