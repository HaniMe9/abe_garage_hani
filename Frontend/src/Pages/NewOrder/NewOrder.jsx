import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaHandPointUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import customerservice from "../../services/customer.service";
import vehicleService from "../../services/vehicle.service";
import serviceService from "../../services/service.service";
import orderService from "../../services/order.service";
import Loader from "../../Components/Loader/Loader";
import NotFound from "../../Components/NotFound/NotFound";
import Layout from "../../Layout/Layout";
import styles from "./NewOrder.module.css";

const NewOrder = () => {

    const navigate = useNavigate();
    const { employeeId } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [customer, setCustomer] = useState({});
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [services, setServices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showSearch, setShowSearch] = useState(true);
    const [showCustomer, setShowCustomer] = useState(false);
    const [showVehicle, setShowVehicle] = useState(false);
    const [showVehicles, setShowVehicles] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [order, setOrder] = useState({
        additional_request: "",
        order_total_price: "",
        order_status: 0,
        active_order: true,
        additional_requests_completed: false,
        service_completed: false,
        service_ids: [],
        customer_id: "",
        vehicle_id: "",
        employee_id: ""
    });
    const itemsPerPage = 10;

    // Fetch customers function
    useEffect(() => {
        const fetchCustomers = async () => {

            setLoading(true);
            setError(false);

            try {
                const response = await customerservice.fetchCustomers();
                setCustomers(response.data);
                setFilteredCustomers(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Search customers function
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setFilteredCustomers(customers);
        } else {
            const results = customers.filter(
                (customer) =>
                    customer.customer_first_name?.toLowerCase().includes(term) ||
                    customer.customer_last_name?.toLowerCase().includes(term) ||
                    customer.customer_email?.toLowerCase().includes(term) ||
                    customer.customer_phone_number?.includes(term)
            );
            setFilteredCustomers(results);
        }
    };

    // Pagination
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    // Add customer function for redirect
    const handleAddCustomer = () => {
        navigate(`/add-customer?redirect=/new-order`);
    };

    // Fetch customer by id
    const fetchCustomerById = async (customerId) => {

        setLoading(true);
        setError(false);

        try {
            const response = await customerservice.fetchCustomerById(customerId);
            setCustomer(response.data);
            setOrder({ ...order, customer_id: customerId });
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicles by customer id
    const fetchVehiclesByCustomerId = async (customerId) => {
        
        setLoading(true);
        setError(false);

        try {
            const response = await vehicleService.fetchVehiclesByCustomerId(customerId);
            setVehicles(response.data);
        } catch (err) {
            console.error(err);
            if (err.response.status === 404) {
                setError(false);
            } else {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicles by customer id function 
    const handleSelectCustomer = (customerId) => {
        fetchCustomerById(customerId);
        fetchVehiclesByCustomerId(customerId);
        setShowSearch(false);
        setShowCustomer(true);
    };

    // Add vehicle function for redirect
    const handleAddVehicle = (id) => {
        navigate(`/customer-profile/${id}?redirect=/new-order`);
    };

    // Fetch vehicle by id
    const fetchVehicleById = async (vehicleId) => {

        setLoading(true);
        setError(false);

        try {
            const response = await vehicleService.fetchVehicleById(vehicleId);
            setVehicle(response.data);
            setOrder({ ...order, vehicle_id: vehicleId, employee_id: employeeId });
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all services
    const fetchAllServices = async () => {

        setLoading(true);
        setError(false);

        try {
            const response = await serviceService.getAllServices();
            setServices(response);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectVehicle = (vehicleId) => {
        fetchVehicleById(vehicleId);
        fetchAllServices();
    };

    // Generate order hash
    const generateorderHash = () => {
        const dataToHash =
            order.additional_request +
            order.order_total_price;
        return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Base64);
    };

    // function to Add data 
    const handleAddData = (e, service) => {
        const { checked } = e.target;
        const { service_id } = service;

        setOrder((prevOrder) => {
            const updatedServices = checked
                ? [...prevOrder.service_ids, service_id]
                : prevOrder.service_ids.filter((id) => id !== service_id);
            return { ...prevOrder, service_ids: updatedServices };
        });
    };

    // function to Create a new order
    const handleCreateOrder = async () => {
        const orderHash = generateorderHash();
        const orderWithHash = {
            ...order,
            order_hash: orderHash,
        };

        setLoading(true);
        setError(false);

        try {
            const response = await orderService.addOrder(orderWithHash);
            setOrder(response.data);
            Swal.fire({
                title: "Success!",
                html: "Order created successfully",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            setTimeout(() => { navigate(`/order-details/${response.data.order_id}`)}, 1500);
        } catch (err) {
            console.error(err);
            if (err === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "error!",
                    html: "Failed to create order. Please try again!",
                    icon: "error",
                    customClass: {
                        popup: styles.popup,
                        confirmButton: styles.confirmButton,
                        icon: styles.icon,
                        title: styles.errorTitle,
                        htmlContainer: styles.text
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className={`${styles.container} row g-0`}>
                <div className=" d-none d-xl-block col-3"><AdminMenu /></div>
                <div className="d-block d-xl-none"><AdminMenuMobile /></div>
                <div className="col-12 col-xl-9">
                    {!loading && !error ? (
                        <div className={styles.orderList}>
                            <div className={styles.header}>
                                <h2>Create a New Order <span>____</span></h2>
                                {showSearch && <div className={styles.searchBar}>
                                    <div className={styles.searchIcon}>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            placeholder="Search for a customer by name, email, or phone number"
                                        />
                                        <span><FaSearch /></span>
                                    </div>
                                    {searchTerm === "" && (
                                        <button onClick={handleAddCustomer} className={styles.addButton}>
                                            Add New Customer
                                        </button>
                                    )}
                                </div>}
                            </div>
                            {showSearch && <div className={styles.results}>
                                {searchTerm !== "" && Object.keys(filteredCustomers).length > 0 ? (
                                    <div>
                                        {/* customers table */}
                                        <div className={styles.tableContainer}>
                                            <table className={styles.customerTable}>
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedCustomers.map((customer) => (
                                                        <tr key={customer.customer_id}>
                                                            <td>{customer.customer_first_name}</td>
                                                            <td>{customer.customer_last_name}</td>
                                                            <td>{customer.customer_email}</td>
                                                            <td>{customer.customer_phone_number}</td>
                                                            <td>
                                                                <button
                                                                    className={styles.selectButton}
                                                                    onClick={() => {
                                                                        handleSelectCustomer(customer.customer_id);
                                                                        setShowVehicles(true);
                                                                    }}
                                                                >
                                                                    <FaHandPointUp />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* pagination */}
                                        <div className={styles.pagination}>
                                            <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                                                Previous
                                            </button>
                                            <span>Page {currentPage} of {totalPages}</span>
                                            <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : searchTerm !== "" ? (
                                    <p className={styles.noResults}>No customers matched your search.</p>
                                ) : null}
                            </div>}
                            {showCustomer && <div>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => {
                                        setShowSearch(true);
                                        setShowCustomer(false);
                                        setServices(null);
                                        setShowVehicle(false);
                                        setShowVehicles(false);
                                        setVehicles([]);
                                    }}
                                >
                                    x
                                </button>
                                {/* customer info */}
                                <div className={styles.customerInfo}>
                                    <h3>{customer.customer_first_name} {customer.customer_last_name}</h3>
                                    <div className={styles.customerDetails}>
                                        <p><strong>Email:</strong> {customer.customer_email}</p>
                                        <p><strong>Phone Number:</strong> {customer.customer_phone_number}</p>
                                        <p><strong>Customer:</strong> {customer.active_customer_status ? "Yes" : "No"}</p>
                                        <p>
                                            <strong>Edit Customer Info:</strong>
                                            <span onClick={() => navigate(`/edit-customer/${customer.customer_id}`)}>
                                                <FaEdit />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                {!showVehicle && <div>
                                    {/* vehicles table */}
                                    <h2>Choose a Vehicle <span>____</span></h2>
                                    {vehicles.length > 0 ? (<div className={styles.tableContainer}>
                                        <table className={styles.vehicleTable}>
                                            <thead>
                                                <tr>
                                                    <th>Year</th>
                                                    <th>Make</th>
                                                    <th>Model</th>
                                                    <th>Color</th>
                                                    <th>Mileage</th>
                                                    <th>Tag</th>
                                                    <th>Serial</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vehicles.map((vehicle) => (
                                                    <tr key={vehicle.vehicle_id}>
                                                        <td>{vehicle.vehicle_year}</td>
                                                        <td>{vehicle.vehicle_make}</td>
                                                        <td>{vehicle.vehicle_model}</td>
                                                        <td>{vehicle.vehicle_color}</td>
                                                        <td>{vehicle.vehicle_mileage}</td>
                                                        <td>{vehicle.vehicle_tag}</td>
                                                        <td>{vehicle.vehicle_serial}</td>
                                                        <td>
                                                            <button
                                                                className={styles.selectButton}
                                                                onClick={() => {
                                                                    handleSelectVehicle(vehicle.vehicle_id);
                                                                    setShowVehicles(false);
                                                                    setShowVehicle(true);
                                                                }}
                                                            >
                                                                <FaHandPointUp />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>) : (<div className={styles.noResults}>
                                        <p>No vehicles found for this customer.</p>
                                        <button onClick={() => { handleAddVehicle(customer.customer_id); }}>
                                            Add New Vehicle
                                        </button>
                                    </div>)}
                                </div>}
                            </div>}
                            {showVehicle && <div>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => {
                                        setShowVehicle(false);
                                        setServices(null);
                                        fetchVehiclesByCustomerId(customer.customer_id);
                                        setShowVehicles(true);
                                    }}
                                >
                                    x
                                </button>
                                {/* vehicle info */}
                                <div className={styles.vehicleInfo}>
                                    <h3>{vehicle.vehicle_make} {vehicle.vehicle_model}</h3>
                                    <div className={styles.vehicleDetails}>
                                        <p><strong>Year:</strong> {vehicle.vehicle_year}</p>
                                        <p><strong>Color:</strong> {vehicle.vehicle_color}</p>
                                        <p><strong>Mileage:</strong> {vehicle.vehicle_mileage}</p>
                                        <p><strong>Tag:</strong> {vehicle.vehicle_tag}</p>
                                        <p><strong>Serial:</strong> {vehicle.vehicle_serial}</p>
                                        <p>
                                            <strong>Edit Vehicle Info:</strong>
                                            <span
                                                onClick={() =>
                                                    navigate(`/edit-vehicle/${customer.customer_id}/${vehicle.vehicle_id}`)
                                                }>
                                                <FaEdit />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>}
                            {services && <div>
                                {/* services section */}
                                <div className={styles.services}>
                                    <h2>Choose Services <span>____</span></h2>
                                    {services.map((service) => (
                                        <div key={service.service_id} className={styles.serviceInfo}>
                                            <div>
                                                <h3>{service.service_name}</h3>
                                                <p>{service.service_description}</p>
                                            </div>
                                            <input type="checkbox" onChange={(e) => handleAddData(e, service)} />
                                        </div>))}
                                </div>
                                <div className={styles.orderForm}>
                                    <div className={styles.orderInfo}>
                                        <h2>Additional requests <span>____</span></h2>
                                        <textarea
                                            type="text"
                                            value={order.additional_request || ""}
                                            placeholder="Service description"
                                            onChange={(e) => setOrder({ ...order, additional_request: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            value={order.order_total_price || ""}
                                            placeholder="Price"
                                            onChange={(e) => setOrder({ ...order, order_total_price: e.target.value })}
                                        />
                                        <button onClick={handleCreateOrder}>Submit Order</button>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default NewOrder;
