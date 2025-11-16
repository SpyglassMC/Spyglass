exports[`mcfunction argument parser > minecraft:int_range > Parse \"-100..\" 1`] = `
{
  "node": {
    "type": "mcfunction:int_range",
    "range": {
      "start": 0,
      "end": 6
    },
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 4
        },
        "value": -100
      },
      {
        "type": "literal",
        "range": {
          "start": 4,
          "end": 6
        },
        "value": ".."
      }
    ],
    "value": [
      -100,
      null
    ]
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:int_range > Parse \"-5\" 1`] = `
{
  "node": {
    "type": "mcfunction:int_range",
    "range": {
      "start": 0,
      "end": 2
    },
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 2
        },
        "value": -5
      }
    ],
    "value": [
      -5,
      -5
    ]
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:int_range > Parse \"..100\" 1`] = `
{
  "node": {
    "type": "mcfunction:int_range",
    "range": {
      "start": 0,
      "end": 5
    },
    "children": [
      {
        "type": "literal",
        "range": {
          "start": 0,
          "end": 2
        },
        "value": ".."
      },
      {
        "type": "integer",
        "range": {
          "start": 2,
          "end": 5
        },
        "value": 100
      }
    ],
    "value": [
      null,
      100
    ]
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:int_range > Parse \"..\" 1`] = `
{
  "node": "FAILURE",
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:int_range > Parse \"0..5\" 1`] = `
{
  "node": {
    "type": "mcfunction:int_range",
    "range": {
      "start": 0,
      "end": 4
    },
    "children": [
      {
        "type": "integer",
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
          "end": 3
        },
        "value": ".."
      },
      {
        "type": "integer",
        "range": {
          "start": 3,
          "end": 4
        },
        "value": 5
      }
    ],
    "value": [
      0,
      5
    ]
  },
  "errors": []
}
`;

exports[`mcfunction argument parser > minecraft:int_range > Parse \"0\" 1`] = `
{
  "node": {
    "type": "mcfunction:int_range",
    "range": {
      "start": 0,
      "end": 1
    },
    "children": [
      {
        "type": "integer",
        "range": {
          "start": 0,
          "end": 1
        },
        "value": 0
      }
    ],
    "value": [
      0,
      0
    ]
  },
  "errors": []
}
`;
