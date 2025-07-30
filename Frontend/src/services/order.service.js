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

// function to fetch all orders
export const fetchOrders = async () => {
    try {
        const response = await axios.get(`${api_url}/api/orders`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error.response?.data?.message || "Failed to fetch orders";
    }
};

// function to fetch orders for a specific customer
export const fetchCustomerOrders = async (customerId) => {
    try {
        const response = await axios.get(
            `${api_url}/api/orders/customer/${customerId}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching orders for customer:", error);
        throw error.response?.data?.message || "Failed to fetch orders for customer";
    }
};

// function to fetch an order by ID
export const fetchOrderById = async (id) => {
    try {
        const response = await axios.get(
            `${api_url}/api/order/${id}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error.response?.data?.message || "Failed to fetch order";
    }
};

// function to add a new order
export const addOrder = async (orderData) => {
    try {
        const response = await axios.post(
            `${api_url}/api/order`,
            orderData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error adding order:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// function to update an order
export const updateOrder = async (id, updatedData) => {
    try {
        const response = await axios.put(
            `${api_url}/api/order/${id}`,
            updatedData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// function to delete an order
export const deleteOrder = async (id) => {
    try {
        const response = await axios.delete(
            `${api_url}/api/order/${id}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// function to delete a service from an order
export const deleteService = async (orderId, serviceId) => {
    try {
        const response = await axios.delete(
            `${api_url}/api/order/${orderId}/service/${serviceId}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// function to delete additional request from an order
export const deleteAdditionalRequest = async (orderId, additionalRequest) => {
    try {
        const response = await axios.put(
            `${api_url}/api/order/${orderId}/additional-request`,
            additionalRequest,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting additional request:", error);
        throw error.response?.data?.message || "Failed";
    }
};

const orderService = { fetchOrders, fetchOrderById, addOrder, updateOrder, deleteOrder, fetchCustomerOrders, deleteService, deleteAdditionalRequest };

export default orderService;
