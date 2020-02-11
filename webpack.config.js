const path = require('path');

module.exports = {
  entry: {
	  landscape: [ './lib/index.js' ],
	  render: [ './lib/render.js' ]
  },
  mode: 'production',
  output: {
	path: path.resolve(__dirname, "docs/dist"),
    filename: '[name].min.js',
    library: '[name]',
    libraryTarget: 'var'
  }
};