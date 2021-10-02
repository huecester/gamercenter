const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'development',

	entry: './src/index.js',

	plugins: [
		new webpack.DefinePlugin({
			'__VUE_OPTIONS_API__': true,
			'__VUE_PROD_DEVTOOLS__': false,
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin(),
	],

	resolve: {
		alias: {
			vue: "vue/dist/vue.esm-bundler.js",
		},
		extensions: ['.tsx', '.ts', '.js'],
	},

	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader',
			},

			{
				test: /\.(?:png|jpe?g|gif)$/,
				use: 'url-loader',
			},

			{
				test: /\.sass$/,
				use: [
					process.env.NODE_ENV !== 'production'
						? 'style-loader'
						: MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							additionalData: `
								@import "./src/styles/_variables.sass"
							`,
							sassOptions: {
								indentedSyntax: true,
							},
						},
					},
				],
			},
		],
	},

	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
