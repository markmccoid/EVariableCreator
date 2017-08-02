var webpack = require('webpack');
var path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
	entry: [
		'./src/app.js'],
	output: {
		path: __dirname,
		filename: './public/bundle.js'
	},
	plugins: [
		// new webpack.ProvidePlugin({
		// 	'$': 'jquery',
		// 	'jQuery': 'jquery'
		// }),
		new webpack.DefinePlugin({
	  'process.env': {
	    NODE_ENV: JSON.stringify('production')
		  }
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
	],
	resolve: {
		root: __dirname,
		modulesDirectories: [
			'node_modules',
			'./src/components',
			'./src/API'
		],
		alias: {
//			Main: 'app/components/Main.jsx',
			applicationStyles: 'src/styles/app.scss'
		},
		extensions: ['','.js','.jsx']
	},
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				query: {
					presets: ['react','es2015','stage-0']
				},
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/
			},
     	// the url-loader uses DataUrls.
      {
      	test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      // the file-loader emits files.
      {
      	test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"
      },
      {
      	test: /\.less$/, loader: "style-loader!css-loader!less-loader"
      },
      {
      	test: /\.gif$/, loader: "url-loader?mimetype=image/png"
      }
		]
	},
	sassLoader: {
		includePaths: [
			path.resolve(__dirname, './node_modules/foundation-sites/scss')
		]
	},
devtool: process.env.NODE_ENV === 'production' ? undefined : 	'cheap-module-eval-source-map'
};
