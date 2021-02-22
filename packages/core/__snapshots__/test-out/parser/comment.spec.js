exports['comment() parse() Should parse \'# Whoops.↓// The world is burning!\' 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['comment() parse() Should parse \'\' 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['comment() parse() Should parse \'// This is a comment.\' 1'] = {
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

exports['comment() parse() Should parse \'// This is a comment.↓Another line here.\' 1'] = {
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
