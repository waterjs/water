const { resolve } = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'public/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'module:@water/babel-plugin',
            ],
            presets: [
              ['@babel/preset-env', { modules: false }],
            ],
          },
        },
      },
    ],
  },
};
