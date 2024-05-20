exports['toLS.completionItem() Should map correctly when cursor is in first line 1'] = {
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

exports['toLS.completionItem() Should map correctly when cursor is in second line 1'] = {
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

exports['toLS.completionItem() Should map correctly when cursor is in third line 1'] = {
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
