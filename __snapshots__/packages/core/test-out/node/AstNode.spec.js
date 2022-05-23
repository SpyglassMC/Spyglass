exports['AstNode findDeepestChild continuous Should return the node at 0 1'] = {
  "node": "leaf_1"
}

exports['AstNode findDeepestChild continuous Should return the node at 1 1'] = {
  "node": "leaf_1"
}

exports['AstNode findDeepestChild continuous Should return the node at 12 1'] = `
undefined
`

exports['AstNode findDeepestChild continuous Should return the node at 5 1'] = {
  "node": "leaf_2"
}

exports['AstNode findDeepestChild continuous Should return the node at 7 1'] = {
  "node": "leaf_3"
}

exports['AstNode findDeepestChild continuous Should return the node at 9 1'] = {
  "node": "leaf_4"
}

exports['AstNode findDeepestChild discontinuous Should return the node at 0 1'] = {
  "node": "leaf_1"
}

exports['AstNode findDeepestChild discontinuous Should return the node at 12 1'] = `
undefined
`

exports['AstNode findDeepestChild discontinuous Should return the node at 3 1'] = {
  "node": "not_leaf_2"
}

exports['AstNode findDeepestChild discontinuous Should return the node at 7 1'] = {
  "node": "not_leaf_1"
}
