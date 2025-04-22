const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production === true;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      'admin-js': './assets/js/admin.js',
      'editor-js': './assets/js/editor.js',
      'public-js': './assets/js/public.js',
      'admin-css': './assets/scss/admin.scss',
      'editor-css': './assets/scss/editor.scss',
      'global-css': './assets/scss/global.scss',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: ({ chunk }) => {
        if (chunk.name.endsWith('-js')) {
          return `js/${chunk.name.replace('-js', '')}.min.js`;
        }
        return '[name].js.temp';
      },
      clean: true,
    },
    devtool: isProduction ? false : 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction,
                postcssOptions: {
                  plugins: [['autoprefixer']],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: ({ chunk }) => `css/${chunk.name.replace('-css', '')}.min.css`,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'assets/fonts',
            to: 'fonts',
            noErrorOnMissing: true,
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'assets/img',
            to: 'img',
            noErrorOnMissing: true,
          },
        ],
      }),
      {
        apply: (compiler) => {
          compiler.hooks.emit.tap('RemoveCssJsFiles', (compilation) => {
            Object.keys(compilation.assets).forEach((asset) => {
              if (asset.endsWith('.js.temp')) {
                delete compilation.assets[asset];
              }
            });
          });
        },
      },
    ],
    performance: {
      hints: isProduction ? 'warning' : false,
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  };
};
