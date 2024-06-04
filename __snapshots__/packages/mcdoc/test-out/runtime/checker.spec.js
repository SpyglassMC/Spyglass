exports['mcdoc runtime checker typeDefinition “struct { test: double }” with value {"test":"hello"} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": "hello",
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "string",
          "value": "hello"
        }
      }
    },
    "expected": {
      "kind": "double"
    }
  }
]

exports['mcdoc runtime checker typeDefinition “struct { test: double }” with value {"test":1} 1'] = []

exports['mcdoc runtime checker typeDefinition “struct { test: string }” with value {"test":1} 1'] = [
  {
    "kind": "type_mismatch",
    "node": {
      "originalNode": 1,
      "inferredType": {
        "kind": "literal",
        "value": {
          "kind": "double",
          "value": 1
        }
      }
    },
    "expected": {
      "kind": "string"
    }
  }
]
