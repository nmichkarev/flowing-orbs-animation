const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
    const entry = argv.mode === 'production' ? 
        ['./src/classes/field.js', '@babel/polyfill'] :
        ['./src/index.js', '@babel/polyfill'];

    return {
        entry,
        output: {
            filename: argv.mode === 'production' ? 'plugin.js' : 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            new HTMLPlugin({ template: env.template ? './src/template.html' : './src/index.html' })
        ],
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                    ],
                }
            ]
        },
        devtool: 'source-map'
    };
};