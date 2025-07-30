import React from 'react'
import styles from './Skill.module.css'
import image from '../../assets/Images/work1.jpg'

const Skill = () => {

    return (
        <div>
            <div className={`${styles.introduction} row justify-content-center g-0`}>
                <div className={`${styles.textBlock} m-2 col-11 col-md-7 col-xl-6 col-xxl-7`}>
                    <h2>We are highly skilled mechanics <span>____</span></h2>
                    <p>
                        we take pride in being highly skilled mechanics dedicated to keeping your car running smoothly and safely. With years of experience and a passion for excellence, we provide top-notch repair and maintenance services tailored to your vehicle's needs. From routine checkups to complex repairs, trust us to deliver reliable, efficient, and professional care for your car. Your satisfaction and safety are our priorities!
                    </p>
                </div>
                <img className={`${styles.image} m-2 col-11 col-md-4 col-xxl-3`} src={image} alt="Car repair" loading="lazy" />
            </div>
            <div className={styles.border}></div>
        </div>
    )
}

export default Skill;
