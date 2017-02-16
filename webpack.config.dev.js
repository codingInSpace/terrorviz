const webpack = require('webpack');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname);

module.exports = {
	devtool: 'source-map',
	entry: [
    'webpack-dev-server/client?http://localhost:1337',
    'webpack/hot/dev-server',
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
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
		new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
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
