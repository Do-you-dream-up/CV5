const Path = require('path');
const { CleanWebpackPlugin: Clean  } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const Merge = require('webpack-merge');
const common = require('./webpack.common');


module.exports = Merge.strategy({plugins: 'prepend'})(common, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new Clean(),
    new Copy([Path.resolve(__dirname, 'public/')], {ignore: ['index.html']}),
  ],
  stats: 'verbose',
});
