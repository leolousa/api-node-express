const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  senha: {
    type: String,
    required: true,
    select: false
  },
  tokenSenhaResetada: {
    type: String,
    select: false
  },
  tempoExpiracaoReset: {
    type: Date,
    select: false
  },
  tsReg: {
    type: Date,
    default: Date.now
  }
});

// Antes de salvar
UserSchema.pre('save', async function(next){
  const senhaEncriptada = await bcrypt.hash(this.senha, 10); // 10 é o número de rounds de encriptação - Cuidado!!! Altera a performance
  this.senha = senhaEncriptada; 

  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;