import React, { useEffect } from 'react';

import HeaderHorizontal from "./HeaderHorizontal";

import { Footer } from "./Footer";

export const BaseHorizontal = (props) =>{
    useEffect(()=>{
        props.actions.changeSetting("horizontal", true);
        return () =>  props.actions.changeSetting("horizontal", true);
       },[])
 return (
        <div className="wrapper">
          <HeaderHorizontal />
  
          <section className={"section-container " + (props.customerId ? "admin-section-container" : "")}>{this.props.children}</section>
  
          <Footer />
        </div>
      );
}


  
  export default BaseHorizontal;