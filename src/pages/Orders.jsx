import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../context/context';
import axios from 'axios';
import LoadingPage from './../components/LoadingPage';
import "./css/orders.css"
import { Link } from 'react-router-dom';
export default function Orders(){
    let [orders,setOrders]=useState(null);
    const{token,Host,formatDate}=useContext(MyContext);
    async function getOrders(){
        try {
            let res=await axios.get(`${Host}/api/v1/ecommerce/order`,{
                headers:{
                    token:token
                }
            })
            setOrders(res.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getOrders();
    },[])

  return (
    <div className='container'>
      {orders!=null?<>
      {orders.length>0?
    <>
         <h2> Your All Orders: </h2>
         <hr /> 
      <div className='allOrdersCont' >
        {orders.map((order)=><div className='order' >
            {order.discount?<>
            <h4> Total price :{order.totalOrderAfterDiscount}  </h4>
            <h4> discount :{order.discount}% </h4>
            </>:
            <h4> Total price :{order.totalOrderPrice}  </h4>
            }
            <h5> Order type : {order.paymentMethod} </h5>
            <h6>  Date:{formatDate(order.createdAt)} </h6>
            <Link to={`/OrderDetails/${order._id}`}  className='btn btn-info' > View Order Details  </Link >
        </div>)}

      </div>
    
    
    </>
      :<h1 className='text-center' > You don't Create Any Order yet </h1>}
      </>:<LoadingPage/>}
    </div>
  )
}
