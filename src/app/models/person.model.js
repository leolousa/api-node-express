const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const PersonSchema = new mongoose.Schema({
  nomeCompleto: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: false
  },
  cpf: {
    type: Number,
    required: false
  },
  email: {
    type: String,
    unique: false,
    required: false,
    lowercase: true
  },
  dataNascimento: {
    type: Date,
    required: false
  },
  identidade: {
    type: String,
    required: false
  },
  orgEmissao: {
    type: String,
    required: false
  },
  sexo: {
    type: String
  },
  endereco: {
    type: String
  },
  complementoEndereco: {
    type: String
  },
  cep: {
    type: String
  },
  tsReg: {
    type: Date,
    default: Date.now
  }
});


const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
