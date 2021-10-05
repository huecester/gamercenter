const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV !== 'production'
	? 'development'
	: 'production',

	devtool: process.env.NODE_ENV !== 'production'
	? 'eval-source-map'
	: 'source-map',

	entry: './src/client/index.js',

	plugins: [
		new webpack.DefinePlugin({
			'__VUE_OPTIONS_API__': true,
			'__VUE_PROD_DEVTOOLS__': false,
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			title: 'gamercenter',
			template: './src/client/index.html',
		}),
		new CopyPlugin({
			patterns: [
				{ from: './public', to: './static' },
			],
		}),
	],

	resolve: {
		alias: {
			vue: "vue/dist/vue.esm-bundler.js",
		},
		extensions: ['.tsx', '.ts', '.js'],
		symlinks: false,
	},

	module: {
		rules: [
			{
				test: /\.vue$/i,
				use: 'vue-loader',
			},

			{
				test: /\.(?:png|jpe?g|gif|svg)$/i,
				type: 'asset/resource'
			},

			{
				test: /\.css$/i,
				use: [
					process.env.NODE_ENV !== 'production'
					? 'style-loader'
					: MiniCssExtractPlugin.loader,
					'css-loader',
				],
			},

			{
				test: /\.sass$/i,
				use: [
					process.env.NODE_ENV !== 'production'
						? 'style-loader'
						: MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							additionalData: `
								@import "./src/client/_variables.sass"
								@import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap')
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
		filename: '[name].[contenthash].js',
		assetModuleFilename: 'images/[hash][ext][query]',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},

	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
		},
	},
};
