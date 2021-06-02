exports['IndexMap create() Should create correctly create 1'] = {
  "name": "create",
  "behavior": [
    {
      "expect": {
        "outerRange": {
          "start": 0,
          "end": 1
        },
        "innerRange": {
          "start": 0,
          "end": 1
        },
        "pairs": []
      }
    },
    {
      "given": {},
      "expect": {
        "outerRange": {
          "start": 0,
          "end": 1
        },
        "innerRange": {
          "start": 0,
          "end": 1
        },
        "pairs": []
      }
    },
    {
      "given": {
        "innerRange": {
          "start": 0,
          "end": 1
        },
        "outerRange": {
          "start": 0,
          "end": 1
        },
        "pairs": []
      },
      "expect": {
        "outerRange": {
          "start": 0,
          "end": 1
        },
        "innerRange": {
          "start": 0,
          "end": 1
        },
        "pairs": []
      }
    }
  ]
}

exports['IndexMap merge() Should merge correctly 1'] = {
  "outerRange": {
    "start": 21,
    "end": 38
  },
  "innerRange": {
    "start": 0,
    "end": 11
  },
  "pairs": [
    {
      "outer": {
        "start": 16,
        "end": 18
      },
      "inner": {
        "start": 3,
        "end": 4
      }
    },
    {
      "outer": {
        "start": 21,
        "end": 27
      },
      "inner": {
        "start": 7,
        "end": 8
      }
    }
  ]
}

exports['IndexMap toInnerOffset() Should throw error for 12 1'] = `
Offset 12 is not in range [13, 30)
`

exports['IndexMap toInnerOffset() Should throw error for 31 1'] = `
Offset 31 is not in range [13, 30)
`

exports['IndexMap toOuterOffset() Should throw error for 12 1'] = `
Offset 12 is not in range [0, 11)
`
