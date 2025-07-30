const loginService = require('../services/login.service');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { query } = require('../config/db.config');
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Handle employee register
async function register(req, res, next) {
  try {
    const employeeData = req.body;
    // Input validation
    if (!employeeData.employee_email || !employeeData.employee_password || !employeeData.employee_first_name || !employeeData.employee_last_name || !employeeData.company_role_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, password, first name, last name, role"
      });
    }
    const result = await loginService.register(employeeData);
    if (result.status !== "success") {
      return res.status(400).json({
        success: false,
        message: result.message || "Failed to register employee"
      });
    }
    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: result.data
    });
  } catch (error) {
    console.error("Employee registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register employee"
    });
  }
}

// Handle employee login with enhanced admin support
async function logIn(req, res, next) {
  try {
    const { employee_email, employee_password } = req.body;
    
    // Input validation
    if (!employee_email || !employee_password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    console.log(`Login attempt for: ${employee_email}`);

    // Get employee with role information
    const employeeQuery = `
      SELECT 
        e.employee_id,
        e.employee_email,
        e.active_employee,
        ei.employee_first_name,
        ei.employee_last_name,
        ei.employee_phone,
        ep.employee_password_hashed,
        cr.company_role_id,
        cr.role_name,
        cr.role_description
      FROM employee e
      LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
      LEFT JOIN employee_pass ep ON e.employee_id = ep.employee_id
      LEFT JOIN employee_role er ON e.employee_id = er.employee_id
      LEFT JOIN company_roles cr ON er.company_role_id = cr.company_role_id
      WHERE e.employee_email = ? AND e.active_employee = 1
    `;

    const employees = await query(employeeQuery, [employee_email]);
    
    if (!employees || employees.length === 0) {
      console.log(`Employee not found: ${employee_email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const employee = employees[0];
    
    // Check if password hash exists
    if (!employee.employee_password_hashed) {
      console.log(`No password hash found for: ${employee_email}`);
      return res.status(401).json({
        success: false,
        message: "Account not properly configured. Please contact administrator."
      });
    }

    // For demo purposes, check if it's a placeholder password
    let passwordValid = false;
    if (employee.employee_password_hashed.startsWith('$2b$10$hashedpassword')) {
      // This is a placeholder password, allow login with simple password
      passwordValid = (employee_password === 'password123' || employee_password === 'admin123');
      console.log(`Using demo password for: ${employee_email}`);
    } else {
      // Use bcrypt to verify the password
      passwordValid = await bcrypt.compare(employee_password, employee.employee_password_hashed);
    }

    if (!passwordValid) {
      console.log(`Invalid password for: ${employee_email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Create JWT payload
    const payload = {
      employee_id: employee.employee_id,
      employee_email: employee.employee_email,
      employee_first_name: employee.employee_first_name,
      employee_last_name: employee.employee_last_name,
      company_role_id: employee.company_role_id,
      role_name: employee.role_name,
      user_type: 'employee',
      is_admin: employee.role_name === 'Admin' || employee.role_name === 'Manager'
    };

    // Generate JWT token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

    console.log(`Login successful for: ${employee_email} (${employee.role_name})`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        employee: {
          employee_id: employee.employee_id,
          employee_email: employee.employee_email,
          employee_first_name: employee.employee_first_name,
          employee_last_name: employee.employee_last_name,
          employee_phone: employee.employee_phone,
          company_role_id: employee.company_role_id,
          role_name: employee.role_name,
          role_description: employee.role_description,
          is_admin: employee.role_name === 'Admin' || employee.role_name === 'Manager'
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

// Get dashboard data for authenticated user
async function getDashboard(req, res) {
  try {
    const { employee_id, role_name, is_admin } = req.user;

    // Get dashboard statistics
    const stats = {};
    
    // Total customers
    const [customerCount] = await query('SELECT COUNT(*) as count FROM customer_identifier');
    stats.totalCustomers = customerCount.count;
    
    // Total employees
    const [employeeCount] = await query('SELECT COUNT(*) as count FROM employee WHERE active_employee = 1');
    stats.totalEmployees = employeeCount.count;
    
    // Total orders
    const [orderCount] = await query('SELECT COUNT(*) as count FROM orders');
    stats.totalOrders = orderCount.count;
    
    // Active orders
    const [activeOrderCount] = await query('SELECT COUNT(*) as count FROM orders WHERE active_order = 1');
    stats.activeOrders = activeOrderCount.count;
    
    // Completed orders
    const [completedOrderCount] = await query('SELECT COUNT(*) as count FROM order_info WHERE completion_date IS NOT NULL');
    stats.completedOrders = completedOrderCount.count;
    
    // Total revenue
    const [revenueResult] = await query('SELECT SUM(order_total_price) as total FROM order_info WHERE completion_date IS NOT NULL');
    stats.totalRevenue = revenueResult.total || 0;
    
    // Recent orders (limit based on role)
    const orderLimit = is_admin ? 10 : 5;
    const recentOrders = await query(`
      SELECT 
        o.order_id,
        o.order_date,
        o.active_order,
        oi.order_total_price,
        os.order_status,
        CONCAT(ci.customer_first_name, ' ', ci.customer_last_name) as customer_name,
        CONCAT(cv.vehicle_year, ' ', cv.vehicle_make, ' ', cv.vehicle_model) as vehicle_info
      FROM orders o
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      LEFT JOIN customer_info ci ON o.customer_id = ci.customer_id
      LEFT JOIN customer_vehicle_info cv ON o.vehicle_id = cv.vehicle_id
      ORDER BY o.order_date DESC
      LIMIT ?
    `, [orderLimit]);

    // Service popularity
    const serviceStats = await query(`
      SELECT 
        cs.service_name,
        COUNT(os.service_id) as service_count
      FROM common_services cs
      LEFT JOIN order_services os ON cs.service_id = os.service_id
      GROUP BY cs.service_id, cs.service_name
      ORDER BY service_count DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        stats,
        recentOrders,
        serviceStats,
        userInfo: {
          employee_id,
          role_name,
          is_admin
        }
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data"
    });
  }
}

// Verify JWT token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required"
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

// Check if user is admin
function requireAdmin(req, res, next) {
  if (!req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }
  next();
}

module.exports = { 
  logIn, 
  register, 
  getDashboard, 
  verifyToken, 
  requireAdmin 
};