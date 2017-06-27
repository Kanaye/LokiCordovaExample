const path = require('path');
module.exports = {
	entry: './www/js/index.js',
	output: {
		path: path.resolve(__dirname, 'www/dist'),
		filename: 'app.js'
	},
	node: {
		fs: 'empty'
	}
};