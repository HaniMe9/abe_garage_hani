import React from 'react'
import engine from "../../assets/images/engine.jpg"
import style from "./Experience.module.css"
import { Link } from 'react-router-dom';

const Experience = () => {

    return (
        <section className={`${style.experience} row justify-content-center g-0`}>
            <img className="d-none d-lg-block m-2 col-lg-3" src={engine} alt="Left" loading="lazy"/>
            <div className="m-2 col-11 col-lg-8 col-xl-7">
                <h2>We have 24 years of experience <span>____</span></h2>
                <p>
                    At <strong>ABE GARAGE</strong>, our skilled technicians have provided
                    top-quality repairs, maintenance, and customer service.From routine
                    oil changes to complex engine diagnostics, we’ve consistently stayed
                    ahead of industry advancements to ensure your vehicle performs at its
                    best. <strong>Visit us today</strong>, and let us keep you safely on
                    the road for years to come.
                </p>
                <Link to="/about-us" className={style.aboutButton}>About Us ____</Link>
                <div className={`${style.aboutUs} d-none d-xxl-block`}>
                    Fast, Reliable, and Always Road-Ready for Your Journey.
                </div>
            </div>
        </section>
    );
}

export default Experience;
