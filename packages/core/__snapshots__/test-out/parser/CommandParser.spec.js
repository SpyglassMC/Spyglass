exports['CommentParser parse() Should parse \'# Whoops.↓// The world is burning!\' 1'] = {
  "node": {
    "type": "comment",
    "range": {
      "start": 0,
      "end": 1
    }
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a comment starting with “//”",
      "severity": 4
    }
  ]
}

exports['CommentParser parse() Should parse \'// This is a comment.\' 1'] = {
  "node": {
    "type": "comment",
    "range": {
      "start": 0,
      "end": 21
    }
  },
  "errors": []
}

exports['CommentParser parse() Should parse \'// This is a comment.↓Another line here.\' 1'] = {
  "node": {
    "type": "comment",
    "range": {
      "start": 0,
      "end": 21
    }
  },
  "errors": []
}
