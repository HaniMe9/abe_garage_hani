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

// function to add a service
export const addService = async (serviceData) => {
    try {
        const response = await axios.post(`${api_url}/api/service`,
            serviceData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error adding service:", error);
        throw error.response?.data.error || "Failed";
    }
};

// function to fetch all services
export const getAllServices = async () => {
    try {
        const response = await axios.get(`${api_url}/api/services`,
            getAuthHeaders()
        );
        return response.data.services;
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error.response?.data || error;
    }
};

// function to fetch a service by ID
export const getServiceById = async (id) => {
    try {
        const response = await axios.get(`${api_url}/api/service/${id}`,
            getAuthHeaders()
        );
        return response.data.service;
    } catch (error) {
        console.error(`Error fetching service with ID ${id}:`, error);
        throw error.response?.data || error;
    }
};

// function to update a service
export const updateService = async (id, serviceData) => {
    try {
        const response = await axios.put(`${api_url}/api/service/${id}`,
            serviceData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating service with ID ${id}:`, error);
        throw error.response?.data.message || "Failed";
    }
};

// function to delete a service
export const deleteService = async (id) => {
    try {
        const response = await axios.delete(`${api_url}/api/service/${id}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error(`Error deleting service with ID ${id}:`, error);
        throw error.response?.data.message || "Failed";
    }
};

const serviceService = { addService, getAllServices, getServiceById, updateService, deleteService };

export default serviceService;
