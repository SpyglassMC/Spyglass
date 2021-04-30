exports['nbt primitive() Parse "" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 0
    },
    "options": {
      "escapable": {},
      "quotes": [
        "\"",
        "'"
      ],
      "unquotable": {}
    },
    "value": "",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 0
      },
      "innerRange": {
        "start": 0,
        "end": 0
      },
      "pairs": []
    }
  },
  "errors": []
}

exports['nbt primitive() Parse ""quoted"" 1'] = {
  "node": {
    "type": "string",
    "range": {
      "start": 0,
      "end": 8
    },
    "options": {
      "escapable": {},
      "quotes": [
        "\"",
        "'"
      ],
      "unquotable": {}
    },
    "value": "quoted",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 7
      },
      "innerRange": {
        "start": 0,
        "end": 6
      },
      "pairs": []
    }
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
    "type": "string",
    "range": {
      "start": 0,
      "end": 7
    },
    "options": {
      "escapable": {},
      "quotes": [
        "\"",
        "'"
      ],
      "unquotable": {}
    },
    "value": "123456b",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 7
      },
      "innerRange": {
        "start": 0,
        "end": 7
      },
      "pairs": []
    }
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
    "type": "string",
    "range": {
      "start": 0,
      "end": 8
    },
    "options": {
      "escapable": {},
      "quotes": [
        "\"",
        "'"
      ],
      "unquotable": {}
    },
    "value": "unquoted",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 8
      },
      "innerRange": {
        "start": 0,
        "end": 8
      },
      "pairs": []
    }
  },
  "errors": []
}
