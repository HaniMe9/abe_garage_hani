const e = require("express");
const employeeService = require("../services/employee.service");

//  function to Create employee
async function createEmployee(req, res, next) {

  // Check if employee email already exists in the database
  const employeeExists = await employeeService.checkIfEmployeeExists(req.body.employee_email);

  // If employee exists, send a response to the client
  if (employeeExists) {
    res.status(400).json({error: "Employee already exists!"});
  } else {
    try {
      const employeeData = req.body;

      // Create the employee
      const employee = await employeeService.createEmployee(employeeData);

      // If the employee is not created
      if (!employee) {
        res.status(400).json({error: "Failed to add the employee!"});
      } else {
        res.status(200).json({status: "true"});
      }
    } catch (error) {
      res.status(400).json({error: "Something went wrong!"});
    }
  }
}

// function to get all employees
async function getAllEmployees(req, res, next) {

  // Get all employees
  const employees = await employeeService.getAllEmployees();

  // If the employees are not found
  if (!employees) {
    res.status(400).json({error: "Failed to get all employees!"});
  } else {
    res.status(200).json({status: "success", data: employees});
  }
}

// function to get employee by ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!id || isNaN(id)) {
    return res.status(400).json({status: "fail", message: "invalid or missing employee ID"});
  }

  try {
    // Fetch the employee by ID
    const employee = await employeeService.getEmployeeById(id);

    // If no employee is found
    if (!employee) {
      return res.status(404).json({status: "fail", message: "The employee ID provided does not exist"});
    }

    return res.status(200).json({status: "success", data: employee});
  } catch (err) {
    console.error("Error retrieving employee:", err.message);
    return res.status(500).json({status: "fail", message: "Failed to retrieve employee"});
  }
};

// function to update employee
async function updateEmployee(req, res) {
  const employeeId = req.params.id;
  const employeeData = req.body;

  try {
    // update the employee
    const result = await employeeService.updateEmployee(employeeId, employeeData);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.message === "Employee not found.") {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// updating an order recipient employee
async function updateOrderRecipientEmployee(req, res) {
  const id = req.params.id;
  const updatedId = req.params.updatedId;

  try {
    // update the employee
    const result = await employeeService.updateOrderRecipientEmployee(id, updatedId);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.message === "Employee not found.") {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// function to delete an employee
async function deleteEmployee(req, res) {
  const employeeId = req.params.id;

  try {
    // delete the employee
    const result = await employeeService.deleteEmployee(employeeId);

    // If the employee is not found
    if (!result) {
      return res.status(404).json({ message: "Employee not found." });
    }
    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, updateOrderRecipientEmployee };
