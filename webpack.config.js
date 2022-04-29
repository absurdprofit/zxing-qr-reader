const path = require('path');

module.exports = [
    {
        mode: 'development',
        entry: {
            index: path.resolve(__dirname, 'src', 'index.ts'),
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: [
                        /node_modules/,
                        /examples/
                    ]
                },
                {
                    test: /\.wasm$/,
                    type: 'asset/inline'
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '...']
        },
        experiments: {
            outputModule: true
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            libraryTarget: 'module',
            filename: '[name].js',
            clean: true
        },
        devtool: 'source-map'
    }
];