import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropup } from "react-icons/io";
import styles from "./Footer.module.css";

const Footer = () => {

    // scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div>
            {/* back to top section */}
            <div onClick={scrollToTop} className={styles.backTop}>
                <IoMdArrowDropup />
                <div>Back to top</div>
            </div>
            <div className={styles.footer}>
                {/* Footer Top Section */}
                <div className={`${styles.contactDetails} row`}>
                    <div className="col-md-4 col-12">
                        <i className="fas fa-map-marker-alt"></i>
                        <p>Semit, Addis Ababa<br />Ethiopia</p>
                    </div>
                    <div className="col-md-4 col-12">
                        <i className="fas fa-envelope"></i>
                        <p>Email us:<br /><a href="mailto:hannayohannes8@gmail.com">hani.course@gmail.com</a></p>
                    </div>
                    <div className="col-md-4 col-12">
                        <i className="fas fa-phone"></i>
                        <p>Call us: <br /><a href="tel:+18325160930">+251 921 259 229</a></p>
                    </div>
                </div>
                {/* Footer Bottom Section */}
                <div className={`${styles.footerBottom} row`}>
                    <p className="d-none d-lg-block col-lg-4">
                        we offer expert auto repair, maintenance, and customization services for all vehicles.<br />
                        <strong>Your ride, our pride!</strong>
                    </p>
                    <div className="col-5 col-md-3 col-lg-2">
                        <h4>Useful Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about-us">About Us</Link></li>
                            <li><Link to="/contact-us">Appointment</Link></li>
                            <li><Link to="/">Testimonials</Link></li>
                            <li><Link to="/contact-us">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="col-7 col-md-4 col-lg-3">
                        <h4>Our Services</h4>
                        <ul>
                            <li>Performance Upgrade</li>
                            <li>Transmission Service</li>
                            <li>Brake Repair & Service</li>
                            <li>Engine Service & Repair</li>
                            <li>Tyre & Wheels</li>
                        </ul>
                    </div>
                    <div className="col-sm-12 col-md-5 col-lg-3">
                        <h4>Newsletter</h4>
                        <p>Get the latest updates and offers.</p>
                        <div className={styles.socialMedia}>
                            <Link to="https://web.facebook.com/hanna.meressa.2025" target="_blank" aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </Link>
                            <Link to="https://x.com/Hanio96" target="_blank" aria-label="Twitter">
                                <i className="fab fa-x-twitter"></i>
                            </Link>
                            <Link to="https://www.instagram.com/hanna3303" target="_blank" aria-label="Instagram">
                                <i className="fab fa-instagram"></i>
                            </Link>
                            <Link to="/" aria-label="Google">
                                <i className="fab fa-google"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
