import React from 'react'
import Layout from '../../Layout/Layout';
import NavBanner from '../../Components/NavBanner/NavBanner';
import OurService from '../../Components/OurService/OurService';
import Appointment from '../../Components/Appointment/Appointment';
import ChooseUs from '../../Components/ChooseUs/ChooseUs';

const AbeServices = () => {
    return (
        <Layout>
            <NavBanner title="Services" />
            <ChooseUs />
            <OurService />
            <Appointment />
        </Layout>
    )
}

export default AbeServices;
