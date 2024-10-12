import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MyContext } from '../context/context';
import LoadingPage from '../components/LoadingPage';
import "./css/card.css"
import Rating from 'react-rating'; // Ensure you install react-rating package
import { FaHeart, FaCartPlus, FaShoppingCart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';
export default function BrandProducts() {
    const[loader,setLoader]=useState(null)

    let [products,setProducts]=useState(null)
    let [name,setName]=useState(null)
      const { token, Host, addToCart,addToWishList} = useContext(MyContext);
  let [userCart,setUserCart]=useState(null)
  let [userWishList,setUserWishList]=useState(null)
    let {slug}=useParams();
    let go=useNavigate()
    useEffect(()=>{
        if(!slug){
            go("/home")
        }
        getProducts();
    },[slug])

async function getCart(){
  try {
    let res=await axios.get(`${Host}/api/v1/ecommerce/cart`,{
      headers:{
        token:token
      }
    })
    setUserCart(res.data?.data);
    await getWishList()
  } catch (error) {
    console.log(error)    
    // alert("err to get user Cart")
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

  async function addCart(productId) {
    setLoader(true)
    try {
      let res = await addToCart(productId);
      await getCart()
      await getProducts()
      setLoader(false)
      toast.success(`Added to cart successfully`,{
              autoClose: 2000 ,
              position: "top-center"
        })
    } catch (error) {
      console.log(error);
      toast.info(error.response?.data.message || "Error adding to cart.");
      setLoader(false)
    }
  }
  async function addWishList(productId) {
    setLoader(true)
    try {
      let res = await addToWishList(productId);
      await getWishList()
      await getProducts()
      setLoader(false)
      toast.success(`Added to wishlist successfully`,{
              autoClose: 2000 ,
              position: "top-center"
        })
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || "Error adding to wishlist.");
      setLoader(false)
    }
  }

  const isInCart = (productId) => {
    if(!userCart){
      return false
    }
    return userCart.cartItems.some(item => item.product._id === productId);
  }
  const isInWishList = (productId) => {
    console.log(userWishList);
    if(!userWishList){
      return false;
    }
    return userWishList.some(item => item.product?._id === productId);
  }
    async function getProducts(){
        setProducts(null);
        try {
            let res=await axios.get(`${Host}/api/v1/ecommerce/filter/brand/${slug}`);
            setProducts(res.data.data);
            setName(res.data.name);
            getCart()
        } catch (error) {
            console.log(error)
            // alert(" err to get products ")
        }
    }



    
  return (
    <div className='container'>
      <ToastContainer/>
      {loader&&<Loader/>}
    {products?
    <>
        {products.length>0?  
      <>
      <h1> All <span className='important'> {name}</span> Brand Products </h1>
      <hr />
        <div className="allproducts">

          { products.map((product) => (
           
             <div className="product-card" key={product._id}>
    <div className="badge">Hot</div>
    <div className="product-tumb">
      <Link to={`/productDetails/${product._id}`}>
        <img width={200} height={200} src={product.imgCover} alt="product" />
      </Link>
    </div>
    <div className="product-details">
      <span className="product-catagory">{product.category.name}{product.subCategory.name}</span>
      <h4>
        <Link to={`/productDetails/${product._id}`}>{product.title}</Link>
      </h4>
      <p>
        <Rating
          initialRating={product.ratingAvg}
          readonly
          emptySymbol="fa fa-star-o"
          fullSymbol="fa fa-star"
        />
      </p>
      <div className="product-bottom-details">
        <div className="product-price">${product.price}</div>
        <div className="product-links" style={{ fontSize: '2rem', display: 'flex', gap: '1rem' }}>
          
          {/* Wishlist Icon Logic */}
          {isInWishList(product._id) ? (
            <FaHeart
              color="red"
              style={{ fontSize:"25px" }}
              title="In Wishlist"
            />
          ) : (
            <FaHeart
              color="grey"
              style={{ cursor: 'pointer' ,fontSize:"25px"}}
              title="Add to Wishlist"
              
              onClick={() => addWishList(product._id)}
            />
          )}

          {/* Cart Icon Logic */}
          {isInCart(product._id) ? (
            <FaShoppingCart
              color="green"
              style={{ fontSize:"25px" }}
              title="In Cart"
            />
          ) : (
            <FaCartPlus
              color="#f7a422"
              style={{ cursor: 'pointer',fontSize:"25px" }}
              title="Add to Cart"
              onClick={() => addCart(product._id)}
            />
          )}

        </div>
      </div>
    </div>
  </div>
            ))}
        </div> 
      </>:<h1 className='text-center mt-3' > Not Found products  for {name} Brand  </h1>}
    </>
    :<LoadingPage/>}
    </div>
  )
}
