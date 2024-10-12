import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

const MyContext = createContext();

const MyProvider = ({ children }) => {
  
  const[userCart,setUserCart]=useState(null);
  const[userWishList,setUserWishList]=useState(null);
  const[totalPrice,setTotalPrice]=useState(null)
    const[isLogIn,setIsLogIn]=useState(null)
  const [token,setToken]=useState(localStorage.getItem("user_token"));
    const Host="https://ecommercoo.vercel.app";


  function getToken(){
    setToken(localStorage.getItem("user_token"));
  }
    async function checkauth(){
        if(!token){
          return setIsLogIn(false)
        }
        try {
            let res=await axios.get(`${Host}/api/v1/ecommerce/auth/protecRoute/${token}`)
            setIsLogIn(res.data.status)
        } catch (error) {
            setIsLogIn(false)
            console.log("Error to protect web",error)
        }
    }
    useEffect(()=>{
      checkauth()
        if(isLogIn){
          getToken();
          getCart()
          getWishList()
          
        }
  
    },[])

     function ProtectRoute({ children }) {
  if (isLogIn == null) {
    return <Loader/>; 
  }

  return isLogIn ? children : <Navigate to="/login" />;
}


 function ProtectAuth({ children }) {
  getCart();
  if (isLogIn === null) {
    return <Loader/>; 
  }

 

  return isLogIn ? <Navigate to="/home" />  :children ;
}

  function logOut(){
    localStorage.removeItem("user_token")
    localStorage.removeItem("user_data")
    window.location.reload()
  }





  function addToCart(product){
    return axios.post(`${Host}/api/v1/ecommerce/cart`,{product},{
      headers:{
        token
      }
    })
  }

  function removeFromCart(product){
    return axios.delete(`${Host}/api/v1/ecommerce/cart/${product}`,{
      headers:{
        token:token
      }
    })
  }


function updateCart(item,count){
  return axios.put(`${Host}/api/v1/ecommerce/cart/${item}`,{
      quantity:count
  },{
    headers:{
      token:token
    }
  })
}


  function addToWishList(product){
    return axios.post(`${Host}/api/v1/ecommerce/wishlist`,{product},{
      headers:{
        token
      }
    })
  }


  function sendVerfiyEmail(email){
    return axios.post(`${Host}/api/v1/ecommerce/auth/reSendEmail`,{email});
  }


async function getCart(){
  try {
    let res=await axios.get(`${Host}/api/v1/ecommerce/cart`,{
      headers:{
        token:token
      }
    })
    setUserCart(res.data.data);
    setTotalPrice(res.data.data.totalPrice);
    console.log(res.data);
  } catch (error) {
    // alert("err to get user Cart  ")
    console.log(error)    
  }
}
async function getWishList(){
  try {
    let res=await axios.get(`${Host}/api/v1/ecommerce/wishList`,{
      headers:{
        token:token
      }
    })
    setUserWishList(res.data.data);
  } catch (error) {
    // alert("err to get user wishlist  ")
    console.log(error)    
  }
}





  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.getDate();


    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}  `;
  };
    return (
        <MyContext.Provider value={{ addToWishList,getWishList,
        userWishList,updateCart,setTotalPrice,totalPrice,setToken,getToken,getCart,removeFromCart,
        userCart,addToCart,addToWishList,Host,checkauth,isLogIn,setIsLogIn,ProtectAuth,ProtectRoute,logOut,formatDate,token,sendVerfiyEmail }}>
            {children}
        </MyContext.Provider>
    );
};

export { MyProvider, MyContext };
