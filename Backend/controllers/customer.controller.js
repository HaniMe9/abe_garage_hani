const { validationResult, checkSchema } = require('express-validator');
const customerService = require('../services/customer.service');

// Validation schema for customer creation
const customerValidationSchema = checkSchema({
  customer_email: {
    isEmail: { errorMessage: 'Invalid email address' },
    notEmpty: { errorMessage: 'Email is required' }
  },
  customer_phone_number: {
    isLength: { options: { min: 10 }, errorMessage: 'must be at least 10 characters long' },
    notEmpty: { errorMessage: 'Phone number is required' }
  },
  customer_first_name: {
    notEmpty: { errorMessage: 'First name is required' }
  },
  customer_last_name: {
    notEmpty: { errorMessage: 'Last name is required' }
  }
});

// Middleware function for validation
const validateCustomer = async (req, res, next) => {
  await Promise.all(customerValidationSchema.map((validation) => validation.run(req)));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'fail', errors: errors.array() });
  }
  next();
};

// function to Create customer
const createCustomer = async (req, res) => {
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    active_customer_status,
    customer_hash
  } = req.body;

  try {
    // Check if customer already exists
    const existingCustomer = await customerService.findCustomerByEmail(customer_email);

    // Return error if customer already exists
    if (existingCustomer.length > 0) {
      return res.status(409).json({ status: "fail", message: "Customer already exists" });
    }

    // Create new customer
    await customerService.createCustomer({
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      active_customer_status,
      customer_hash
    });

    return res.status(201).json({ status: "success", message: "Customer created successfully" });
  } catch (err) {
    console.error("Error creating customer:", err.message);
    return res.status(500).json({status: "fail", message: err.message || "Failed to create customer"});
  }
};

// function to Get all customers
const getAllCustomers = async (req, res) => {
  try {
    // Fetch all customers
    const customers = await customerService.getAllCustomers();

    return res.status(200).json({ status: 'success', data: customers });
  } catch (err) {
    console.error('Error retrieving customers:', err.message);
    return res.status(500).json({status: 'fail', message: 'Failed to retrieve customers'});
  }
};

// function to Get a single customer by ID
const getCustomerById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ status: "fail", message: "invalid or missing customer ID" });
  }

  try {
    // Fetch the customer by ID
    const customer = await customerService.getCustomerById(id);

    // Check if customer exists
    if (!customer) {
      return res.status(404).json({ status: "fail", message: "The customer ID provided does not exist" });
    }

    return res.status(200).json({ status: "success", data: customer });
  } catch (err) {
    console.error("Error retrieving customer:", err.message);
    return res.status(500).json({status: "fail", message: "Failed to retrieve customer"});
  }
};

// function to Update customer information
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const {
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    active_customer_status 
  } = req.body;

  // Validate the ID
  if (!id || isNaN(id)) {
    return res.status(400).json({status: "fail", message: "invalid or missing customer ID"});
  }

  try {
    // Fetch the customer by ID
    const existingCustomer = await customerService.getCustomerById(id);

    // Check if customer exists
    if (!existingCustomer) {
      return res.status(404).json({status: "fail", message: "The customer ID provided does not exist."});
    }

    // Update customer information
    const updatedCustomer = await customerService.updateCustomer(id, {
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      active_customer_status,
    });

    return res.status(200).json({status: "success", message: "Customer updated successfully", data: updatedCustomer});
  } catch (err) {
    console.error("Error updating customer:", err.message);
    return res.status(500).json({status: "fail", message: "There was an issue updating customer."});
  }
};

// function to delete customer by ID    
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(id)) {
    return res.status(400).json({status: "fail", message: "invalid or missing customer ID"});
  }

  try {
    // Fetch the customer by ID
    const existingCustomer = await customerService.getCustomerById(id);

    // Check if customer exists
    if (!existingCustomer) {
      return res.status(404).json({status: "fail", message: "The customer ID provided does not exist."});
    }
    // Delete customer
    await customerService.deleteCustomer(id);
    
    return res.status(200).json({status: "success", message: "Customer deleted successfully"});
  } catch (err) {
    console.error("Error deleting customer:", err.message);
    return res.status(500).json({status: "fail", message: "There was an issue deleting the customer."});
  }
};

module.exports = { validateCustomer, createCustomer: [validateCustomer, createCustomer], getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };