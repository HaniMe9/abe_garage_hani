const db = require("../config/db.config");

// function to Create a new order
const createOrder = async (orderData) => {
  const {
    employee_id,
    customer_id,
    vehicle_id,
    service_ids,
    active_order,
    order_hash,
    order_total_price,
    additional_request,
    additional_requests_completed,
    service_completed,
    order_status,
  } = orderData;

  // Get a connection from the pool
  const connection = await db.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert the order into the orders table
    const [orderResult] = await connection.query(
      `INSERT INTO orders (employee_id, customer_id, vehicle_id, order_hash, active_order) 
      VALUES (?, ?, ?, ?, ?)`,
      [employee_id, customer_id, vehicle_id, order_hash, active_order]
    );

    // Get the inserted order ID
    const order_id = orderResult.insertId;

    // Insert associated order_services into the order_services table
    await connection.query(
      `INSERT INTO order_info (order_id, order_total_price, additional_request, additional_requests_completed)
      VALUES (?, ?, ?, ?)`,
      [order_id, order_total_price, additional_request, additional_requests_completed]
    );

    // Insert associated order_services into the order_services table
    const placeholders = service_ids.map(() => "(?, ?, ?)").join(", ");
    const values = service_ids.flatMap((service_id) => [order_id, service_id, service_completed]);

    // Execute the query
    await connection.query(
      `INSERT INTO order_services (order_id, service_id, service_completed)
      VALUES ${placeholders}`,
      values
    );

    // Insert order status into the `order_status` table
    await connection.query(
      `INSERT INTO order_status (order_id, order_status)
      VALUES (?, ?)`,
      [order_id, order_status]
    );

    // Commit the transaction
    await connection.commit();

    // Release the connection back to the pool
    connection.release();

    // Return the newly created order ID
    return { order_id };
  } catch (error) {
    // Rollback the transaction on error
    await connection.rollback();
    connection.release();
    throw error;
  }
};

// function to Get all orders
const getAllOrders = async () => {
  try {
    // Get all orders
    const orders = await db.query(
      `SELECT
        o.order_id,
        o.customer_id,
        o.vehicle_id,
        o.employee_id,
        o.order_date,
        ci.customer_first_name,
        ci.customer_last_name,
        cid.customer_email,
        cid.customer_phone_number,
        cvi.vehicle_make,
        cvi.vehicle_model,
        cvi.vehicle_year,
        cvi.vehicle_tag,
        ei.employee_first_name,
        ei.employee_last_name,
        os.order_status
      FROM 
        orders o
      LEFT JOIN 
        customer_info ci ON o.customer_id = ci.customer_id
      LEFT JOIN 
        customer_identifier cid ON o.customer_id = cid.customer_id
      LEFT JOIN 
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      LEFT JOIN 
        employee_info ei ON o.employee_id = ei.employee_id
      LEFT JOIN 
        order_status os ON o.order_id = os.order_id
      ORDER BY 
        o.order_date DESC;`
    );

    return orders;
  } catch (error) {
    throw error;
  }
};

// function to get all orders for a specific customer
const getOrdersByCustomerId = async (customer_id) => {
  try {
    // Get all orders
    const orders = await db.query(
      `SELECT 
        o.order_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        os.order_status,
        oi.order_total_price,
        cvi.vehicle_year,
        cvi.vehicle_make,
        cvi.vehicle_model
      FROM 
        orders o
      LEFT JOIN
        order_status os ON o.order_id = os.order_id
      LEFT JOIN 
        order_info oi ON o.order_id = oi.order_id
      LEFT JOIN 
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      WHERE 
        o.customer_id = ?
      ORDER BY 
        o.order_date DESC;`,
      [customer_id]
    );

    return orders;
  } catch (error) {
    console.error("Error retrieving orders for customer:", error);
    throw error;
  }
};

// function to Get a single order by ID
const getOrderById = async (id) => {
  try {
    // Get a single order
    const order = await db.query(
      `SELECT 
        o.active_order,
        ci.customer_first_name,
        ci.customer_last_name,
        ci.active_customer_status,
        cid.customer_email,
        cid.customer_phone_number,
        cvi.vehicle_make,
        cvi.vehicle_model,
        cvi.vehicle_year,
        cvi.vehicle_tag,
        cvi.vehicle_mileage,
        cvi.vehicle_color,
        os.order_status,
        oi.additional_request,
        oi.additional_requests_completed,
        oi.order_total_price,
        DATE_FORMAT(oi.completion_date, '%Y-%m-%d') AS completion_date,
        oi.notes_for_internal_use,
        oi.notes_for_customer,
        (
          SELECT 
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'service_id', cs.service_id,
                    'service_name', cs.service_name,
                    'service_description', cs.service_description,
                    'service_completed', osrv.service_completed
                )
            )
          FROM 
            order_services osrv
          LEFT JOIN 
            common_services cs ON cs.service_id = osrv.service_id
          WHERE 
            osrv.order_id = o.order_id
        ) AS services
      FROM 
        orders o
      LEFT JOIN 
        customer_info ci ON o.customer_id = ci.customer_id
      LEFT JOIN 
        customer_identifier cid ON o.customer_id = cid.customer_id
      LEFT JOIN 
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      LEFT JOIN 
        employee_info ei ON o.employee_id = ei.employee_id
      LEFT JOIN 
        order_status os ON o.order_id = os.order_id
      LEFT JOIN 
        order_info oi ON o.order_id = oi.order_id
      WHERE 
        o.order_id = ?;`,
      [id]
    );

    return order
  } catch (error) {
    throw error;
  }
};

//function to get all orders for a specific employee
const getOrdersByEmployeeId = async (employee_id) => {
  try {
    // Get all orders
    const orders = await db.query(
      `SELECT 
        o.order_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        os.order_status,
        oi.order_total_price,
        cvi.vehicle_year,
        cvi.vehicle_make,
        cvi.vehicle_model
      FROM 
        orders o
      LEFT JOIN 
        order_status os ON o.order_id = os.order_id
      LEFT JOIN 
        order_info oi ON o.order_id = oi.order_id
      LEFT JOIN 
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      WHERE 
        o.employee_id = ? 
      ORDER BY 
        o.order_date DESC;`,
      [employee_id]
    );

    return orders;
  } catch (error) {
    console.error("Error retrieving orders for employee:", error);
    throw error;
  }
};

// function to Update order and its associated services
const updateOrder = async (updatedData) => {

  const {
    id,
    additional_request,
    additional_requests_completed,
    order_status,
    active_order,
    completion_date,
    order_total_price,
    notes_for_internal_use,
    notes_for_customer,
    services
  } = updatedData;

  const order_id = id;
  let connection;

  try {
    // Get a connection from the pool
    connection = await db.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Update `order_service` table for multiple `service_completed` fields
    if (services && services.length > 0) {
      const serviceUpdateCases = services.map(
        (service) => `WHEN service_id = ${service.service_id} THEN "${service.service_completed}"`
      ).join(" ");

      // Generate a comma-separated list of service IDs
      const serviceIds = services.map((service) => service.service_id).join(", ");
      await connection.query(
        `UPDATE order_services
        SET service_completed = CASE ${serviceUpdateCases} END
        WHERE service_id IN (${serviceIds}) AND order_id = ?`,
        [order_id]);
    }

    // Update `order_info` table
    await connection.query(
      `UPDATE order_info SET 
        additional_request = ?,
        additional_requests_completed = ?,
        completion_date = ?,
        order_total_price = ?,
        notes_for_internal_use = ?,
        notes_for_customer = ?
      WHERE order_id = ?`,
      [
      additional_request,
      additional_requests_completed,
      completion_date,
      order_total_price,
      notes_for_internal_use,
      notes_for_customer,
      order_id,
    ]);

    // Update `order_status` table
    await connection.query(
      `UPDATE order_status SET order_status = ? WHERE order_id = ?`,
      [order_status, order_id]
    );

    // Update `orders` table
    await connection.query(
      `UPDATE orders SET active_order = ? WHERE order_id = ?`,
      [active_order, order_id]
    );

    // Commit the transaction
    await connection.commit();

    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    // Rollback on error
    if (connection) await connection.rollback();
    console.error("Error updating order:", error.message);
    throw new Error("Failed to update the order");
  } finally {
    // Release the connection back to the pool
    if (connection) await connection.release();
  }
};

// function to Delete an order by ID
const deleteOrder = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Delete associated services first
    await connection.query(`DELETE FROM order_services WHERE order_id = ?`, [id]);

    // Delete from order_status
    await connection.query(`DELETE FROM order_status WHERE order_id = ?`, [id]);

    // Delete from order_info
    await connection.query(`DELETE FROM order_info WHERE order_id = ?`, [id]);

    // Delete the order
    const [result] = await connection.query(`DELETE FROM orders WHERE order_id = ?`, [id]);

    // Handle case where no rows were deleted
    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    // Commit transaction
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// function to delete a service from an order
const deleteService = async (orderId, serviceId) => {
  // Get a connection from the pool
  const connection = await db.getConnection();

  try {
    // Begin transaction
    await connection.beginTransaction();

    // Delete service from the services table
    const [result] = await connection.query(
      'DELETE FROM order_services WHERE order_id = ? AND service_id = ?',
      [orderId, serviceId]
    );

    // If no service was deleted
    if (result.affectedRows === 0) {
      await connection.rollback();
      throw new Error("Service not found.");
    }

    // Commit transaction
    await connection.commit();
    return { success: true, message: "Service deleted successfully." };
  } catch (error) {
    console.error("Error deleting service:", error);
    await connection.rollback();
    throw new Error("Failed to delete service.");
  } finally {
    connection.release();
  }
};

// Service to cancel additional request for an order
const cancelAdditionalRequest = async (orderId, additionalRequest, additionalRequestsCompleted) => {
  const connection = await db.getConnection();

  try {
    // Begin transaction
    await connection.beginTransaction();

    // Update the additional request and status
    const [result] = await connection.query(
      'UPDATE order_info SET additional_request = ?, additional_requests_completed = ? WHERE order_id = ?',
      [additionalRequest, additionalRequestsCompleted, orderId]
    );

    // If the order doesn't exist
    if (result.affectedRows === 0) {
      await connection.rollback();
      throw new Error("Order not found.");
    }

    // Commit transaction
    await connection.commit();
    return { success: true, message: "Additional request canceled successfully." };
  } catch (error) {
    console.error("Error canceling additional request:", error);
    await connection.rollback();
    throw new Error("Failed to cancel additional request.");
  } finally {
    connection.release();
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, getOrdersByEmployeeId, updateOrder, deleteOrder, getOrdersByCustomerId, deleteService, cancelAdditionalRequest };
