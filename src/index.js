const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // Para que a API entende que as requisições serão no formato JSON
app.use(bodyParser.urlencoded({ extended: false })); //Para que a API entenda quando pasarmos parâmetros via URL

// require('./app/controllers/auth.controller')(app);
// require('./app/controllers/client.controller')(app);
// Importamos apenas o Index.js da pasta controllers
// e todos os controllers que criarmos são importados automaticamente
require('./app/controllers/index')(app);

app.listen(3000); //Porta da API
console.log("Servidor rodando...");