import React, {useState,useEffect, useContext } from 'react';
import './HeaderFooterStyle.css'; // Include your custom CSS styles
import { Link } from 'react-router-dom';
import { MyContext } from '../context/context';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);


  let {Host,isLogIn,logOut}=useContext(MyContext)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  
  return (
    <header className="header">
      <div className="logo">
         <div className="main-logo">
              <Link to="/home">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} width={120} height={600} alt="logo" className="img-fluid" />
              </Link>
            </div>
      </div>
      
      {/* Button for small screens */}
      <button className="nav-toggle" onClick={toggleNav}>
        ☰
      </button>
      
      {/* Navigation links */}
      <nav className={`nav ${isNavOpen ? 'open' : ''}`}>
        <ul className='p-2'>
        
        
         <li> <Link to="/register" > Register </Link> </li>         
         <li> <Link to="/login" > Login </Link> </li> 
         


        </ul>
      </nav>
      
      {/* Background overlay on menu open */}
      {isNavOpen && <div className="overlay" onClick={toggleNav}></div>}
    </header>
  );
};

export default Header;
