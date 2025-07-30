import React from 'react'
import dashboard from "../../assets/images/dashboard.jpg"   
import style from "./Quality.module.css"

const Quality = () => {

    return (
        <section className={`${style.qualityService} row g-0`}>
            <div className="col-12 p-3 p-xl-5 col-md-8 col-lg-7 col-xxl-6">
                <h2>Quality Service and Customer Satisfaction</h2>
                <p>
                    At our auto repair shop, we prioritize quality service and customer satisfaction above all else. Our experienced technicians ensure every repair and maintenance task is completed with precision and care. We’re dedicated to keeping your vehicle running at its best while providing a hassle-free and friendly experience you can trust.
                </p>
            </div>
            <img className="d-none d-md-block col-4 col-lg-5 col-xxl-6" src={dashboard} alt="Quality Service" loading="lazy"/>
        </section>
    )
}

export default Quality;
