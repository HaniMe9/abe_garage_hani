import React from "react";
import Layout from "../../Layout/Layout";
import Banner from "../../Components/Banner/Banner";
import Experience from "../../Components/Experience/Experience";
import OurService from "../../Components/OurService/OurService";
import Quality from "../../Components/Quality/Quality";
import ChooseUs from "../../Components/ChooseUs/ChooseUs";
import Testimonial from "../../Components/Testimonial/Testimonial";
import Appointment from "../../Components/Appointment/Appointment";

const Home = () => {
    
    return (
        <Layout>
            <Banner />
            <Experience />
            <OurService />
            <Quality />
            <ChooseUs />
            <Testimonial />
            <Appointment />
        </Layout>
    );
};

export default Home;
