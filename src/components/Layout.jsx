import React, { useContext, useEffect, useState } from 'react';
import MainHeader from './HeaderWeb';
import axios from 'axios';
import { MyContext } from '../context/context';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [brands,setBrands]=useState(null)
  const [categories,setCategories]=useState(null)
  const [subCategories,setSubCategories]=useState(null)
  const {token,Host}=useContext(MyContext)
  useEffect(()=>{
    getData()
  },[])
    async function getData(){
    try {
      let res1=await axios.get(`${Host}/api/v1/ecommerce/brand/all`,{headers:{token}})
      setBrands(res1.data.data)
    } catch (error) {
      // alert("err to get brands")
      console.log(error)
    }
    try {
      let res2=await axios.get(`${Host}/api/v1/ecommerce/category/all`,{headers:{token}})
      setCategories(res2.data.data)
    } catch (error) {
      // alert("err to get categories")
      console.log(error)
    }
    try {
      let res3=await axios.get(`${Host}/api/v1/ecommerce/subCategory/all`,{headers:{token}})
      setSubCategories(res3.data.data)
    } catch (error) {
      // alert("err to get subCategories")
      console.log(error)
    }

  }
  return (
    <div className="layout"> 
      <MainHeader brands={brands} categories={categories} subCategories={subCategories}  />
      <div>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
