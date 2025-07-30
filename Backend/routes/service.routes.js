const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Route to add a new service
router.post("/api/service", [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.addService);

// Route to get all services
router.get('/api/services', authMiddleware.verifyToken, serviceController.getAllServices);

// Route to get a single service by ID
router.get('/api/service/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], serviceController.getServiceById);

// Route to update a service
router.put('/api/service/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.updateService);

// Route to delete a service
router.delete('/api/service/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], serviceController.deleteService);

module.exports = router;
