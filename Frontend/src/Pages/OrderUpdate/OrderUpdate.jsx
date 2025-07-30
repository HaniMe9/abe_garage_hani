import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import orderService from "../../services/order.service";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import Layout from "../../Layout/Layout";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./OrderUpdate.module.css";

const OrderUpdate = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // Fetch order data on component mount
    useEffect(() => {
        const fetchOrderData = async () => {

            setLoading(true);
            setError(false);

            try {
                const response = await orderService.fetchOrderById(parseInt(id, 10));
                setOrder(response.data[0]);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [id]);

    // Handle input changes and service cancellations
    const handleChange = async (e) => {
        const { name, value, type, checked, dataset } = e.target;
        const index = dataset.index ? parseInt(dataset.index, 10) : null;

        if (value === "3" && name === "service_completed" && index !== null) {

            Swal.fire({
                title: "Are you sure you want to cancel this service?",
                html: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes !",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    cancelButton: styles.cancelButton,
                    icon: styles.icon,
                    title: styles.warningTitle,
                    htmlContainer: styles.text,
                }
            }).then(async (result) => {
                if (result.isConfirmed) {

                    setLoading(true);
                    setError(false);

                    try {
                        const serviceId = order.services[index].service_id; // Assume each service has a unique `id`
                        const orderId = id;
                        await orderService.deleteService(orderId, serviceId);
                        // Remove the service if confirmed
                        setOrder((prevOrder) => {
                            const updatedServices = [...prevOrder.services];
                            updatedServices.splice(index, 1); // Remove the service at the selected index
                            return {
                                ...prevOrder,
                                services: updatedServices,
                            };
                        });
                        Swal.fire({
                            title: "Cancelled!",
                            html: "The service has been cancelled.",
                            icon: "success",
                            customClass: {
                                popup: styles.popup,
                                confirmButton: styles.confirmButton,
                                icon: styles.icon,
                                title: styles.successTitle,
                                htmlContainer: styles.text,
                            },
                        });
                    } catch (error) {
                        console.error("Error canceling service:", error);
                        if (error === "Failed") {
                            setError(true);
                        } else {
                            Swal.fire({
                                title: "Error!",
                                html: "Failed to cancel service. Please try again!",
                                icon: "error",
                                customClass: {
                                    popup: styles.popup,
                                    confirmButton: styles.confirmButton,
                                    icon: styles.icon,
                                    title: styles.errorTitle,
                                    htmlContainer: styles.text,
                                },
                            });
                        }
                    } finally {
                        setLoading(false);
                    }
                }
            });

        // Handle additional request cancellations
        } else if (value === "3" && name === "additional_requests_completed") {

            Swal.fire({
                title: "Are you sure you want to cancel this additional request?",
                html: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes !",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    cancelButton: styles.cancelButton,
                    icon: styles.icon,
                    title: styles.warningTitle,
                    htmlContainer: styles.text
                }
            }).then(async (result) => {
                if (result.isConfirmed) {

                    setLoading(true);
                    setError(false);

                    try {
                        const orderId = id;
                        const additionalRequest = { additional_request: null, additional_requests_completed: 0 };
                        await orderService.deleteAdditionalRequest(orderId, additionalRequest);
                        // Remove the additional request if confirmed
                        setOrder((prevOrder) => ({
                            ...prevOrder,
                            additional_request: null,
                            additional_requests_completed: null,
                        }));
                        Swal.fire({
                            title: "Cancelled!",
                            html: "The additional request has been cancelled.",
                            icon: "success",
                            customClass: {
                                popup: styles.popup,
                                confirmButton: styles.confirmButton,
                                icon: styles.icon,
                                title: styles.successTitle,
                                htmlContainer: styles.text,
                            },
                        });
                    } catch (error) {
                        console.error("Error canceling additional request:", error);
                        if (error === "Failed") {
                            setError(true);
                        } else {
                            Swal.fire({
                                title: "Error!",
                                html: "Failed to cancel additional request. Please try again!",
                                icon: "error",
                                customClass: {
                                    popup: styles.popup,
                                    confirmButton: styles.confirmButton,
                                    icon: styles.icon,
                                    title: styles.errorTitle,
                                    htmlContainer: styles.text,
                                },
                            });
                        }
                    } finally {
                        setLoading(false);
                    }
                }
            });

        // Handle order cancellations
        } else if (value === "3" && name === "order_status") {

            Swal.fire({
                title: "Are you sure you want to cancel this order?",
                html: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes !",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    cancelButton: styles.cancelButton,
                    icon: styles.icon,
                    title: styles.warningTitle,
                    htmlContainer: styles.text
                }
            }).then(async (result) => {
                if (result.isConfirmed) {

                    setLoading(true);
                    setError(false);

                    try {
                        await orderService.deleteOrder(id);
                        Swal.fire({
                            title: "Cancelled!",
                            html: "The order has been cancelled.",
                            icon: "success",
                            customClass: {
                                popup: styles.popup,
                                confirmButton: styles.confirmButton,
                                icon: styles.icon,
                                title: styles.successTitle,
                                htmlContainer: styles.text,
                            },
                        });
                        setTimeout(() => { navigate("/orders")}, 1500);
                    } catch (error) {
                        console.error("Error canceling order:", error);
                        if (error === "Failed") {
                            setError(true);
                        } else {
                            Swal.fire({
                                title: "Error!",
                                html: "Failed to cancel order. Please try again!",
                                icon: "error",
                                customClass: {
                                    popup: styles.popup,
                                    confirmButton: styles.confirmButton,
                                    icon: styles.icon,
                                    title: styles.errorTitle,
                                    htmlContainer: styles.text,
                                },
                            });
                        }
                    } finally {
                        setLoading(false);
                    }
                }
            });

        // Handle other input changes
        } else {
            setOrder((prevOrder) => {
                if (index !== null) {
                    const updatedServices = [...prevOrder.services];
                    updatedServices[index] = {
                        ...updatedServices[index],
                        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
                    };
                    return {
                        ...prevOrder,
                        services: updatedServices,
                    };
                } else {
                    return {
                        ...prevOrder,
                        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
                    };
                }
            });
        }
    };

    // Handle form submission for updating the order
    const handleUpdateOrder = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(false);

        try {
            await orderService.updateOrder(id, order);
            Swal.fire({
                title: "Updated!",
                html: "The order has been updated.",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            setTimeout(() => { navigate(`/order-details/${id}`)}, 1500);
        } catch (err) {
            console.error(err);
            if (err === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "error!",
                    html: "Failed to update order. Please try again!",
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

    // Helper functions to get status class
    const getStatusClass = (status) => {
        switch (parseInt(status)) {
            case 2:
                return styles.statusCompleted;
            case 1:
                return styles.statusInProgress;
            case 0:
                return styles.statusReceived;
            default:
                return "";
        }
    };

    // Helper function to get status text
    const getStatusText = (status) => {
        switch (parseInt(status)) {
            case 2:
                return "Completed";
            case 1:
                return "In Progress";
            case 0:
                return "Received";
            default:
                return "Unknown";
        }
    };

    // Helper function to format date
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    };

    const formatDateToday = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const today = formatDateToday(new Date());

    return (
        <Layout>
            <div className={`${styles.updateOrderContainer} row g-0`}>
                <div className="d-none d-xl-block col-3"><AdminMenu /></div>
                <div className="d-block d-xl-none"><AdminMenuMobile /></div>
                <div className="col-12 col-xl-9">
                    {!loading && !error ? (
                        <div className={styles.orderDetails}>
                            <div className={styles.header}>
                                <h2>Update Order <span>____</span></h2>
                                <p className={`${styles.status} ${getStatusClass(order.order_status)}`}>
                                    {getStatusText(order.order_status)}
                                </p>
                            </div>
                            <div className={`${styles.infoSection} row justify-content-between g-0`}>
                                <div className="col-12 col-md-6 my-3 pe-md-3">
                                    <div className={styles.customerInfo}>
                                        <h6>CUSTOMER</h6>
                                        <h3>{order.customer_first_name} {order.customer_last_name}</h3>
                                        <p><strong>Email:</strong> {order.customer_email}</p>
                                        <p><strong>Phone:</strong> {order.customer_phone_number}</p>
                                        <p><strong>Active:</strong> {order.active_customer_status ? "Yes" : "No"}</p>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 mb-3 my-md-3 ps-md-3">
                                    <div className={styles.vehicleInfo}>
                                        <h6>CAR IN SERVICE</h6>
                                        <h3>{order.vehicle_make} {order.vehicle_model} ({order.vehicle_color})</h3>
                                        <p><strong>Tag:</strong> {order.vehicle_model}</p>
                                        <p><strong>Year:</strong> {order.vehicle_year}</p>
                                        <p><strong>Mileage:</strong> {order.vehicle_mileage}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.servicesSection}>
                                <h6>{order.vehicle_make} {order.vehicle_model}</h6>
                                <h3>Edit: Requested Services <span>____</span></h3>
                                {order.services ? (order.services.map((order, index) => (
                                    <div
                                        key={order.service_id}
                                        className={`${styles.service} row align-items-center justify-content-between g-0`}
                                    >
                                        <div className="col-12 col-md-9 mb-3 mb-md-0 pe-md-3">
                                            <h4>{order.service_name}</h4>
                                            <p>{order.service_description}</p>
                                        </div>
                                        <select
                                            className={`${styles.status} ${getStatusClass(order.service_completed)} col-12 col-md-3 ps-md-3`}
                                            name="service_completed"
                                            value={order.service_completed}
                                            onChange={handleChange}
                                            data-index={index}
                                        >
                                            <option className={styles.statusReceived} value={0}>Received</option>
                                            <option className={styles.statusInProgress} value={1}>In Progress</option>
                                            <option className={styles.statusCompleted} value={2}>Completed</option>
                                            <option className={styles.statusCancelled} value={3}>Cancel</option>
                                        </select>
                                    </div>
                                ))) : <p className={styles.noServices}>
                                    No services requested or we stop performing the selected services.
                                </p>}
                                {order.additional_request && (
                                    <div className={`${styles.service} row align-items-center justify-content-between g-0`}>
                                        <div className="col-12 col-md-9 mb-3 mb-md-0 pe-md-3">
                                            <h4>Additional Requests</h4>
                                            <textarea
                                                type="text"
                                                name="additional_request"
                                                placeholder="Additional Requests"
                                                value={order.additional_request}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <select
                                            className={`${styles.status} ${getStatusClass(order.additional_requests_completed)} col-12 col-md-3 ps-md-3`}
                                            name="additional_requests_completed"
                                            value={order.additional_requests_completed}
                                            onChange={handleChange}
                                        >
                                            <option className={styles.statusReceived} value={0}>Received</option>
                                            <option className={styles.statusInProgress} value={1}>In Progress</option>
                                            <option className={styles.statusCompleted} value={2}>Completed</option>
                                            <option className={styles.statusCancelled} value={3}>Cancel</option>
                                        </select>
                                    </div>)}
                            </div>
                            <div className={styles.updateSection}>
                                <h3>Edit: Order Details <span>____</span></h3>
                                <form onSubmit={handleUpdateOrder}>
                                    <div className={styles.formGroup}>
                                        <div className={`${styles.orderFlexContainer} row justify-content-between g-0`}>
                                            <div className="col-12 col-md-6">
                                                <div className={styles.orderFlex}>
                                                    <h4>Order Status:</h4>
                                                    <select
                                                        className={`${styles.status} ${getStatusClass(order.order_status)}`}
                                                        name="order_status"
                                                        value={order.order_status}
                                                        onChange={handleChange}
                                                    >
                                                        <option className={styles.statusReceived} value={0}>Received</option>
                                                        <option className={styles.statusInProgress} value={1}>In Progress</option>
                                                        <option className={styles.statusCompleted} value={2}>Completed</option>
                                                        <option className={styles.statusCancelled} value={3}>Cancel</option>
                                                    </select>
                                                </div>
                                                <div className={styles.orderFlex}>
                                                    <h4>completion date:</h4>
                                                    <input
                                                        className={styles.date}
                                                        name="completion_date"
                                                        type="date"
                                                        placeholder="mm/dd/yy"
                                                        onChange={handleChange}
                                                        min={today}
                                                        value={order.completion_date ? formatDate(order.completion_date) : ""}
                                                    />
                                                </div>
                                                <div>
                                                    <h4>Notes for customer</h4>
                                                    <textarea
                                                        name="notes_for_customer"
                                                        type="text"
                                                        placeholder="Notes for customer"
                                                        onChange={handleChange}
                                                        value={order.notes_for_customer || ""}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-5">
                                                <div className={styles.orderFlex}>
                                                    <h4>Active Order:</h4>
                                                    <input
                                                        className={styles.checkbox}
                                                        type="checkbox"
                                                        name="active_order"
                                                        checked={order.active_order}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className={styles.orderFlex}>
                                                    <h4>Total Price:</h4>
                                                    <input
                                                        className={styles.price}
                                                        name="order_total_price"
                                                        placeholder="Total Price"
                                                        type="number"
                                                        onChange={handleChange}
                                                        value={order.order_total_price}
                                                    />
                                                </div>
                                                <div>
                                                    <h4>Notes for provider</h4>
                                                    <textarea
                                                        name="notes_for_internal_use"
                                                        type="text"
                                                        placeholder="Notes for provider"
                                                        onChange={handleChange}
                                                        value={order.notes_for_internal_use || ""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit">Update Order</button>
                                    </div>
                                </form>
                            </div>
                        </div>) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default OrderUpdate;
