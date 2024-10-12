import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MyContext } from '../context/context';
import axios from 'axios';
import LoadingPage from '../components/LoadingPage';
import "./css/orders.css"
export default function OrderDetails() {
    const{id}=useParams();
    let[orderData,setOrderData]=useState(null);
    const{token,Host,formatDate}=useContext(MyContext)
    const go=useNavigate();
    async function getOrderData(){
        try {
            let res=await axios.get(`${Host}/api/v1/ecommerce/order/details/${id}`,{
                headers:{
                    token:token
                }
            })
            setOrderData(res.data.data);
            console.log(res.data)
        } catch (error) {
            console.log(error)
            go("/orders")
        }
    }
    
    useEffect(()=>{
        if(!id){
            go("/orders")
        } else {
            getOrderData();
        }
    },[])

    return (
    <div className='container'>
      {orderData!=null?<>
      <div className="orderDetialsCont">
        <h2> Order Details </h2>
        <hr />
        <div className="orderData">
                {orderData.discount?<>
            <h5> Discount : {orderData.discount}% </h5>
            <h4> Total Price After discount :{orderData.totalOrderAfterDiscount} </h4>
        </>:<h4> Total Price  :{orderData.totalOrderPrice} </h4>}
        <h5> Order Date : {formatDate(orderData.createdAt)} </h5>
        <p> Order Method : {orderData.paymentMethod} </p>
        </div>
        <hr />

      </div>
      <div className="CartItems">
       {orderData.cartItems.map((item)=>
            item.product&& <div className="wishlist-item mt-2" key={item.id}>
        <div className='data'>
            <img src={item.product.imgCover} alt={item.product.title} className="wishlist-item-image" />
        <div className="wishlist-item-details">
            <h3>{item.product.title}</h3>
            <p>Price: ${item.product.price}</p>
            <p>quantity: {item.quantity}</p>
        </div>
        </div>
            <Link c  to={`/ProductDetails/${item.product._id}`} className="wishlist-remo-btn btn btn-info">
            View Product
            </Link>
        </div>
            )}         

      </div>
      </>:<LoadingPage/>}
    </div>
  )
}
