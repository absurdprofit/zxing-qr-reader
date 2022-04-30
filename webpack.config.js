const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, args) => {
    const optimization = {
        minimize: true,
        minimizer: [new TerserPlugin()]
    };

    return {
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
            outputModule: args.mode === "development" ? false : true
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            libraryTarget: args.mode === "development" ? 'commonjs' : 'module',
            filename: args.mode === "development" ? undefined : '[name].js',
            clean: true
        },
        devtool: 'source-map',
        optimization: args.mode === "development" ? undefined : optimization
    }
};