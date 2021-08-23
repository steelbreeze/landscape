const path = require('path');

module.exports = {
  entry: {
	  landscape: [ './lib/node/index.js' ],
    render: ['./lib/node/render.js']
  },
  mode: 'production',
  output: {
	path: path.resolve(__dirname, "lib/web"),
    filename: '[name].min.js',
    library: '[name]',
    libraryTarget: 'var'
  }
};