const db = require("../config/db.config");
const bcrypt = require("bcrypt");

// Customer Registration Service
async function registerCustomer(customerData) {
  try {
    // Check if customer already exists
    const existingCustomer = await db.query(
      "SELECT customer_id FROM customer_identifier WHERE customer_email = ?",
      [customerData.customer_email]
    );

    if (existingCustomer.length > 0) {
      throw new Error("Customer with this email already exists");
    }

    // Insert into customer_identifier table
    const result = await db.query(
      `INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash, customer_password)
       VALUES (?, ?, ?, ?)`,
      [
        customerData.customer_email,
        customerData.customer_phone_number || null,
        customerData.customer_hash,
        customerData.customer_password
      ]
    );

    if (!result.insertId) {
      throw new Error("Failed to create customer");
    }

    const customer_id = result.insertId;

    // Insert into customer_info table
    await db.query(
      `INSERT INTO customer_info (customer_id, customer_username, customer_first_name, customer_last_name, active_customer_status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer_id,
        customerData.customer_username || `${customerData.customer_first_name}_${customerData.customer_last_name}`,
        customerData.customer_first_name,
        customerData.customer_last_name,
        customerData.active_customer_status
      ]
    );

    // Return the created customer data
    return {
      customer_id,
      customer_email: customerData.customer_email,
      customer_first_name: customerData.customer_first_name,
      customer_last_name: customerData.customer_last_name
    };
  } catch (error) {
    console.error("Error in registerCustomer:", error);
    throw error;
  }
}

// Customer Login Service
async function loginCustomer(email, password) {
  try {
    // Get customer with password
    const customers = await db.query(
      `SELECT 
        ci.customer_id,
        ci.customer_first_name,
        ci.customer_last_name,
        ci.active_customer_status,
        cid.customer_email,
        cid.customer_password
       FROM customer_info ci
       INNER JOIN customer_identifier cid ON ci.customer_id = cid.customer_id
       WHERE cid.customer_email = ?`,
      [email]
    );

    if (customers.length === 0) {
      return {
        success: false,
        message: "Customer not found"
      };
    }

    const customer = customers[0];

    // Check if customer is active
    if (!customer.active_customer_status) {
      return {
        success: false,
        message: "Account is deactivated"
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, customer.customer_password);
    
    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid password"
      };
    }

    // Remove password from response
    delete customer.customer_password;

    return {
      success: true,
      customer
    };
  } catch (error) {
    console.error("Error in loginCustomer:", error);
    return {
      success: false,
      message: "Login failed"
    };
  }
}

// Employee Registration Service
async function registerEmployee(employeeData) {
  try {
    // Check if employee already exists
    const existingEmployee = await db.query(
      "SELECT employee_id FROM employee WHERE employee_email = ?",
      [employeeData.employee_email]
    );

    if (existingEmployee.length > 0) {
      throw new Error("Employee with this email already exists");
    }

    // Insert into employee table
    const result = await db.query(
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)",
      [employeeData.employee_email, employeeData.active_employee]
    );

    if (!result.insertId) {
      throw new Error("Failed to create employee");
    }

    const employee_id = result.insertId;

    // Insert into employee_info table
    await db.query(
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)",
      [
        employee_id,
        employeeData.employee_first_name,
        employeeData.employee_last_name,
        employeeData.employee_phone || null
      ]
    );

    // Insert into employee_pass table
    await db.query(
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)",
      [employee_id, employeeData.employee_password]
    );

    // Insert into employee_role table
    await db.query(
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)",
      [employee_id, employeeData.company_role_id]
    );

    // Return the created employee data
    return {
      employee_id,
      employee_email: employeeData.employee_email,
      employee_first_name: employeeData.employee_first_name,
      employee_last_name: employeeData.employee_last_name,
      company_role_id: employeeData.company_role_id
    };
  } catch (error) {
    console.error("Error in registerEmployee:", error);
    throw error;
  }
}

// Employee Login Service
async function loginEmployee(email, password) {
  try {
    // Get employee with password and role
    const employees = await db.query(
      `SELECT 
        e.employee_id,
        e.employee_email,
        e.active_employee,
        ei.employee_first_name,
        ei.employee_last_name,
        ep.employee_password_hashed,
        er.company_role_id,
        cr.role_name
       FROM employee e
       INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
       INNER JOIN employee_pass ep ON e.employee_id = ep.employee_id
       INNER JOIN employee_role er ON e.employee_id = er.employee_id
       INNER JOIN company_roles cr ON er.company_role_id = cr.company_role_id
       WHERE e.employee_email = ?`,
      [email]
    );

    if (employees.length === 0) {
      return {
        success: false,
        message: "Employee not found"
      };
    }

    const employee = employees[0];

    // Check if employee is active
    if (!employee.active_employee) {
      return {
        success: false,
        message: "Account is deactivated"
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, employee.employee_password_hashed);
    
    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid password"
      };
    }

    // Remove password from response
    delete employee.employee_password_hashed;

    return {
      success: true,
      employee
    };
  } catch (error) {
    console.error("Error in loginEmployee:", error);
    return {
      success: false,
      message: "Login failed"
    };
  }
}

// Get user by token (for middleware)
async function getUserByToken(token) {
  try {
    const jwt = require("jsonwebtoken");
    const jwtSecret = process.env.JWT_SECRET;
    
    const decoded = jwt.verify(token, jwtSecret);
    
    if (decoded.user_type === 'customer') {
      // Get customer data
      const customers = await db.query(
        `SELECT 
          ci.customer_id,
          ci.customer_first_name,
          ci.customer_last_name,
          ci.active_customer_status,
          cid.customer_email
         FROM customer_info ci
         INNER JOIN customer_identifier cid ON ci.customer_id = cid.customer_id
         WHERE ci.customer_id = ?`,
        [decoded.customer_id]
      );
      
      if (customers.length === 0) {
        return null;
      }
      
      return {
        ...customers[0],
        user_type: 'customer'
      };
    } else if (decoded.user_type === 'employee') {
      // Get employee data
      const employees = await db.query(
        `SELECT 
          e.employee_id,
          e.employee_email,
          e.active_employee,
          ei.employee_first_name,
          ei.employee_last_name,
          er.company_role_id,
          cr.role_name
         FROM employee e
         INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
         INNER JOIN employee_role er ON e.employee_id = er.employee_id
         INNER JOIN company_roles cr ON er.company_role_id = cr.company_role_id
         WHERE e.employee_id = ?`,
        [decoded.employee_id]
      );
      
      if (employees.length === 0) {
        return null;
      }
      
      return {
        ...employees[0],
        user_type: 'employee'
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in getUserByToken:", error);
    return null;
  }
}

exports.getAdminStats = async () => {
  // Get total customers, employees, orders
  const [customers] = await db.query('SELECT COUNT(*) as total FROM customer');
  const [employees] = await db.query('SELECT COUNT(*) as total FROM employee');
  const [orders] = await db.query('SELECT COUNT(*) as total FROM orders');
  return {
    totalCustomers: customers[0].total,
    totalEmployees: employees[0].total,
    totalOrders: orders[0].total
  };
};

exports.getEmployeeStats = async (employeeId) => {
  // Get assigned orders and upcoming appointments for employee
  const [assignedOrders] = await db.query('SELECT COUNT(*) as total FROM orders WHERE employee_id = ?', [employeeId]);
  // For demo, treat all assigned orders as upcoming appointments
  return {
    assignedOrders: assignedOrders[0].total,
    upcomingAppointments: assignedOrders[0].total
  };
};

exports.getCustomerStats = async (customerId) => {
  // Get number of vehicles and recent orders for customer
  const [vehicles] = await db.query('SELECT COUNT(*) as total FROM vehicle WHERE customer_id = ?', [customerId]);
  const [orders] = await db.query('SELECT COUNT(*) as total FROM orders WHERE customer_id = ?', [customerId]);
  return {
    totalVehicles: vehicles[0].total,
    recentOrders: orders[0].total
  };
};

module.exports = {
  registerCustomer,
  loginCustomer,
  registerEmployee,
  loginEmployee,
  getUserByToken
}; 