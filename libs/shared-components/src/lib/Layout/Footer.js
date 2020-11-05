import React from 'react';

export const Footer = (props) => {
  const year = new Date().getFullYear()

    return (
      <footer className="footer-container">
        <span>
          &copy; {year} - {props.productName}
        </span>
      </footer>
    );    
    

}
