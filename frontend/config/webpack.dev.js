const path = require('path');
const { merge } = require('webpack-merge');
const { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv } = require('./dotenv');

setupDotenvFilesForEnv({ env: 'development' });
const webpackCommon = require('./webpack.common.js');

const RELATIVE_DIRNAME = process.env._ODH_RELATIVE_DIRNAME;
const IS_PROJECT_ROOT_DIR = process.env._ODH_IS_PROJECT_ROOT_DIR;
const SRC_DIR = process.env._ODH_SRC_DIR;
const COMMON_DIR = process.env._ODH_COMMON_DIR;
const DIST_DIR = process.env._ODH_DIST_DIR;
const HOST = process.env._ODH_HOST;
const PORT = process.env._ODH_PORT;
const BACKEND_PORT = process.env._BACKEND_PORT;

module.exports = merge(
  {
    plugins: [
      ...setupWebpackDotenvFilesForEnv({ directory: RELATIVE_DIRNAME, env: 'development', isRoot: IS_PROJECT_ROOT_DIR })
    ]
  },
  webpackCommon('development'),
  {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      host: HOST,
      port: PORT,
      compress: true,
      historyApiFallback: true,
      hot: true,
      open: true,
      proxy: {
        '/api': `http://0.0.0.0:${BACKEND_PORT}`,
      },
      devMiddleware: {
        stats: 'errors-only',
      },
      client: {
        overlay: false,
      },
      static: {
        directory: DIST_DIR,
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: [
            SRC_DIR,
            COMMON_DIR,
            path.resolve(RELATIVE_DIRNAME, 'node_modules/patternfly'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/patternfly'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-catalog-view-extension'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-core/dist/styles/base.css'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly'),
            path.resolve(RELATIVE_DIRNAME, 'node_modules/@patternfly/quickstarts')
          ],
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.css$/,
          include: stylesheet => stylesheet.includes('@patternfly/react-styles/css/'),
          use: ['null-loader']
        }
      ]
    }
  }
);
