const express = require('express');
const router = express.Router();
const employeesController = require ('../controllers/employeesController');
const ROLES_LIST = require('../config/roles');
const verifyRoles = require('../../middleware/verifyRoles');

router.route( '/' ).get(employeesController.getAllemployees) // middleware that handles the GET request to /
     .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route('/:id').get(employeesController.getEmployee);

module.exports = router;