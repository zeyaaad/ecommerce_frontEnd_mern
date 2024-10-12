import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './css/RegisterStyle.css'; // Include the CSS for background animation
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom/dist';
import Header from '../components/Header';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import Loader from '../components/Loader';
import { MyContext } from '../context/context';


const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const[success,setSuccess]=useState(null)

  const{Host}=useContext(MyContext)
  const[err,setErr]=useState(null)
   const go=useNavigate()
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number')
        .required('Phone is required'),
    }),
    onSubmit: (values) => {
      setIsLoading(true); // Start loading when form is submitted
      axios
        .post(`${Host}/api/v1/ecommerce/auth/register`, {
          name: values.name,
          email: values.email.trim(),
          password: values.password,
          phone: values.phone,
        })
        .then((response) => {
          console.log('Registration successful:', response.data);
          setSuccess(`We Send Email to ${values.email.trim()} to Verfiy Account`)
          
        })
        .catch((error) => {
          setSuccess(null)
          console.log(error)
          setErr(error?.response?.data?.message)
          console.error('Error during registration:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <>
    
    <Header/>
    <div className="register-container">
      {isLoading&&<Loader/>}
    <div className="registerPage w-100">
   
      <form className="register-form w-md-50" onSubmit={formik.handleSubmit}>
        <h2>Register</h2>
        {err&&<div className="text-center">{err}</div>}
        {success&&<div className=" text-center alert alert-success">{success}</div>}
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name ? <div className="error">{formik.errors.name}</div> : null}

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}

        <input
          type="password"
          placeholder="Re-enter Password"
          name="rePassword"
          value={formik.values.rePassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.rePassword && formik.errors.rePassword ? <div className="error">{formik.errors.rePassword}</div> : null}

        <input
          type="tel"
          placeholder="Phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.phone && formik.errors.phone ? <div className="error">{formik.errors.phone}</div> : null}

        <button type="submit" >
          Register

        </button>

        {/* Already have an account link */}
        <div className="already-account">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
         
    </div>
    </div>
    </>
  );
};


export default RegisterPage;
