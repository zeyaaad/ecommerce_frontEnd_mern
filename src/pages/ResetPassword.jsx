import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MyContext } from '../context/context';
import LoadingPage from '../components/LoadingPage'; // Optional: A loading component
import Header from '../components/Header';
import "./css/forget.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ResetPassword() {
  const { Host } = useContext(MyContext); // Get the API Host from context
  const { token } = useParams(); // Get the token from URL params
  const navigate = useNavigate(); // Navigation hook
  const [isTokenValid, setIsTokenValid] = useState(null); // Null means still validating, true/false for token state
  const [errorMessage, setErrorMessage] = useState(''); // Handle error messages

  // Step 1: Check if the reset token is valid
  useEffect(() => {
    async function checkResetToken() {
      try {
        const response = await axios.get(`${Host}/api/v1/ecommerce/auth/check-reset-token`, {
          headers: { token: token },
        });
        if (response.data.message === true) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setErrorMessage('Invalid or expired token');
        }
      } catch (error) {
        setIsTokenValid(false);
        setErrorMessage('Invalid or expired token');
      }
    }
    checkResetToken();
  }, [Host, token]);

  // Step 2: Define form validation and submission
  const formik = useFormik({
    initialValues: {
      newPassword: '',
      reEnterPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password cannot exceed 20 characters')
        .required('New password is required'),
      reEnterPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Re-entering the password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${Host}/api/v1/ecommerce/auth/reset-password`,
          { newPassword: values.newPassword },
          { headers: { token: token } }
        );
       if (response.data.message === 'success') {
            toast.success('Password changed successfully. You will be redirected to login shortly.');
            setTimeout(() => {
                navigate('/login');
            }, 4000); 
        }

      } catch (error) {
        setErrorMessage('Failed to reset password');
      }
    },
  });

  if (isTokenValid === null) {
    return <LoadingPage />;
  }

  if (!isTokenValid) {
    return (
      <div className="invalid-token text-center mt-5">
        <h2>{errorMessage}</h2>
        <p>The reset token is either invalid or expired. Please try again.</p>
        <Link to="/login"> Back to login </Link>
      </div>
    );
  }

  // Step 3: Render the form when the token is valid
  return (
    <>
    <ToastContainer/>
    <Header/>
    <div className="reset-password-page register-container  ">

      {/* Form for password reset */}
      <form onSubmit={formik.handleSubmit} className="reset-password-form forget-password-form " >
              <h2>Reset Password</h2>

      {/* Display error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.newPassword && formik.errors.newPassword ? 'input-error' : ''}
        />
        {formik.touched.newPassword && formik.errors.newPassword ? (
          <div className="error">{formik.errors.newPassword}</div>
        ) : null}

        <input
          type="password"
          name="reEnterPassword"
          placeholder="Re-enter Password"
          value={formik.values.reEnterPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.reEnterPassword && formik.errors.reEnterPassword ? 'input-error mt-3' : 'mt-3'}
        />
        {formik.touched.reEnterPassword && formik.errors.reEnterPassword ? (
          <div className="error">{formik.errors.reEnterPassword}</div>
        ) : null}

        <button type="submit" className='mt-3 btn btn-primary' disabled={formik.isSubmitting || !formik.isValid}>
          Change Password
        </button>
      </form>
    </div>
    </>

  );
}
