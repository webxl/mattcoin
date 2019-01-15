const path = require('path');
const webpack = require('webpack')

// Constant with our paths
const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  JS: path.resolve(__dirname, 'frontend/js'),
};

const platformRoot = '/reqext/mc/v/0.1';

// Webpack configuration

const configuration = {

  output: {
    path: paths.DIST,
    filename: '[name].bundle.js',
    library: 'MattcoinModule',
    libraryTarget: 'umd',
    publicPath: '/'
  },
  externals: [
    (context, req, callback) => {
      if (req.startsWith('platform!')) {
        return callback(null, `commonjs ${req}`);
      }
      callback();
    }
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              //cacheDirectory: true,
             plugins: [/*'babel-plugin-styled-components',*/ 'react-hot-loader/babel']
            }
          }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};

const development = {
  entry: {
    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', path.join(paths.JS, 'main.js')] ,
    platformModule: [('webpack-hot-middleware/client?path=' + platformRoot + '/__webpack_hmr&name=platformModule&timeout=20000'), path.join(paths.JS, 'platform-module.js')]
  },
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // uncomment hot lines in frontend/js/App.js
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

const production = {
  entry: {
    main: path.join(paths.JS, 'main.js') ,
    platformModule: path.join(paths.JS, 'platform-module.js')
  },
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify('production') }
    }),
  ],
};

module.exports = (env={dev: true}) => Object.assign(
  {},
  configuration,
  env.prod ? production : development
);