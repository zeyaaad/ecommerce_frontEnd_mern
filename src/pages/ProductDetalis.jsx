import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/productDetails.css'; // Make sure you style your component
import { MyContext } from '../context/context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Rating from 'react-rating'; // Ensure you install react-rating package
import LoadingPage from "../components/LoadingPage";
import Loader from '../components/Loader';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
import { FaCartPlus, FaHeart, FaShoppingCart } from 'react-icons/fa';
const ProductDetails = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null); 
  const { token, Host, addToCart, addToWishList } = useContext(MyContext);
  let [userCart, setUserCart] = useState(null);
  let [userWishList, setUserWishList] = useState(null);
  const [isReview, setIsReview] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const [loader, setLoader] = useState(false); // Initialize loader as false
  const go = useNavigate();

  useEffect(() => {
    if (!id) {
      go("/home");
    }
    fetchProduct();
  }, [id]);

  async function checkReview() {
    try {
      let res = await axios.get(`${Host}/api/v1/ecommerce/review/isReviewed/${id}`, {
        headers: {
          token: token
        }
      });
      setIsReview(res.data.status);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };
  const handleReviewSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${Host}/api/v1/ecommerce/review`, {
        comment: newReview.comment,
        product: id,
        rating: newReview.rating
      }, {
        headers: {
          token: token
        }
      });
      toast.success('Review added successfully');
      fetchProduct();
      checkReview();
    } catch (error) {
      if (error.response.data.message === "error") {
        toast.info(`Must write your comment and choose the number for rating `, {
          autoClose: 4000,
          position: "top-center"
        });
      } else {
        toast.error('Failed to add review');
      }
      console.error('Error adding review:', error);
    } finally {
      setLoader(false); // Ensure loader is turned off after the request
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${Host}/api/v1/ecommerce/product/${id}`, {
        headers: { token: token },
      });
      setProduct(response.data.data);
      await getCart();
      await checkReview();
      getWishList();
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  async function delComment(reviewId) {
    setLoader(true);
    try {
      let res = await axios.delete(`${Host}/api/v1/ecommerce/review/${reviewId}`, {
        headers: {
          token: token
        }
      });
      console.log(res);
      fetchProduct();
      checkReview();
      toast.success(`Review deleted successfully`, {
        autoClose: 2000,
        position: "top-center"
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false); // Ensure loader is turned off after the request
    }
  }

  async function getCart() {
    try {
      let res = await axios.get(`${Host}/api/v1/ecommerce/cart`, {
        headers: {
          token: token
        }
      });
      setUserCart(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getWishList() {
    try {
      let res = await axios.get(`${Host}/api/v1/ecommerce/wishList`, {
        headers: {
          token: token
        }
      });
      setUserWishList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addCart(productId) {
    setLoader(true);
    try {
      await addToCart(productId);
      getCart();
      fetchProduct();
      toast.success(`Added to cart successfully`, {
        autoClose: 2000,
        position: "top-center"
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || "Error adding to cart.");
    } finally {
      setLoader(false); // Ensure loader is turned off after the request
    }
  }

  async function addWishList(productId) {
    setLoader(true);
    try {
      await addToWishList(productId);
      getWishList();
      fetchProduct();
      toast.success(`Added to wishlist successfully`, {
        autoClose: 2000,
        position: "top-center"
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || "Error adding to wishlist.");
    } finally {
      setLoader(false); // Ensure loader is turned off after the request
    }
  }

  const isInCart = (productId) => {
    if (!userCart) {
      return false;
    }
    return userCart.cartItems.some(item => item?.product?._id === productId);
  }

  const isInWishList = (productId) => {
    if (!userWishList) {
      return false;
    }
    return userWishList.some(item => item.product?._id === productId);
  }

  return (
    <div className="view-product container mx-auto">
      {loader && <Loader />}
      <ToastContainer />
      {product && isReview !== null ? (
        <>
          <div className="product-container">

     <Swiper
        pagination={pagination}
        modules={[Pagination]}
        className="mySwiper w-100"
      >
         <SwiperSlide><img height={350}  src={product.imgCover} alt={product.title} /></SwiperSlide>
         {product.images && product.images.map((image, index) => (
                  <SwiperSlide key={index}><img  height={350} src={image} alt={`Product image ${index + 1}`} /></SwiperSlide>
                ))}
      </Swiper>


            <div className="product-details ">
              <h2>{product.title}</h2>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>Sold:</strong> {product.sold}</p>
              <p><strong>Category:</strong> {product.category.name}</p>
              <p><strong>SubCategory:</strong> {product.subCategory.name}</p>
              <p><strong>Brand:</strong> {product.brand.name}</p>
              <p><strong>Rating Count:</strong> {product.ratingCount}</p>
              <div className="rating">
                <strong className='me-1'>Rating:</strong>
                <Rating
                  initialRating={product.ratingAvg}
                  readonly
                  emptySymbol="fa fa-star-o"
                  fullSymbol="fa fa-star"
                />
              </div>
              <p className='mt-2'><strong>Description:</strong> {product.description}</p>
               {/* Wishlist Icon Logic */}
         <div className="mt-4">
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
              style={{ fontSize:"25px",marginLeft:"5px" }}
              title="In Cart"
            />
          ) : (
            <FaCartPlus
              color="#f7a422"
              style={{ cursor: 'pointer',fontSize:"25px" ,marginLeft:"5px"}}
              title="Add to Cart"
              onClick={() => addCart(product._id)}
            />
          )}
         </div>
            </div>
          </div>

         <div className="reviews">
  <h3>Reviews:</h3>
  {product.reviews && product.reviews.length > 0 ? (
    product.reviews.map((review, index) => (
      <div key={index} className="review">
        <div>
          <Rating
            initialRating={review.rating}
            readonly
            emptySymbol="fa fa-star-o"
            fullSymbol="fa fa-star"
          />
          <p><strong>{review.user.name}:</strong> {review.comment}</p>
        </div>
        {review.user._id === userData.id && 
          <button onClick={() => delComment(review._id)} className='btn btn-danger'>Delete</button>
        }
      </div>
    ))
  ) : (
    <p>No reviews yet.</p>
  )}
</div>


          {!isReview ? (
            <div className="add-review">
              <h3>Add Your Review:</h3>
              <form onSubmit={handleReviewSubmit}>
                            <div className="form-group">
                <label>Rating:</label>
                <Rating
                  onClick={(value) => {
                    setNewReview({ ...newReview, rating: value });
                  }}
                  emptySymbol="fa fa-star-o"
                  fullSymbol="fa fa-star"
                  initialRating={newReview.rating} // Add this line
                />
              </div>

                <div className="form-group">
                  <label>Comment:</label>
                  <textarea 
                    className="form-control" 
                    value={newReview.comment} 
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} 
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            </div>
          ) : (
            <h3 className='text-center mt-5' >You have already reviewed this product.</h3>
          )}
        </>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
};

export default ProductDetails;
