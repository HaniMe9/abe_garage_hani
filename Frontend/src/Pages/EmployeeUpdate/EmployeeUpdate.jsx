import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import employeeService from "../../services/employee.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./EmployeeUpdate.module.css";

const EmployeeUpdate = () => {

    const { id } = useParams();
    const [employee, setEmployee] = useState({
        employee_first_name: "",
        employee_last_name: "",
        employee_email: "", employee_phone: "",
        employee_role_name: "Employee",
        active_employee: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // Fetch employee data
    useEffect(() => {
        const fetchEmployeeData = async () => {

            setLoading(true);
            setError(false);
            try {
                const response = await employeeService.fetchEmployeeById(parseInt(id, 10));
                setEmployee(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(false);
        
        try {
            const {
                employee_first_name,
                employee_last_name,
                employee_email,
                employee_phone,
                company_role_id,
                active_employee,
            } = employee;
            await employeeService.updateEmployee(id, {
                employee_first_name,
                employee_last_name,
                employee_email,
                employee_phone,
                company_role_id,
                active_employee,
            });
            Swal.fire({
                title: "Updated!",
                html: "The employee has been updated.",
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
        } catch (err) {
            console.error(err);
            if (err === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "error!",
                    html: "Failed to update employee. Please try again!",
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
            <section className={`${styles.updateSection} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (
                        <div className={styles.container}>
                            <h2>
                                Edit: {`${employee.employee_first_name} ${employee.employee_last_name}`}
                                <span>____</span>
                            </h2>
                            <div className={styles.formContainer}>
                                <h6>Employee email: <strong>{employee.employee_email}</strong></h6>
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <input
                                            className={styles.formControl}
                                            type="text"
                                            name="employee_first_name"
                                            value={employee.employee_first_name}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <input
                                            className={styles.formControl}
                                            type="text"
                                            name="employee_last_name"
                                            value={employee.employee_last_name}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <input
                                            className={styles.formControl}
                                            type="text"
                                            name="employee_phone"
                                            value={employee.employee_phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <select
                                            name="company_role_id"
                                            value={employee.company_role_id}
                                            onChange={handleChange}
                                            className={styles.formControl}
                                        >
                                            <option value="1">Employee</option>
                                            <option value="2">Manager</option>
                                            <option value="3">Admin</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            <input
                                                type="checkbox"
                                                name="active_employee"
                                                checked={employee.active_employee}
                                                onChange={handleChange}
                                            />
                                            <div className={styles.checkmark}>Is active employee</div>
                                        </label>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <button className={styles.updateButton} type="submit">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                            {error && <p className={styles.errorMessage}>{error}</p>}
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </section>
        </Layout>
    );
};

export default EmployeeUpdate;
