const Path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env) =>
  Merge.smart(common(env), {
    devServer: {
      compress: true,
      allowedHosts: 'all',
      static: {
        directory: Path.resolve(__dirname, 'public'),
      },
      open: ['/?dydupanel'],
      client: {
        overlay: {
          errors: true,
          warnings: true,
        },
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
    },
    devtool: 'inline-source-map',
    mode: 'development',
    output: {
      filename: 'bundle.min.js',
      chunkLoadingGlobal: 'dydu.chatbox',
      path: Path.resolve(__dirname, 'build/'),
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PUBLIC_URL: JSON.stringify('http://localhost:8081/'),
        },
      }),
    ],
    stats: 'errors-warnings',
  });
