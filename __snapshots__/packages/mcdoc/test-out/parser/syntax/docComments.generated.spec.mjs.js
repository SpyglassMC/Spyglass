exports['mcdoc docComments Parse "/// First line↓⮀⮀⮀⮀/// Second line↓⮀⮀⮀⮀Not comment" 1'] = {
  "node": {
    "type": "mcdoc:doc_comments",
    "children": [
      {
        "type": "comment",
        "range": {
          "start": 0,
          "end": 15
        },
        "comment": " First line\n"
      },
      {
        "type": "comment",
        "range": {
          "start": 19,
          "end": 35
        },
        "comment": " Second line\n"
      }
    ],
    "range": {
      "start": 0,
      "end": 39
    }
  },
  "errors": []
}
