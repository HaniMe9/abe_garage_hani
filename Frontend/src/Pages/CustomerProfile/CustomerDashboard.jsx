import React from "react";
import Layout from "../../Layout/Layout";

const CustomerDashboard = () => {
    return (
        <Layout>
            <div style={{ padding: '2rem' }}>
                <h1>Customer Dashboard</h1>
                <p>Welcome! Here you can view your profile, vehicles, and recent orders.</p>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', minWidth: '200px' }}>
                        <h3>My Vehicles</h3>
                        <p>--</p>
                    </div>
                    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', minWidth: '200px' }}>
                        <h3>Recent Orders</h3>
                        <p>--</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CustomerDashboard; 