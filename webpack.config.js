const path = require('path');
const Copy = require('copy-webpack-plugin');
const Html = require('html-webpack-plugin');
const Unminified = require('unminified-webpack-plugin');


module.exports = environment => {

  const isProduction = environment === 'production';

  process.env.BABEL_ENV = environment;
  process.env.NODE_ENV = environment;

  return {
    bail: true,
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src/index.js'),
    mode: isProduction ? 'production' : 'development',
    module: {
      rules: [{
        include: path.resolve(__dirname, 'src/'),
        loader: 'babel-loader',
        options: {
          cacheCompression: isProduction,
          cacheDirectory: true,
          compact: isProduction,
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
          sourceMaps: false,
        },
        test: /\.js$/,
      }],
      strictExportPresence: true,
    },
    output: {
      filename: 'bundle.min.js',
      path: path.resolve(__dirname, 'build/'),
    },
    plugins: [
      new Copy([path.resolve(__dirname, 'public/')], {ignore: ['index.html']}),
      new Html({template: path.resolve(__dirname, 'public/index.html')}),
      new Unminified(),
    ],
  };
};
