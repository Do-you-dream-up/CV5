const Path = require('path');
const DayJs = require('dayjs');
const GitRevision = require('git-revision-webpack-plugin');
const Eslint = require('eslint-webpack-plugin');
const Html = require('html-webpack-plugin');
const { version } = require('./package');
const now = DayJs().format('YYYY-MM-DD HH:mm');
const configuration = require('./public/override/configuration.json');

function getCommitHash() {
  if (process.env.CI_COMMIT_SHORT_SHA)
    return process.env.CI_COMMIT_SHORT_SHA;
  return new GitRevision().commithash().substring(0, 7);
}

module.exports = {
  bail: true,
  entry: Path.resolve(__dirname, 'src/index.js'),
  module: {
    rules: [
      {
        include: Path.resolve(__dirname, 'src/'),
        use: ["babel-loader"],
        test: /\.js$/,
      },
      {
        use: ["style-loader", "css-loader"],
        test: /\.css$/,
      },
      {
        type: "asset/resource",
        test: /\.(eot|png|svg|ttf|woff|woff2)$/,
      },
      configuration.Voice && configuration.Voice.enable ? {
        include: Path.resolve(__dirname, 'src/'),
        use: ["string-replace-loader"],
        options: {
          multiple: [
            {  flags: 'g', replace: "import Voice from '@dydu_ai/voice-module';", search: '//import-voice' },
            {  flags: 'g', replace: "<Voice DialogContext={DialogContext} configuration={configuration} Actions={Actions} show={!!Local.get(Local.names.gdpr)} t={t('input.actions.record')} />", search: '<voice/>' },
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
    new Eslint(),
    new Html({
      hash: true,
      template: Path.resolve(__dirname, 'public/index.html'),
      templateParameters: {hash: getCommitHash(), now, version},
    })
  ]
};
