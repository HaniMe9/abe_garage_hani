import React from "react";
import Layout from "../../Layout/Layout";

const EmployeeDashboard = () => {
    return (
        <Layout>
            <div style={{ padding: '2rem' }}>
                <h1>Employee Dashboard</h1>
                <p>Welcome! Here you can view your assigned orders, upcoming appointments, and more.</p>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', minWidth: '200px' }}>
                        <h3>Assigned Orders</h3>
                        <p>--</p>
                    </div>
                    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', minWidth: '200px' }}>
                        <h3>Upcoming Appointments</h3>
                        <p>--</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeDashboard; 