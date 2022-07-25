const express = require('express');
const router = express.Router();
const controller = require('../controllers/users')

router.get('/', controller.index);

router.get('/:id/editar', controller.edit);
router.put('/:id/editar', controller.update);

router.delete('/:id/excluir', controller.delete);

router.get('/adicionar', controller.add);
router.post('/adicionar', controller.create);

router.get('/:id', controller.read);

module.exports = router;
