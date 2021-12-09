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
  const QUALIFICATION = env.prod ? false : true;
  const ONPREM = env.onprem ?  true : false;
  const OIDC_CLIENT_ID = !QUALIFICATION ? JSON.stringify(configuration.oidc.clientIdProd) : JSON.stringify(configuration.oidc.clientIdPreprod);
  const OIDC_URL = !QUALIFICATION ? JSON.stringify(configuration.oidc.prodPorovider) : JSON.stringify(configuration.oidc.preprodPorovider);
  if (process.env.ASSET_FULL_URL) {
    ASSET = process.env.ASSET_FULL_URL + '/';
    console.log(ASSET);
  }
  else if (env[2]) {
    ASSET = env[2] +  env.prod ? 'prod' : 'preprod' + '/';
    console.log(ASSET);
  }
  else if (configuration.application.cdn && configuration.application.directory) {
    ASSET =  configuration.application.cdn + configuration.application.directory;
    if (!ONPREM ) {
      ASSET += env.prod ? 'prod' : 'preprod' + '/';
    }
  }

  return Merge.strategy({plugins: 'prepend'})(common, {
    devtool: 'source-map',
    mode: 'production',
    output: {
      filename: 'bundle.min.js',
      chunkLoadingGlobal: 'dydu.bliss',
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
      new Copy(
          {
            patterns: [
              {
                from: "**/*",
                context: Path.resolve(__dirname, "public"),
                globOptions: {
                  dot: true,
                  gitignore: true,
                  ignore: ["**/index.html", "**/*.json.sample", "**/*.css.sample"],
                },
              },
            ],
          }
      ),
      new webpack.DefinePlugin({
        'process.env': {
          OIDC_CLIENT_ID: OIDC_CLIENT_ID,
          OIDC_URL: OIDC_URL,
          PUBLIC_URL: JSON.stringify(ASSET),
          QUALIFICATION
        }
      })
    ],
    stats: 'verbose',
  });
};
