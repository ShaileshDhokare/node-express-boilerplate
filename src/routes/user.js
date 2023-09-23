const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.addUser);
// router.get('/:id', userController.getKpiDetails);
// router.delete('/:id', userController.deleteKpi);

module.exports = router;
