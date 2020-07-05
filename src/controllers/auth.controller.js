const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

const User = require('../models/user.model');

const router = express.Router();

// Rota de registro do usuário
router.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    if(await User.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já existe!' })
    }

    const user = await User.create(req.body);
    user.senha = undefined;

    return res.send({ user });
  } catch (err) {
    return res.status(400).send({ error: 'Falha no registro do usuário!' });
  }
});

// Rota de autenticação com JWT
router.post('/authenticate', async (req, res) => {
  const { email, senha } = req.body;

  const user= await User.findOne({ email }).select('+senha');

  if(!user) {
    return res.status(400).send({ erros: 'Usuário não encontrado!' })
  }

  if(!await bcrypt.compare(senha, user.senha)) {
    return res.status(400).send({ erros: 'Senha inválida!' }) 
  }

  user.senha = undefined;

  const token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 86400 // Tempo de expiração do token - 1 dia
  })


  res.send({ user, token });
});





module.exports = (app) => app.use('/auth', router)

