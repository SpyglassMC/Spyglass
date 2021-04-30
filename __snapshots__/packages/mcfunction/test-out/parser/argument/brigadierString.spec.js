exports['mcfunction argument brigadier:string Parse """" with {"type":"phrase"} 1'] = {
  "node": {
    "type": "mcfunction:argument/brigadier:string",
    "range": {
      "start": 0,
      "end": 2
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
        "start": 1,
        "end": 1
      },
      "innerRange": {
        "start": 0,
        "end": 0
      },
      "pairs": []
    },
    "name": "test",
    "hover": "<test: string>"
  },
  "errors": []
}

exports['mcfunction argument brigadier:string Parse ""and symbols"" with {"type":"greedy"} 1'] = {
  "node": {
    "type": "mcfunction:argument/brigadier:string",
    "range": {
      "start": 0,
      "end": 13
    },
    "options": {
      "unquotable": {}
    },
    "value": "\"and symbols\"",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 13
      },
      "innerRange": {
        "start": 0,
        "end": 13
      },
      "pairs": []
    },
    "name": "test",
    "hover": "<test: string>"
  },
  "errors": []
}

exports['mcfunction argument brigadier:string Parse ""quoted phrase"" with {"type":"phrase"} 1'] = {
  "node": {
    "type": "mcfunction:argument/brigadier:string",
    "range": {
      "start": 0,
      "end": 15
    },
    "options": {
      "escapable": {},
      "quotes": [
        "\"",
        "'"
      ],
      "unquotable": {}
    },
    "value": "quoted phrase",
    "valueMap": {
      "outerRange": {
        "start": 1,
        "end": 14
      },
      "innerRange": {
        "start": 0,
        "end": 13
      },
      "pairs": []
    },
    "name": "test",
    "hover": "<test: string>"
  },
  "errors": []
}

exports['mcfunction argument brigadier:string Parse "word" with {"type":"greedy"} 1'] = {
  "node": {
    "type": "mcfunction:argument/brigadier:string",
    "range": {
      "start": 0,
      "end": 4
    },
    "options": {
      "unquotable": {}
    },
    "value": "word",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 4
      },
      "innerRange": {
        "start": 0,
        "end": 4
      },
      "pairs": []
    },
    "name": "test",
    "hover": "<test: string>"
  },
  "errors": []
}

exports['mcfunction argument brigadier:string Parse "word" with {"type":"phrase"} 1'] = {
  "node": {
    "type": "mcfunction:argument/brigadier:string",
    "range": {
      "start": 0,
      "end": 4
    },
    "options": {
      "escapable": {},
      "quotes": [
        "\"",
        "'"
      ],
      "unquotable": {}
    },
    "value": "word",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 4
      },
      "innerRange": {
        "start": 0,
        "end": 4
      },
      "pairs": []
    },
    "name": "test",
    "hover": "<test: string>"
  },
  "errors": []
}

exports['mcfunction argument brigadier:string Parse "word" with {"type":"word"} 1'] = {
  "node": {
    "type": "mcfunction:argument/brigadier:string",
    "range": {
      "start": 0,
      "end": 4
    },
    "options": {
      "unquotable": {}
    },
    "value": "word",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 4
      },
      "innerRange": {
        "start": 0,
        "end": 4
      },
      "pairs": []
    },
    "name": "test",
    "hover": "<test: string>"
  },
  "errors": []
}

exports['mcfunction argument brigadier:string Parse "word_with_underscores" with {"type":"word"} 1'] = {
  "node": {
    "type": "mcfunction:argument/brigadier:string",
    "range": {
      "start": 0,
      "end": 21
    },
    "options": {
      "unquotable": {}
    },
    "value": "word_with_underscores",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 21
      },
      "innerRange": {
        "start": 0,
        "end": 21
      },
      "pairs": []
    },
    "name": "test",
    "hover": "<test: string>"
  },
  "errors": []
}

exports['mcfunction argument brigadier:string Parse "words with spaces" with {"type":"greedy"} 1'] = {
  "node": {
    "type": "mcfunction:argument/brigadier:string",
    "range": {
      "start": 0,
      "end": 17
    },
    "options": {
      "unquotable": {}
    },
    "value": "words with spaces",
    "valueMap": {
      "outerRange": {
        "start": 0,
        "end": 17
      },
      "innerRange": {
        "start": 0,
        "end": 17
      },
      "pairs": []
    },
    "name": "test",
    "hover": "<test: string>"
  },
  "errors": []
}
