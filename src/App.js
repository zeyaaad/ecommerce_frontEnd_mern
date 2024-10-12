import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/Register';
import LogIn from './pages/LogIn';
import { MyContext } from './context/context';
import Home from './pages/Home';
import Layout from './components/Layout';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetalis';
import Wishlist from './pages/WishList';
import CategoryProducts from './pages/CategoryProducts';
import SubCategoryProducts from './pages/SubCategoryProducts';
import BrandProducts from './pages/BrandProducts';
import Search from './pages/Search';
import Error from './pages/Error';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import SuccessCach from './pages/SuccessCach';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Verfiy from './pages/Verfiy';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Coupons from './pages/Coupons';
import ChangeEmail from './pages/ChangeEmail';
import VerfiyChaneEmail from './pages/VerfiyChangeEmail';

function App() {
    const {ProtectAuth,ProtectRoute } = useContext(MyContext);
  return (
    <> 
      <Routes>
        {/* Auth */}
        <Route path="" element={<ProtectAuth><LogIn /></ProtectAuth>} />
        <Route path="/register" element={<ProtectAuth><RegisterPage /></ProtectAuth>} />
        <Route path="/login" element={<ProtectAuth><LogIn /></ProtectAuth>} />
        <Route path="/forget-password" element={<ProtectAuth><ForgetPassword /></ProtectAuth>} />

        <Route
          path="/verify"
          element={<ProtectAuth><Verfiy /></ProtectAuth>}> 
          <Route
        
          path="/verify/:token"
          element={<ProtectAuth><Verfiy /></ProtectAuth>}
        />
        </Route>

        <Route
          path="/reset-password"
          element={<ProtectAuth><ResetPassword /></ProtectAuth>}> 
          <Route
        
          path="/reset-password/:token"
          element={<ProtectAuth><ResetPassword /></ProtectAuth>}
        />
        </Route>







        <Route path="/home" element={<ProtectRoute><Layout><Home /></Layout></ProtectRoute>} />
        <Route path="/cart" element={<ProtectRoute><Layout><Cart /></Layout></ProtectRoute>} />
        <Route path="/wishlist" element={<ProtectRoute><Layout><Wishlist /></Layout></ProtectRoute>} />
        <Route path="/error" element={<ProtectRoute><Layout><Error /></Layout></ProtectRoute>} />
        <Route path="/contact" element={<ProtectRoute><Layout><Contact /></Layout></ProtectRoute>} />
        <Route path="/orders" element={<ProtectRoute><Layout><Orders /></Layout></ProtectRoute>} />
        <Route path="/success" element={<ProtectRoute><Layout><SuccessCach /></Layout></ProtectRoute>} />
        <Route path="/profile" element={<ProtectRoute><Layout><Profile /></Layout></ProtectRoute>} />
        <Route path="/coupons" element={<ProtectRoute><Layout><Coupons /></Layout></ProtectRoute>} />
        <Route path="/changeEmail" element={<ProtectRoute><Layout><ChangeEmail /></Layout></ProtectRoute>} />
      
      
        <Route
          path="/orderDetails"
          element={<ProtectRoute><Layout><OrderDetails /></Layout></ProtectRoute>}> 
          <Route
        
          path="/orderDetails/:id"
          element={<ProtectRoute><Layout><OrderDetails /></Layout></ProtectRoute>}
        />
        </Route>
        <Route
          path="/productDetails"
          element={<ProtectRoute><Layout><ProductDetails /></Layout></ProtectRoute>}> 
          <Route
        
          path="/productDetails/:id"
          element={<ProtectRoute><Layout><ProductDetails /></Layout></ProtectRoute>}
        />
        </Route>
        <Route
          path="/search"
          element={<ProtectRoute><Layout><Search /></Layout></ProtectRoute>}> 
          <Route
        
          path="/search/:value"
          element={<ProtectRoute><Layout><Search /></Layout></ProtectRoute>}
        />
        </Route>
        <Route
          path="/products/category"
          element={<ProtectRoute><Layout><CategoryProducts /></Layout></ProtectRoute>}> 
          <Route
        
          path="/products/category/:slug"
          element={<ProtectRoute><Layout><CategoryProducts /></Layout></ProtectRoute>}
        />
        </Route>
        <Route
          path="/products/subCategory"
          element={<ProtectRoute><Layout><SubCategoryProducts /></Layout></ProtectRoute>}> 
          <Route
        
          path="/products/subCategory/:slug"
          element={<ProtectRoute><Layout><SubCategoryProducts /></Layout></ProtectRoute>}
        />
        </Route>
        <Route
          path="/products/brand"
          element={<ProtectRoute><Layout><BrandProducts /></Layout></ProtectRoute>}> 

          <Route
        
          path="/products/brand/:slug"
          element={<ProtectRoute><Layout><BrandProducts /></Layout></ProtectRoute>}
        />
        </Route>
        <Route
          path="/verifyChangeEmail"
          element={<ProtectRoute><Layout><VerfiyChaneEmail /></Layout></ProtectRoute>}> 

          <Route
        
          path="/verifyChangeEmail/:token"
          element={<ProtectRoute><Layout><VerfiyChaneEmail /></Layout></ProtectRoute>}
        />
        </Route>



        {/* <Route path="/*" element={<ProtectAuth><NotFound /></ProtectAuth>} /> */}
        <Route path="/*" element={<ProtectRoute><Layout><NotFound /></Layout></ProtectRoute>} />

      </Routes>
    </>
  );
}

export default App;
