import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Header from '../components/Header';
import { MyContext } from '../context/context'; // Assuming you're using this for Host
import "./css/forget.css";
export default function ForgetPassword() {
  const { Host } = useContext(MyContext); // Access Host from context
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setMessage('');
      setError('');

      try {
        const response = await axios.post(`${Host}/api/v1/ecommerce/auth/forgot-password`, {
          email: values.email,
        });

        if (response.data.message === 'success') {
          setMessage(`Reset password link has been sent to ${values.email}`);
        } else {
          setError(response.data.message||'Failed to send reset password email');
        }
      } catch (error) {
        setError(error.response.data.message||'Failed to send reset password email');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div>
      <Header />
      <div className="forgetPasswordCont register-container">
        <form className="forget-password-form" onSubmit={formik.handleSubmit}>
          <h2 >Forget Password</h2>

          {/* Display success or error message */}
          {message && <div className="alert alert-success ">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
          />
          {/* Display error message if validation fails */}
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}

          <button type="submit"  className='btn btn-primary mt-3' disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
