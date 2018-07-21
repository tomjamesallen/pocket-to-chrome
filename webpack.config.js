const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = env => {
  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
      ],
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    entry: {
      background: ['babel-polyfill', './src/background.js'],
    },
    output: {
      filename: '[name].js',
      path: `${__dirname}/pocket-to-chrome-extension`,
    },
    plugins: [
      new Dotenv({ systemvars: true }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(env.NODE_ENV) },
      }),
    ],
  };
};
