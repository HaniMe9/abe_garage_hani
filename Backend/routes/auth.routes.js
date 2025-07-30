// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Customer Authentication Routes
router.post('/auth/customer/register', authController.registerCustomer);
router.post('/auth/customer/login', authController.loginCustomer);

// Employee Authentication Routes
router.post('/auth/employee/register', authController.registerEmployee);
router.post('/auth/employee/login', authController.loginEmployee);

// Token Verification Route
router.get('/auth/verify', authController.verifyToken);

// Stats routes
router.get('/admin-stats', authController.getAdminStats);
router.get('/employee-stats/:employeeId', authController.getEmployeeStats);
router.get('/customer-stats/:customerId', authController.getCustomerStats);

module.exports = router;
