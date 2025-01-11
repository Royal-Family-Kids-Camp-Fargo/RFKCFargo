import React from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>Fargo, ND</p>
        <p className="contact-info">
          <span className="contact-item">
            <FaPhone className="icon" />
            <a href="tel:+16057707731">+1 (605) 770-7731</a>
          </span>
          <span className="separator">|</span>
          <span className="contact-item">
            <FaEnvelope className="icon" />
            <a href="mailto:ftcfargo@gmail.com">ftcfargo@gmail.com</a>
          </span>
        </p>
        <p>Copyright © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

export default Footer;
