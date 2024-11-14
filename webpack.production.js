const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const configuration = require('./public/override/configuration.json');
const common = require('./webpack.common');
const GitRevision = require('git-revision-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => {
  const getCommitHash = () => {
    if (process.env.CI_COMMIT_SHORT_SHA) return process.env.CI_COMMIT_SHORT_SHA;
    return new GitRevision().commithash().substring(0, 7);
  };

  const getBranchName = () => {
    if (process.env.CHATBOX_VERSION) return process.env.CHATBOX_VERSION;
    return new GitRevision().branch();
  };

  const buildTime = Date.now();

  console.log('env.CHATBOX_VERSION', env.CHATBOX_VERSION);
  console.log('env.CHATBOX_REVISION', env.CHATBOX_REVISION);

  let ASSET = 'TIMESTAMPED_CDN_URL' + '/';

  return Merge.strategy({ plugins: 'prepend' })(common(env), {
    devtool: 'nosources-source-map',
    mode: 'production',
    output: {
      filename: 'bundle.min.js',
      chunkLoadingGlobal: 'dydu.chatbox',
      chunkFilename: `[name].${env.CHATBOX_VERSION || getBranchName().replace('/', '.')}.${
        env.CHATBOX_REVISION || getCommitHash()
      }.js`,
      path: Path.resolve(__dirname, 'build/'.concat(buildTime)), // backend will now buildtime based on the name of this directory
    },
    plugins: [
      // new WebpackBundleAnalyzer(), // uncomment this line in local to analyze bundles
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [Path.join(__dirname, 'build/**/*')],
      }),
      new Copy({
        patterns: [
          {
            from: '**/*',
            context: Path.resolve(__dirname, 'public'),
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: ['**/loader.js', '**/bundle.min.js', '**/preview.index.html', '**/index.html'],
            },
          },
          {
            from: Path.resolve(__dirname, 'public/loader.js'),
            toType: 'file',
            to: '../loader.js',
          },
          {
            from: Path.resolve(__dirname, 'public/bundle.min.js'),
            toType: 'file',
            to: '../bundle.min.js',
          },
          {
            from: Path.resolve(__dirname, 'public/preview.index.html'),
            toType: 'file',
            to: '../preview.index.html',
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
