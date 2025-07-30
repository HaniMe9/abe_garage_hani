import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import serviceService from "../../services/service.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./ProvideServices.module.css";

const ProvideServices = () => {

    const [newservice, setNewservice] = useState({ service_name: "", service_description: "" });
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({});
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    // Fetch all services when the component mounts
    const fetchAllServices = async () => {

        setLoading(true);
        setError(false);

        try {
            const services = await serviceService.getAllServices();
            setServices(services);
        } catch (error) {
            console.error("Error fetching services:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllServices();
    }, []);

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewservice({ ...newservice, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // Add a new service
    const handleAddService = async () => {

        let newErrors = {};

        if (!newservice.service_name.trim()) {
            newErrors.service_name = "Service name is required";
        }

        if (!newservice.service_description.trim()) {
            newErrors.service_description = "Service description is required";
        }

        if (newErrors.service_name || newErrors.service_description) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setError(false);

        try {
            await serviceService.addService(newservice);
            fetchAllServices();
            setNewservice({ service_name: "", service_description: "" });
            Swal.fire({
                title: "Success!",
                html: "Service added successfully.",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
        } catch (error) {
            console.error("Error adding service:", error);
            if (error === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Failed to add service. Please try again.",
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

    // redirect to edit page
    const handleEdit = (id) => { navigate(`/edit-service/${id}`)};

    // Delete a service
    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure you want to delete this service?",
                html: "All related data associated with this service will be deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    cancelButton: styles.cancelButton,
                    icon: styles.icon,
                    title: styles.warningTitle,
                    htmlContainer: styles.text,
                },
            });
            if (!result.isConfirmed) return;
            setLoading(true);
            setError(false);

            await serviceService.deleteService(id);
            setServices(services.filter((service) => service.service_id !== id));

            await Swal.fire({
                title: "Deleted!",
                html: "Service and related data deleted successfully.",
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
            console.error("Error deleting service:", err);
            if (err === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Failed to delete service. Please try again.",
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
            <div className={`${styles.provideServices} row g-0`}>
                <div className="d-none d-xl-block col-3"><AdminMenu /></div>
                <div className="d-block d-xl-none"><AdminMenuMobile /></div>
                <div className="col-12 col-xl-9">
                    {!loading && !error ? (
                        <div className={styles.container}>
                            <h1>Service We Provide <span>____</span></h1>
                            <p> Bring to the table win-win survival strategies to ensure proactive
                                domination. At the end of the day, going forward, a new normal has
                                evolved from generation experiences.
                            </p>
                            <div className={styles.serviceList}>
                                {services.map((service, index) => (
                                    <div key={service.service_id || index} className={styles.service}>
                                        <div className={styles.details}>
                                            <h2>{service.service_name}</h2>
                                            <p>{service.service_description}</p>
                                        </div>
                                        {isAdmin && <div className={styles.actions}>
                                            <button onClick={() => handleEdit(service.service_id)}>
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(service.service_id)}>
                                                <MdDelete />
                                            </button>
                                        </div>}
                                    </div>
                                ))}
                            </div>
                            {isAdmin && <div className={styles.form}>
                                <h1>Add a new Service <span>____</span></h1>
                                {errors.service_name && <div className={styles.error}>
                                    {errors.service_name}
                                </div>}
                                <input
                                    type="text"
                                    name="service_name"
                                    placeholder="Service Name"
                                    value={newservice.service_name}
                                    onChange={handleInputChange}
                                />
                                {errors.service_description && <div className={styles.error}>
                                    {errors.service_description}
                                </div>}
                                <textarea
                                    name="service_description"
                                    placeholder="Service Description"
                                    value={newservice.service_description}
                                    onChange={handleInputChange}
                                />
                                <div className={styles.addButton} onClick={handleAddService}>
                                    Add Service
                                </div>
                            </div>}
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default ProvideServices;

