import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from "react-icons/fa"
export default function SuccessCach() {

  return (
    <div className='container'>
         <div className="mx-auto text-center" >
              <img 
              src={`${process.env.PUBLIC_URL}/cachorder.png`} 
                width={400} alt="logo" className="img-fluid mx-auto text-center" />
              <h3 className='text-center mt-5'>Order delivered Successfully !</h3>
              <Link to="/home" className='d-block linksucess' > Back to Home <FaArrowRight/>  </Link>
              <Link to="/orders"  className='linksucess'> View orders <FaArrowRight/>  </Link>
           </div>
    </div>
  )
}
