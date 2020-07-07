const mongoose = require('mongoose');

/**
 * Arquivo de configuração do MongoDB com o Mongoose
 */

mongoose.Promise = global.Promise; // Utiliza as Promises da aplicação e não do Mongoose

mongoose.connect('mongodb://localhost/fundamento-bd', { useNewUrlParser: true });


module.exports = mongoose;
