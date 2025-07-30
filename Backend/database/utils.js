const { query, getConnection } = require('../config/db.config');

class DatabaseUtils {
  // Generic CRUD operations
  static async findAll(tableName, conditions = {}, orderBy = null) {
    try {
      let sql = `SELECT * FROM ${tableName}`;
      const params = [];
      
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
        sql += ` WHERE ${whereClause}`;
        params.push(...Object.values(conditions));
      }
      
      if (orderBy) {
        sql += ` ORDER BY ${orderBy}`;
      }
      
      return await query(sql, params);
    } catch (error) {
      console.error(`Error in findAll for ${tableName}:`, error);
      throw error;
    }
  }

  static async findById(tableName, idColumn, id) {
    try {
      const sql = `SELECT * FROM ${tableName} WHERE ${idColumn} = ?`;
      const results = await query(sql, [id]);
      return results[0] || null;
    } catch (error) {
      console.error(`Error in findById for ${tableName}:`, error);
      throw error;
    }
  }

  static async insert(tableName, data) {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      
      const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      const result = await query(sql, values);
      return result.insertId;
    } catch (error) {
      console.error(`Error in insert for ${tableName}:`, error);
      throw error;
    }
  }

  static async update(tableName, idColumn, id, data) {
    try {
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];
      
      const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = ?`;
      const result = await query(sql, values);
      return result.affectedRows;
    } catch (error) {
      console.error(`Error in update for ${tableName}:`, error);
      throw error;
    }
  }

  static async delete(tableName, idColumn, id) {
    try {
      const sql = `DELETE FROM ${tableName} WHERE ${idColumn} = ?`;
      const result = await query(sql, [id]);
      return result.affectedRows;
    } catch (error) {
      console.error(`Error in delete for ${tableName}:`, error);
      throw error;
    }
  }

  // Specific queries for Abe Garage
  static async getCustomerWithVehicles(customerId) {
    try {
      const sql = `
        SELECT 
          ci.customer_id,
          ci.customer_email,
          ci.customer_phone_number,
          cinfo.customer_first_name,
          cinfo.customer_last_name,
          cinfo.active_customer_status,
          cv.vehicle_id,
          cv.vehicle_year,
          cv.vehicle_make,
          cv.vehicle_model,
          cv.vehicle_type,
          cv.vehicle_mileage,
          cv.vehicle_tag,
          cv.vehicle_color
        FROM customer_identifier ci
        LEFT JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
        LEFT JOIN customer_vehicle_info cv ON ci.customer_id = cv.customer_id
        WHERE ci.customer_id = ?
      `;
      return await query(sql, [customerId]);
    } catch (error) {
      console.error('Error getting customer with vehicles:', error);
      throw error;
    }
  }

  static async getEmployeeWithRole(employeeId) {
    try {
      const sql = `
        SELECT 
          e.employee_id,
          e.employee_email,
          e.employee_phone,
          ei.employee_first_name,
          ei.employee_last_name,
          ei.active_employee,
          cr.role_name,
          cr.role_description
        FROM employee e
        LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
        LEFT JOIN employee_role er ON e.employee_id = er.employee_id
        LEFT JOIN company_roles cr ON er.company_role_id = cr.company_role_id
        WHERE e.employee_id = ?
      `;
      return await query(sql, [employeeId]);
    } catch (error) {
      console.error('Error getting employee with role:', error);
      throw error;
    }
  }

  static async getOrderDetails(orderId) {
    try {
      const sql = `
        SELECT 
          o.order_id,
          o.order_date,
          o.active_order,
          oi.order_total_price,
          oi.additional_request,
          oi.completion_date,
          os.order_status,
          ci.customer_first_name,
          ci.customer_last_name,
          ci.customer_email,
          ci.customer_phone_number,
          cv.vehicle_make,
          cv.vehicle_model,
          cv.vehicle_year,
          cv.vehicle_tag,
          ei.employee_first_name as assigned_employee_first_name,
          ei.employee_last_name as assigned_employee_last_name
        FROM orders o
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        LEFT JOIN order_status os ON o.order_id = os.order_id
        LEFT JOIN customer_info ci ON o.customer_id = ci.customer_id
        LEFT JOIN customer_vehicle_info cv ON o.vehicle_id = cv.vehicle_id
        LEFT JOIN employee_info ei ON o.employee_id = ei.employee_id
        WHERE o.order_id = ?
      `;
      return await query(sql, [orderId]);
    } catch (error) {
      console.error('Error getting order details:', error);
      throw error;
    }
  }

  static async getOrderServices(orderId) {
    try {
      const sql = `
        SELECT 
          cs.service_id,
          cs.service_name,
          cs.service_description,
          os.service_completed
        FROM order_services os
        JOIN common_services cs ON os.service_id = cs.service_id
        WHERE os.order_id = ?
      `;
      return await query(sql, [orderId]);
    } catch (error) {
      console.error('Error getting order services:', error);
      throw error;
    }
  }

  static async getDashboardStats() {
    try {
      const stats = {};
      
      // Total customers
      const [customerCount] = await query('SELECT COUNT(*) as count FROM customer_identifier');
      stats.totalCustomers = customerCount.count;
      
      // Total employees
      const [employeeCount] = await query('SELECT COUNT(*) as count FROM employee');
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
      
      return stats;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  // Database health check
  static async healthCheck() {
    try {
      const connection = await getConnection();
      await connection.execute('SELECT 1');
      connection.release();
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      console.error('Database health check failed:', error);
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }

  // Backup utilities
  static async backupTable(tableName) {
    try {
      const data = await query(`SELECT * FROM ${tableName}`);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupData = {
        table: tableName,
        timestamp,
        data
      };
      return backupData;
    } catch (error) {
      console.error(`Error backing up table ${tableName}:`, error);
      throw error;
    }
  }
}

module.exports = DatabaseUtils;
