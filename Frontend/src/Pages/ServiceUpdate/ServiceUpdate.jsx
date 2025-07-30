import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import serviceService from "../../services/service.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./ServiceUpdate.module.css";


const ServiceUpdate = () => {

    const { id } = useParams();
    const [service, setService] = useState({ service_name: "", service_description: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // Fetch service data when the component mounts
    useEffect(() => {

        setLoading(true);
        setError(false);

        const fetchServiceData = async () => {
            try {
                const response = await serviceService.getServiceById(parseInt(id, 10));
                setService(response);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceData();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setService((prevService) => ({
            ...prevService,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle form submission for updating the service
    const handleUpdateService = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(false);

        try {
            await serviceService.updateService(id, service);
            Swal.fire({
                title: "Success!",
                html: "Service updated successfully.",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            setTimeout(() => { navigate("/services")}, 1500);
        } catch (err) {
            console.error(err);
            if (err === "Failed") {
                setError(true);
            } else {                
                Swal.fire({
                    title: "error!",
                    html: "Failed to update service. Please try again!",
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
            <div className={`${styles.container} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (
                        <div className={styles.content}>
                            <h2>Update Service <span>___</span></h2>
                            <form onSubmit={handleUpdateService}>
                                <input
                                    type="text"
                                    name="service_name"
                                    placeholder="Service Name"
                                    value={service.service_name}
                                    onChange={handleChange}
                                    required
                                />
                                <textarea
                                    name="service_description"
                                    placeholder="Service Description"
                                    value={service.service_description}
                                    onChange={handleChange}
                                    required
                                />
                                <div>
                                    <button type="submit" className={styles.addButton}>
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default ServiceUpdate;
