const path = require('path');

module.exports = {
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
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '...']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'commonjs2',
        assetModuleFilename: (pathData) => {
            const { filename } = pathData;

            if (filename.endsWith('.ts')) {
                return '[name].js';
            } else {
                return '[name][ext]';
            }
        },
        clean: true
    },
    devtool: 'source-map'
};