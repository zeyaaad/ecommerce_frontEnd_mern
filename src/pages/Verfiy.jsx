import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MyContext } from '../context/context';
import LoadingPage from '../components/LoadingPage';
import { useFormik } from 'formik';
import * as Yup from 'yup';
export default function Verfiy() {
  let { token } = useParams();
  let [status, setStatus] = useState(null);
  let [showModal, setShowModal] = useState(false); // Modal visibility state
  let [success, setSuccess] = useState(null);
  let [err, setErr] = useState(null);

  const { Host, sendVerfiyEmail } = useContext(MyContext);

  // Function to send the verification request
  async function sendVerfiy() {
    try {
      let res = await axios.get(`${Host}/api/v1/ecommerce/auth/verfiy/${token}`);
      if (res.data.message === 'success') {
        setStatus(true);
      } else {
        setStatus(false);
      }
    } catch (error) {
      setStatus(false);
    }
  }

  useEffect(() => {
    if (!token.trim()) {
      setStatus(false);
    } else {
      sendVerfiy();
    }
  }, [token]);

  // Function to handle resending the verification email
  async function resendVerificationEmail(email) {
    try {
      let res = await sendVerfiyEmail(email);
      console.log(res);
      setErr(null);
      setSuccess('Verification message sent to your email successfully!');
    } catch (error) {
      setSuccess(null);
      console.log(error);
      setErr(error.response?.data?.message||'Failed to resend verification message.');
    }
  }

  // Formik for email validation
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
    }),
    onSubmit: (values) => {
      resendVerificationEmail(values.email);
      setShowModal(false); // Close the modal after submitting
    },
  });

  return (
    <div>
      {status === null ? (
        <LoadingPage />
      ) : (
        <div className='mt-5 mx-auto verfiycont'>
            {success && <h4 className="success">{success}</h4>}
            {err && <h4 className="error">{err}</h4>}
          {status ? (
            <h1 className='alert alert-success'>Verification Successful</h1>
          ) : (
            <h1 className='alert alert-danger'>Invalid token or expired</h1>
          )}
          {!status&&!success? (
            <button className='btn btn-link' onClick={() => setShowModal(true)}>
              Resend verification message?
            </button>
          ):""}
          <Link to="/login">Back to Login</Link>
        </div>
      )}

      {/* Modal for Resend Verification */}
      {showModal && (
        <div className="modal-container">
          <div className="modal-content">
            <h3>Resend Verification Email</h3>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}

              <button className='btn btn-primary mt-3' type="submit">Send Verification Email</button>
              <button className='btn btn-danger ms-3 mt-3' type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
      
          </div>
        </div>
      )}
    </div>
  );
}
