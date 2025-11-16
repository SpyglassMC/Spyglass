exports[`ColorToken > fillGap() > Fill for “\"/kill @a\"” 1`] = `
[
  {
    "range": {
      "start": 5,
      "end": 6
    },
    "type": "string"
  },
  {
    "range": {
      "start": 6,
      "end": 11
    },
    "type": "keyword"
  },
  {
    "range": {
      "start": 11,
      "end": 12
    },
    "type": "string"
  },
  {
    "range": {
      "start": 12,
      "end": 14
    },
    "type": "literal"
  },
  {
    "range": {
      "start": 14,
      "end": 15
    },
    "type": "string"
  }
]
`;

exports[`ColorToken > fillGap() > Fill for “\"foo:qux\"” 1`] = `
[
  {
    "range": {
      "start": 5,
      "end": 6
    },
    "type": "string"
  },
  {
    "range": {
      "start": 6,
      "end": 13
    },
    "type": "resourceLocation"
  },
  {
    "range": {
      "start": 13,
      "end": 14
    },
    "type": "string"
  }
]
`;

exports[`ColorToken > fillGap() > Fill for “bar” 1`] = `
[
  {
    "range": {
      "start": 5,
      "end": 8
    },
    "type": "keyword"
  }
]
`;

exports[`ColorToken > fillGap() > Fill for “” 1`] = `
[
  {
    "range": {
      "start": 0,
      "end": 20
    },
    "type": "string"
  }
]
`;
