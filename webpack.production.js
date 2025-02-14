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

  // regarding "https://cdn.doyoudreamup.com/chatbox/",
  // this value must not come from configuration.json as it must not be changed
  // it is used 'as is' to deploy preview chatbox on the CDN (used by channels)
  // and replaced also at publish time by backend by for example
  // https://cdn.doyoudreamup.com/dydubox/configurations/preprod/dd3f55a4-c47e-4c2e-a175-a44d1998b924/7f000101-9229-157f-8192-29764abf0000/
  let ASSET = 'https://cdn.doyoudreamup.com/chatbox/' + `${env.CHATBOX_VERSION}/` + buildTime;

  console.log('env.CHATBOX_VERSION', env.CHATBOX_VERSION);
  console.log('env.CHATBOX_REVISION', env.CHATBOX_REVISION);

  return Merge.strategy({ plugins: 'prepend' })(common(env), {
    devtool: 'nosources-source-map',
    mode: 'production',
    output: {
      filename: 'bundle.min.js',
      chunkLoadingGlobal: 'dydu.chatbox',
      chunkFilename: `[name].${env.CHATBOX_VERSION || getBranchName().replace('/', '.')}.${
        env.CHATBOX_REVISION || getCommitHash()
      }.js`,
      path: Path.resolve(__dirname, 'build/'.concat(buildTime)), // backend will know buildtime based on the name of this directory
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
              ignore: [
                '**/loader.js',
                '**/bundle.min.js',
                '**/index.html',
                '**/iframe.html',
                '**/iframe.debug.html',
                '**/debug.html',
              ],
            },
          },
          {
            from: Path.resolve(__dirname, 'public/loader.js'),
            toType: 'file',
            to: '../loader.js',
            transform: (buffer) => {
              return buffer.toString().replace('TIMESTAMPED_CDN_URL', ASSET);
            },
          },
          {
            from: Path.resolve(__dirname, 'public/bundle.min.js'),
            toType: 'file',
            to: '../bundle.min.js',
            transform: (buffer) => {
              return buffer.toString().replace('TIMESTAMPED_CDN_URL', ASSET);
            },
          },
          {
            from: Path.resolve(__dirname, 'public/iframe.html'),
            toType: 'file',
            to: '../iframe.html',
          },
        ],
      }),
      new webpack.DefinePlugin({
        'process.env': {
          PUBLIC_URL: JSON.stringify(ASSET + '/'),
        },
      }),
    ],
    stats: 'verbose',
  });
};
