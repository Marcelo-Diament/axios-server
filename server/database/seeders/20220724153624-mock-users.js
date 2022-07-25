'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        nome: 'Fulano da Silva',
        email: 'fulanodasilva@email.com',
        senha: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Ciclano dos Santos',
        email: 'ciclanodossantos@email.com',
        senha: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Beltrano Dias',
        email: 'beltranodias@email.com',
        senha: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
