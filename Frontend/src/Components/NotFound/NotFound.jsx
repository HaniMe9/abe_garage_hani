import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Oops! Page not found.</p>
        <Link to="/" className={styles.link}>
          Go back home
        </Link>
      </div>
  );
};

export default NotFound;
