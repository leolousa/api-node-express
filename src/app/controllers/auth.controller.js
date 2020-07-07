const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

const authConfig = require('../../config/auth.json');

const User = require('../models/user.model');

const router = express.Router();

// Função que gera o Token
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400 // Tempo de expiração do token - 1 dia
  })
}

// Rota de registro do usuário
router.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    if(await User.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já existe!' })
    }

    const user = await User.create(req.body);

    user.senha = undefined;

    return res.send({
      user, 
      token: generateToken({ id: user.id })
    });

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

  res.send({
    user,
    token: generateToken({ id: user.id })
  });
});

// Rota de recuperação de senha
router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if(!user) {
      return res.status(400).send({ erros: 'Usuário não encontrado!' })
    }

    const token = crypto.randomBytes(20).toString('hex'); // Geramos esta string para a recuperação de senha apenas.
    const now = new Date();
    now.setHours(now.getHours() + 1); //Dá um tempo de expiração de 1 hora

    await User.findByIdAndUpdate(user.id, {
      '$set' : {
        tokenSenhaResetada: token,
        tempoExpiracaoReset: now
      }
    });

    // Envia o email
    mailer.sendMail({
      to: email,
      from: 'noreply@clinicafundamento.com.br',
      template: 'forgot_password',
      context: { token }
    }, (err) => {
      if(err) {
        console.log(err);
        return res.status(400).send({ erros: 'Não foi possível enviar o e-mail de recuperação de senha!'})

      }
      return res.send();
    })

    //console.log(token, now);

  } catch(err) {
    res.status(400).send({ error: 'Erro ao recuperar senha, tente novamente!' });
  }
});


// Rota para resetar a senha
router.post('/reset_password', async (req, res) => {
  const { email, token, senha } = req.body;

  try {
    const user = await User.findOne({ email })
    .select('+tokenSenhaResetada tempoExpiracaoReset');

    if(!user) {
      return res.status(400).send({ erros: 'Usuário não encontrado!' })
    }

    if(token !== user.tokenSenhaResetada) {
      return res.status(400).send({ error: 'Token inválido!' });
    }

    const now = new Date();

    if(now > user.tempoExpiracaoReset) {
      return res.status(400).send({ error: 'O Token expirou! É necessário gerar outro token' });
    }

    user.senha = senha;

    await user.save();

    res.send();

  } catch (err) {
    res.status(400).send({ error: 'Não podemos resetar sua senha! Tente novamente.' });
  }
});


module.exports = (app) => app.use('/auth', router)
