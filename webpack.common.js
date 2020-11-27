const Path = require('path');
const DayJs = require('dayjs');
const GitRevision = require('git-revision-webpack-plugin');
const Html = require('html-webpack-plugin');
const { version } = require('./package');
const hash = new GitRevision().commithash().substring(0, 7);
const now = DayJs().format('YYYY-MM-DD HH:mm');
const configuration = require('./public/override/configuration.json');

module.exports = {
  bail: true,
  entry: Path.resolve(__dirname, 'src/index.js'),
  module: {
    rules: [
      {
        include: Path.resolve(__dirname, 'src/'),
        loader: 'babel-loader',
        test: /\.js$/,
      },
      {
        loader: ['style-loader', 'css-loader'],
        test: /\.css$/,
      },
      {
        loader: 'file-loader',
        test: /\.(eot|png|svg|ttf|woff|woff2)$/,
      },
      configuration.Voice && configuration.Voice.enable ? {
        include: Path.resolve(__dirname, 'src/'),
        loader: 'string-replace-loader',
        options: {
          multiple: [
            {  flags: 'g', replace: "import Voice from '@dydu_ai/voice-module';", search: '//import-voice' },
            {  flags: 'g', replace: "<Voice DialogContext={DialogContext} configuration={configuration} Actions={Actions} show={!!Cookie.get(Cookie.names.gdpr)} t={t('input.actions.record')} />", search: '<voice/>' },
         ]
        },
        test: /\.js$/
      } : {},
    ],
    strictExportPresence: true,
  },
  performance: {
    hints: false,
  },
  plugins: [
    new Html({
      hash: true,
      template: Path.resolve(__dirname, 'public/index.html'),
      templateParameters: {hash, now, version},
    })
  ]
};
