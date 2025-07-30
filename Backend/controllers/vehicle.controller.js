const { validationResult, checkSchema } = require("express-validator");
const vehicleService = require("../services/vehicle.service");

// Validation schema for vehicle creation
const vehicleValidationSchema = checkSchema({
    vehicle_tag: {
        notEmpty: { errorMessage: "vehicle tag is required" },
        isLength: { options: { min: 6 }, errorMessage: "vehicle tag must be at least 6 characters long" }
    },
    vehicle_make: {
        notEmpty: { errorMessage: "Make is required" }
    },
    vehicle_model: {
        notEmpty: { errorMessage: "Model is required" }
    },
    vehicle_year: {
        isInt: { options: { min: 1900, max: new Date().getFullYear() }, errorMessage: "Year must be a valid year" },
        notEmpty: { errorMessage: "Year is required" },
    },
});

// Middleware for validation
const validateVehicle = async (req, res, next) => {
    await Promise.all(vehicleValidationSchema.map((validation) => validation.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "fail", errors: errors.array() });
    }
    next();
};

// function to Create vehicle
const createVehicle = async (req, res) => {
    const { customer_id } = req.params;
    const { vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_type,
        vehicle_mileage,
        vehicle_tag,
        vehicle_serial,
        vehicle_color } = req.body;

    try {
        // Check for duplicate license plate
        const existingVehicle = await vehicleService.findVehicleByTag(vehicle_tag);
        if (existingVehicle) {
            return res.status(409).json({status: "fail", message: "Vehicle with this license plate already exists"});
        }

        // Create new vehicle
        await vehicleService.createVehicle({
            customer_id,
            vehicle_make,
            vehicle_model,
            vehicle_year,
            vehicle_type,
            vehicle_mileage,
            vehicle_tag,
            vehicle_serial,
            vehicle_color
        });

        return res.status(201).json({ status: "success", message: "Vehicle created successfully" });
    } catch (err) {
        console.error("Error creating vehicle:", err.message);
        return res.status(500).json({status: "fail", message: "Failed to add vehicle"});
    }
};

// function to Get all vehicles of a single customer
const getVehiclesByCustomerId = async (req, res) => {
    const { customer_id } = req.params;

    // Validate customer ID
    if (!customer_id || isNaN(customer_id)) {
        return res.status(400).json({status: "fail", message: "invalid or missing customer ID"});
    }

    try {
        // Fetch all vehicles for the given customer
        const vehicles = await vehicleService.getVehiclesByCustomerId(customer_id);

        // If no vehicles are found
        if (!vehicles || vehicles.length === 0) {
            return res.status(404).json({status: "fail", message: "No vehicles found for this customer"});
        }

        return res.status(200).json({status: "success", data: vehicles});
    } catch (err) {
        console.error("Error retrieving vehicles:", err.message);
        return res.status(500).json({status: "fail", message: "Failed to retrieve vehicles"});
    }
};

// function to Get a single vehicle by ID
const getVehicleById = async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!id || isNaN(id)) {
        return res.status(400).json({status: "fail", message: "invalid or missing vehicle ID"});
    }

    try {
        // Fetch the vehicle by ID
        const vehicle = await vehicleService.getVehicleById(id);

        // If no vehicle is found
        if (!vehicle) {
            return res.status(404).json({status: "fail", message: "The vehicle ID provided does not exist"});
        }

        return res.status(200).json({status: "success", data: vehicle});
    } catch (err) {
        console.error("Error retrieving vehicle:", err.message);
        return res.status(500).json({status: "fail", message: "Failed to retrieve vehicle"});
    }
};

// function to Update vehicle information
const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { vehicle_color, vehicle_mileage, vehicle_tag } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
        return res.status(400).json({status: "fail", message: "invalid or missing vehicle ID",});
    }

    try {
        // Check if vehicle exists
        const existingVehicle = await vehicleService.getVehicleById(id);
        if (!existingVehicle) {
            return res.status(404).json({status: "fail", message: "The vehicle ID provided does not exist."});
        }

        // Update vehicle information
        const updatedVehicle = await vehicleService.updateVehicle(id, { vehicle_color, vehicle_mileage, vehicle_tag });

        // Send success response
        return res.status(200).json({status: "success", message: "Vehicle updated successfully", data: updatedVehicle});
    } catch (err) {
        console.error("Error updating vehicle:", err.message);
        return res.status(500).json({status: "fail", message: "There was an issue updating the vehicle details."});
    }
};

// function to Delete vehicle by ID
const deleteVehicle = async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
        return res.status(400).json({status: "fail", message: "invalid or missing vehicle ID",});
    }

    try {
        // Check if vehicle exists
        const existingVehicle = await vehicleService.getVehicleById(id);
        if (!existingVehicle) {
            return res.status(404).json({status: "fail", message: "The vehicle ID provided does not exist."});
        }

        // Delete the vehicle
        await vehicleService.deleteVehicle(id);

        return res.status(200).json({status: "success", message: "Vehicle deleted successfully"});
    } catch (err) {
        console.error("Error deleting vehicle:", err.message);
        return res.status(500).json({status: "fail", message: "There was an issue deleting the vehicle."});
    }
};

// function to delete all vehicles by customer ID
const deleteVehiclesByCustomerId = async (req, res) => {
    const { customer_id } = req.params;

    try {
        await vehicleService.deleteVehiclesByCustomerId(customer_id);
        res.status(200).json({ message: "All vehicles deleted successfully for customer" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { validateVehicle, createVehicle: [validateVehicle, createVehicle], getVehiclesByCustomerId, getVehicleById, updateVehicle, deleteVehicle, deleteVehiclesByCustomerId };
