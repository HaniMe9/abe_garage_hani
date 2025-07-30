import React from 'react'
import { Link } from 'react-router-dom'
import style from "./Appointment.module.css"

const Appointment = () => {

    return (
        <section className={style.appointmentSection}>
            <div className={`${style.appointment} row align-items-center justify-content-between g-0`}>
                <div className="col-12 col-lg-6">
                    <h2>Schedule Your Appointment Today</h2>
                    <p>Repair & Maintenance services specialist</p>
                </div>
                <h2 className="col-12 col-lg-4">Call Us: +251 921 259 229</h2>
                <Link to="/contact-us" className={`${style.contactUs} col-12 col-lg-2`}>Contact Us <span>__</span></Link>
            </div>
        </section>
    )
}

export default Appointment;
