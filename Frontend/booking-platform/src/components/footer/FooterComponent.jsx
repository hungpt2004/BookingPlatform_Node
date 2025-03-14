import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css"; // File chứa CSS animation

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row fade-in">
          <div className="col-md-6">
            <h2 className="brand-name">Travelofy</h2>
            <p>Khu Cong Nghiep FPT, phuong Hoa Hai, Thanh pho Da Nang</p>
            <p>Viet Nam, VN</p>
            <p>
              <span className="fw-bold">Phone:</span> +1 5589 55488 55
            </p>
            <p>
              <span className="fw-bold">Email:</span> info@gmail.com
            </p>
            <div className="social-icons">
              <FaFacebook className="social-icon" />
              <FaTwitter className="social-icon" />
              <FaInstagram className="social-icon" />
              <FaLinkedin className="social-icon" />
            </div>
          </div>

          <div className="col-md-3">
            <h6 className="footer-heading">Useful Links</h6>
            <ul className="footer-list">
              <li>
                <IoIosArrowForward /> Home
              </li>
              <li>
                <IoIosArrowForward /> About Us
              </li>
              <li>
                <IoIosArrowForward /> Services
              </li>
              <li>
                <IoIosArrowForward /> Terms of service
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="footer-heading">Our Services</h6>
            <ul className="footer-list">
              <li>
                <IoIosArrowForward /> Booking
              </li>
              <li>
                <IoIosArrowForward /> Become Owner
              </li>
              <li>
                <IoIosArrowForward /> Marketing
              </li>
              <li>
                <IoIosArrowForward /> Destination
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-4">
          <p>&copy; {new Date().getFullYear()} Travelofy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
