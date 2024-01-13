import React from "react";
import Logo from "../../assests/Logo/mainLogo.png";
import stylesNd from "./LoadingComp.module.css"
const LoadingComp = () =>{
    return(
        
            <div className={stylesNd.overlay}>
            <div className={stylesNd.spinnerContainer}>
            <div className={stylesNd.loadingContainer}>
          <div className={stylesNd.heart}>
            <span role="img" aria-label="Heartbeat">
              <img alt="waiting" src={Logo} width="200px" height="auto" />
            </span>
          </div>
          <p>در حال بارگذاری</p>
          
        </div>
                
              <div className={stylesNd.spinner}></div>
            </div>
          </div>
            
    )
}
export default LoadingComp;