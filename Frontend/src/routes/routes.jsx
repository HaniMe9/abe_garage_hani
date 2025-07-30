import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateAuthRoute from "../Auth/PrivateAuthRoute";
import Home from "../Pages/Home/Home";
import Orders from "../Pages/Orders/Orders";
import Customers from "../Pages/Customers/Customers";
import AddEmployee from "../Pages/AddEmployee/AddEmployee";
import Login from "../Pages/Login/Login";
import AboutUs from "../Pages/AboutUs/AboutUs";
import ContactUs from "../Pages/ContactUs/ContactUs";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Employees from "../Pages/Employees/Employees";
import AbeServices from "../Pages/AbeSevices/AbeServices";
import EmployeeUpdate from "../Pages/EmployeeUpdate/EmployeeUpdate";
import CustomerUpdate from "../Pages/CustomerUpdate/CustomerUpdate";
import VehicleUpdate from "../Pages/VehicleUpdate/VehicleUpdate";
import NewOrder from "../Pages/NewOrder/NewOrder";
import AddCustomer from "../Pages/AddCustomer/AddCustomer";
import CustomerProfile from "../Pages/CustomerProfile/CustomerProfile";
import ProvideServices from "../Pages/ProvideServices/ProvideServices";
import ServiceUpdate from "../Pages/ServiceUpdate/ServiceUpdate";
import OrderDetails from "../Pages/OrderDetails/OrderDetails";
import OrderUpdate from "../Pages/OrderUpdate/OrderUpdate";
import AdminDashboard from "../Pages/Dashboard/Dashboard";
import EmployeeDashboard from "../Pages/Employees/EmployeeDashboard";
import CustomerDashboard from "../Pages/CustomerProfile/CustomerDashboard";
import Register from "../Pages/AddCustomer/Register";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/contact-us" element={<ContactUs />} />
    <Route path="/abe-Services" element={<AbeServices />} />
    <Route path="/register" element={<Register />} />

    {/* Protected Routes */}
    <Route path="/dashboard" element={
      <PrivateAuthRoute roles={[1, 2, 3]}>
        <Dashboard />
      </PrivateAuthRoute>
    } />
    <Route path="/orders" element={
      <PrivateAuthRoute roles={[1, 2, 3]}>
        <Orders />
      </PrivateAuthRoute>
    } />
    <Route path="/order-details/:id" element={
      <PrivateAuthRoute roles={[1, 2, 3]}>
        <OrderDetails />
      </PrivateAuthRoute>
    } />
    <Route path="/edit-order/:id" element={
      <PrivateAuthRoute roles={[1, 4]}>
        <OrderUpdate />
      </PrivateAuthRoute>
    } />
    <Route path="/new-order" element={
      <PrivateAuthRoute roles={[1, 4]}>
        <NewOrder />
      </PrivateAuthRoute>
    } />
    <Route path="/add-employee" element={
      <PrivateAuthRoute roles={[4]}>
        <AddEmployee />
      </PrivateAuthRoute>
    } />
    <Route path="/employees" element={
      <PrivateAuthRoute roles={[1, 4]}>
        <Employees />
      </PrivateAuthRoute>
    } />
    <Route path="/edit-employee/:id" element={
      <PrivateAuthRoute roles={[4]}>
        <EmployeeUpdate />
      </PrivateAuthRoute>
    } />
    <Route path="/add-customer" element={
      <PrivateAuthRoute roles={[1, 4]}>
        <AddCustomer />
      </PrivateAuthRoute>
    } />
    <Route path="/customers" element={
      <PrivateAuthRoute roles={[1, 4]}>
        <Customers />
      </PrivateAuthRoute>
    } />
    <Route path="/edit-customer/:id" element={
      <PrivateAuthRoute roles={[1, 4]}>
        <CustomerUpdate />
      </PrivateAuthRoute>
    } />
    <Route path="/edit-vehicle/:customer_id/:vehicle_id" element={
      <PrivateAuthRoute roles={[1, 4]}>
        <VehicleUpdate />
      </PrivateAuthRoute>
    } />
    <Route path="/customer-profile/:id" element={
      <PrivateAuthRoute roles={[1, 4]}>
        <CustomerProfile />
      </PrivateAuthRoute>
    } />
    <Route path="/services" element={
      <PrivateAuthRoute roles={[1, 2, 3]}>
        <ProvideServices />
      </PrivateAuthRoute>
    } />
    <Route path="/edit-service/:id" element={
      <PrivateAuthRoute roles={[4]}>
        <ServiceUpdate />
      </PrivateAuthRoute>
    } />
    <Route path="/admin-dashboard" element={
      <PrivateAuthRoute roles={[4]}>
        <AdminDashboard />
      </PrivateAuthRoute>
    } />
    <Route path="/employee-dashboard" element={
      <PrivateAuthRoute roles={[1]}>
        <EmployeeDashboard />
      </PrivateAuthRoute>
    } />
    <Route path="/customer-dashboard" element={
      <PrivateAuthRoute roles={[1]}>
        <CustomerDashboard />
      </PrivateAuthRoute>
    } />
  </Routes>
);

export default AppRoutes;
