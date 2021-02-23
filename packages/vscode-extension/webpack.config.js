//@ts-check

'use strict'

const path = require('path')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    target: 'node',
    mode: 'production',

    entry: {
        extension: './src/extension.ts',
        server: './node_modules/@spyglassmc/datapack-language-server/lib/server.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]'
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
    }
}
