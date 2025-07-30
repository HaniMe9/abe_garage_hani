const db = require("../config/db.config");

// function to find customer by email
const findCustomerByEmail = async (email) => {
  try {
    // select customer by email
    const rows = await db.query(
      `SELECT * FROM customer_info 
      INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id
      WHERE customer_identifier.customer_email = ?`,
      [email]
    );

    return rows ? rows : null;

  } catch (error) {
    console.error("Error in findCustomerByEmail:", error.message);
    throw new Error("Database query failed");
  }
};


// function to Create a new customer
const createCustomer = async (customerData) => {
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    active_customer_status,
    customer_hash,
    customer_username,
    customer_password
  } = customerData;

  try {
    // Insert into customer_info table
    const result = await db.query(
      `INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash, customer_password)
      VALUES (?, ?, ?)`,
      [customer_email, customer_phone_number, customer_hash, customer_password]
    );

    // Retrieve the generated customer_id
    if (result && result.insertId) {
      const customer_id = result.insertId;

      // Insert into customer_info table using the generated customer_id
      await db.query(
        `INSERT INTO customer_info (customer_id, customer_username, customer_first_name, customer_last_name, active_customer_status)
        VALUES (?, ?, ?, ?)`,
        [customer_id, customer_username, customer_first_name, customer_last_name, active_customer_status]
      );
    } else {
      throw new Error("Failed to retrieve insertId from customer_identifier insert.");
    }
  } catch (error) {
    console.error("Error creating customer:", error.message);
    throw new Error("Failed to create customer");
  }
};

//function to get all customers
const getAllCustomers = async () => {
  // Fetch all customers
  const rows = await db.query(
    `SELECT customer_info.customer_id, customer_info.customer_first_name, customer_info.customer_last_name, 
    customer_info.active_customer_status, customer_identifier.customer_email, 
    customer_identifier.customer_phone_number, customer_identifier.customer_added_date 
    FROM customer_info 
    INNER JOIN customer_identifier 
    ON customer_info.customer_id = customer_identifier.customer_id
    ORDER BY customer_info.customer_id DESC;`
  );

  return rows;
};

// function to Get a customer by ID
const getCustomerById = async (id) => {
  const rows = await db.query(
    `SELECT customer_info.*, customer_identifier.*, customer_vehicle_info.vehicle_id, orders.order_id
    FROM customer_info 
    INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id
    LEFT JOIN customer_vehicle_info ON customer_info.customer_id = customer_vehicle_info.customer_id
    LEFT JOIN orders ON customer_info.customer_id = orders.customer_id
    WHERE customer_info.customer_id = ?`,
    [id]
  );

  return rows[0]; // Return the first row if found
};

// function to Update customer information
const updateCustomer = async (id, customerData) => {
  const {
    customer_first_name,
    customer_last_name,
    customer_phone_number,
    active_customer_status,
  } = customerData;

  const fieldsInfo = [];
  const fieldsIdentifier = [];
  const values = [];

  // Map fields to their respective tables
  if (customer_first_name) {
    fieldsInfo.push("customer_info.customer_first_name = ?");
    values.push(customer_first_name);
  }

  if (customer_last_name) {
    fieldsInfo.push("customer_info.customer_last_name = ?");
    values.push(customer_last_name);
  }

  if (active_customer_status !== undefined && active_customer_status !== null) {
    fieldsInfo.push("customer_info.active_customer_status = ?");
    values.push(active_customer_status);
  }

  if (customer_phone_number) {
    fieldsIdentifier.push("customer_identifier.customer_phone_number = ?");
    values.push(customer_phone_number);
  }

  if (fieldsInfo.length === 0 && fieldsIdentifier.length === 0) {
    throw new Error("No fields provided for update");
  }

  // Construct the SQL query
  const query = `
    UPDATE customer_info, customer_identifier
    SET ${fieldsInfo.join(", ")}
        ${fieldsInfo.length > 0 && fieldsIdentifier.length > 0 ? "," : ""}
        ${fieldsIdentifier.join(", ")}
    WHERE customer_info.customer_id = ?
    AND customer_identifier.customer_id = ?`;

  // Add the customer_id to the values array
  values.push(id, id);

  try {
    // Execute the query
    const result = await db.query(query, values);

    // Check if any rows were updated
    if (result.affectedRows === 0) { return false; }

    return true;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Failed to update customer information");
  }
};

// function to delete a customer
const deleteCustomer = async (id) => {
  try {
    const result = await db.query(
      `DELETE customer_info, customer_identifier 
      FROM customer_info 
      INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id 
      WHERE customer_info.customer_id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error("Failed to delete customer");
  }
};

module.exports = { findCustomerByEmail, createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };
