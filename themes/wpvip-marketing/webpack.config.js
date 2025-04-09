const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry,
    admin: './assets/scss/admin.scss',
    editor: './assets/scss/editor.scss',
    global: './assets/scss/global.scss',
  },
  output: {
    ...defaultConfig.output,
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js', // JS output (if any) goes to dist/js/
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production', // Source maps in dev only
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...defaultConfig.plugins,
    new MiniCssExtractPlugin({
      filename: 'css/[name].css', // CSS output to dist/css/
    }),
  ],
};
