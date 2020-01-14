const path = require('path');

module.exports = {
  entry: './lib/index.js',
  mode: 'production',
  output: {
	path: path.resolve(__dirname, "docs/dist"),
    filename: 'landscape.min.js',
    library: 'landscape',
    libraryTarget: 'var'
  }
};