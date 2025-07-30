const authService = require('../services/auth.service');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Customer Registration
async function registerCustomer(req, res) {
  try {
    const customerData = req.body;

    if (!customerData.customer_email || !customerData.customer_password || !customerData.customer_first_name || !customerData.customer_last_name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, password, first name, last name"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(customerData.customer_password, salt);

    const customerWithHash = {
      ...customerData,
      customer_password: hashedPassword,
      customer_hash: `customer_${Date.now()}`,
      active_customer_status: true
    };

    const result = await authService.registerCustomer(customerWithHash);

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: {
        customer_id: result.customer_id,
        customer_email: result.customer_email,
        customer_first_name: result.customer_first_name,
        customer_last_name: result.customer_last_name
      }
    });
  } catch (error) {
    console.error("Customer registration error:", error);

    if (error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        message: "Customer with this email already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to register customer",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Customer Login
async function loginCustomer(req, res) {
  try {
    const { customer_email, customer_password } = req.body;

    if (!customer_email || !customer_password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const result = await authService.loginCustomer(customer_email, customer_password);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message
      });
    }

    const payload = {
      customer_id: result.customer.customer_id,
      customer_email: result.customer.customer_email,
      customer_first_name: result.customer.customer_first_name,
      customer_last_name: result.customer.customer_last_name,
      user_type: 'customer'
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

    res.status(200).json({
      success: true,
      message: "Customer logged in successfully",
      data: {
        token,
        customer: {
          customer_id: result.customer.customer_id,
          customer_email: result.customer.customer_email,
          customer_first_name: result.customer.customer_first_name,
          customer_last_name: result.customer.customer_last_name
        }
      }
    });
  } catch (error) {
    console.error("Customer login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login customer"
    });
  }
}

// Employee Registration
async function registerEmployee(req, res) {
  try {
    const employeeData = req.body;

    if (!employeeData.employee_email || !employeeData.employee_password || !employeeData.employee_first_name || !employeeData.employee_last_name || !employeeData.company_role_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, password, first name, last name, role"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employeeData.employee_password, salt);

    const employeeWithHash = {
      ...employeeData,
      employee_password: hashedPassword,
      active_employee: true
    };

    const result = await authService.registerEmployee(employeeWithHash);

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        employee_id: result.employee_id,
        employee_email: result.employee_email,
        employee_first_name: result.employee_first_name,
        employee_last_name: result.employee_last_name,
        company_role_id: result.company_role_id
      }
    });
  } catch (error) {
    console.error("Employee registration error:", error);

    if (error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to register employee",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Employee Login
async function loginEmployee(req, res) {
  try {
    const { employee_email, employee_password } = req.body;

    if (!employee_email || !employee_password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const result = await authService.loginEmployee(employee_email, employee_password);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message
      });
    }

    const payload = {
      employee_id: result.employee.employee_id,
      employee_email: result.employee.employee_email,
      employee_first_name: result.employee.employee_first_name,
      employee_last_name: result.employee.employee_last_name,
      company_role_id: result.employee.company_role_id,
      user_type: 'employee'
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

    res.status(200).json({
      success: true,
      message: "Employee logged in successfully",
      data: {
        token,
        employee: {
          employee_id: result.employee.employee_id,
          employee_email: result.employee.employee_email,
          employee_first_name: result.employee.employee_first_name,
          employee_last_name: result.employee.employee_last_name,
          company_role_id: result.employee.company_role_id,
          role_name: result.employee.role_name
        }
      }
    });
  } catch (error) {
    console.error("Employee login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login employee"
    });
  }
}

// Verify Token
async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, jwtSecret);

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: decoded
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
}

async function getAdminStats(req, res) {
  try {
    const stats = await authService.getAdminStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getEmployeeStats(req, res) {
  try {
    const { employeeId } = req.params;
    const stats = await authService.getEmployeeStats(employeeId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCustomerStats(req, res) {
  try {
    const { customerId } = req.params;
    const stats = await authService.getCustomerStats(customerId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  registerCustomer,
  loginCustomer,
  registerEmployee,
  loginEmployee,
  verifyToken,
  getAdminStats,
  getEmployeeStats,
  getCustomerStats
};
