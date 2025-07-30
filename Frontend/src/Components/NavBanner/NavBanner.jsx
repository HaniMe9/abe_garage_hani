import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import styles from './NavBanner.module.css'

const NavBanner = ({ title }) => {

    return (
        <section className={styles.mainBanner}>
            <div className={styles.bannerContent}>
                <h1>{title}</h1>
                <nav className={styles.nav}>
                    <span className={styles.home}>Home</span>
                    <IoIosArrowForward />
                    <span>{title}</span>
                </nav>
            </div>
        </section>
    )
}

export default NavBanner;
