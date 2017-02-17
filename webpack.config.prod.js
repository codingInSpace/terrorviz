const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const ROOT_PATH = path.resolve(__dirname);

module.exports = {
	devtool: '',
	entry: [
    'babel-polyfill',
    './src/index.js'
  ],
  output: {
    path: ROOT_PATH + '/public/',
    filename: 'bundle.js',
		publicPath: '/public/'
  },
	plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new Dotenv({
      path: './.env',
      safe: false
    }),
    new webpack.optimize.UglifyJsPlugin()
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /(\.scss|\.css)$/,
        exclude: /node_modules/,
				loader: 'style-loader!css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]-[local]___[hash:base64:5]!sass-loader?sourceMap'
			},
		]
  }
};
