const Path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const configuration = require('./public/override/configuration.json');
const common = require('./webpack.common');

module.exports = env => Merge.smart(common(env), {
  devServer: {
    compress: true,
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
        OIDC_CLIENT_ID: JSON.stringify(configuration.oidc.clientIdPreprod),
        OIDC_URL: JSON.stringify(configuration.oidc.preprodPorovider),
        PUBLIC_URL: JSON.stringify('./'),
        QUALIFICATION: true
       }
   })
  ],
  stats: 'errors-warnings',
});
