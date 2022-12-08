const Path = require('path');
const { CleanWebpackPlugin: Clean  } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const configuration = require('./public/override/configuration.json');
const common = require('./webpack.common');

module.exports = (env) => {

  let ASSET = './';
  
  const QUALIFICATION = env.prod ? false : true;
  
  const OIDC_CLIENT_ID = !QUALIFICATION ? JSON.stringify(configuration.oidc.clientIdProd) : JSON.stringify(configuration.oidc.clientIdPreprod);
  const OIDC_URL = !QUALIFICATION ? JSON.stringify(configuration.oidc.prodPorovider) : JSON.stringify(configuration.oidc.preprodPorovider);
  
  console.log("env.CHATBOX_VERSION", env.CHATBOX_VERSION)
  console.log("env.CHATBOX_REVISION", env.CHATBOX_REVISION)

  if (env.CHATBOX_VERSION && env.CHATBOX_VERSION !== '$CHATBOX_VERSION' && env.CHATBOX_VERSION !== '') {
    ASSET = `${configuration.application.cdn}${env.CHATBOX_VERSION}/`;
    console.log(ASSET);
  }
  else {
    ASSET =  configuration.application.cdn + configuration.application.directory;
  }
  
  console.log("ASSET CDN URL", ASSET)

  return Merge.strategy({ plugins: 'prepend' })(common(env), {
    devtool: 'source-map',
    mode: 'production',
    output: {
      filename: 'bundle.min.js',
      chunkLoadingGlobal: 'dydu.chatbox',
      chunkFilename: `[name].${env.CHATBOX_VERSION || 'lts'}.${env.CHATBOX_REVISION || 'xxxxxx'}.js`,
      path: Path.resolve(__dirname, 'build'),
      publicPath: ASSET,
    },
    plugins: [
      new Clean(),
      new Copy({
        patterns: [
          {
            from: '**/*',
            context: Path.resolve(__dirname, 'public'),
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: ['**/index.html', '**/*.json.sample', '**/*.css.sample'],
            },
          },
        ],
      }),
      new webpack.DefinePlugin({
        'process.env': {
          OIDC_CLIENT_ID: OIDC_CLIENT_ID,
          OIDC_URL: OIDC_URL,
          PUBLIC_URL: JSON.stringify(ASSET),
          QUALIFICATION,
        },
      }),
    ],
    stats: 'verbose',
  });
};
