const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const argv = require('minimist')(process.argv.slice(2));
const production = argv.mode === 'production';

module.exports = {
  output: {
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.less'],
    fallback: {
      path: require.resolve('path-browserify'),
      util: require.resolve('util-browserify'),
      process: require.resolve('process/browser'),
    },
    alias: {
      process: 'process',
    },
  },
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { name: 'index.html' },
          },
          {
            loader: 'pug-html-loader',
            options: { data: {} },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
                auto: true,
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
                auto: true,
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
                auto: true,
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
    }),
    new MiniCssExtractPlugin({ filename: 'style.css' }),
  ],
  optimization: {
    minimize: production,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          parse: {},
          compress: {},
          module: false,
          ecma: 6,
          mangle: false,
          keep_classnames: true,
          keep_fnames: false,
        },
      }),
      new CssMinimizerPlugin({
        parallel: true,
      }),
    ],
  },
  devServer: {
    contentBase: 'dist',
    compress: true,
    port: 10000,
  },
};
