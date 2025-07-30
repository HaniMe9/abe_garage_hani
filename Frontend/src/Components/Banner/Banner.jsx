import React from 'react'
import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa';
import style from "./Banner.module.css"

const Banner = () => {

  return (
    <div className={style.banner}>
      <p>Working since 2000 <span>______</span></p>
      <h1>Tuneup Your Car to Next Level</h1>
      <div className={style.bannerButtons}>
        <a href="https://www.youtube.com/watch?v=CZ3U5oHLyl8" target="_blank">
          <i className="fab fa-youtube" />
        </a>
        <p>Watch Intro Video<br />about us</p>
      </div>
      <Link className={style.appointment}>Make an Appointment <FaChevronRight /></Link>
    </div>
  );
}

export default Banner;
