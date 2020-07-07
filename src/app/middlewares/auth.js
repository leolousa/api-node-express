const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json')

// Middleware para verificar o Token de autenticação
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificações simples para saber se o token é válido - Mais performance
  if(!authHeader) {
    return res.status(401).send({ error: 'Nenhum Token fornecido!' });
  }

  const parts = authHeader.split(' ');

  if(!parts.lenght === 2) {
    return res.status(401).send({ error: 'Erro no Token!' });
  }

  const [ scheme, token ] = parts;

  if(!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformado!' });
  }

  // Verificação final - mais pesada e menos performance
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if(err) {
      return res.status(401).send({ error: 'Token inválido!' });
    }

    req.userId = decoded.id;

    return next();

  });

};