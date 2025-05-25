exports['ConfigService merge() Should merge empty overrides correctly 1'] = {
  "env": {
    "dataSource": "GitHub",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": false
    }
  }
}

exports['ConfigService merge() Should merge empty overrides correctly 2'] = {
  "env": {
    "dataSource": "GitHub",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": false
    }
  }
}

exports['ConfigService merge() Should merge empty overrides correctly 3'] = {
  "env": {
    "dataSource": "GitHub",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": false
    }
  }
}

exports['ConfigService merge() Should merge multiple overrides correctly 1'] = {
  "env": {
    "dataSource": "TEST",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": false
    },
    "foo": "qux",
    "erm": 3
  }
}

exports['ConfigService merge() Should merge nested overrides correctly 1'] = {
  "env": {
    "dataSource": "TEST",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": false
    }
  }
}

exports['ConfigService merge() Should merge nested overrides correctly 2'] = {
  "env": {
    "dataSource": "GitHub",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": false
    }
  }
}

exports['ConfigService merge() Should merge nested overrides correctly 3'] = {
  "env": {
    "dataSource": "GitHub",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": true
    }
  }
}

exports['ConfigService merge() Should merge nested overrides correctly 4'] = {
  "env": {
    "dataSource": "GitHub",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": true,
      "c": 9
    }
  }
}

exports['ConfigService merge() Should merge nested overrides correctly 5'] = {
  "env": {
    "dataSource": "GitHub",
    "dependencies": [],
    "feature": {
      "a": true,
      "b": false
    }
  }
}

exports['ConfigService merge() Should merge top-level overrides correctly 1'] = {
  "env": {
    "dataSource": "GitHub",
    "dependencies": [
      "@vanilla-mcdoc"
    ],
    "feature": {
      "a": true,
      "b": false
    }
  },
  "test": true
}
