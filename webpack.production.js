const Path = require('path');
const { CleanWebpackPlugin: Clean  } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env) =>  Merge.strategy({plugins: 'prepend'})(common, {
  devtool: 'source-map',
  mode: 'production',
  output: {
    filename: 'bundle.min.js',
    jsonpFunction: 'dydu.bliss',
    path: Path.resolve(__dirname, 'build'),
    publicPath: env.ASSET_PATH || './'
  },
  plugins: [
    new Clean(),
    new Copy([Path.resolve(__dirname, 'public/')], {ignore: ['index.html']}),
    new webpack.DefinePlugin({
      'process.env': {
        PUBLIC_URL: JSON.stringify(env.ASSET_PATH || './'),
        }
    })
  ],
  stats: 'verbose',
});
