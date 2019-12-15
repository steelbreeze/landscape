const path = require('path');

module.exports = {
  entry: './lib/index.js',
  mode: 'production',
  output: {
    filename: 'layout.min.js',
    library: 'layout',
    libraryTarget: 'var'
  }
};