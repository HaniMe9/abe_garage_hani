import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import Layout from "../../Layout/Layout";
import customerService from "../../services/customer.service";
import styles from "./AddCustomer.module.css";

const Register = () => {
    const [formData, setFormData] = useState({
        customer_first_name: "",
        customer_last_name: "",
        customer_email: "",
        customer_phone_number: "",
        active_customer_status: 1,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        });
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.customer_email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.customer_email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }
        const nameRegex = /^[A-Za-z]{2,}([ '-][A-Za-z]+)*$/;
        if (!formData.customer_first_name) {
            newErrors.first_name = "First name is required";
            isValid = false;
        } else if (!nameRegex.test(formData.customer_first_name)) {
            newErrors.first_name = "Invalid first name format";
            isValid = false;
        }
        if (!formData.customer_last_name) {
            newErrors.last_name = "Last name is required";
            isValid = false;
        } else if (!nameRegex.test(formData.customer_last_name)) {
            newErrors.last_name = "Invalid last name format";
            isValid = false;
        }
        const phoneRegex = /^(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
        if (!formData.customer_phone_number) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!phoneRegex.test(formData.customer_phone_number)) {
            newErrors.phone = "Phone number must be 10 digits";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const generateCustomerHash = () => {
        const dataToHash =
            formData.customer_first_name +
            formData.customer_last_name +
            formData.customer_email;
        return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Base64);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const customerHash = generateCustomerHash();
        const formDataWithHash = {
            ...formData,
            customer_hash: customerHash,
        };
        setLoading(true);
        try {
            await customerService.addCustomer(formDataWithHash);
            Swal.fire({
                title: "Success!",
                html: "Registration successful! Please sign in.",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            setTimeout(() => { navigate("/login") }, 1500);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                html: `${error}. Please try again!`,
                icon: "error",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.errorTitle,
                    htmlContainer: styles.text,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className={styles.background}>
                <div className="col-12 col-md-8 offset-md-2">
                    <div className={styles.container}>
                        <h2>Register as a Customer <span>____</span></h2>
                        <div className={styles.formContainer}>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupContainer}>
                                    <div>
                                        {errors.first_name && (
                                            <div className={styles.error}>{errors.first_name}</div>
                                        )}
                                        <input
                                            type="text"
                                            name="customer_first_name"
                                            placeholder="First name *"
                                            value={formData.customer_first_name}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </div>
                                    <div>
                                        {errors.last_name && (
                                            <div className={styles.error}>{errors.last_name}</div>
                                        )}
                                        <input
                                            type="text"
                                            name="customer_last_name"
                                            placeholder="Last name *"
                                            value={formData.customer_last_name}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </div>
                                    <div>
                                        {errors.email && (
                                            <div className={styles.error}>{errors.email}</div>
                                        )}
                                        <input
                                            type="email"
                                            name="customer_email"
                                            placeholder="Email *"
                                            value={formData.customer_email}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </div>
                                    <div>
                                        {errors.phone && (
                                            <div className={styles.error}>{errors.phone}</div>
                                        )}
                                        <input
                                            type="text"
                                            name="customer_phone_number"
                                            placeholder="Phone number *"
                                            value={formData.customer_phone_number}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </div>
                                </div>
                                <button className={styles.submitButton} type="submit" disabled={loading}>
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register; 