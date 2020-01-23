const Path = require('path');
const DayJs = require('dayjs');
const GitRevision = require('git-revision-webpack-plugin');
const Html = require('html-webpack-plugin');
const { version } = require('./package');


const hash = new GitRevision().commithash();
const now = DayJs().format('YYYY-MM-DD HH:mm');


module.exports = {
  bail: true,
  entry: Path.resolve(__dirname, 'src/index.js'),
  module: {
    rules: [{
      include: Path.resolve(__dirname, 'src/'),
      loader: 'babel-loader',
      test: /\.js$/,
    }],
    strictExportPresence: true,
  },
  output: {
    filename: 'bundle.min.js',
    path: Path.resolve(__dirname, 'build/'),
  },
  performance: {
    hints: false,
  },
  plugins: [
    new Html({
      hash: true,
      template: Path.resolve(__dirname, 'public/index.html'),
      templateParameters: {hash, now, version},
    }),
  ],
};
