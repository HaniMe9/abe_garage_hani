const orderService = require("../services/order.service");

// function to Create a new order
const createOrder = async (req, res) => {
  const {
    employee_id,
    customer_id,
    vehicle_id,
    service_ids,
    additional_request,
    additional_requests_completed,
    active_order,
    order_hash,
    order_status,
    order_total_price,
    service_completed,
  } = req.body;

  try {
    // Create order in the database
    const newOrder = await orderService.createOrder({
      employee_id,
      customer_id,
      vehicle_id,
      service_ids,
      additional_request,
      additional_requests_completed,
      active_order,
      order_hash,
      order_status,
      order_total_price,
      service_completed,
    });

    return res.status(201).json({status: "success", message: "Order created successfully", data: newOrder});
  } catch (error) {
    console.error("Error creating order:", error.message);
    return res.status(500).json({status: "fail", message: "There was an issue creating the order."});
  }
};

// function to Get all orders
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and their details
    const orders = await orderService.getAllOrders();

    return res.status(200).json({status: 'success', data: orders});
  } catch (error) {
    console.error('Error retrieving orders:', error.message);
    return res.status(500).json({status: 'fail', message: 'There was an issue retrieving the orders.'});
  }
};

// function to Get all orders for a specific customer
const getOrdersByCustomerId = async (req, res) => {
  const { customer_id } = req.params;

  try {
    // Validate customer ID
    if (!customer_id || isNaN(customer_id)) {
      return res.status(400).json({status: "fail", message: "invalid or missing customer ID."});
    }

    // Fetch orders for the customer
    const orders = await orderService.getOrdersByCustomerId(customer_id);

    return res.status(200).json({status: "success", data: orders});
  } catch (error) {
    console.error("Error retrieving orders for customer:", error.message);
    return res.status(500).json({status: "fail", message: "error retrieving orders for customer."});
  }
};

// function to Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate order ID
    if (!id || isNaN(id)) {
      return res.status(400).json({status: "fail", message: "invalid or missing order ID."});
    }

    // Fetch the order by ID
    const order = await orderService.getOrderById(id);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({status: "fail", message: "The order ID provided does not exist."});
    }

    return res.status(200).json({status: "success", data: order});
  } catch (error) {
    console.error("Error retrieving order:", error.message);
    return res.status(500).json({status: "fail", message: "There was an issue retrieving the order."});
  }
};

// function to get order by employee id
const getOrdersByEmployeeId = async (req, res) => {
  const { employee_id } = req.params;

  try {
    // Validate employee ID
    if (!employee_id || isNaN(employee_id)) {
      return res.status(400).json({status: "fail", message: "invalid or missing employee ID."});
    }

    // Fetch orders for the employee
    const orders = await orderService.getOrdersByEmployeeId(employee_id);

    return res.status(200).json({status: "success", data: orders});
  } catch (error) { 
    console.error("Error retrieving orders for employee:", error.message);
    return res.status(500).json({status: "fail", message: "error retrieving the orders for the employee."});
  }
};

// function to Update order by ID
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      order_id,
      services,
      additional_request,
      additional_requests_completed,
      order_status,
      active_order,
      completion_date,
      order_total_price,
      notes_for_internal_use,
      notes_for_customer,
    } = req.body;

    // Validate ID and required fields
    if (!id || isNaN(id)) {
      return res.status(400).json({status: "fail", message: "invalid or missing order ID."});
    }
    
    // Validate that the order exists
    const orderExists = await orderService.getOrderById(id);
    if (!orderExists) {
      return res.status(404).json({status: "fail", message: "The order ID provided does not exist."});
    }

    // Update order in the database
    const updatedOrder = await orderService.updateOrder({
      id,
      order_id,
      additional_request,
      additional_requests_completed,
      order_status,
      active_order,
      completion_date,
      order_total_price,
      notes_for_internal_use,
      notes_for_customer,
      services
  });

    // Check for successful update
    if (!updatedOrder) {
      return res.status(500).json({status: "fail", message: "There was an issue updating the order."});
    }

    return res.status(200).json({status: "success", message: "Order updated successfully.", data: updatedOrder});
  } catch (error) {
    console.error("Error updating order:", error.message);
    return res.status(500).json({status: "fail", message: "There was an issue updating the order."});
  }
};

// function to Delete order by ID
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate order ID
    if (!id || isNaN(id)) {
      return res.status(400).json({status: "fail", message: "invalid or missing order ID."});
    }

    // Validate that the order exists
    const orderExists = await orderService.getOrderById(id);
    if (!orderExists) {
      return res.status(404).json({status: "fail", message: "The order ID provided does not exist."});
    }

    // Delete the order
    await orderService.deleteOrder(id);

    return res.status(200).json({status: "success", message: "Order deleted successfully."});
  } catch (error) {
    console.error("Error deleting order:", error.message);
    return res.status(500).json({status: "fail", message: "There was an issue deleting the order."});
  }
};

// function to delete service from an order
const deleteService = async (req, res) => {
  const { orderId, serviceId } = req.params;

  // Validate order ID
  if (!orderId || isNaN(orderId)) {
    return res.status(400).json({status: "fail", message: "The order ID provided is invalid or missing."});
  }

  // Validate that the order exists
  const orderExists = await orderService.getOrderById(orderId);
  if (!orderExists) {
    return res.status(404).json({status: "fail", message: "The order ID provided does not exist."});
  }

  try {
    // Delete the service
    const result = await orderService.deleteService(orderId, serviceId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteServiceController:", error);
    res.status(500).json({ message: error.message || "Failed to delete service." });
  }
};

// function to cancel additional request for an order
const cancelAdditionalRequest = async (req, res) => {
    const { orderId } = req.params;
    const { additional_request, additional_requests_completed } = req.body;

    try {
        // Validate order ID
        if (!orderId || isNaN(orderId)) {
            return res.status(400).json({status: "fail", message: "The order ID provided is invalid or missing."});
        }

        // Validate that the order exists
        const orderExists = await orderService.getOrderById(orderId); 
        if (!orderExists) {
            return res.status(404).json({status: "fail", message: "The order ID provided does not exist."});
        }

        // Cancel the additional request  
        const result = await orderService.cancelAdditionalRequest(orderId, additional_request, additional_requests_completed);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in canceling additional request:", error);
        res.status(500).json({ message: error.message || "Failed to cancel additional request." });
    }
};

module.exports = {createOrder, getAllOrders, getOrderById, getOrdersByEmployeeId, updateOrder, deleteOrder, getOrdersByCustomerId, deleteService, cancelAdditionalRequest};
