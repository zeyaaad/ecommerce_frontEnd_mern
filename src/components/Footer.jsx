// Footer.js
import React from 'react';
import './Footer.css'; // Create a separate CSS file for styles
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa'; // Import icons from react-icons
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
    return (
        <footer className="footer mt-4">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>About Us</h4>
                    <p>Learn more about our company and mission.</p>
                </div>
                <div className="footer-section">
                    <h4>Customer Service</h4>
                    <ul>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                        <li><Link to="/wishlist">Wishlist</Link></li>
                        <li><Link to="/orders">Orders</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Categories</h4>
                    <ul>
                        <li><Link to="/products/category/electronics">Electronics</Link></li>
                        <li><Link to="/products/category/home-and-kitchen">Home & Kitchen</Link></li>
                        <li><Link to="/products/category/clothing"> Clothing</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Follow Me</h4>
                    <ul className="social-media">
                        <li><a href="https://www.facebook.com/zeyd.mohad?locale=ar_AR" target="_blank" rel="noopener noreferrer"><FaFacebook style={{ fontSize: "25px" }} /></a></li>
                        <li><a href="https://www.linkedin.com/in/zeyad-m-muhammedin-2a3097287/" target="_blank" rel="noopener noreferrer"><FaLinkedin style={{ fontSize: "25px" }} /></a></li>
                        <li><a href="https://www.instagram.com/zeyad.__.mohamed/" target="_blank" rel="noopener noreferrer"><FaInstagram style={{ fontSize: "25px" }} /></a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 Your Zezo Ecommerce. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
