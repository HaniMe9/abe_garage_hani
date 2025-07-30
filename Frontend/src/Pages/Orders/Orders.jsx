import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import orderService from "../../services/order.service";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import Layout from "../../Layout/Layout";
import styles from "./Orders.module.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAdmin, isManager } = useAuth();
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {

      setLoading(true);
      setError(false);

      try {
        const response = await orderService.fetchOrders();
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const displayedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // navigate to order details
  const handleViewOrder = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  // navigate to edit order
  const handleEditOrder = (orderId) => {
    navigate(`/edit-order/${orderId}`);
  };

  return (
    <Layout>
      <div className={`${styles.ordersContainer} row g-0`}>
        <div className="d-none d-xxl-block col-3"><AdminMenu /></div>
        <div className="d-block d-xxl-none"><AdminMenuMobile /></div>
        <div className="col-12 col-xxl-9">
          {!loading && !error ? (
            <div className={styles.ordersList}>
              <h2>Orders <span>____</span></h2>
              <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Order Date</th>
                      <th>Received by</th>
                      <th>Order status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td>{order.order_id}</td>
                        <td>
                          <div>{order.customer_first_name + " " + order.customer_last_name}</div>
                          <div>{order.customer_email}</div>
                          <div>{order.customer_phone_number}</div>
                        </td>
                        <td>
                          <div>{order.vehicle_make + " " + order.vehicle_model}</div>
                          <div>{order.vehicle_year}</div>
                          <div>{order.vehicle_tag}</div>
                        </td>
                        <td>{order.order_date.split("T")[0]}</td>
                        <td>{order.employee_first_name + " " + order.employee_last_name}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${getStatusClass(order.order_status)}`}>
                            {getStatusText(order.order_status)}
                          </span>
                        </td>
                        <td>
                          {(isAdmin || isManager) && (
                            <button className={styles.btnViewEdit} onClick={() => handleEditOrder(order.order_id)}>
                              <FaEdit />
                            </button>
                          )}
                          <button className={styles.btnViewEdit} onClick={() => handleViewOrder(order.order_id)}>
                            <GrView />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          ) : error ? <NotFound /> : <Loader />}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
