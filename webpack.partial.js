const { TranslationsJsonFilesPlugin } = require('./addTranslationsAssets');
const path = require('path');

module.exports = {
  plugins: [
    new TranslationsJsonFilesPlugin({
      contextPath: path.join(__dirname, 'src')
    })
  ]
};
