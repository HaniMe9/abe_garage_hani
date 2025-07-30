import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import Styles from "./AdminMenu.module.css"

function AdminMenu() {

  // Access the authentication context
  const { isAdmin, isManager } = useAuth();

  // Function to get the role text
  const getRoleText = () => {
    if (isAdmin) return "Admin";
    if (isManager) return "Manager";
    return "Mechanic";
  };

  return (   
    <div className={Styles.adminMenuContainer}>
      <div className={Styles.adminMenuTitle}>
        <h2>{getRoleText()} Menu</h2>
      </div>
      <div className={Styles.listGroup}>
        <Link to="/dashboard" className={Styles.listGroupItem}>Dashboard</Link>
        <Link to="/orders" className={Styles.listGroupItem}>Orders</Link>
        {(isAdmin || isManager) && <Link to="/new-order" className={Styles.listGroupItem}>New order</Link>}
        {isAdmin && <Link to="/add-employee" className={Styles.listGroupItem}>Add employee</Link>}
        {(isAdmin || isManager) && <Link to="/employees" className={Styles.listGroupItem}>Employees</Link>}
        {(isAdmin || isManager) && <Link to="/add-customer" className={Styles.listGroupItem}>Add customer</Link>}
        {(isAdmin || isManager) && <Link to="/customers" className={Styles.listGroupItem}>Customers</Link>}
        <Link to="/services" className={Styles.listGroupItem}>Services</Link>
      </div>
    </div>
  );
}

export default AdminMenu;