import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../context/context'
import axios from 'axios';
import LoadingPage from '../components/LoadingPage';
import { Link } from 'react-router-dom';

export default function Coupons() {

    const{token,Host,formatDate}=useContext(MyContext);
    let [coupons,setcoupons]=useState(null);

    async function getCoupons(){
        try {
            let res=await axios.get(`${Host}/api/v1/ecommerce/coupon`,{
                headers:{
                    token:token
                }
            })
            setcoupons(res.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getCoupons();
    },[])
    
  return (
    <div className='container'>
      {coupons!=null?<div className="allcoupons">
        <h2> All available coupons </h2>
        <hr />
        <h5>
           Please enter the coupon code or scan the image to retrieve the code, and use it during checkout on the cart page. 
        </h5>
        {coupons.length>0?
        <div className='allproducts'>
        {coupons.map((coupon)=>
        <div className="card p-1  text-center" key={coupon._id}>
            <a href={coupon.url} target='_blank'>
                <img className="card-img-top" width={100} height={150} src={coupon.url} alt="" />
            </a>
                <div className="card-body">
                  <h4 className="card-title"> Code : {coupon.code}</h4>
                  <h5 className="card-title"> Code Discount : {coupon.discount}%</h5>
                  <h6 className="card-title"> Expire At : {formatDate(coupon.expires)} </h6>
                </div>
              </div>)}
        </div>
        :<h3 className='text-center mt-3' > there is Not available Coupons Now!  </h3>}
      </div>:<LoadingPage/>}
    </div>
  )
}
