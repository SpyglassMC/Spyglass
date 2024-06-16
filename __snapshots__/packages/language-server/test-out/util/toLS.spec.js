exports['toLS completionItem Should map correctly when cursor is in first line 1'] = {
  "label": "advancement",
  "textEdit": {
    "newText": "advancement",
    "insert": {
      "start": {
        "line": 0,
        "character": 0
      },
      "end": {
        "line": 0,
        "character": 1
      }
    },
    "replace": {
      "start": {
        "line": 0,
        "character": 0
      },
      "end": {
        "line": 0,
        "character": 4
      }
    }
  },
  "insertTextFormat": 2,
  "insertTextMode": 2,
  "additionalTextEdits": [
    {
      "range": {
        "start": {
          "line": 0,
          "character": 4
        },
        "end": {
          "line": 2,
          "character": 2
        }
      },
      "newText": ""
    }
  ]
}

exports['toLS completionItem Should map correctly when cursor is in second line 1'] = {
  "label": "advancement",
  "filterText": "an\\",
  "textEdit": {
    "newText": "advancement",
    "insert": {
      "start": {
        "line": 1,
        "character": 0
      },
      "end": {
        "line": 1,
        "character": 1
      }
    },
    "replace": {
      "start": {
        "line": 1,
        "character": 0
      },
      "end": {
        "line": 1,
        "character": 3
      }
    }
  },
  "insertTextFormat": 2,
  "insertTextMode": 2,
  "additionalTextEdits": [
    {
      "range": {
        "start": {
          "line": 0,
          "character": 0
        },
        "end": {
          "line": 1,
          "character": 0
        }
      },
      "newText": ""
    },
    {
      "range": {
        "start": {
          "line": 1,
          "character": 3
        },
        "end": {
          "line": 2,
          "character": 2
        }
      },
      "newText": ""
    }
  ]
}

exports['toLS completionItem Should map correctly when cursor is in third line 1'] = {
  "label": "advancement",
  "filterText": "ce",
  "textEdit": {
    "newText": "advancement",
    "insert": {
      "start": {
        "line": 2,
        "character": 0
      },
      "end": {
        "line": 2,
        "character": 1
      }
    },
    "replace": {
      "start": {
        "line": 2,
        "character": 0
      },
      "end": {
        "line": 2,
        "character": 2
      }
    }
  },
  "insertTextFormat": 2,
  "insertTextMode": 2,
  "additionalTextEdits": [
    {
      "range": {
        "start": {
          "line": 0,
          "character": 0
        },
        "end": {
          "line": 2,
          "character": 0
        }
      },
      "newText": ""
    }
  ]
}
exports['toLS semanticTokens Tokenize "foo" with multiline token support 1'] = [
  {
    "deltaLine": 0,
    "deltaStartChar": 0,
    "length": 100,
    "tokenType": 0,
    "tokenModifiers": 0
  }
]

exports['toLS semanticTokens Tokenize "foo" without multiline token support 1'] = [
  {
    "deltaLine": 0,
    "deltaStartChar": 0,
    "length": 100,
    "tokenType": 0,
    "tokenModifiers": 0
  }
]

exports['toLS semanticTokens Tokenize "foo↓bar" with multiline token support 1'] = [
  {
    "deltaLine": 0,
    "deltaStartChar": 0,
    "length": 100,
    "tokenType": 0,
    "tokenModifiers": 0
  }
]

exports['toLS semanticTokens Tokenize "foo↓bar" without multiline token support 1'] = [
  {
    "deltaLine": 0,
    "deltaStartChar": 0,
    "length": 4,
    "tokenType": 0,
    "tokenModifiers": 0
  },
  {
    "deltaLine": 1,
    "deltaStartChar": 0,
    "length": 3,
    "tokenType": 0,
    "tokenModifiers": 0
  }
]

exports['toLS semanticTokens Tokenize "foo↓bar↓qux" with multiline token support 1'] = [
  {
    "deltaLine": 0,
    "deltaStartChar": 0,
    "length": 100,
    "tokenType": 0,
    "tokenModifiers": 0
  }
]

exports['toLS semanticTokens Tokenize "foo↓bar↓qux" without multiline token support 1'] = [
  {
    "deltaLine": 0,
    "deltaStartChar": 0,
    "length": 4,
    "tokenType": 0,
    "tokenModifiers": 0
  },
  {
    "deltaLine": 1,
    "deltaStartChar": 0,
    "length": 4,
    "tokenType": 0,
    "tokenModifiers": 0
  },
  {
    "deltaLine": 1,
    "deltaStartChar": 0,
    "length": 3,
    "tokenType": 0,
    "tokenModifiers": 0
  }
]
