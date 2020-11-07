'use strict'

const path = require('path')
const CircularDependencyPlugin = require('circular-dependency-plugin')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    target: 'node',
    mode: 'production',

    entry: {
        main: './src/server.ts'
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode'
    },
    resolve: {
        extensions: ['.ts', '.js', 'json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /node_modules/,
            // include specific files based on a RegExp
            include: /src/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // allow import cycles that include an asyncronous import,
            // e.g. via import(/* webpackMode: "weak" */ './file.js')
            allowAsyncCycles: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        })
    ]
}
