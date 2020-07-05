const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

/**
 * Controller de Clientes - Deve ser autenticado
 */

//Middleware para proteger a rota
router.use(authMiddleware);

router.get('/', (req, res) => {
  res.send({ ok: true, userId: req.userId });
});

// Pra quem quiser saber como colocar apenas em rotas específicas, basta fazer isso:
// Coloca o authMiddleware antes do (req, res) => { }
//router.get('/', authMiddleware, (req, res) => {
//    res.send({ ok: true })
//})


module.exports = app => app.use('/clients', router);
