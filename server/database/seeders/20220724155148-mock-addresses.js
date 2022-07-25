'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Addresses', [
      {
        cep: "01001000",
        uf: "SP",
        cidade: "São Paulo",
        bairro: "Sé",
        logradouro: "Praça da Sé",
        numero: "1",
        complemento: "123-B",
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cep: "01002000",
        uf: "SP",
        cidade: "São Paulo",
        bairro: "Sé",
        logradouro: "Rua Direita",
        numero: "12",
        complemento: null,
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cep: "01003000",
        uf: "SP",
        cidade: "São Paulo",
        bairro: "Sé",
        logradouro: "Rua José Bonifácio",
        numero: "420",
        complemento: "4o andar",
        UserId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Addresses', null, {});
  }
};
