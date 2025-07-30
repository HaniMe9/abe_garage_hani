const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Route to create a new employee
router.post("/api/employee", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.createEmployee);

// Route to get all employees
router.get("/api/employees", [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], employeeController.getAllEmployees);

// Route to get a single employee by ID
router.get("/api/employee/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.getEmployeeById);

// Route to update an employee
router.put("/api/employee/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.updateEmployee);

// Route to update the recipient of an order
router.put("/api/employee/orders/:id/:updatedId", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.updateOrderRecipientEmployee);

// Route to delete an employee
router.delete("/api/employee/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.deleteEmployee);

module.exports = router;