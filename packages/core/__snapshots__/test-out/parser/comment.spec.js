exports['comment() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['comment() Parse "# Whoops.↓// The world is burning!" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['comment() Parse "// This is a comment." 1'] = {
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

exports['comment() Parse "// This is a comment.↓Another line here." 1'] = {
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
