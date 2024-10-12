import { Link, useNavigate } from "react-router-dom";
import "../pages/css/normalize.css";
import "../pages/css/vendor.css";
import { FaUser, FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useContext, useState, useRef } from "react";
import { MyContext } from "../context/context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles

const MainHeader = ({ brands, categories, subCategories }) => {
  let { totalPrice } = useContext(MyContext);
  let [value, setValue] = useState("");
  const navigate = useNavigate();
  const offcanvasRef = useRef(null); // Create a reference for the offcanvas

  function handleSearch(e) {
    e.preventDefault();
    if (value.length < 1) {
      toast.info("Write the product you want to search about it");
      return;
    }
    const isValidInput = /^[a-zA-Z0-9_]+$/.test(value.trim());

    if (isValidInput) {
      navigate(`/search/${value}`);
    } else {
      toast.error("Invalid word search!");
    }
  }
const closeOffcanvas = () => {
    if (offcanvasRef.current) {
        // Close the offcanvas
        offcanvasRef.current.classList.remove('show');
        offcanvasRef.current.setAttribute('aria-hidden', 'true');

        // Reset body styles
        document.body.classList.remove('modal-open'); // Remove any modal-open class
        document.body.style.paddingRight = ''; // Reset padding

        // Reset opacity and background color
        document.body.style.opacity = '1'; // Reset opacity
        document.body.style.backgroundColor = ''; // Reset background color

        // Simulate a click on the body
        const clickEvent = new MouseEvent('click', { bubbles: true });
        document.body.dispatchEvent(clickEvent);
    }
};




  // Function to handle navigation and closing of the offcanvas
  const handleNavClick = () => {
    closeOffcanvas();
  };

  function logOut(){
      closeOffcanvas();
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_Data");
      window.location.reload()
  }
  return (
    <header>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row py-3 border-bottom">
          <div className="col-sm-4 col-lg-3 text-center text-sm-start">
            <div className="main-logo">
              <Link to="/home">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} width={120} height={600} alt="logo" className="img-fluid" />
              </Link>
            </div>
          </div>

          <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
            <div className="search-bar row bg-light p-2 my-2 rounded-4">
              <div className="col-11 col-md-11">
                <form onSubmit={handleSearch} id="search-form" className="text-center">
                  <input
                    type="text"
                    onChange={(e) => setValue(e.target.value)}
                    className="w-100 p-2 searchinput border-0 bg-transparent"
                    placeholder="Search for more than 20,000 products"
                  />
                </form>
              </div>
              <div className="col-1">
                <button type="submit" form="search-form" className="btn btn-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
            <div className="support-box text-end d-none d-xl-block">
              <span className="fs-6 text-muted">For Support?</span>
              <h5 className="mb-0">+20 1122788629</h5>
            </div>

            <ul className="d-flex justify-content-end list-unstyled m-0">
              <li>
                <Link to="/profile" className="rounded-circle bg-light p-2 mx-1">
                  <FaUser size={24} />
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="rounded-circle bg-light p-2 mx-1">
                  <FaHeart size={24} />
                </Link>
              </li>
              <li className="d-lg">
                <Link to="/cart" className="rounded-circle bg-light p-2 mx-1">
                  <FaShoppingCart size={24} />
                </Link>
              </li>
              
            </ul>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row py-3">
          <div className="d-flex justify-content-center justify-content-sm-between align-items-center">
            <nav className="main-menu d-flex navbar navbar-expand-lg">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                ref={offcanvasRef} // Add reference here
              >
                <div className="offcanvas-header justify-content-center">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    onClick={closeOffcanvas}
                  ></button>
                </div>

                <div className="offcanvas-body">
                  <ul className="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                    <li className="nav-item">
                      <Link to="/home" className="nav-link" onClick={handleNavClick}>Home</Link>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        role="button"
                        id="categories"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Categories
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="categories">
                        {categories ? 
                          categories.map((cat) => (
                            <li key={cat.slug}>
                              <Link className="dropdown-item" to={`/products/category/${cat.slug}`} onClick={handleNavClick}>{cat.name}</Link>
                            </li>
                          )) : null}
                      </ul>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        role="button"
                        id="subcategories"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Sub Categories
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="subcategories">
                        {subCategories ? 
                          subCategories.map((cat) => (
                            <li key={cat.slug}>
                              <Link className="dropdown-item" to={`/products/subCategory/${cat.slug}`} onClick={handleNavClick}>{cat.name}</Link>
                            </li>
                          )) : null}
                      </ul>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        role="button"
                        id="brands"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Brands
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="brands">
                        {brands ? 
                          brands.map((brand) => (
                            <li key={brand.slug}>
                              <Link className="dropdown-item" to={`/products/brand/${brand.slug}`} onClick={handleNavClick}>{brand.name}</Link>
                            </li>
                          )) : null}
                      </ul>
                    </li>
                    <li className="nav-item dropdown">
                      <a 
                        className="nav-link dropdown-toggle" 
                        role="button" 
                        id="aboutUs" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                      >
                        Pages
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="aboutUs">
                        <li><Link className="dropdown-item" to="/cart" onClick={handleNavClick}>Cart</Link></li>
                        <li><Link className="dropdown-item" to="/wishlist" onClick={handleNavClick}>WishList</Link></li>
                        <li><Link className="dropdown-item" to="/orders" onClick={handleNavClick}>My Orders</Link></li>
                        <li><Link className="dropdown-item" to="/profile" onClick={handleNavClick}>Profile</Link></li>
                        <li><Link className="dropdown-item" to="/contact" onClick={handleNavClick}>Contact Us</Link></li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/coupons" onClick={handleNavClick}>All Coupons</Link>
                    </li>
                  
                    <li className="nav-item">
                      <a 
                        type='button' 
                        
                        onClick={logOut} 
                        className="nav-link" 
                      >
                        Log out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
