import React from 'react'
import { Link } from 'react-router-dom'
import style from "./Testimonial.module.css"

const Testimonial = () => {

    return (
        <section className={style.testimonials}>
            <p>Working since 2000 <span>______</span></p>
            <h1>We are Leader in Car Mechanical Work</h1>
            <div className={style.testimonialsButtons}>
                <Link to="https://www.youtube.com/watch?v=CZ3U5oHLyl8" target="_blank">
                    <i className="fab fa-youtube" />
                </Link>
                <p>Watch Intro Video<br />about us</p>
            </div>
        </section>
    )
}

export default Testimonial;
