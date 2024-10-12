import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MyContext } from '../context/context';
import LoadingPage from '../components/LoadingPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';
import "./css/card.css"
import Rating from 'react-rating'; // Ensure you install react-rating package
import { FaHeart, FaCartPlus, FaShoppingCart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Grid, Pagination ,Autoplay} from 'swiper/modules';
import 'swiper/css/grid';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function Search() {
    let {value}=useParams()
      const[loader,setLoader]=useState(null)

    const{Host,token,addToCart,addToWishList}=useContext(MyContext);
    let [userCart,setUserCart]=useState(null)
  let [userWishList,setUserWishList]=useState(null)
    const go=useNavigate()
    let[data,setData]=useState(null)
    function isVaild(){
     const isValidInput = /^[a-zA-Z0-9_]+$/.test(value.trim());
    if (isValidInput) {
      return true
    } else {
        return false
    }
    }

    async function getData(){
        try {
            let res =await axios.get(`${Host}/api/v1/ecommerce/product/search/${value}`,{
                headers:{
                    token:token
                }
            })
            setData(res.data.data);
            console.log(res.data)
            getCart()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(isVaild()){
           getData()
        }else {
            go("/error")
        }
    },[value])





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
    console.log(error)    
  }
}

  async function addCart(productId) {
    setLoader(true)
    try {
      let res = await addToCart(productId);
      getCart()
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
      getWishList()
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

  return (
    <div className='container'>
      <ToastContainer/>
      {loader?<Loader/>:""}
      {data?<>
      <div className="results">
        <h1 > All Result for <span className='importantt'> {value}  </span>: </h1>
        <hr />
        {data.products.length>0&&
        <>
        <h3 className='mt-3' > All available products: </h3>
        <div className="allproducts">
          { data.products.map((product) => (
               
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
        </>
        
        }
        {data.categories.length>0&&
        <>
        <hr />
        <h3 className='mt-3'> All available categories: </h3>
        <div className="allproducts">
          { data.categories.map((cat) => (
              <div className="card p-1 text-center" key={cat._id}>
                <Link to={`/products/category/${cat.slug}`}>
                
                <img className="card-img-top" width={200} height={200} src={cat.image} alt="" />
                </Link>
                <div className="card-body">
                  <h4 className="card-title">{cat.name}</h4>
                  <Link className='btn btn-primary' to={`/products/category/${cat.slug}`} > View   {cat.name} Products </Link>

                </div>
              </div>
            ))}
        </div>
        </>
        
        }
        {data.subCategories.length>0&&
        <>
        <hr />
        <h3 className='mt-3'> All available subCategories: </h3>
        <div className="allproducts">
          { data.subCategories.map((cat) => (
              <div className="card p-1  text-center" key={cat._id}>
                <Link to={`/products/subCategory/${cat.slug}`}>
                
                <img className="card-img-top" width={200} height={200} src={cat.image} alt="" />
                </Link>
                <div className="card-body">
                  <h4 className="card-title">{cat.name}</h4>
                  <Link className='btn btn-primary' to={`/products/subCategory/${cat.slug}`} > View   {cat.name} Products </Link>
                </div>
              </div>
            ))}
        </div>
        </>
        }
        {data.brands.length>0&&
        <>
        <hr />
        <h3 className='mt-3'> All available brands: </h3>
     <Swiper
        spaceBetween={4}
          breakpoints={{
                640: {
                    slidesPerView: 3, // 1 slide on small screens
                },
                768: {
                    slidesPerView: 6, // 3 slides on medium and large screens
                },
            }}
              loop={true} 
            pagination={{ clickable: true }}
            naviation
            autoplay={{
                delay: 500, 
                disableOnInteraction: false, 
            }}
            modules={[Autoplay]}
      >
        {data.brands.map((category) => (
                <SwiperSlide className='mt-4' key={category._id}>
                    <Link to={`/products/brand/${category.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={category.logo}
                                alt={category.name}
                                style={{ borderRadius: '50%', width: '150px', height: '130px', backgroundColor:"#eee",padding:"12px" }}
                            />
                            <h5 style={{ color: '#000' }}>{category.name}</h5>
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
      </Swiper>
    
    
        
        </>
        }
      </div>
      
      </>:<LoadingPage/>}
    </div>
  )
}
