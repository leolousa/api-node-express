const fs = require('fs');
const path = require('path');

/**
 * Exportação do Filesistem mapeando o arquivos index.js em cada pasta
 */
module.exports = app => {
  fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
    .forEach(file => require(path.resolve(__dirname, file ))(app));
}