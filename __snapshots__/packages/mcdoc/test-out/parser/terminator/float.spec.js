exports[`mcdoc parser > float > Parse \"-1.4\" 1`] = `
{
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": -1.4
  },
  "errors": []
}
`;

exports[`mcdoc parser > float > Parse \".7e+3\" 1`] = `
{
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": 700
  },
  "errors": []
}
`;

exports[`mcdoc parser > float > Parse \"0\" 1`] = `
{
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 0
  },
  "errors": []
}
`;

exports[`mcdoc parser > float > Parse \"\" 1`] = `
{
  "node": {
    "type": "float",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": 0
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a float",
      "severity": 3
    }
  ]
}
`;
