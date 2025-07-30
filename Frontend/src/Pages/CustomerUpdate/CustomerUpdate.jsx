import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import customerService from "../../services/customer.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./CustomerUpdate.module.css";

const CustomerUpdate = () => {
    
    const { id } = useParams();
    const [customer, setCustomer] = useState({
        customer_first_name: "",
        customer_last_name: "",
        customer_phone_number: "",
        active_customer_status: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // Fetch customer data
    useEffect(() => {
        const fetchCustomerData = async () => {

            setLoading(true);
            setError(false);

            try {
                const response = await customerService.fetchCustomerById(parseInt(id, 10));
                setCustomer(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(false);

        try {
            await customerService.updateCustomer(id, customer);
            Swal.fire({
                title: "Success!",
                html: "Customer updated successfully",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            setTimeout(() => { navigate(`/customer-profile/${id}`)}, 1500);
        } catch (err) {
            console.error(err);
            if (err === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "error!",
                    html: "Failed to update customer. Please try again!",
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
            <section className={`${styles.updateSection} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (
                        <div className={styles.container}>
                            <h2>
                                Edit: {`${customer.customer_first_name} ${customer.customer_last_name}`} 
                                <span>____</span>
                            </h2>
                            <div className={styles.formContainer}>
                                <h6>Customer email: <strong>{customer.customer_email}</strong></h6>
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <p>First Name:</p>
                                        <input
                                            className={styles.formControl}
                                            type="text"
                                            name="customer_first_name"
                                            value={customer.customer_first_name}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <p>Last Name:</p>
                                        <input
                                            className={styles.formControl}
                                            type="text"
                                            name="customer_last_name"
                                            value={customer.customer_last_name}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <p>Phone Number:</p>
                                        <input
                                            className={styles.formControl}
                                            type="text"
                                            name="customer_phone_number"
                                            value={customer.customer_phone_number}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            <input
                                                type="checkbox"
                                                name="active_customer_status"
                                                checked={customer.active_customer_status}
                                                onChange={handleChange} 
                                            />
                                            <div className={styles.checkmark}>Is active customer</div>
                                        </label>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <button className={styles.updateButton} type="submit"> Update </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </section>
        </Layout>
    );
};

export default CustomerUpdate;
