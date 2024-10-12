import React from 'react'

export default function NotFound() {
  return (
         <div className="mx-auto text-center container" >
            <img 
            src={`${process.env.PUBLIC_URL}/404.png`} 
                width={500} alt="logo" className="img-fluid mx-auto text-center" />
            <h3 className='text-center mt-5'>Not Found page 404 !</h3>

         </div>
  )
}
