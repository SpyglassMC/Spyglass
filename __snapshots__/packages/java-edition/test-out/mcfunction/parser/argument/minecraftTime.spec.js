exports[`mcfunction argument parser > minecraft:time > Parse \"0\" 1`] = `
{
  "node": {
    "type": "mcfunction:time",
    "range": {
      "start": 0,
      "end": 1
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 0
      }
    ],
    "value": 0
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:time > Parse \"0d\" 1`] = `
{
  "node": {
    "type": "mcfunction:time",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 0
      },
      {
        "type": "literal",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": "d"
      }
    ],
    "value": 0,
    "unit": "d"
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:time > Parse \"0foo\" 1`] = `
{
  "node": {
    "type": "mcfunction:time",
    "range": {
      "start": 0,
      "end": 1
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 0
      }
    ],
    "value": 0
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:time > Parse \"0s\" 1`] = `
{
  "node": {
    "type": "mcfunction:time",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 0
      },
      {
        "type": "literal",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": "s"
      }
    ],
    "value": 0,
    "unit": "s"
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:time > Parse \"0t\" 1`] = `
{
  "node": {
    "type": "mcfunction:time",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "type": "float",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 0
      },
      {
        "type": "literal",
        "range": {
          "start": 1,
          "end": 2
        },
        "value": "t"
      }
    ],
    "value": 0,
    "unit": "t"
  },
  "errors": []
}
`;
