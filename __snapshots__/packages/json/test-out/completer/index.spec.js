exports['JSON completer boolean Complete \'true|\' 1'] = {
  "completions": [
    {
      "kind": 12,
      "insertText": "false",
      "label": "false",
      "range": {
        "start": 0,
        "end": 4
      }
    },
    {
      "kind": 12,
      "insertText": "true",
      "label": "true",
      "range": {
        "start": 0,
        "end": 4
      }
    }
  ]
}

exports['JSON completer boolean Complete \'t|rue\' 1'] = {
  "completions": [
    {
      "kind": 12,
      "insertText": "false",
      "label": "false",
      "range": {
        "start": 0,
        "end": 4
      }
    },
    {
      "kind": 12,
      "insertText": "true",
      "label": "true",
      "range": {
        "start": 0,
        "end": 4
      }
    }
  ]
}

exports['JSON completer boolean Complete \'|true\' 1'] = {
  "completions": [
    {
      "kind": 12,
      "insertText": "false",
      "label": "false",
      "range": {
        "start": 0,
        "end": 4
      }
    },
    {
      "kind": 12,
      "insertText": "true",
      "label": "true",
      "range": {
        "start": 0,
        "end": 4
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true, "bar": , : false, |}\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\": ${1|false,true|}",
      "label": "baz",
      "range": {
        "start": 33,
        "end": 33
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\": ${1|false,true|}",
      "label": "qux",
      "range": {
        "start": 33,
        "end": 33
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true, "bar": , : false, }|\' 1'] = {
  "completions": []
}

exports['JSON completer object Complete \'{ "foo": true, "bar": , : false,| }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\": ${1|false,true|}",
      "label": "baz",
      "range": {
        "start": 32,
        "end": 32
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\": ${1|false,true|}",
      "label": "qux",
      "range": {
        "start": 32,
        "end": 32
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true, "bar": , : false|, }\' 1'] = {
  "completions": []
}

exports['JSON completer object Complete \'{ "foo": true, "bar": , : |false, }\' 1'] = {
  "completions": []
}

exports['JSON completer object Complete \'{ "foo": true, "bar": , :| false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 24,
        "end": 24
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 24,
        "end": 24
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true, "bar": , |: false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 24,
        "end": 24
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 24,
        "end": 24
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true, "bar": ,| : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\": ${1|false,true|},",
      "label": "baz",
      "range": {
        "start": 23,
        "end": 23
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\": ${1|false,true|},",
      "label": "qux",
      "range": {
        "start": 23,
        "end": 23
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true, "bar": |, : false, }\' 1'] = {
  "completions": [
    {
      "kind": 12,
      "insertText": "false",
      "label": "false",
      "range": {
        "start": 22,
        "end": 22
      }
    },
    {
      "kind": 12,
      "insertText": "true",
      "label": "true",
      "range": {
        "start": 22,
        "end": 22
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true, "bar":| , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0bar",
      "filterText": "\"bar\"",
      "insertText": "\"bar\": ${1|false,true|},",
      "label": "bar",
      "range": {
        "start": 15,
        "end": 23
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\": ${1|false,true|},",
      "label": "baz",
      "range": {
        "start": 15,
        "end": 23
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\": ${1|false,true|},",
      "label": "qux",
      "range": {
        "start": 15,
        "end": 23
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true, |"bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0bar",
      "filterText": "\"bar\"",
      "insertText": "\"bar\": ${1|false,true|},",
      "label": "bar",
      "range": {
        "start": 15,
        "end": 23
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\": ${1|false,true|},",
      "label": "baz",
      "range": {
        "start": 15,
        "end": 23
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\": ${1|false,true|},",
      "label": "qux",
      "range": {
        "start": 15,
        "end": 23
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true,| "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\": ${1|false,true|},",
      "label": "baz",
      "range": {
        "start": 14,
        "end": 14
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\": ${1|false,true|},",
      "label": "qux",
      "range": {
        "start": 14,
        "end": 14
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo": true|, "bar": , : false, }\' 1'] = {
  "completions": []
}

exports['JSON completer object Complete \'{ "foo": |true, "bar": , : false, }\' 1'] = {
  "completions": []
}

exports['JSON completer object Complete \'{ "foo":| true, "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0foo",
      "filterText": "\"foo\"",
      "insertText": "\"foo\"",
      "label": "foo",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 2,
        "end": 7
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo"|: true, "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0foo",
      "filterText": "\"foo\"",
      "insertText": "\"foo\"",
      "label": "foo",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 2,
        "end": 7
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "foo|": true, "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0foo",
      "filterText": "\"foo\"",
      "insertText": "\"foo\"",
      "label": "foo",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 2,
        "end": 7
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "fo|o": true, "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0foo",
      "filterText": "\"foo\"",
      "insertText": "\"foo\"",
      "label": "foo",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 2,
        "end": 7
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "f|oo": true, "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0foo",
      "filterText": "\"foo\"",
      "insertText": "\"foo\"",
      "label": "foo",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 2,
        "end": 7
      }
    }
  ]
}

exports['JSON completer object Complete \'{ "|foo": true, "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0foo",
      "filterText": "\"foo\"",
      "insertText": "\"foo\"",
      "label": "foo",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 2,
        "end": 7
      }
    }
  ]
}

exports['JSON completer object Complete \'{ |"foo": true, "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0foo",
      "filterText": "\"foo\"",
      "insertText": "\"foo\"",
      "label": "foo",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\"",
      "label": "baz",
      "range": {
        "start": 2,
        "end": 7
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\"",
      "label": "qux",
      "range": {
        "start": 2,
        "end": 7
      }
    }
  ]
}

exports['JSON completer object Complete \'{| "foo": true, "bar": , : false, }\' 1'] = {
  "completions": [
    {
      "kind": 10,
      "detail": "",
      "sortText": "0baz",
      "filterText": "\"baz\"",
      "insertText": "\"baz\": ${1|false,true|},",
      "label": "baz",
      "range": {
        "start": 1,
        "end": 1
      }
    },
    {
      "kind": 10,
      "detail": "",
      "sortText": "0qux",
      "filterText": "\"qux\"",
      "insertText": "\"qux\": ${1|false,true|},",
      "label": "qux",
      "range": {
        "start": 1,
        "end": 1
      }
    }
  ]
}

exports['JSON completer object Complete \'|{ "foo": true, "bar": , : false, }\' 1'] = {
  "completions": []
}
