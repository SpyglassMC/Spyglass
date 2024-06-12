exports['nbt primitive() Parse "" 1'] = {
  "node": {
    "type": "nbt:string",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 0,
          "end": 0
        }
      }
    ]
  },
  "errors": []
}

exports['nbt primitive() Parse ""quoted"" 1'] = {
  "node": {
    "type": "nbt:string",
    "range": {
      "start": 0,
      "end": 8
    },
    "value": "quoted",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 1,
          "end": 1
        }
      }
    ]
  },
  "errors": []
}

exports['nbt primitive() Parse "1.23f" 1'] = {
  "node": {
    "type": "nbt:float",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": 1.23
  },
  "errors": []
}

exports['nbt primitive() Parse "1024L" 1'] = {
  "node": {
    "type": "nbt:long",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "1024"
  },
  "errors": []
}

exports['nbt primitive() Parse "123456b" 1'] = {
  "node": {
    "type": "nbt:string",
    "range": {
      "start": 0,
      "end": 7
    },
    "value": "123456b",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 0,
          "end": 0
        }
      }
    ]
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 7
      },
      "message": "This looks like a byte tag, but it is actually a string tag due to the numeral value being out of [-128, 127]",
      "severity": 2
    }
  ]
}

exports['nbt primitive() Parse "1b" 1'] = {
  "node": {
    "type": "nbt:byte",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": 1
  },
  "errors": []
}

exports['nbt primitive() Parse "4.56" 1'] = {
  "node": {
    "type": "nbt:double",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": 4.56
  },
  "errors": []
}

exports['nbt primitive() Parse "4.56d" 1'] = {
  "node": {
    "type": "nbt:double",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": 4.56
  },
  "errors": []
}

exports['nbt primitive() Parse "72s" 1'] = {
  "node": {
    "type": "nbt:short",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 72
  },
  "errors": []
}

exports['nbt primitive() Parse "987" 1'] = {
  "node": {
    "type": "nbt:int",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 987
  },
  "errors": []
}

exports['nbt primitive() Parse "false" 1'] = {
  "node": {
    "type": "nbt:byte",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": 0
  },
  "errors": []
}

exports['nbt primitive() Parse "true" 1'] = {
  "node": {
    "type": "nbt:byte",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": 1
  },
  "errors": []
}

exports['nbt primitive() Parse "unquoted" 1'] = {
  "node": {
    "type": "nbt:string",
    "range": {
      "start": 0,
      "end": 8
    },
    "value": "unquoted",
    "valueMap": [
      {
        "inner": {
          "start": 0,
          "end": 0
        },
        "outer": {
          "start": 0,
          "end": 0
        }
      }
    ]
  },
  "errors": []
}
