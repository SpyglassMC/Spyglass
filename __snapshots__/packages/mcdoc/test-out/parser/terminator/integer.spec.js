exports[`mcdoc parser > integer > Parse \"-1\" 1`] = `
{
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -1
  },
  "errors": []
}
`;

exports[`mcdoc parser > integer > Parse \"0\" 1`] = `
{
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 0
  },
  "errors": []
}
`;

exports[`mcdoc parser > integer > Parse \"1\" 1`] = `
{
  "node": {
    "type": "integer",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 1
  },
  "errors": []
}
`;

exports[`mcdoc parser > integer > Parse \"\" 1`] = `
{
  "node": {
    "type": "integer",
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
      "message": "Expected an integer",
      "severity": 3
    }
  ]
}
`;
