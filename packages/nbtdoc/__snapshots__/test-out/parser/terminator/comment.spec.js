exports['comment() Test "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['comment() Test "/" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['comment() Test "// This is a comment." 1'] = {
  "node": {
    "type": "comment",
    "range": {
      "start": 0,
      "end": 21
    },
    "comment": "// This is a comment."
  },
  "errors": []
}

exports['comment() Test "// This is a comment.↓next line test;" 1'] = {
  "node": {
    "type": "comment",
    "range": {
      "start": 0,
      "end": 21
    },
    "comment": "// This is a comment."
  },
  "errors": []
}

exports['comment() Test "//" 1'] = {
  "node": {
    "type": "comment",
    "range": {
      "start": 0,
      "end": 2
    },
    "comment": "//"
  },
  "errors": []
}

exports['comment() Test "/// This is a doc comment." 1'] = {
  "node": {
    "type": "comment",
    "range": {
      "start": 0,
      "end": 26
    },
    "comment": "/// This is a doc comment."
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 26
      },
      "message": "Doc comments are not allowed here; you might want to replace the three slashes with two slashes",
      "severity": 3
    }
  ]
}
