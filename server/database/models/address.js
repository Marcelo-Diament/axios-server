'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: 'UserId',
        as: 'endereco'
      })
    }
  }
  Address.init({
    cep: DataTypes.STRING(8),
    uf: DataTypes.STRING,
    cidade: DataTypes.STRING,
    bairro: DataTypes.STRING,
    logradouro: DataTypes.STRING,
    numero: DataTypes.STRING,
    complemento: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Address',
  });
  return Address;
};