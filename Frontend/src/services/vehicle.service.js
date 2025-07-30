import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

// Helper function to retrieve authentication headers
const getAuthHeaders = () => {
    const storedToken = JSON.parse(localStorage.getItem("employee"));
    const token = storedToken?.employee_token;
    return {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
};

// Function to fetch all vehicles for a specific customer
export const fetchVehiclesByCustomerId = async (customerId) => {
    try {
        const response = await axios.get(
            `${api_url}/api/vehicles/${customerId}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        throw error.response?.data?.message || "Failed to fetch vehicles";
    }
};

// Function to fetch a specific vehicle by ID
export const fetchVehicleById = async (vehicleId) => {
    try {
        const response = await axios.get(
            `${api_url}/api/vehicle/${vehicleId}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        throw error.response?.data?.message || "Failed to fetch vehicle";
    }
};

// Function to add a new vehicle for a specific customer
export const addVehicle = async (customerId, vehicleData) => {
    try {
        const response = await axios.post(
            `${api_url}/api/vehicle/${customerId}`,
            vehicleData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error adding vehicle:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// Function to update an existing vehicle
export const updateVehicle = async (vehicleId, updatedData) => {
    try {
        const response = await axios.put(
            `${api_url}/api/update-vehicle/${vehicleId}`,
            updatedData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error updating vehicle:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// Function to delete a vehicle
export const deleteVehicle = async (vehicleId) => {
    try {
        const response = await axios.delete(
            `${api_url}/api/delete-vehicle/${vehicleId}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// Function to delete all vehicles for a specific customer
export const deleteVehiclesByCustomerId = async (customer_id) => {
    try {
        const response = await axios.delete(
            `${api_url}/api/vehicles/customer/${customer_id}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting vehicles for customer:", error);
        throw error.response?.status || "Failed";
    }
};

const vehicleService = {fetchVehiclesByCustomerId, fetchVehicleById, addVehicle, updateVehicle, deleteVehicle, deleteVehiclesByCustomerId};

export default vehicleService;
