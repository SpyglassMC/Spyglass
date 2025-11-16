exports[`mcdoc parser > identifier > Parse \"123\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": ""
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}
`;

exports[`mcdoc parser > identifier > Parse \"\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": ""
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}
`;

exports[`mcdoc parser > identifier > Parse \"foo()bar\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}
`;

exports[`mcdoc parser > identifier > Parse \"foo123\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": "foo123"
  },
  "errors": []
}
`;

exports[`mcdoc parser > identifier > Parse \"foo;bar\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}
`;

exports[`mcdoc parser > identifier > Parse \"foo\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}
`;

exports[`mcdoc parser > identifier > Parse \"foo↓bar\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}
`;

exports[`mcdoc parser > identifier > Parse \"super\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "super"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "“super” is a reserved word and cannot be used as an identifier name",
      "severity": 3
    }
  ]
}
`;

exports[`mcdoc parser > identifier > Parse \"ĦĔĽĻŎ你好捏\" 1`] = `
{
  "node": {
    "type": "mcdoc:identifier",
    "range": {
      "start": 0,
      "end": 8
    },
    "value": "ĦĔĽĻŎ你好捏"
  },
  "errors": []
}
`;
