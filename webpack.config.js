const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (env, argv) => {
/*     const jsEntry = argv.mode === 'production' ? 
    ['./src/classes/field.js', '@babel/polyfill'] :
    ['./src/index.js', '@babel/polyfill']; */
    const jsEntry = argv.mode === 'production' ? 
    './src/classes/field.js':
    './src/index.js';
    const cssEntry = env.template ? './src/scss/text-above.scss' : './src/scss/index.scss';
    const entry = {
        index: [jsEntry, cssEntry]
    };

    const config = {
        entry,
        output: {
            filename: argv.mode === 'production' ? 'plugin.js' : 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            new HTMLPlugin({ template: env.template ? './src/template.html' : './src/index.html' }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    { useBuiltIns: 'usage'}
                                ]
                            ]
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        argv.mode !== 'production'
                            ? 'style-loader'
                            : MiniCssExtractPlugin.loader,
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: "file-loader"
                }
            ]
        },
        devtool: 'source-map',
    };

    if (argv.mode === 'production') {
        config.target = ['web', 'es5'];
    }

    return config;
};