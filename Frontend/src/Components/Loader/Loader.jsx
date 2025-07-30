import React from 'react'
import { FadeLoader } from "react-spinners";
import style from "./Loader.module.css"

const Loader = () => {
  return (
    <div className={style.loader}>
      <FadeLoader color="#07184A" />
    </div>
  );
}

export default Loader;