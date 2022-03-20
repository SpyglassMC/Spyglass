exports['nbtdoc checker/type.ts checkAssignability() Assign \'(string | (string | int))\' to \'(string | int)\' 1'] = {
  "isAssignable": true
}

exports['nbtdoc checker/type.ts checkAssignability() Assign \'(string | int | boolean)\' to \'(string | int)\' 1'] = {
  "isAssignable": false,
  "errorMessage": "Type “(string | int | boolean)” is not assignable to type “(string | int)”\n  Type “boolean” is not assignable to type “(string | int)”"
}

exports['nbtdoc checker/type.ts checkAssignability() Assign \'(string | int)\' to \'(string | int | boolean)\' 1'] = {
  "isAssignable": true
}

exports['nbtdoc checker/type.ts checkAssignability() Assign \'(string | int)\' to \'string\' 1'] = {
  "isAssignable": false,
  "errorMessage": "Type “(string | int)” is not assignable to type “string”\n  Type “int” is not assignable to type “string”"
}

exports['nbtdoc checker/type.ts checkAssignability() Assign \'[[(string | int | boolean)]]\' to \'[[(string | int)]]\' 1'] = {
  "isAssignable": false,
  "errorMessage": "Type “[[(string | int | boolean)]]” is not assignable to type “[[(string | int)]]”\n  Type “[(string | int | boolean)]” is not assignable to type “[(string | int)]”\n    Type “(string | int | boolean)” is not assignable to type “(string | int)”\n      Type “boolean” is not assignable to type “(string | int)”"
}

exports['nbtdoc checker/type.ts checkAssignability() Assign \'[[(string | int)]]\' to \'[[(string | int | boolean)]]\' 1'] = {
  "isAssignable": true
}

exports['nbtdoc checker/type.ts checkAssignability() Assign \'int\' to \'string\' 1'] = {
  "isAssignable": false,
  "errorMessage": "Type “int” is not assignable to type “string”"
}

exports['nbtdoc checker/type.ts checkAssignability() Assign \'string\' to \'(string | int)\' 1'] = {
  "isAssignable": true
}

exports['nbtdoc checker/type.ts checkAssignability() Assign \'string\' to \'string\' 1'] = {
  "isAssignable": true
}
