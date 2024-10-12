import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './css/RegisterStyle.css'; // Include the same CSS for background animation
import { useNavigate, Link } from 'react-router-dom';
import { MyContext } from '../context/context';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';
const LogIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showResendButton, setShowResendButton] = useState(false); // State to manage showing resend button
  const navigate = useNavigate();

  const { Host, setIsLogIn, setToken, sendVerfiyEmail } = useContext(MyContext);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(6).required('Password is required'),
    }),
    onSubmit: (values) => {
      setIsLoading(true); // Start loading when form is submitted
      axios
        .post(`${Host}/api/v1/ecommerce/auth/login`, {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          console.log('Login successful:', response);
          if (response.data.message === 'success') {
            let userData = jwtDecode(response.data.token);
            localStorage.setItem('user_token', response.data.token);
            localStorage.setItem('user_data', JSON.stringify(userData));
            setToken(response.data.token);
            setErr(null);
            setIsLogIn(true);
            navigate('/home');
          } else if (response.data.message === 'Verify your email first') {
            setShowResendButton(true); // Show resend email button
            setErr(response.data.message);
          }
        })
        .catch((error) => {
          setSuccess(null);
          if(error.response?.data?.message=="Verify your email first") {
            setShowResendButton(true); 
  
          }
          setErr(error.response?.data?.message || 'Login failed');
          console.error('Error during login:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  async function resendVerificationEmail(email) {
    setIsLoading(true)
    try {
      let res = await sendVerfiyEmail(email);
      console.log(res);
      setErr(null)
      setSuccess("Verfied Message Send to Your Email successfully!")
      setIsLoading(false)
    } catch (error) {
      setSuccess(null);
      console.log(error);
      toast.error("wrong to reSend verfied messages");
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  return (
    <>
      <Header />
      <ToastContainer/>
      <div className="register-container">
      {isLoading&&<Loader/>}
        <form className="register-form w-md-50" onSubmit={formik.handleSubmit}>
          <h2>Login</h2>
          
          {success && <div className="alert alert-success">{success}   </div>}
          {err && <div className="error mainErr text-center">{err}  
          {err=="Verify your email first"?<>  {showResendButton && (
            <Link className='resendemail'
              onClick={() => resendVerificationEmail(formik.values.email)}
            >
              ,Resend Email?
            </Link>
          )}</>:""} 
        </div>}
          
       

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}

          <button type="submit">Login</button>

          <div className="forgot-password">
            <p>
              <Link to="/forget-password">Forgot Password?</Link>
            </p>
          </div>

          <div className="already-account">
            <p>
              Don't have an account?
              <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default LogIn;
