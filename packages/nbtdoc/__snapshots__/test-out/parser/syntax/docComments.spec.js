exports['docComments() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:doc_comments",
    "range": {
      "start": 0,
      "end": 0
    },
    "nodes": [],
    "doc": ""
  },
  "errors": []
}

exports['docComments() Parse "/// This is a doc comment." 1'] = {
  "node": {
    "type": "nbtdoc:doc_comments",
    "range": {
      "start": 0,
      "end": 26
    },
    "nodes": [
      {
        "type": "comment",
        "range": {
          "start": 0,
          "end": 26
        },
        "comment": " This is a doc comment."
      }
    ],
    "doc": " This is a doc comment."
  },
  "errors": []
}

exports['docComments() Parse "compound Something {}" 1'] = {
  "node": {
    "type": "nbtdoc:doc_comments",
    "range": {
      "start": 0,
      "end": 0
    },
    "nodes": [],
    "doc": ""
  },
  "errors": []
}

exports['docComments() Parse "⮀/// This is a doc comment.↓⮀/// And more?↓⮀foo: Boolean" 1'] = {
  "node": {
    "type": "nbtdoc:doc_comments",
    "range": {
      "start": 0,
      "end": 44
    },
    "nodes": [
      {
        "type": "comment",
        "range": {
          "start": 1,
          "end": 28
        },
        "comment": " This is a doc comment.\n"
      },
      {
        "type": "comment",
        "range": {
          "start": 29,
          "end": 43
        },
        "comment": " And more?\n"
      }
    ],
    "doc": " This is a doc comment.\n And more?\n"
  },
  "errors": []
}
