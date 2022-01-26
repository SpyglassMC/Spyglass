exports['mcfunction literal() Parse "" 1'] = {
  "node": "FAILURE",
  "errors": []
}

exports['mcfunction literal() Parse "advancement grant @s everything" 1'] = {
  "node": {
    "type": "mcfunction:command_child/literal",
    "range": {
      "start": 0,
      "end": 11
    },
    "value": "advancement"
  },
  "errors": []
}

exports['mcfunction literal() Parse "tell @p Hello!" 1'] = {
  "node": {
    "type": "mcfunction:command_child/literal",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": "tell"
  },
  "errors": []
}

exports['mcfunction literal() Parse "tellraw @a "World!"" 1'] = {
  "node": {
    "type": "mcfunction:command_child/literal",
    "range": {
      "start": 0,
      "end": 7
    },
    "value": "tellraw"
  },
  "errors": []
}
