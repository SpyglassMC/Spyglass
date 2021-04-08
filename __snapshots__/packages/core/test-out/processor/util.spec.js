exports['processor/util.ts selectedNode() continuous Should return the node at 0 1'] = {
  "node": "leaf_1",
  "parents": [
    "not_leaf_1"
  ]
}

exports['processor/util.ts selectedNode() continuous Should return the node at 1 1'] = {
  "node": "leaf_1",
  "parents": [
    "not_leaf_1"
  ]
}

exports['processor/util.ts selectedNode() continuous Should return the node at 12 1'] = `
null
`

exports['processor/util.ts selectedNode() continuous Should return the node at 5 1'] = {
  "node": "leaf_2",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts selectedNode() continuous Should return the node at 7 1'] = {
  "node": "leaf_3",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts selectedNode() continuous Should return the node at 9 1'] = {
  "node": "leaf_4",
  "parents": [
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts selectedNode() discontinuous Should return the node at 0 1'] = {
  "node": "leaf_1",
  "parents": [
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts selectedNode() discontinuous Should return the node at 12 1'] = `
null
`

exports['processor/util.ts selectedNode() discontinuous Should return the node at 3 1'] = {
  "node": "not_leaf_2",
  "parents": [
    "not_leaf_1"
  ]
}

exports['processor/util.ts selectedNode() discontinuous Should return the node at 7 1'] = {
  "node": "not_leaf_1",
  "parents": []
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf 1'] = {
  "leaf": "leaf_1",
  "parents": [
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf 2'] = {
  "leaf": "leaf_2",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf 3'] = {
  "leaf": "leaf_3",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf 4'] = {
  "leaf": "leaf_4",
  "parents": [
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [0, 10) 1'] = {
  "leaf": "leaf_1",
  "parents": [
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [0, 10) 2'] = {
  "leaf": "leaf_2",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [0, 10) 3'] = {
  "leaf": "leaf_3",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [0, 10) 4'] = {
  "leaf": "leaf_4",
  "parents": [
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [4, 5) 1'] = {
  "leaf": "leaf_1",
  "parents": [
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [5, 7) 1'] = {
  "leaf": "leaf_2",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [5, 7) 2'] = {
  "leaf": "leaf_3",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [6, 7) 1'] = {
  "leaf": "leaf_3",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [7, 10) 1'] = {
  "leaf": "leaf_3",
  "parents": [
    "not_leaf_3",
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traverseLeaves() Should traverse every leaf in [7, 10) 2'] = {
  "leaf": "leaf_4",
  "parents": [
    "not_leaf_2",
    "not_leaf_1"
  ]
}

exports['processor/util.ts traversePreOrder() Should traverse nodes that match the predicates 1'] = {
  "node": "leaf_1",
  "parents": [
    "not_leaf_1"
  ]
}

exports['processor/util.ts traversePreOrder() Should traverse nodes that match the predicates 2'] = {
  "node": "not_leaf_3",
  "parents": [
    "not_leaf_2",
    "not_leaf_1"
  ]
}
