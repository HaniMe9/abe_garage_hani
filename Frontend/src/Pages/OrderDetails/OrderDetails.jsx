import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderService from "../../services/order.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./OrderDetails.module.css";

const OrderDetails = () => {

    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch order details
    useEffect(() => {
        const fetchOrderDetails = async () => {

            setLoading(true);
            setError(false);

            try {
                const response = await orderService.fetchOrderById(parseInt(id));
                setOrder(response.data[0]);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    // Helper functions to get status class
    const getStatusClass = (status) => {
        switch (status) {
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
        switch (status) {
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

    return (
        <Layout>
            <div className={`${styles.orderDetailsContainer} row g-0`}>
                <div className="d-none d-xl-block col-3"><AdminMenu /></div>
                <div className="d-block d-xl-none"><AdminMenuMobile /> </div>
                <div className="col-12 col-xl-9">
                    {!loading && !error ? (
                        <div className={styles.orderDetails}>
                            <div className={styles.header}>
                                <h2>
                                    {order.customer_first_name} {order.customer_last_name}
                                    <span>____</span>
                                </h2>
                                <p className={`${styles.status} ${getStatusClass(order.order_status)}`}>
                                    {getStatusText(order.order_status)}
                                </p>
                            </div>
                            <p>
                                You can track the progress of your order using this page. we will constantly
                                update this page to let you know how we are progressing.As soon as we are done
                                with the order, the status will turn green. That means, your car is ready for pick up.
                            </p>
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
                                        <p><strong>Tag:</strong> {order.vehicle_tag}</p>
                                        <p><strong>Year:</strong> {order.vehicle_year}</p>
                                        <p><strong>Mileage:</strong> {order.vehicle_mileage}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.servicesSection}>
                                <h6>{order.vehicle_make} {order.vehicle_model}</h6>
                                <h3>Requested Services</h3>
                                {order.services ? (order.services.map((order) => (
                                    <div
                                        key={order.service_id}
                                        className={`${styles.service} row align-items-center justify-content-between g-0`}
                                    >
                                        <div className="col-12 col-md-10 mb-3 mb-md-0 pe-md-3">
                                            <h4>{order.service_name}</h4>
                                            <p>{order.service_description}</p>
                                        </div>
                                        <p
                                            className={`
                                                ${styles.status} 
                                                ${getStatusClass(order.service_completed)} 
                                                col-12 col-md-2 ps-md-3
                                            `}
                                        >
                                            {getStatusText(order.service_completed)}
                                        </p>
                                    </div>
                                ))) : <p className={styles.noServices}>
                                    No services requested or we stop performing the selected services.
                                </p>
                                }
                                {order.additional_request &&
                                    <div className={`${styles.service} row align-items-center justify-content-between g-0`}>
                                        <div className="col-12 col-md-10 mb-3 mb-md-0 pe-md-3">
                                            <h4>Additional Requests</h4>
                                            <p>{order.additional_request}</p>
                                        </div>
                                        <p
                                            className={`
                                                ${styles.status} 
                                                ${getStatusClass(order.additional_requests_completed)} 
                                                col-12 col-md-2 ps-md-3
                                            `}
                                        >
                                            {getStatusText(order.additional_requests_completed)}
                                        </p>
                                    </div>}
                            </div>
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default OrderDetails;
