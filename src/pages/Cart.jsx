import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { MyContext } from '../context/context';
import "./css/cart.css";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';
import axios from 'axios';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import CustomModal from '../components/CustomModal ';
import LoadingPage from '../components/LoadingPage';

export default function Cart() {
    let { token, Host, removeFromCart, updateCart } = useContext(MyContext);
    let [loader, setLoader] = useState(false);
    let [userCart, setUserCart] = useState(null);
    const [addressDetails, setAddressDetails] = useState({ city: '', street: '', phone: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const[checkoutType,setCheckoutType]=useState(null)
    const go=useNavigate();
    useEffect(() => {
        getCart();
    }, []);

    async function getCart() {
        try {
            let res = await axios.get(`${Host}/api/v1/ecommerce/cart`, {
                headers: { token: token }
            });
            if (res.data.data) {
                setUserCart(res.data?.data);
            } else {
                setUserCart("not");
            }
            console.log(res);
        } catch (error) {
            console.log(error);
            setUserCart("not");
        }
    }

    async function deleteItem(product) {
        setLoader(true);
        try {
            let res=await removeFromCart(product);
            console.log(res)
            await getCart();
            setLoader(false);
             toast.success(`Product Removed Successfully`,{
                    autoClose: 2000 ,
                    position: "top-center"
            })
        } catch (error) {
            console.log(error);
            toast.error("Error deleting item");
            setLoader(false);
        }
    }

    async function updateCount(product, count) {
        if (count < 1) {
            deleteItem(product);
            return;
        }
        setLoader(true);
        try {
            await updateCart(product, count);
            await getCart();
            setLoader(false);
            toast.success(`Product Updated Successfully`,{
                    autoClose: 2000 ,
                    position: "top-center"
                })
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "max Quantity") {
                toast.info("You have reached the max Quantity for this product");
                setLoader(false);
                return;
            }
            toast.error("Error updating item");
            setLoader(false);
        }
    }

    async function clearCart() {
        setLoader(true);
        try {
            await axios.delete(`${Host}/api/v1/ecommerce/cart`, {
                headers: { token: token }
            });
            getCart();
             toast.info(`Cart Cleared successfully!`,{
                    autoClose: 3000 ,
                    position: "top-center"
            })
            setLoader(false);
        } catch (error) {
            console.log(error);
            toast.error("Error clearing cart");
            setLoader(false);
        }
    }

    let [code, setCode] = useState(null);
    async function Applycoupon() {
        setLoader(true);
        if (!code) {
            toast.error("Write Your Coupon code!");
            setLoader(false);
            return;
        }
        if (code.length < 3) {
            toast.error("At least coupon code 3 characters");
            setLoader(false);
            return;
        }
        try {
            await axios.post(`${Host}/api/v1/ecommerce/cart/applyCoupon/${code}`, {}, {
                headers: { token: token }
            });
            getCart();
            toast.success("Coupon Successfully Added!");
            setLoader(false);
        } catch (error) {
            toast.error("Invalid Coupon or  expired");
            console.log(error);
            setLoader(false);
        }
        setLoader(false);
    }


    const handleCheckout = () => {
        if (validateAddress()) {
            if(checkoutType==0){
                makeCashOrder();
            }
            if(checkoutType==1){
                makeCreditOrder()
            }
            setIsModalOpen(false); 
        }
    };

  


  
    async function makeCashOrder() {
        setLoader(true)
        try {
            await axios.post(`${Host}/api/v1/ecommerce/order/${userCart._id}`, {
                shippingAddress: addressDetails
            }, {
                headers: { token: token }
            });
            setLoader(false)

            go("/success");
        } catch (error) {
              setLoader(false)
            console.log("Error making cash order");
            console.log(error);
        }
    }

    const validateAddress = () => {
        const { city, street, phone } = addressDetails;
      if(!city.trim() || !street.trim() || !phone.trim()){
        toast.error(" Write All inputs Addresses ")
        return false
      }
        const cityRegex = /^[a-zA-Z0-9\s]+$/; 
        if (!cityRegex.test(city.trim())) {
            toast.error("City name must not contain special characters.");
            return false;
        }
        if (!cityRegex.test(street.trim())) {
            toast.error("street name must not contain special characters.");
            return false;
        }

        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(phone.trim())) {
            toast.error("Phone number must be in valid Egyptian format.");
            return false;
        }

        return true;
    };

    async function makeCreditOrder(){
        setLoader(true)
        try {
            let res=await axios.post(`${Host}/api/v1/ecommerce/order/checkout/${userCart._id}`,{
                shippingAddress:addressDetails
            },{
                headers:{
                    token:token
                }
            })
            if(res.data.message=="success"){
                setLoader(false)
                window.location.href=res.data.session;
            }
        } catch (error){
              setLoader(false)
        toast.error(" err to get stripe session")
      }
    }
    return (
        <div>
            {userCart ? (
                <div className="container">
                    <ToastContainer />
                    {userCart ? <>
                        {userCart.cartItems?.length > 0 && userCart !== "not" ?
                            <>
                            <h3>Your Cart</h3>
                            <hr />
                                <button onClick={clearCart} className='btn btn-danger text-center mb-3 text-end'>Clear Cart</button>
                                {loader ? <Loader /> : ""}
                                <div className="contcart">
                                    <div className="info1 text-center">
                                        <h6>Order Summary</h6>
                                        <hr />
                                        {userCart.discount && <p>{userCart.discount}% Discount</p>}
                                        <h1>totalPrice: {userCart.totalPriceAfterDiscount || userCart.totalPrice}$</h1>
                                        <div>
                                            Cart quantity Products: {userCart.cartItems.length}
                                        </div>
                                        <hr />
                                        <div className="coupons">
                                            <input onChange={(e) => setCode(e.target.value.trim())} type="text" placeholder='Write coupon code' />
                                            <button onClick={Applycoupon}>Apply</button>
                                        </div>
                                        <div>
                                            <Link to="/offers" className="view-offers">
                                                View Available Offers
                                            </Link>
                                        </div>
                                        <div className="shipping-info">
                                            <span className="shipping-text">Free shipping on orders</span>
                                            <i className="fas fa-shipping-fast"></i>
                                        </div>
                                        <div className="cartActions">
                                            <button onClick={() => { setCheckoutType(0);setIsModalOpen(true); }} className="checkout-cash">Cash Checkout <FaMoneyBillWave size={24} /></button>
                                            <button onClick={() => { setCheckoutType(1);setIsModalOpen(true); }} className="checkout-cash mt-2">Credit Card Checkout <FaCreditCard size={24} /></button>
                                        </div>
                                    </div>
                                    <div className="cartItems">
                                        {userCart.cartItems.map((item) => (
                                            <div className='cartitem' key={item.product._id}>
                                                <div className="data">
                                                      <Link to={`/productDetails/${item.product._id}`} >
                                                    <img src={item.product.imgCover} width={80} alt="" />
                </Link>
                                                    <div className="info">
                                                        <p>Title: {item.product.title}</p>
                                                        <p>Price: {item.product.price}$</p>
                                                        <button className='btn btn-danger' onClick={() => deleteItem(item._id)}>Remove</button>
                                                    </div>
                                                </div>
                                                <div className="operations">
                                                    <button className={item.quantity >= item.product.quantity ? "disablead" : "btn btn-info"} onClick={() => updateCount(item._id, item.quantity + 1)}>+</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateCount(item._id, item.quantity - 1)} className='btn btn-info'>-</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                            :<> 
                          <div className="mx-auto text-center" >
                                <img 
                                src={`${process.env.PUBLIC_URL}/emptycart.png`} 
                                 width={400} alt="logo" className="img-fluid mx-auto text-center" />
                               <h3 className='text-center mt-5'>Your cart is Empty!</h3>

                          </div>
                            </>
                            }
                    </> : <Loader />}
                </div>
            ) : (
               <LoadingPage/>
            )}
            <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>{checkoutType?"Credit Card ":"Cash"} Checkout</h2>
                <hr />
                <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
                    <label htmlFor="">City:</label>
                    <input type="text" onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}  />
                    <label htmlFor="">Street:</label>
                    <input type="text" onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}  />
                    <label htmlFor="">Phone:</label>
                    <input type="text" onChange={(e) => setAddressDetails({ ...addressDetails, phone: e.target.value })}  />
                    <button className='btn btn-primary mt-3' type="submit">Place Order</button>
                </form>
            </CustomModal>
        </div>
    );
}
