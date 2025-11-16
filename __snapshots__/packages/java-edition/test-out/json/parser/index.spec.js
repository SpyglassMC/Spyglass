exports[`translationValueParser() > Parse 'hello %$s' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 7
        },
        "value": "%"
      }
    ],
    "value": "hello %$s"
  },
  "errors": [
    {
      "range": {
        "start": 7,
        "end": 7
      },
      "message": "Expected “s”. If you want to display a literal percent sign, use “%%” instead",
      "severity": 3
    }
  ]
}
`;

exports[`translationValueParser() > Parse 'hello %%' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 8
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 8
        },
        "value": "%%"
      }
    ],
    "value": "hello %%"
  },
  "errors": []
}
`;

exports[`translationValueParser() > Parse 'hello %' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 7
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 7
        },
        "value": "%"
      }
    ],
    "value": "hello %"
  },
  "errors": [
    {
      "range": {
        "start": 7,
        "end": 7
      },
      "message": "Expected “s”. If you want to display a literal percent sign, use “%%” instead",
      "severity": 3
    }
  ]
}
`;

exports[`translationValueParser() > Parse 'hello %1$' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 9
        },
        "value": "%1$"
      }
    ],
    "value": "hello %1$"
  },
  "errors": [
    {
      "range": {
        "start": 9,
        "end": 9
      },
      "message": "Expected “s”. If you want to display a literal percent sign, use “%%” instead",
      "severity": 3
    }
  ]
}
`;

exports[`translationValueParser() > Parse 'hello %1$s' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 10
        },
        "value": "%1$s"
      }
    ],
    "value": "hello %1$s"
  },
  "errors": []
}
`;

exports[`translationValueParser() > Parse 'hello %1' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 8
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 8
        },
        "value": "%1"
      }
    ],
    "value": "hello %1"
  },
  "errors": [
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “$”. If you want to display a literal percent sign, use “%%” instead",
      "severity": 3
    },
    {
      "range": {
        "start": 8,
        "end": 8
      },
      "message": "Expected “s”. If you want to display a literal percent sign, use “%%” instead",
      "severity": 3
    }
  ]
}
`;

exports[`translationValueParser() > Parse 'hello %s %42$s' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 14
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 8
        },
        "value": "%s"
      },
      {
        "type": "literal",
        "range": {
          "start": 9,
          "end": 14
        },
        "value": "%42$s"
      }
    ],
    "value": "hello %s %42$s"
  },
  "errors": []
}
`;

exports[`translationValueParser() > Parse 'hello %s%%' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 10
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 8
        },
        "value": "%s"
      },
      {
        "type": "literal",
        "range": {
          "start": 8,
          "end": 10
        },
        "value": "%%"
      }
    ],
    "value": "hello %s%%"
  },
  "errors": []
}
`;

exports[`translationValueParser() > Parse 'hello %s%' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 9
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 8
        },
        "value": "%s"
      },
      {
        "type": "literal",
        "range": {
          "start": 8,
          "end": 9
        },
        "value": "%"
      }
    ],
    "value": "hello %s%"
  },
  "errors": [
    {
      "range": {
        "start": 9,
        "end": 9
      },
      "message": "Expected “s”. If you want to display a literal percent sign, use “%%” instead",
      "severity": 3
    }
  ]
}
`;

exports[`translationValueParser() > Parse 'hello %s' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 8
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 6,
          "end": 8
        },
        "value": "%s"
      }
    ],
    "value": "hello %s"
  },
  "errors": []
}
`;

exports[`translationValueParser() > Parse 'hello world' 1`] = `
{
  "node": {
    "type": "java_edition:translation_value",
    "range": {
      "start": 0,
      "end": 11
    },
    "children": [],
    "value": "hello world"
  },
  "errors": []
}
`;
