const Path = require('path');
const webpack = require('webpack');
const Html = require('html-webpack-plugin');
const GitRevision = require('git-revision-webpack-plugin');
const Merge = require('webpack-merge');
const common = require('./webpack.common');
const DayJs = require('dayjs');
const now = DayJs().format('YYYY-MM-DD HH:mm');

const getCommitHash = () => {
  if (process.env.CI_COMMIT_SHORT_SHA) return process.env.CI_COMMIT_SHORT_SHA;
  return new GitRevision().commithash().substring(0, 7);
};

const getBranchName = () => {
  if (process.env.CHATBOX_VERSION) return process.env.CHATBOX_VERSION;
  return new GitRevision().branch();
};

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
      new Html({
        hash: true,
        template: Path.resolve(__dirname, 'public/debug.html'),
        templateParameters: { hash: getCommitHash(), now, version: getBranchName() },
      }),
    ],
    stats: 'errors-warnings',
  });
