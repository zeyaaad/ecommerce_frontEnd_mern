import React, { useContext, useEffect, useState } from 'react';
import "./css/wishlist.css";
import axios from 'axios';
import { MyContext } from '../context/context';

import 'react-toastify/dist/ReactToastify.css';  // Import styles
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';
import LoadingPage from '../components/LoadingPage';
import { Link } from 'react-router-dom';
const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
    const{token,Host}=useContext(MyContext)
  let[loading,setLoading]=useState(false)

    useEffect(()=>{
        getWishList()
    },[])

  async function getWishList(){
    try {
        let res=await axios.get(`${Host}/api/v1/ecommerce/wishList`,{
            headers:{
                token:token
            }
        })
        console.log(res.data.data)
        setWishlistItems(res.data.data)
    } catch (error) {
        console.log(error)
    }
  }



  const removeFromWishlist = async (productId) => {
    setLoading(true)
    try {
      let res=await axios.delete(`${Host}/api/v1/ecommerce/wishList/${productId}`,{
        headers:{
          token:token
        }
      })
      console.log(res)
      getWishList()
      toast.success(`product removed successfull`,{
        autoClose: 2000 ,
        position: "top-center"
      })
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error("err to removed successfully")
      
      setLoading(false)
    }
    setLoading(false)

  };

  const clearWishList = async () => {
    setLoading(true)
    try {
      let res=await axios.delete(`${Host}/api/v1/ecommerce/wishList/`,{
        headers:{
          token:token
        }
      })
      console.log(res)
      getWishList()
      toast.info(`wishLsit cleared  successfull`,{
        autoClose: 3000 ,
        position: "top-center"
      })
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error("err to cleared wishLsit  successfully")
      
      setLoading(false)
    }
    setLoading(false)

  };

  return (
    <div className="wishlist-container container">
      {loading&&<Loader/>}
      <ToastContainer/>
      <h2 className="wishlist-title text-start w-100">Your Wishlist</h2>
      <hr />
     {wishlistItems!=null? 
     <>
     {wishlistItems.length == 0 ? (
        <p className="empty-wishlist">Your wishlist is empty</p>
      ) : (
        <div className="wishlist-items ">
          <button className='btn btn-danger w-25' onClick={clearWishList} > Clear  </button>
          {wishlistItems.map((item) => (
            item.product&& <div className="wishlist-item" key={item.id}>
              <div className='data'>
                <Link to={`/productDetails/${item.product._id}`} >
                <img src={item.product.imgCover} alt={item.product.title} className="wishlist-item-image" />
                </Link>
              <div className="wishlist-item-details">
                <h3>{item.product.title}</h3>
                <p>Price: ${item.product.price}</p>
              </div>
              </div>
                <button onClick={() => removeFromWishlist(item._id)} className="wishlist-remove-btn">
                  Remove
                </button>
            </div>
           
          ))}
        </div>
      )}
     </>
     
     :<LoadingPage/>}
    </div>
  );
};

export default Wishlist;
