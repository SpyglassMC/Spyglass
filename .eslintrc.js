module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "tsconfigRootDir": __dirname,
        "project": "./packages/**/tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                "multiline": {
                    "delimiter": "comma",
                    "requireLast": false
                },
                "singleline": {
                    "delimiter": "comma",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/quotes": [
            "warn",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "warn",
            "never"
        ],
        "@typescript-eslint/indent": [
            "warning",
            "tab"
        ],
        "indent": "off",
        "comma-dangle": "warn",
        "eol-last": "warn",
        "no-fallthrough": "warn",
        "prefer-const": "warn",
        "prefer-object-spread": "warn",
        "quote-props": [
            "warn",
            "as-needed"
        ]
    }
};
