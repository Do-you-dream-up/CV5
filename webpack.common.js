const Path = require('path');
const Html = require('html-webpack-plugin');


module.exports = {
  bail: true,
  entry: Path.resolve(__dirname, 'src/index.js'),
  module: {
    rules: [{
      include: Path.resolve(__dirname, 'src/'),
      loader: 'babel-loader',
      test: /\.js$/,
    }],
    strictExportPresence: true,
  },
  output: {
    filename: 'bundle.min.js',
    path: Path.resolve(__dirname, 'build/'),
  },
  performance: {
    hints: false,
  },
  plugins: [
    new Html({hash: true, template: Path.resolve(__dirname, 'public/index.html')}),
  ],
};
