const db = require("../config/db.config");
const bcrypt = require("bcrypt");

// function to check if employee exists in the database
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email = ? ";
  const rows = await db.query(query, [email]);
  if (rows.length > 0) { return true; }
  return false;
}

// function to create a new employee
async function createEmployee(employee) {
  let createdEmployee = {};
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);

    // Insert the email in to the employee table
    const query = "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const rows = await db.query(query, [employee.employee_email, employee.active_employee]);

    if (rows.affectedRows !== 1) { return false; }

    // Get the employee id from the inserted row
    const employee_id = rows.insertId;

    // Insert the remaining data in to the employee_info table
    const query2 = "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)";
    const rows2 = await db.query(query2, [
      employee_id,
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
    ]);

    // Insert the remaining data in to the employee_pass table
    const query3 = "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)";
    const rows3 = await db.query(query3, [employee_id, hashedPassword]);

    // Insert the remaining data in to the employee_role table
    const query4 = "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)";
    const rows4 = await db.query(query4, [employee_id, employee.company_role_id]);

    // construct to the employee object to return
    createdEmployee = {employee_id: employee_id};
  } catch (err) {
    console.error("Error creating employee:", err);
    throw new Error("Failed to create employee");
  }

  return createdEmployee;
}

// function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query =
    `SELECT * FROM employee
    INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id
    INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id
    INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id
    WHERE employee.employee_email = ?`;

  const rows = await db.query(query, [employee_email]);
  return rows;
}

// function to get all employees
async function getAllEmployees() {
  const query =
    `SELECT * FROM employee
    INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id
    INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id
    INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id
    ORDER BY employee.employee_id DESC`;

  const rows = await db.query(query);
  return rows;
}

// function to get an employee by ID
const getEmployeeById = async (id) => {
  const rows = await db.query(
    `SELECT employee.*, employee_info.*, employee_role.*, company_roles.*, orders.order_id FROM employee
    INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id
    INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id
    INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id
    LEFT JOIN orders ON employee.employee_id = orders.employee_id
    WHERE employee.employee_id = ?`,
    [id]
  );

  return rows[0]; // Return the first row if found
};

// function to update an employee
async function updateEmployee(employeeId, employeeData) {
  const { employee_email,
    active_employee,
    employee_first_name,
    employee_last_name,
    company_role_id,
    employee_phone } = employeeData;
  try {
    // Check if the employee exists
    const existingEmployee = await getEmployeeByEmail(employee_email);
    if (!existingEmployee) { throw new Error("Employee not found.")};

    // Start building the update query
    let updateQuery = "UPDATE employee SET ";
    let values = [];

    // Update active employee status
    if (active_employee !== undefined) {
      updateQuery += "active_employee = ?, ";
      values.push(active_employee);
    }

    updateQuery = updateQuery.slice(0, -2);
    updateQuery += " WHERE employee_id = ?";
    values.push(employeeId);

    const updateResult = await db.query(updateQuery, values);

    // Update employee info
    await db.query(
      `UPDATE employee_info
      SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?`,
      [employee_first_name, employee_last_name, employee_phone, employeeId]
    );

    // Update employee role if provided
    if (company_role_id) {
      await db.query(
        `UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?`,
        [company_role_id, employeeId]);
    }

    return { message: "Employee updated successfully" };
  } catch (err) {
    console.error("Error updating employee:", err);
    throw new Error("Failed to update employee.");
  }
}

// function to update an order recipient employee
async function updateOrderRecipientEmployee(id, updatedId) {
  // update the employee
  const result = await db.query(`UPDATE orders SET employee_id = ? WHERE employee_id = ?`, [updatedId, id]);

  return result.affectedRows === 1; // Return true if update was successful
}

// function to delete an employee
async function deleteEmployee(employeeId) {
  // Verify the employee exists
  const rows = await db.query(`SELECT * FROM employee WHERE employee_id = ?`, [employeeId]);

  // If the employee is not found
  if (rows.length === 0) { return false };

  // Delete related records from child tables first
  try {
    await db.query(`DELETE FROM employee_info WHERE employee_id = ?`, [employeeId]);
    await db.query(`DELETE FROM employee_pass WHERE employee_id = ?`, [employeeId]);
    await db.query(`DELETE FROM employee_role WHERE employee_id = ?`, [employeeId]);

    // Delete the employee record from the parent table
    const result = await db.query(`DELETE FROM employee WHERE employee_id = ?`, [employeeId]);

    return result.affectedRows === 1; // Return true if the deletion was successful
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw new Error("Failed to delete employee");
  }
}

module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getEmployeeById,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  updateOrderRecipientEmployee
};
