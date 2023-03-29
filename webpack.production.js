const Path = require('path');
const { CleanWebpackPlugin: Clean } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const configuration = require('./public/override/configuration.json');
const common = require('./webpack.common');
const GitRevision = require('git-revision-webpack-plugin');

module.exports = (env) => {
  const getCommitHash = () => {
    if (process.env.CI_COMMIT_SHORT_SHA) return process.env.CI_COMMIT_SHORT_SHA;
    return new GitRevision().commithash().substring(0, 7);
  };

  const getBranchName = () => {
    if (process.env.CHATBOX_VERSION) return process.env.CHATBOX_VERSION;
    return new GitRevision().branch();
  };

  let ASSET = './';

  console.log('env.CHATBOX_VERSION', env.CHATBOX_VERSION);
  console.log('env.CHATBOX_REVISION', env.CHATBOX_REVISION);

  if (env.CHATBOX_VERSION && env.CHATBOX_VERSION !== '$CHATBOX_VERSION' && env.CHATBOX_VERSION !== '') {
    ASSET = `${configuration.application.cdn}${env.CHATBOX_VERSION}/`;
    console.log(ASSET);
  } else {
    ASSET = configuration.application.cdn + '/' + configuration.application.directory;
  }

  console.log('ASSET CDN URL', ASSET);

  return Merge.strategy({ plugins: 'prepend' })(common(env), {
    devtool: 'source-map',
    mode: 'production',
    output: {
      filename: 'bundle.min.js',
      chunkLoadingGlobal: 'dydu.chatbox',
      chunkFilename: `[name].${env.CHATBOX_VERSION || getBranchName().replace('/', '.')}.${
        env.CHATBOX_REVISION || getCommitHash()
      }.js`,
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
          PUBLIC_URL: JSON.stringify(ASSET),
        },
      }),
    ],
    stats: 'verbose',
  });
};
