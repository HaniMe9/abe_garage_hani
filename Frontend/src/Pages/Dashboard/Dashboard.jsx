import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import Layout from "../../Layout/Layout";
import styles from "./Dashboard.module.css";
import orderService from "../../services/order.service";
import employeeService from "../../services/employee.service";
import customerService from "../../services/customer.service";
import serviceService from "../../services/service.service";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ orders: 0, employees: 0, customers: 0, services: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [orders, employees, customers, services] = await Promise.all([
          orderService.fetchOrders(),
          employeeService.fetchEmployees(),
          customerService.fetchCustomers(),
          serviceService.getAllServices(),
        ]);
        setCounts({
          orders: orders.length || 0,
          employees: employees.length || 0,
          customers: customers.length || 0,
          services: services.length || 0,
        });
      } catch (err) {
        setCounts({ orders: 0, employees: 0, customers: 0, services: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const cards = [
    { icon: "📦", title: "All Orders", count: counts.orders, link: "/orders" },
    { icon: "👥", title: "Employees", count: counts.employees, link: "/employees" },
    { icon: "👤", title: "Customers", count: counts.customers, link: "/customers" },
    { icon: "🛠️", title: "Services", count: counts.services, link: "/services" },
  ];

  return (
    <Layout>
      <div className={`${styles.dashboard} row g-0`}>
        {/* Sidebar Navigation */}
        <div className="d-none d-md-block col-3"><AdminMenu /></div>
        <div className="d-block d-md-none"><AdminMenuMobile /></div>
        <div className={`${styles.main} col-12 col-md-9`}>
          <h1>Admin Dashboard <span>____</span></h1>
          <p>
            Welcome to the admin dashboard. Here you can manage orders, employees, customers, and services.
          </p>
          <div className="row g-3 g-lg-4">
            {cards.map((card, index) => (
              <div key={index} className="col-6 col-lg-3">
                <div
                  className={styles.dashboardCard}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(card.link)}
                >
                  <div className={styles.dashboardIcon}>{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p style={{ fontSize: "2em", margin: 0 }}>{loading ? "..." : card.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
