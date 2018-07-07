module.exports = {
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
    path: __dirname,
  },
};
