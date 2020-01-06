const Path = require('path');
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
  stats: 'errors-warnings',
});
