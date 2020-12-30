exports['IndexMap Position Transformation Escapes toInnerOffset() Should throw error for 12 1'] = `
Offset 12 is not in range [13, 30)
`

exports['IndexMap Position Transformation Escapes toInnerOffset() Should throw error for 30 1'] = `
Offset 30 is not in range [13, 30)
`

exports['IndexMap Position Transformation Escapes toOuterOffset() Should throw error for 11 1'] = `
Offset 11 is not in range [0, 11)
`

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
