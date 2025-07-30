import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import Swal from "sweetalert2";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import employeeService from "../../services/employee.service";
import Loader from "../../Components/Loader/Loader";
import NotFound from "../../Components/NotFound/NotFound";
import Layout from "../../Layout/Layout";
import styles from "./AddEmployee.module.css";

const AddEmployee = () => {

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [employee, setEmployee] = useState({
    employee_email: "",
    employee_first_name: "",
    employee_last_name: "",
    employee_phone: "",
    employee_password: "",
    active_employee: 1,
    company_role_id: 1
  });
  const navigate = useNavigate();

  // Get the logged in employee
  const { employee: loggedInEmployee } = useAuth();
  const loggedInEmployeeToken = loggedInEmployee?.employee_token || "";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({...prev, [name]: value}));
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!employee.employee_email) {
      newErrors.employee_email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(employee.employee_email)) {
      newErrors.employee_email = "Invalid email format";
      isValid = false;
    }

    // Name validation
    const nameRegex = /^[A-Za-z]{2,}([ '-][A-Za-z]+)*$/;
    if (!employee.employee_first_name) {
      newErrors.employee_first_name = "First name is required";
      isValid = false;
    } else if (!nameRegex.test(employee.employee_first_name)) {
      newErrors.employee_first_name = "Invalid first name format";
      isValid = false;
    }

    if (!employee.employee_last_name) {
      newErrors.employee_last_name = "Last name is required";
      isValid = false;
    } else if (!nameRegex.test(employee.employee_last_name)) {
      newErrors.employee_last_name = "Invalid last name format";
      isValid = false;
    }

    // Phone validation (must be 10 digits)
    const phoneRegex = /^(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
    if (!employee.employee_phone) {
      newErrors.employee_phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(employee.employee_phone)) {
      newErrors.employee_phone = "Phone number must be 10 digits";
      isValid = false;
    }

    // Password validation
    if (!employee.employee_password || employee.employee_password.length < 8) {
      newErrors.employee_password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(false);

    try {
      const data = await employeeService.addEmployee(employee, loggedInEmployeeToken);
      Swal.fire({
        title: "Success!",
        html: "Employee added successfull!",
        icon: "success",
        customClass: {
          popup: styles.popup,
          confirmButton: styles.confirmButton,
          icon: styles.icon,
          title: styles.successTitle,
          htmlContainer: styles.text,
        },
      });
      
      setTimeout(() => { navigate("/employees")}, 1500);
    } catch (error) {
      console.error("Error adding employee:", error);
      if (error === "Failed") {
        setError(true);
      } else {
        Swal.fire({
          title: "Error!",
          html: `${error}. Please try again.`,
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
  };

  return (
    <Layout>
      <div className={`${styles.contactSection} row g-0`}>
        <div className="d-none d-md-block col-3"><AdminMenu /></div>
        <div className="d-block d-md-none"><AdminMenuMobile /></div>
        <div className="col-12 col-md-9">
          {!loading && !error ? (<div>
          <div className={styles.container}>
            <h2>Add a new employee <span>____</span></h2>
            <div className={styles.contactForm}>
              <div className={styles.innerContainer}>
                <div className={styles.formContainer}>
                  <div className={styles.form}>
                    <form onSubmit={handleSubmit}>
                      <div className={styles.formGroupContainer}>
                        <div className={styles.formGroup}>
                          {errors.employee_email && (
                            <div className={styles.error}>{errors.employee_email}</div>
                          )}
                          <input
                            className={styles.formControl}
                            name="employee_email"
                            placeholder="Employee email *"
                            value={employee.employee_email}
                            onChange={handleChange}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          {errors.employee_first_name && (
                            <div className={styles.error}>{errors.employee_first_name}</div>
                          )}
                          <input
                            className={styles.formControl}
                            type="text"
                            name="employee_first_name"
                            placeholder="Employee first name *"
                            value={employee.employee_first_name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          {errors.employee_last_name && (
                            <div className={styles.error}>{errors.employee_last_name}</div>
                          )}
                          <input
                            className={styles.formControl}
                            type="text"
                            name="employee_last_name"
                            placeholder="Employee last name *"
                            value={employee.employee_last_name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          {errors.employee_phone && (
                            <div className={styles.error}>{errors.employee_phone}</div>
                          )}
                          <input
                            className={styles.formControl}
                            type="text"
                            name="employee_phone"
                            placeholder="Employee phone (555) 555-5555 *"
                            value={employee.employee_phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <div className={styles.selectContainer}>
                            <select
                              name="company_role_id"
                              className={styles.formControl}
                              value={employee.company_role_id}
                              onChange={handleChange}
                            >
                              <option value="1">Employee</option>
                              <option value="2">Manager</option>
                              <option value="3">Admin</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          {errors.employee_password && (
                            <div className={styles.error}>{errors.employee_password}</div>
                          )}
                          <input
                            className={styles.formControl}
                            type="password"
                            name="employee_password"
                            placeholder="Employee password *"
                            value={employee.employee_password}
                            onChange={handleChange}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <button className={styles.submitButton} type="submit">Add Employee</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>) : error ? <NotFound /> : <Loader />}
        </div>
      </div>
    </Layout>
  );
};

export default AddEmployee;
