const Path = require('path');
const DayJs = require('dayjs');
const GitRevision = require('git-revision-webpack-plugin');
const Eslint = require('eslint-webpack-plugin');
const Html = require('html-webpack-plugin');
const now = DayJs().format('YYYY-MM-DD HH:mm');
const DYDU_MODULES = require('./dydu-module/ModuleList');

const getCommitHash = () => {
  if (process.env.CI_COMMIT_SHORT_SHA) return process.env.CI_COMMIT_SHORT_SHA;
  return new GitRevision().commithash().substring(0, 7);
};

const getBranchName = () => {
  if (process.env.CHATBOX_VERSION) return process.env.CHATBOX_VERSION;
  return new GitRevision().branch();
};

const COMMON_RULE_LIST = [
  {
    include: Path.resolve(__dirname, 'src/'),
    use: ['babel-loader'],
    test: /\.(js|jsx|tsx|ts)$/,
  },
  {
    use: ['css-loader'],
    test: /\.css$/,
  },
  {
    type: 'asset/resource',
    test: /\.(eot|png|svg|ttf|woff|woff2)$/,
  },
];

const COMMON_PLUGIN_LIST = [
  new Eslint(),
  new Html({
    template: Path.resolve(__dirname, 'public/index.html'),
    templateParameters: { hash: getCommitHash(), now, version: getBranchName() },
    filename: '../index.html',
  }),
];

const getRuleList = (env) => COMMON_RULE_LIST.concat(DYDU_MODULES.getRules(env));

const getPluginList = (env) => COMMON_PLUGIN_LIST.concat(DYDU_MODULES.getPlugins(env));

module.exports = (env = {}) => {
  return {
    bail: true,
    entry: Path.resolve(__dirname, 'src/index.tsx'),
    module: {
      rules: getRuleList(env),
      strictExportPresence: true,
    },
    performance: {
      hints: false,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.css'],
      modules: [Path.resolve('./node_modules'), Path.resolve('./')],
    },
    plugins: getPluginList(env),
  };
};
