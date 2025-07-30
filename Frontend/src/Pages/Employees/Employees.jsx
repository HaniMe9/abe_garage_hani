import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import employeeService from "../../services/employee.service";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import Layout from "../../Layout/Layout";
import styles from "./Employees.module.css";

const EmployeeList = () => {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [newOrdersRecipient, setNewOrdersRecipient] = useState("");
    const [showUpdateSection, setShowUpdateSection] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const itemsPerPage = 10;
    
    // Fetch employees
    useEffect(() => {
        const fetchEmployeesData = async () => {

            setLoading(true);
            setError(false);

            try {
                const response = await employeeService.fetchEmployees();
                setEmployees(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeesData();
    }, []);

    // Function to format date
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        return `${month}-${day}-${year}`;
    };

    // Function to handle page change
    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Calculate total pages
    const totalPages = Math.ceil(employees.length / itemsPerPage);
    const displayedEmployees = employees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Function to handle edit
    const handleEdit = (id) => {
        navigate(`/edit-employee/${id}`);
    };

    // Function to handle delete
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure you want to delete this employee?",
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

                // fetch the employee data
                try {
                    const { data: employee } = await employeeService.fetchEmployeeById(id);
                    setSelectedEmployee(employee);

                    if (employee.order_id) {
                        if (employee.employee_email === "admin@admin.com") {
                            Swal.fire({
                                title: "Oops!",
                                html: "You cannot delete this employee!",
                                icon: "info",
                                customClass: {
                                    popup: styles.popup,
                                    confirmButton: styles.confirmButton,
                                    icon: styles.icon,
                                    title: styles.infoTitle,
                                    htmlContainer: styles.text,
                                },
                            });
                            return;
                        }
                        Swal.fire({
                            title: "Reassignment Required!",
                            html: "Before deleting this employee, you must reassign their orders to another employee.",
                            icon: "info",
                            customClass: {
                                popup: styles.popup,
                                confirmButton: styles.confirmButton,
                                icon: styles.icon,
                                title: styles.infoTitle,
                                htmlContainer: styles.text,
                            },
                        }).then(() => {
                            setShowUpdateSection(true);
                        });
                    } else {
                        // delete the employee
                        await employeeService.deleteEmployee(id);
                        setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.employee_id !== id));
                        Swal.fire({
                            title: "Deleted!",
                            html: "Employee has been deleted successfully.",
                            icon: "success",
                            customClass: {
                                popup: styles.popup,
                                confirmButton: styles.confirmButton,
                                icon: styles.icon,
                                title: styles.successTitle,
                                htmlContainer: styles.text,
                            },
                        });
                    }
                } catch (err) {
                    console.error("Error deleting employee:", err);
                    if (err === "Failed") {
                        setError(true);
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: "Failed to delete employee. Please try again.",
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
        });
    };

    // Filter employees
    useEffect(() => {
        const filterEmployees = employees.filter(
            (employee) =>
                (employee.company_role_id === 2 || employee.company_role_id === 3) &&
                employee.employee_id !== selectedEmployee?.employee_id
        );
        setFilteredEmployees(filterEmployees);
    }, [selectedEmployee, employees]);

    // Function to handle update
    const handleUpdate = async () => {
        if (!newOrdersRecipient) {
            Swal.fire({
                title: "Missing Recipient!",
                html: "Please select a new recipient before proceeding.",
                icon: "error",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.errorTitle,
                    htmlContainer: styles.text,
                },
            });
            return;
        }

        setLoading(true);
        setError(false);

        try {
            // Reassign the orders
            await employeeService.updateEmployeeOrders(
                selectedEmployee?.employee_id,
                newOrdersRecipient
            );

            // Delete the employee after successful reassignment
            await employeeService.deleteEmployee(selectedEmployee?.employee_id);

            // Update the employees list
            setEmployees((prevEmployees) =>
                prevEmployees.filter((emp) => emp.employee_id !== selectedEmployee?.employee_id)    
            );

            setShowUpdateSection(false);
            Swal.fire({
                title: "Deleted!",
                html: "orders reassigned and employee deleted successfully.",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
        } catch (err) {
            console.error(err);
            if(err === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "error!",
                    html: "Failed to delete employee. Please try again!",
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
                <div className="d-none d-xxl-block col-2"><AdminMenu /></div>
                <div className="d-block d-xxl-none"><AdminMenuMobile /></div>
                <div className="col-12 col-xxl-10">
                    {!loading && !error ? (
                        <div>
                            {!showUpdateSection && (
                                <div className={styles.employeeList}>
                                    <h2>Employees <span>____</span></h2>
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>Active</th>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Added Date</th>
                                                    <th>Role</th>
                                                    {isAdmin && <th>Actions</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayedEmployees.length > 0 ? (
                                                    displayedEmployees.map((employee) => (
                                                        <tr key={employee.employee_id}>
                                                            <td>{employee.active_employee ? "Yes" : "No"}</td>
                                                            <td>{employee.employee_first_name}</td>
                                                            <td>{employee.employee_last_name}</td>
                                                            <td>{employee.employee_email}</td>
                                                            <td>{employee.employee_phone}</td>
                                                            <td>{formatDate(employee.added_date)}</td>
                                                            <td>{employee.company_role_name}</td>
                                                            {isAdmin && (
                                                                <td>
                                                                    <button onClick={() => handleEdit(employee.employee_id)}>
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(employee.employee_id)}>
                                                                        <MdDelete />
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8">No employees found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Pagination */}
                                    <div className={styles.pagination}>
                                        <button
                                            onClick={() => handlePageChange("prev")}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                        <span>Page {currentPage} of {totalPages}</span>
                                        <button
                                            onClick={() => handlePageChange("next")}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* Update Orders Recipient Section */}
                            {showUpdateSection && (
                                <div className={styles.employeeList}>
                                    <h2>Update Orders Recipient <span>____</span></h2>
                                    <p>
                                        Please reassign all orders associated with
                                        <strong>
                                            {" "}{selectedEmployee?.employee_first_name}{" "}
                                            {selectedEmployee?.employee_last_name}{" "}
                                        </strong>
                                        before deletion.
                                    </p>
                                    <div className={styles.newRecipient}>
                                        <label>Select New Recipient:</label>
                                        <select
                                            id="newOrdersRecipient"
                                            value={newOrdersRecipient}
                                            onChange={(e) => setNewOrdersRecipient(e.target.value)}
                                        >
                                            <option value="" disabled>Select an employee</option>
                                            {filteredEmployees.map((employee) => (
                                                <option key={employee.employee_id} value={employee.employee_id}>
                                                    {employee.employee_first_name}{" "}
                                                    {employee.employee_last_name}
                                                </option>
                                            ))}
                                        </select>
                                        <div onClick={handleUpdate} className={styles.button}>
                                            Update
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeList;
