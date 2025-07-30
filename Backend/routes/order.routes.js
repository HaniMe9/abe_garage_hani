const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Route to create a new order
router.post('/api/order', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.createOrder);

// Route to get all orders
router.get('/api/orders', authMiddleware.verifyToken, orderController.getAllOrders);

// Route to get orders by employee ID
router.get('/api/orders/customer/:customer_id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.getOrdersByCustomerId);

// Route to get a single order by ID
router.get('/api/order/:id', authMiddleware.verifyToken, orderController.getOrderById);

// Route to update an order
router.put('/api/order/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.updateOrder);

// Route to delete an order
router.delete('/api/order/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.deleteOrder);

// Route to delete a service to an order
router.delete('/api/order/:orderId/service/:serviceId', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.deleteService);

// Route to add an additional request to an order
router.put('/api/order/:orderId/additional-request', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.cancelAdditionalRequest);

module.exports = router;