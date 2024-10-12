import React, { useContext, useEffect, useState } from 'react';
import "./css/normalize.css";
import "./css/vendor.css";
import { MyContext } from '../context/context';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import LoadingPage from '../components/LoadingPage';
import Loader from './../components/Loader';
import { Link } from 'react-router-dom';
import "./css/card.css"
import Rating from 'react-rating'; // Ensure you install react-rating package
import { FaHeart, FaCartPlus, FaShoppingCart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Autoplay,Navigation} from 'swiper/modules';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import 'swiper/css/grid';
import 'swiper/css';
import 'swiper/css/navigation';





const Home = () => {
    const [brands,setBrands]=useState(null)
  const [categories,setCategories]=useState(null)
  const [subCategories,setSubCategories]=useState(null)
  const[loader,setLoader]=useState(null)
  const [products, setProducts] = useState(null);
  const { token, Host, addToCart,addToWishList} = useContext(MyContext);
  let [userCart,setUserCart]=useState(null)
  let [userWishList,setUserWishList]=useState(null)
  useEffect(() => {
    getData()
    getCart()
  }, []);

  async function getProducts() {
    try {
      let res = await axios.get(`${Host}/api/v1/ecommerce/product`);
      setProducts(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching products. Check console for details.");
    }
  }
async function getCart(){
  try {
    let res=await axios.get(`${Host}/api/v1/ecommerce/cart`,{
      headers:{
        token:token
      }
    })
    setUserCart(res.data?.data);
    await getWishList()
    getProducts()
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
    return userCart.cartItems.some(item => item?.product?._id === productId);
  }
  const isInWishList = (productId) => {
    console.log(userWishList);
    if(!userWishList){
      return false;
    }
    return userWishList.some(item => item?.product?._id === productId);
  }
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
    <>
    {loader?<Loader/>:""}
     <div className="container w-sm-100">
        <ToastContainer />
 <Swiper    autoplay={{
                delay: 3000, 
                disableOnInteraction: false, 
            }}
            loop={true} 
            navigation={true} modules={[Navigation,Autoplay]} className="mySwiper">
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/ea0d20c3-9a04-44f7-bcc5-9afd6c58d80f.png?format=avif" alt="" /></SwiperSlide>
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/7af02b16-5bf5-48d2-96b8-3a00a5215801.png?format=avif" alt="" /></SwiperSlide>
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/7cbc3201-992a-4955-990b-874ed524bc41.png?format=avif" alt="" /></SwiperSlide>
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/945d9d0c-a6e4-4c15-b050-83314b5ce03d.png?format=avif" alt="" /></SwiperSlide>
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/642d2435-8765-4fdf-aa95-b6cb1f9aa75b.png?format=avif" alt="" /></SwiperSlide>
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/4d096145-29ea-4c3a-90cc-4a1db809436a.png?format=avif" alt="" /></SwiperSlide>
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/c12e7c1f-6305-4f65-ae23-437ae1e50c6f.png?format=avif" alt="" /></SwiperSlide>
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/4e3e0c32-4359-47f9-b60b-c979c95ff278.png?format=avif" alt="" /></SwiperSlide>
        <SwiperSlide><img  height={300}  src="https://f.nooncdn.com/mpcms/EN0003/assets/bd7058ca-abe8-469d-84a6-c1a0e242ac8e.png?format=avif" alt="" /></SwiperSlide>
     
      </Swiper>
      <hr />
      <h3> Shop By Category : </h3>
    {categories?<Swiper
            spaceBetween={4}
                breakpoints={{
                640: {
                    slidesPerView: 2, // 1 slide on small screens
                },
                768: {
                    slidesPerView: 6, // 3 slides on medium and large screens
                },
            }}
            loop={true} 
            pagination={{ clickable: true }}
            naviation
            autoplay={{
                delay: 1600, 
                disableOnInteraction: false, 
            }}
            modules={[Autoplay]}
        >
            {categories.map((category) => (
                <SwiperSlide className='mt-4' key={category._id}>
                    <Link to={`/products/category/${category.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={category.image}
                                alt={category.name}
                                style={{ borderRadius: '50%', width: '150px', height: '130px', backgroundColor:"#eee",padding:"12px" }}
                            />
                            <h4 style={{ color: '#000' }}>{category.name}</h4>
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>:<LoadingPage/>}
      <hr />
      <h3 className='mt-2'> Shop By sub-Category : </h3>
    {subCategories?<Swiper
            spaceBetween={4}
                breakpoints={{
                640: {
                    slidesPerView: 2, // 1 slide on small screens
                },
                768: {
                    slidesPerView: 6, // 3 slides on medium and large screens
                },
            }}
            loop={true} 
            pagination={{ clickable: true }}
            naviation
            autoplay={{
                delay: 1600, 
                disableOnInteraction: false, 
            }}
            modules={[Autoplay]}
        >
            {subCategories.map((category) => (
                <SwiperSlide className='mt-4' key={category._id}>
                    <Link to={`/products/subCategory/${category.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={category.image}
                                alt={category.name}
                                style={{ borderRadius: '50%', width: '150px', height: '130px', backgroundColor:"#eee",padding:"12px" }}
                            />
                            <h4 style={{ color: '#000' }}>{category.name}</h4>
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>:<LoadingPage/>}



              <hr />
              <h3 className='mt-3'>Recommended for you:</h3>
        {products?
        <div className="allproducts">
{products.map((product) => (
  <div className="product-card" key={product._id}>
    <div className="badge">Hot</div>
    <div className="product-tumb">
      <Link to={`/productDetails/${product._id}`}>
        <img width={200} height={200} src={product.imgCover} alt="product" />
      </Link>
    </div>
    <div className="product-details">
      <span className="product-catagory">{product.category.name}>{product.subCategory.name}</span>
      <h5>
        <Link to={`/productDetails/${product._id}`}>{product.title}</Link>
      </h5>
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
        :<LoadingPage/>}


      <hr />
      <h3 className='mt-3'> Our Brands : </h3>
    {brands?
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
        {brands.map((category) => (
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
    
    
        
        :<LoadingPage/>}

        
      </div>
     
    </>
  );
};

export default Home;
