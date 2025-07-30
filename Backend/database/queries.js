const { query } = require('../config/db.config');

class DatabaseQueries {
  // Customer Queries
  static async createCustomer(customerData) {
    const connection = await require('../config/db.config').getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert into customer_identifier
      const identifierResult = await connection.execute(
        'INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash, customer_password) VALUES (?, ?, ?, ?)',
        [customerData.email, customerData.phone, customerData.hash, customerData.password]
      );
      
      const customerId = identifierResult[0].insertId;
      
      // Insert into customer_info
      await connection.execute(
        'INSERT INTO customer_info (customer_id, customer_username, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?, ?)',
        [customerId, customerData.username, customerData.firstName, customerData.lastName, 1]
      );
      
      await connection.commit();
      return customerId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateCustomer(customerId, updateData) {
    const connection = await require('../config/db.config').getConnection();
    try {
      await connection.beginTransaction();
      
      if (updateData.email || updateData.phone) {
        const identifierUpdates = [];
        const identifierValues = [];
        
        if (updateData.email) {
          identifierUpdates.push('customer_email = ?');
          identifierValues.push(updateData.email);
        }
        if (updateData.phone) {
          identifierUpdates.push('customer_phone_number = ?');
          identifierValues.push(updateData.phone);
        }
        
        identifierValues.push(customerId);
        await connection.execute(
          `UPDATE customer_identifier SET ${identifierUpdates.join(', ')} WHERE customer_id = ?`,
          identifierValues
        );
      }
      
      if (updateData.firstName || updateData.lastName || updateData.username) {
        const infoUpdates = [];
        const infoValues = [];
        
        if (updateData.firstName) {
          infoUpdates.push('customer_first_name = ?');
          infoValues.push(updateData.firstName);
        }
        if (updateData.lastName) {
          infoUpdates.push('customer_last_name = ?');
          infoValues.push(updateData.lastName);
        }
        if (updateData.username) {
          infoUpdates.push('customer_username = ?');
          infoValues.push(updateData.username);
        }
        
        infoValues.push(customerId);
        await connection.execute(
          `UPDATE customer_info SET ${infoUpdates.join(', ')} WHERE customer_id = ?`,
          infoValues
        );
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Employee Queries
  static async createEmployee(employeeData) {
    const connection = await require('../config/db.config').getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert into employee
      const employeeResult = await connection.execute(
        'INSERT INTO employee (employee_email, employee_phone, employee_added_date) VALUES (?, ?, NOW())',
        [employeeData.email, employeeData.phone]
      );
      
      const employeeId = employeeResult[0].insertId;
      
      // Insert into employee_info
      await connection.execute(
        'INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, active_employee) VALUES (?, ?, ?, ?)',
        [employeeId, employeeData.firstName, employeeData.lastName, 1]
      );
      
      // Insert into employee_pass
      await connection.execute(
        'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
        [employeeId, employeeData.hashedPassword]
      );
      
      // Assign role if provided
      if (employeeData.roleId) {
        await connection.execute(
          'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)',
          [employeeId, employeeData.roleId]
        );
      }
      
      await connection.commit();
      return employeeId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Vehicle Queries
  static async addVehicle(vehicleData) {
    try {
      const result = await query(
        'INSERT INTO customer_vehicle_info (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          vehicleData.customerId,
          vehicleData.year,
          vehicleData.make,
          vehicleData.model,
          vehicleData.type,
          vehicleData.mileage,
          vehicleData.tag,
          vehicleData.serial,
          vehicleData.color
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateVehicle(vehicleId, updateData) {
    try {
      const updates = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          updates.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });
      
      values.push(vehicleId);
      
      const result = await query(
        `UPDATE customer_vehicle_info SET ${updates.join(', ')} WHERE vehicle_id = ?`,
        values
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Order Queries
  static async createOrder(orderData) {
    const connection = await require('../config/db.config').getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert into orders
      const orderResult = await connection.execute(
        'INSERT INTO orders (employee_id, customer_id, vehicle_id, order_hash, active_order, order_date) VALUES (?, ?, ?, ?, ?, NOW())',
        [orderData.employeeId, orderData.customerId, orderData.vehicleId, orderData.orderHash, 1]
      );
      
      const orderId = orderResult[0].insertId;
      
      // Insert into order_info
      await connection.execute(
        'INSERT INTO order_info (order_id, order_total_price, additional_request) VALUES (?, ?, ?)',
        [orderId, orderData.totalPrice || 0, orderData.additionalRequest || null]
      );
      
      // Insert into order_status
      await connection.execute(
        'INSERT INTO order_status (order_id, order_status) VALUES (?, ?)',
        [orderId, 'Received']
      );
      
      // Insert services if provided
      if (orderData.services && orderData.services.length > 0) {
        for (const serviceId of orderData.services) {
          await connection.execute(
            'INSERT INTO order_services (order_id, service_id, service_completed) VALUES (?, ?, ?)',
            [orderId, serviceId, 0]
          );
        }
      }
      
      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateOrderStatus(orderId, status) {
    try {
      const result = await query(
        'UPDATE order_status SET order_status = ? WHERE order_id = ?',
        [status, orderId]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  static async completeOrder(orderId, completionData) {
    const connection = await require('../config/db.config').getConnection();
    try {
      await connection.beginTransaction();
      
      // Update order_info
      await connection.execute(
        'UPDATE order_info SET completion_date = NOW(), order_total_price = ?, notes = ? WHERE order_id = ?',
        [completionData.totalPrice, completionData.notes || null, orderId]
      );
      
      // Update order status
      await connection.execute(
        'UPDATE order_status SET order_status = ? WHERE order_id = ?',
        ['Completed', orderId]
      );
      
      // Update active_order
      await connection.execute(
        'UPDATE orders SET active_order = 0 WHERE order_id = ?',
        [orderId]
      );
      
      // Mark all services as completed
      await connection.execute(
        'UPDATE order_services SET service_completed = 1 WHERE order_id = ?',
        [orderId]
      );
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Service Queries
  static async addService(serviceData) {
    try {
      const result = await query(
        'INSERT INTO common_services (service_name, service_description) VALUES (?, ?)',
        [serviceData.name, serviceData.description]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateService(serviceId, updateData) {
    try {
      const updates = [];
      const values = [];
      
      if (updateData.name) {
        updates.push('service_name = ?');
        values.push(updateData.name);
      }
      if (updateData.description) {
        updates.push('service_description = ?');
        values.push(updateData.description);
      }
      
      values.push(serviceId);
      
      const result = await query(
        `UPDATE common_services SET ${updates.join(', ')} WHERE service_id = ?`,
        values
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Search and Filter Queries
  static async searchCustomers(searchTerm) {
    try {
      const sql = `
        SELECT 
          ci.customer_id,
          ci.customer_email,
          ci.customer_phone_number,
          cinfo.customer_first_name,
          cinfo.customer_last_name,
          cinfo.active_customer_status
        FROM customer_identifier ci
        LEFT JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
        WHERE 
          ci.customer_email LIKE ? OR
          ci.customer_phone_number LIKE ? OR
          cinfo.customer_first_name LIKE ? OR
          cinfo.customer_last_name LIKE ?
        ORDER BY cinfo.customer_first_name, cinfo.customer_last_name
      `;
      
      const searchPattern = `%${searchTerm}%`;
      return await query(sql, [searchPattern, searchPattern, searchPattern, searchPattern]);
    } catch (error) {
      throw error;
    }
  }

  static async getOrdersByDateRange(startDate, endDate) {
    try {
      const sql = `
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
        WHERE o.order_date BETWEEN ? AND ?
        ORDER BY o.order_date DESC
      `;
      
      return await query(sql, [startDate, endDate]);
    } catch (error) {
      throw error;
    }
  }

  // Reports
  static async getMonthlyRevenue(year, month) {
    try {
      const sql = `
        SELECT 
          DATE(oi.completion_date) as completion_date,
          SUM(oi.order_total_price) as daily_revenue,
          COUNT(*) as orders_completed
        FROM order_info oi
        WHERE 
          YEAR(oi.completion_date) = ? AND 
          MONTH(oi.completion_date) = ? AND
          oi.completion_date IS NOT NULL
        GROUP BY DATE(oi.completion_date)
        ORDER BY completion_date
      `;
      
      return await query(sql, [year, month]);
    } catch (error) {
      throw error;
    }
  }

  static async getServicePopularity() {
    try {
      const sql = `
        SELECT 
          cs.service_name,
          COUNT(os.service_id) as service_count,
          SUM(CASE WHEN os.service_completed = 1 THEN 1 ELSE 0 END) as completed_count
        FROM common_services cs
        LEFT JOIN order_services os ON cs.service_id = os.service_id
        GROUP BY cs.service_id, cs.service_name
        ORDER BY service_count DESC
      `;
      
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DatabaseQueries;
