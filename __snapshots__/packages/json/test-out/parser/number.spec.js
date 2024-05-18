exports['JSON number parser number() Parse "+1" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": 1
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 2
      },
      "message": "Illegal float numeral that doesn't follow /^-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][-+]?\\d+)?$/",
      "severity": 3
    }
  ]
}

exports['JSON number parser number() Parse "-1" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 2
    },
    "value": -1
  },
  "errors": []
}

exports['JSON number parser number() Parse "0" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 0
  },
  "errors": []
}

exports['JSON number parser number() Parse "0.0" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 0
  },
  "errors": []
}

exports['JSON number parser number() Parse "1" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 1
    },
    "value": 1
  },
  "errors": []
}

exports['JSON number parser number() Parse "1.0" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 1
  },
  "errors": []
}

exports['JSON number parser number() Parse "1.0232E2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 8
    },
    "value": 102.32
  },
  "errors": []
}

exports['JSON number parser number() Parse "1.2" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": 1.2
  },
  "errors": []
}

exports['JSON number parser number() Parse "1.342E-10" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 9
    },
    "value": 1.342e-10
  },
  "errors": []
}

exports['JSON number parser number() Parse "1E12" 1'] = {
  "node": {
    "type": "json:number",
    "range": {
      "start": 0,
      "end": 4
    },
    "value": 1000000000000
  },
  "errors": []
}
