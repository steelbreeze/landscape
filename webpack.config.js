module.exports = {
  entry: './lib/index.js',
  mode: 'production',
  output: {
    filename: 'landscape.min.js',
    library: 'landscape',
    libraryTarget: 'var'
  }
};