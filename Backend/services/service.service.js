const db = require("../config/db.config");

// function to create a new service
const createService = async ({service_name, service_description}) => {
  try {
    // Insert the service into the database
    const result = await db.query(
      `INSERT INTO common_services (service_name, service_description)
      VALUES (?, ?)`,
      [service_name, service_description]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error creating service:", error.message);
    throw error;
  }
};

// function to fetch all services
const fetchAllServices = async () => {
  try {
    // Fetch all services
    const rows = await db.query(`SELECT service_id, service_name, service_description FROM common_services`);

    return rows;
  } catch (error) {
    console.error('Error fetching all services:', error.message);
    throw error;
  }
};

// function to fetch a single service by ID
const fetchServiceById = async (id) => {
  try {
    // Fetch the service
    const rows = await db.query(
      `SELECT service_id, service_name, service_description
      FROM common_services
      WHERE service_id = ?`,
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching service by ID:', error.message);
    throw error;
  }
};

// function to Update a service by ID
const updateServiceById = async (id, service_name, service_description) => {
  try {
    // Update the service
    const result = await db.query(
      `UPDATE common_services
      SET service_name = ?, service_description = ?
      WHERE service_id = ?`,
      [service_name, service_description, id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating service by ID:', error.message);
    throw error;
  }
};

// function to delete a service by ID
const deleteServiceById = async (id) => {
  try {
    // Delete related records from order_services first
    await db.query(`DELETE FROM order_services WHERE service_id = ?`, [id]);

    // Delete from common_services
    const result = await db.query(`DELETE FROM common_services WHERE service_id = ?`, [id]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting service by ID:", error.message);
    throw error;
  }
};

module.exports = {createService, fetchAllServices, fetchServiceById, updateServiceById, deleteServiceById};
