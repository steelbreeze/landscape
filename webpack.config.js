const path = require('path');

module.exports = {
  entry: './lib/index.js',
  mode: 'production',
  output: {
    filename: 'heatmap.min.js',
    library: 'heatmap',
    libraryTarget: 'var'
  }
};