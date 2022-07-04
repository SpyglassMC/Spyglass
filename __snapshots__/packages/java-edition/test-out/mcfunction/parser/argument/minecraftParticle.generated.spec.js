exports['mcfunction argument minecraft:particle Parse "block stone" 1'] = {
  "node": {
    "type": "mcfunction:particle",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 5
        },
        "path": [
          "block"
        ]
      },
      {
        "type": "mcfunction:block",
        "range": {
          "start": 6,
          "end": 11
        },
        "children": [
          {
            "type": "resource_location",
            "range": {
              "start": 6,
              "end": 11
            },
            "path": [
              "stone"
            ]
          }
        ],
        "id": {
          "type": "resource_location",
          "range": {
            "start": 6,
            "end": 11
          },
          "path": [
            "stone"
          ]
        }
      }
    ],
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "path": [
        "block"
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:particle Parse "cloud" 1'] = {
  "node": {
    "type": "mcfunction:particle",
    "range": {
      "start": 0,
      "end": 5
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 5
        },
        "path": [
          "cloud"
        ]
      }
    ],
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 5
      },
      "path": [
        "cloud"
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:particle Parse "dust 0.2 0.4 0.6 0.8" 1'] = {
  "node": {
    "type": "mcfunction:particle",
    "range": {
      "start": 0,
      "end": 20
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 4
        },
        "path": [
          "dust"
        ]
      },
      {
        "type": "mcfunction:vector",
        "range": {
          "start": 5,
          "end": 16
        },
        "children": [
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 5,
              "end": 8
            },
            "value": 0.2
          },
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 9,
              "end": 12
            },
            "value": 0.4
          },
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 13,
              "end": 16
            },
            "value": 0.6
          }
        ],
        "system": 0,
        "color": {
          "value": [
            0.2,
            0.4,
            0.6,
            1
          ],
          "format": [
            1
          ]
        }
      },
      {
        "type": "float",
        "range": {
          "start": 17,
          "end": 20
        },
        "value": 0.8
      }
    ],
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 4
      },
      "path": [
        "dust"
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:particle Parse "dust_color_transition 0.1 0.2 0.3 0.4 0.5 0.6 0.7" 1'] = {
  "node": {
    "type": "mcfunction:particle",
    "range": {
      "start": 0,
      "end": 49
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 21
        },
        "path": [
          "dust_color_transition"
        ]
      },
      {
        "type": "mcfunction:vector",
        "range": {
          "start": 22,
          "end": 33
        },
        "children": [
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 22,
              "end": 25
            },
            "value": 0.1
          },
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 26,
              "end": 29
            },
            "value": 0.2
          },
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 30,
              "end": 33
            },
            "value": 0.3
          }
        ],
        "system": 0,
        "color": {
          "value": [
            0.1,
            0.2,
            0.3,
            1
          ],
          "format": [
            1
          ]
        }
      },
      {
        "type": "float",
        "range": {
          "start": 34,
          "end": 37
        },
        "value": 0.4
      },
      {
        "type": "mcfunction:vector",
        "range": {
          "start": 38,
          "end": 49
        },
        "children": [
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 38,
              "end": 41
            },
            "value": 0.5
          },
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 42,
              "end": 45
            },
            "value": 0.6
          },
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 46,
              "end": 49
            },
            "value": 0.7
          }
        ],
        "system": 0,
        "color": {
          "value": [
            0.5,
            0.6,
            0.7,
            1
          ],
          "format": [
            1
          ]
        }
      }
    ],
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 21
      },
      "path": [
        "dust_color_transition"
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:particle Parse "item carrot_on_a_stick" 1'] = {
  "node": {
    "type": "mcfunction:particle",
    "range": {
      "start": 0,
      "end": 22
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 4
        },
        "path": [
          "item"
        ]
      },
      {
        "type": "mcfunction:item",
        "range": {
          "start": 5,
          "end": 22
        },
        "children": [
          {
            "type": "resource_location",
            "range": {
              "start": 5,
              "end": 22
            },
            "path": [
              "carrot_on_a_stick"
            ]
          }
        ],
        "id": {
          "type": "resource_location",
          "range": {
            "start": 5,
            "end": 22
          },
          "path": [
            "carrot_on_a_stick"
          ]
        }
      }
    ],
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 4
      },
      "path": [
        "item"
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:particle Parse "sculk_charge 4.2" 1'] = {
  "node": {
    "type": "mcfunction:particle",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 12
        },
        "path": [
          "sculk_charge"
        ]
      },
      {
        "type": "float",
        "range": {
          "start": 13,
          "end": 16
        },
        "value": 4.2
      }
    ],
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 12
      },
      "path": [
        "sculk_charge"
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:particle Parse "shriek 20" 1'] = {
  "node": {
    "type": "mcfunction:particle",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 6
        },
        "path": [
          "shriek"
        ]
      },
      {
        "type": "integer",
        "range": {
          "start": 7,
          "end": 9
        },
        "value": 20
      }
    ],
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 6
      },
      "path": [
        "shriek"
      ]
    }
  },
  "errors": []
}

exports['mcfunction argument minecraft:particle Parse "vibration 0.1 0.2 0.3 40" 1'] = {
  "node": {
    "type": "mcfunction:particle",
    "range": {
      "start": 0,
      "end": 24
    },
    "children": [
      {
        "type": "resource_location",
        "range": {
          "start": 0,
          "end": 9
        },
        "path": [
          "vibration"
        ]
      },
      {
        "type": "mcfunction:vector",
        "range": {
          "start": 10,
          "end": 21
        },
        "children": [
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 10,
              "end": 13
            },
            "value": 0.1
          },
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 14,
              "end": 17
            },
            "value": 0.2
          },
          {
            "type": "mcfunction:coordinate",
            "notation": "",
            "range": {
              "start": 18,
              "end": 21
            },
            "value": 0.3
          }
        ],
        "system": 0
      },
      {
        "type": "integer",
        "range": {
          "start": 22,
          "end": 24
        },
        "value": 40
      }
    ],
    "id": {
      "type": "resource_location",
      "range": {
        "start": 0,
        "end": 9
      },
      "path": [
        "vibration"
      ]
    }
  },
  "errors": []
}
