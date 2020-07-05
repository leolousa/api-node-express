const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Utiliza as Promises da aplicação e não do Mongoose

mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true });


module.exports = mongoose;