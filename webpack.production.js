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

  if (process?.env?.ASSET_FULL_URL) {
    ASSET = process.env.ASSET_FULL_URL + '/';
    console.log(ASSET);
  }
  else if (env[2]) {
    ASSET = env[2] +  env[0] + '/';
    console.log(ASSET);
  }
  else if (configuration.application.cdn && configuration.application.directory) {
    ASSET =  configuration.application.cdn + configuration.application.directory;
    if (!ONPREM ) {
      ASSET += env[0] + '/';
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
          OIDC_URL: JSON.stringify(configuration.oidc.prodPorovider),
          PUBLIC_URL: JSON.stringify(ASSET),
          QUALIFICATION
          }
      })
    ],
    stats: 'verbose',
  });
};
