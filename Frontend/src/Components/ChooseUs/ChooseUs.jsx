import React from 'react'
import additional from "../../assets/images/additional.jpg"
import style from "./ChooseUs.module.css"

const ChooseUs = () => {

    return (
        <section className="row justify-content-center g-0">
            {/* Why Choose Us Section */}
            <div className={`${style.whyChooseUs} ps-lg-4 col-11 col-md-5 col-lg-4`}>
                <h2>Why Choose Us <span>____</span></h2>
                <ul>
                    {[
                        { icon: "🛠️", title: "Certified Expert Mechanics" },
                        { icon: "🏅", title: "Fast and Quality Service" },
                        { icon: "💲", title: "Best Prices in Town" },
                        { icon: "📅", title: "convenient Appointments" },
                        { icon: "🏆", title: "Awarded Workshop" },
                    ].map((benefit, index) => (
                        <li key={index} className={style.benefit}>
                            {benefit.icon} {benefit.title}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Additional Services Section */}
            <div className={`${style.additionalServices} col-11 col-md-6 col-lg-8 col-xl-7 col-xxl-6`}>
                <h2>Additional Services <span>____</span></h2>
                <div className="row justify-content-center g-0">
                    <img className="d-none d-lg-block col-lg-5" src={additional} alt="Additional Service" loading="lazy"/>
                    <ul className="col-lg-7">
                        <li>General Auto Repair & Maintenance</li>
                        <li>Transmission Repair & Replacement</li>
                        <li>Tire Repair and Replacement</li>
                        <li>State Emissions Inspection</li>
                        <li>Brake Job / Brake Services</li>
                        <li>Electrical Diagnostics</li>
                        <li>Fuel System Repairs</li>
                        <li>Starting and Charging Repair</li>
                        <li>Steering and Suspension Work</li>
                        <li>Emission Repair Facility</li>
                        <li>Wheel Alignment</li>
                        <li>Computer Diagnostic Testing</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default ChooseUs;
