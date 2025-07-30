import styles from "./Address.module.css"

const Address = () => {

    return (
        <section className={`${styles.infoSection} row g-0 justify-content-center`}>
            <div className={`${styles.map} col-10 col-lg-4 m-2`}>
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1783.1197271917852!2d38.84947399839477!3d8.988440400000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9b66d419a1eb%3A0xd89999a1f770218a!2zU3VtbWl0IE1pbGl0YXJ5IEFwYXJ0bWVudHMgfCDhiLDhiJrhibUg4YiY4Yqo4YiL4Yqo4YurIOGKoOGNk-GIreGJteGImOGKleGJtQ!5e1!3m2!1sam!2set!4v1753435617419!5m2!1sam!2set" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                   
            </div>
            <div className={`${styles.contactInfo} col-10 col-lg-6 m-2 ps-lg-5`}>
                <h2>Our Address <span>____</span></h2>
                <div className={styles.description}>
                    Completely synergize resource taxing relationships via premier niche
                    markets. Professionally cultivate one-to-one customer service.
                </div>
                <address className={styles.address}>
                    <div>
                        <i className="fas fa-map-marker-alt"></i>
                        <p><strong>Address:</strong> <br /> Semit, Addis Ababa, Ethiopia</p>
                    </div>
                    <div>
                        <i className="fas fa-envelope"></i>
                        <p><strong>Email:</strong> <br /> hani.course@gmail.com</p>
                    </div>
                    <div>
                        <i className="fas fa-phone"></i>
                        <p><strong>Phone:</strong> <br />+251 921 259 229</p>
                    </div>
                </address>
            </div>
        </section>
    )
}

export default Address;
