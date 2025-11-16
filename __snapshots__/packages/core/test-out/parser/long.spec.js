exports[`long() > long() > long() > Parse '' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a long",
      "severity": 3
    }
  ]
}
`;

exports[`long() > long() > long() > Parse '+' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Illegal long numeral that doesn't follow /^[+-]?(?:0|[1-9][0-9]*)$/",
      "severity": 3
    }
  ]
}
`;

exports[`long() > long() > long() > Parse '+1' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "1"
  },
  "errors": []
}
`;

exports[`long() > long() > long() > Parse '-1' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": "-1"
  },
  "errors": []
}
`;

exports[`long() > long() > long() > Parse '-123' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "-123"
  },
  "errors": []
}
`;

exports[`long() > long() > long() > Parse '0123' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "123"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 4
      },
      "message": "Illegal long numeral that doesn't follow /^[+-]?(?:0|[1-9][0-9]*)$/",
      "severity": 3
    }
  ]
}
`;

exports[`long() > long() > long() > Parse '123' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "123"
  },
  "errors": []
}
`;

exports[`long() > long() > long() > Parse 'foo' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected a long",
      "severity": 3
    }
  ]
}
`;

exports[`long() > long(failsOnEmpty) > long(failsOnEmpty=true) > Parse '' 1`] = `
{
  "node": "FAILURE",
  "errors": []
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(1, 6, true) > Parse '0' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Test message!",
      "severity": 3
    }
  ]
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(1, 6, true) > Parse '3' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "3"
  },
  "errors": []
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(1, 6, true) > Parse '9' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "9"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Test message!",
      "severity": 3
    }
  ]
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(1, undefined, false) > Parse '0' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a long between 1 and +∞",
      "severity": 3
    }
  ]
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(1, undefined, false) > Parse '3' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "3"
  },
  "errors": []
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(1, undefined, false) > Parse '9' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "9"
  },
  "errors": []
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(undefined, 6, false) > Parse '0' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "0"
  },
  "errors": []
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(undefined, 6, false) > Parse '3' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "3"
  },
  "errors": []
}
`;

exports[`long() > long(min, max, onOutOfRange) > long(undefined, 6, false) > Parse '9' 1`] = `
{
  "node": {
    "type": "long",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": "9"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 1
      },
      "message": "Expected a long between -∞ and 6",
      "severity": 3
    }
  ]
}
`;
