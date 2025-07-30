import React from "react";
import Layout from "../../Layout/Layout";
import NavBanner from "../../Components/NavBanner/NavBanner";
import Address from "../../Components/Address/Address";
import Appointment from "../../Components/Appointment/Appointment";

const ContactUs = () => {

    return (
        <Layout>
            <NavBanner title="Contact Us" />
            <Address />
            <Appointment />
        </Layout>
    );
};

export default ContactUs;
