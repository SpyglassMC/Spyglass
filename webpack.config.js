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
        client: './src/client.ts',
        server: './src/server.ts'
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
