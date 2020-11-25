const Path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const common = require('./webpack.common');
module.exports = Merge.smart(common, {
  devServer: {
    compress: true,
    contentBase: Path.resolve(__dirname, 'public/'),
    open: true,
    openPage: '?wizard',
    overlay: {
      errors: true,
      warnings: true,
    },
  },
  devtool: 'inline-source-map',
  mode: 'development',
  output: {
    filename: 'bundle.min.js',
    jsonpFunction: 'dydu.bliss',
    path: Path.resolve(__dirname, 'build/'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PUBLIC_URL: JSON.stringify('./'),
       }
   })
  ],
  stats: 'errors-warnings',
});
