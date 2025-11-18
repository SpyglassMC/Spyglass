exports[`mcdoc parser > useStatement > Parse \"\" 1`] = `
{
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected “use” but got “”",
      "severity": 3
    }
  ]
}
`;

exports[`mcdoc parser > useStatement > Parse \"other\" 1`] = `
{
  "node": "FAILURE",
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "Expected “use” but got “other”",
      "severity": 3
    }
  ]
}
`;

exports[`mcdoc parser > useStatement > Parse \"use foo as bar\" 1`] = `
{
  "node": {
    "type": "mcdoc:use_statement",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "use",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:path",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 4,
              "end": 7
            },
            "value": "foo"
          }
        ],
        "range": {
          "start": 4,
          "end": 7
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 8,
          "end": 10
        },
        "value": "as"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 11,
          "end": 14
        },
        "value": "bar"
      }
    ],
    "range": {
      "start": 0,
      "end": 14
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > useStatement > Parse \"use foo/// Trailing doc comment.\" 1`] = `
{
  "node": {
    "type": "mcdoc:use_statement",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "use",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:path",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 4,
              "end": 7
            },
            "value": "foo"
          }
        ],
        "range": {
          "start": 4,
          "end": 7
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > useStatement > Parse \"use foo::bar as qux// Trailing comment.\" 1`] = `
{
  "node": {
    "type": "mcdoc:use_statement",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "use",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:path",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 4,
              "end": 7
            },
            "value": "foo"
          },
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 9,
              "end": 12
            },
            "value": "bar"
          }
        ],
        "range": {
          "start": 4,
          "end": 12
        }
      },
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 13,
          "end": 15
        },
        "value": "as"
      },
      {
        "type": "mcdoc:identifier",
        "range": {
          "start": 16,
          "end": 19
        },
        "value": "qux"
      }
    ],
    "range": {
      "start": 0,
      "end": 19
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > useStatement > Parse \"use foo\" 1`] = `
{
  "node": {
    "type": "mcdoc:use_statement",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "use",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:path",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 4,
              "end": 7
            },
            "value": "foo"
          }
        ],
        "range": {
          "start": 4,
          "end": 7
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 7
    }
  },
  "errors": []
}
`;

exports[`mcdoc parser > useStatement > Parse \"use\" 1`] = `
{
  "node": {
    "type": "mcdoc:use_statement",
    "children": [
      {
        "type": "mcdoc:literal",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "use",
        "colorTokenType": "keyword"
      },
      {
        "type": "mcdoc:path",
        "children": [
          {
            "type": "mcdoc:identifier",
            "range": {
              "start": 3,
              "end": 3
            },
            "value": ""
          }
        ],
        "range": {
          "start": 3,
          "end": 3
        }
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": [
    {
      "range": {
        "start": 3,
        "end": 3
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}
`;
