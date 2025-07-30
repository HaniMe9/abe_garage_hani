const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Route for customer management
router.post('/api/add-customer', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], customerController.createCustomer);

// Route to get all customers
router.get('/api/customers', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], customerController.getAllCustomers);

// Route to get a single customer by ID 
router.get('/api/customer/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], customerController.getCustomerById);

// Route to Update customer endpoint
router.put('/api/update-customer/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], customerController.updateCustomer);

// Route to Delete customer endpoint
router.delete('/api/delete-customer/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], customerController.deleteCustomer);

module.exports = router;