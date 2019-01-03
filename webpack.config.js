const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const path = require('path');


module.exports = environment => {

  const isDevelopment = environment === 'development';
  const isProduction = environment === 'production';

  process.env.BABEL_ENV = environment;
  process.env.NODE_ENV = environment;

  return {
    bail: true,
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src/index.js'),
    mode: isProduction ? 'production' : isDevelopment && 'development',
    module: {
      rules: [{
        oneOf: [
          {
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
          },
          {
            include: path.resolve(__dirname, 'src/'),
            use: [
              {loader: 'style-loader'},
              {loader: 'css-loader'},
              {loader: 'sass-loader'},
            ],
            test: /\.(sass|scss)$/,
          },
        ],
      }],
      strictExportPresence: true,
    },
    output: {
      filename: 'bundle.min.js',
      path: path.resolve(__dirname, 'build/'),
      pathinfo: isDevelopment,
    },
    plugins: [
      new CopyWebpackPlugin([path.resolve(__dirname, 'public/')], {ignore: ['index.html']}),
      new HtmlWebpackPlugin({template: path.resolve(__dirname, 'public/index.html')}),
      new UnminifiedWebpackPlugin(),
    ],
  };
};
