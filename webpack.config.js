const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  	entry: {
		index: './src/index.js', // Your main JavaScript file
		upload_page: './src/upload_page.js',
		view_documents_page: './src/view_documents_page.js',
		edit_document_page: './src/edit_document_page.js',
		register_profile_page: './src/register_profile_page.js',
		user_home_page: './src/user_home_page.js'
	},
	output: {
		filename: '[name].bundle.js', // The name of your bundled JavaScript file
		path: path.resolve(__dirname, 'dist'), // Output directory
		publicPath: '/', // Important for serving static assets
	},
	mode: 'development', // Or 'production' for a production build
	devtool: 'inline-source-map', // Optional: for easier debugging in development
	devServer: {
		static: './dist', // Serve static files from the 'dist' directory
		port: 8080, // Choose a port for the development server
		open: true, // Automatically open the browser
		hot: true, // Enable hot module replacement (if needed for your setup)
		historyApiFallback: true, // Useful if you have client-side routing (even in plain JS)
	},
	module: {
		rules: [
		// You might add rules here for CSS or assets if you have them
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader'],
		},
		{
			test: /\.(png|svg|jpg|jpeg|gif)$/i,
			type: 'asset/resource',
		},
		{
			test: /\.(woff|woff2|eot|ttf|otf)$/i,
			type: 'asset/resource',
		},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/register_profile_page.html', // Your base HTML file
			filename: 'register_profile_page.html', // Output HTML filename
			chunks: ['register_profile_page'],
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html', // Your base HTML file
			filename: 'index.html', // Output HTML filename
			chunks: ['index'],
		}),
		new HtmlWebpackPlugin({
			template: './src/user_home_page.html',
			filename: 'user_home_page.html',
			chunks: ['user_home_page'], // Load only user_home_page.js
		}),
		new HtmlWebpackPlugin({
			template: './src/upload_page.html',
			filename: 'upload_page.html',
			chunks: ['upload_page'], // Load only upload_page.js
		}),
		new HtmlWebpackPlugin({
			template: './src/view_documents_page.html',
			filename: 'view_documents_page.html',
			chunks: ['view_documents_page'], // Load only upload_page.js
		}),
		new HtmlWebpackPlugin({
			template: './src/edit_document_page.html',
			filename: 'edit_document_page.html',
			chunks: ['edit_document_page'], // Load only upload_page.js
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: 'public', to: '.' }]
		})
	],
};