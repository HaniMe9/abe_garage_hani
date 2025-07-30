const db = require("../config/db.config");

// function to Create a new vehicle for a customer
const createVehicle = async (vehicleData) => {
    const { customer_id,
        vehicle_year,
        vehicle_make,
        vehicle_model,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_serial,
        vehicle_color } = vehicleData;

    try {
        const query = `INSERT
        INTO customer_vehicle_info 
        (customer_id, 
        vehicle_year, 
        vehicle_make, 
        vehicle_model, 
        vehicle_type, 
        vehicle_mileage, 
        vehicle_tag, 
        vehicle_serial, 
        vehicle_color)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [customer_id,
            vehicle_year,
            vehicle_make,
            vehicle_model,
            vehicle_type,
            vehicle_mileage,
            vehicle_tag,
            vehicle_serial,
            vehicle_color];

        // Insert the vehicle into the database
        const result = await db.query(query, values);

        return result;
    } catch (error) {
        console.error("Error creating vehicle:", error.message);
        throw new Error("Failed to create vehicle");
    }
};

// function to find a vehicle by its license plate
const findVehicleByTag = async (vehicle_tag) => {
    try {
        // Find the vehicle by its license plate
        const vehicle = await db.query(`SELECT * FROM customer_vehicle_info WHERE vehicle_tag = ?`, [vehicle_tag]);

        return vehicle[0];
    } catch (error) {
        console.error("Error finding vehicle by tag:", error.message);
        throw new Error("Failed to find vehicle");
    }
};

// function to get all vehicles of a specific customer
const getVehiclesByCustomerId = async (customerId) => {
    try {
        // Retrieve all vehicles for the given customer
        const vehicles = await db.query(`SELECT * FROM customer_vehicle_info WHERE customer_id = ?`, [customerId]);

        return vehicles;
    } catch (error) {
        console.error("Error retrieving vehicles by customer ID:", error.message);
        throw new Error("Failed to retrieve vehicles");
    }
};

// function to get a single vehicle by its ID
const getVehicleById = async (vehicleId) => {
    try {
        // Retrieve the vehicle by its ID
        const vehicle = await db.query(`SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?`, [vehicleId]);

        return vehicle[0];
    } catch (error) {
        console.error("Error retrieving vehicle by ID:", error.message);
        throw new Error("Failed to retrieve vehicle");
    }
};

// function to Update vehicle details
const updateVehicle = async (vehicle_id, vehicleData) => {
    const { vehicle_mileage, vehicle_tag, vehicle_color } = vehicleData;

    try {
        // Update the vehicle in the database
        const result = await db.query(
            `UPDATE customer_vehicle_info 
            SET vehicle_mileage = ?, vehicle_tag = ?, vehicle_color = ?
            WHERE vehicle_id = ?`,
            [vehicle_mileage, vehicle_tag, vehicle_color, vehicle_id]
        );

        return result;
    } catch (error) {
        console.error("Error updating vehicle:", error.message);
        throw new Error("Failed to update vehicle");
    }
};

// function to Delete a vehicle by its ID
const deleteVehicle = async (vehicleId) => {

    try {
        // Delete from order_status
        await db.query(
            `DELETE FROM order_status WHERE order_id IN (SELECT order_id FROM orders WHERE vehicle_id = ?)`,
            [vehicleId]
        );

        // Delete from order_services
        await db.query(
            `DELETE FROM order_services WHERE order_id IN (SELECT order_id FROM orders WHERE vehicle_id = ?)`,
            [vehicleId]
        );

        // Delete from order_info 
        await db.query(
            `DELETE FROM order_info WHERE order_id IN (SELECT order_id FROM orders WHERE vehicle_id = ?)`,
            [vehicleId]
        );

        // Delete related orders
        await db.query(`DELETE FROM orders WHERE vehicle_id = ?`, [vehicleId]);

        // finally Delete the vehicle
        const result = await db.query(
            `DELETE FROM customer_vehicle_info WHERE vehicle_id = ?`,
            [vehicleId]
        );

        return result;
    } catch (error) {
        console.error("Error deleting vehicle:", error.message);
        throw new Error("Failed to delete vehicle");
    }
};

// Function to delete all vehicles by customer ID
const deleteVehiclesByCustomerId = async (customer_id) => {
    if (!customer_id) {
        throw new Error("Customer ID is required");
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Delete dependent records in order_status
        await connection.query(
            `DELETE FROM order_status WHERE order_id
            IN (SELECT order_id FROM orders WHERE vehicle_id IN (SELECT vehicle_id FROM customer_vehicle_info WHERE customer_id = ?))`,
            [customer_id]
        );

        // Delete dependent records in order_services
        await connection.query(
            `DELETE FROM order_services WHERE order_id IN
            (SELECT order_id FROM orders WHERE vehicle_id IN (SELECT vehicle_id FROM customer_vehicle_info WHERE customer_id = ?))`,
            [customer_id]
        );

        // Delete dependent records in order_info
        await connection.query(
            `DELETE FROM order_info WHERE order_id IN
            (SELECT order_id FROM orders WHERE vehicle_id IN (SELECT vehicle_id FROM customer_vehicle_info WHERE customer_id = ?))`,
            [customer_id]
        );

        // Delete orders that reference the customer's vehicles
        await connection.query(
            `DELETE FROM orders WHERE vehicle_id IN (SELECT vehicle_id FROM customer_vehicle_info WHERE customer_id = ?)`,
            [customer_id]
        );

        // Finally, delete the vehicles
        const result = await connection.query(
            `DELETE FROM customer_vehicle_info WHERE customer_id = ?`,
            [customer_id]
        );

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting vehicles for customer:", error.message);
        throw new Error("Failed to delete vehicles for customer");
    } finally {
        connection.release();
    }
};

module.exports = { createVehicle, findVehicleByTag, getVehiclesByCustomerId, getVehicleById, updateVehicle, deleteVehicle, deleteVehiclesByCustomerId };
