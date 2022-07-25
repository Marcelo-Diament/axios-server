const express = require('express');
const router = express.Router();
const usersApi = require('../api/users')

router.put('/usuarios/:id/editar/endereco', usersApi.updateAddress);

router.delete('/usuarios/:id/excluir/endereco', usersApi.deleteAddress);

router.get('/usuarios/:id/endereco', usersApi.readUserAddress);

router.put('/usuarios/:id/editar', usersApi.update);

router.delete('/usuarios/:id/excluir', usersApi.delete);

router.post('/usuarios/adicionar', usersApi.create);

router.get('/usuarios/:id', usersApi.readUser);

router.get('/usuarios', usersApi.readUsers);

module.exports = router;
