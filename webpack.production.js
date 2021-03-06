const Path = require('path');
const { CleanWebpackPlugin: Clean  } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const configuration = require('./public/override/configuration.json');
const common = require('./webpack.common');

module.exports = (env) => {

  let ASSET = './';
  const QUALIFICATION = env[0] === 'prod' ? false : true;
  const ONPREM = env[1] && env[1] === 'onprem' ?  true : false;

  if (configuration.application.cdn && configuration.application.directory) {
    ASSET =  configuration.application.cdn + configuration.application.directory;
    if (!ONPREM) {
      ASSET += `${env[0] ? env[0] + '/' : ''}`;
    }
  }

  return Merge.strategy({plugins: 'prepend'})(common, {
    devtool: 'source-map',
    mode: 'production',
    output: {
      filename: 'bundle.min.js',
      jsonpFunction: 'dydu.bliss',
      path: Path.resolve(__dirname, 'build'),
      publicPath:  ASSET
    },
    plugins: [
      configuration.Voice && configuration.Voice.enable ? new WebpackShellPluginNext({
        onBuildStart:{
          blocking: true,
          parallel: false,
          scripts: ['npm install @dydu_ai/voice-module --no-save'],
        }
      }) : () => {},
      new Clean(),
      new Copy([Path.resolve(__dirname, 'public/')], {ignore: ['index.html', '*.json.sample', '*.css.sample']}),
      new webpack.DefinePlugin({
        'process.env': {
          PUBLIC_URL: JSON.stringify(ASSET),
          QUALIFICATION
          }
      })
    ],
    stats: 'verbose',
  });
};
