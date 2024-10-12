import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../context/context';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';

import LoadingPage from '../components/LoadingPage';
import CustomModal from '../components/CustomModal ';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { token, setToken, getToken, Host } = useContext(MyContext);
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);

    async function getData() {
        try {
            let res = await axios.get(`${Host}/api/v1/ecommerce/user/userData`, {
                headers: {
                    token: token
                }
            });
            setUserData(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching user data");
        }
    }

    async function handleChangeData(values, { setSubmitting }) {
        setLoader(true);
        try {
            let res = await axios.put(`${Host}/api/v1/ecommerce/auth/changeData`, {
                name: values.name,
                phone: values.phone
            }, {
                headers: {
                    token: token
                }
            });
            if (res.data.message === "success") {
                toast.success("User data changed successfully");
                getData(); // Refresh user data
            } else {
                toast.error(res.data.message || "Failed to change user data");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error changing user data");
        } finally {
            setLoader(false);
            setSubmitting(false);
            setIsModalOpen(false);
        }
    }

    async function handleChangePassword(values, { setSubmitting }) {
        setLoader(true);
        try {
            let res = await axios.patch(`${Host}/api/v1/ecommerce/auth/changePassword`, {
                currentpassword: values.currentPassword,
                password: values.newPassword
            }, {
                headers: {
                    token: token
                }
            });
            if (res.data.message === "success") {
                localStorage.setItem("user_token", res.data.token);
                await getToken();
                toast.success("Password changed successfully");
            } else {
                toast.error(res.data.message || "Password change failed");
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data.message === "Incorrect current Password") {
                toast.error("Incorrect Current Password");
            } else {
                toast.error(error.response.data.message||"Error changing password");
            }
        } finally {
            setLoader(false);
            setSubmitting(false);
            setIsPasswordModalOpen(false);
        }
    }

    const dataValidationSchema = Yup.object({
        name: Yup.string()
            .matches(/^[a-zA-Z0-9 ]+$/, 'Name can only contain letters, numbers,and spaces')
            .required('Name is required'),
        phone: Yup.string()
            .matches(/^(01)(0|1|2|5)[0-9]{8}$/, 'Phone number must be a valid Egyptian number')
            .required('Phone is required')
    });

    const passwordValidationSchema = Yup.object({
        currentPassword: Yup.string().required('Current Password is required'),
        newPassword: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must not exceed 20 characters')
            .required('New Password is required'),
        reNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Re-enter New Password is required')
    });

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            {loader && <Loader />}
            <ToastContainer />
            {userData ? (
                <>
                    <div className="contUserData text-center">
                        <h1>Your Information</h1>
                        <hr />
                        <h3>Name: {userData.name}</h3>
                        <h3>Email: {userData.email}</h3>
                        <h3>Phone: {userData.phone}</h3>
                        <h3>Role: {userData.role}</h3>
                        <hr />
                        <button className='btn btn-info mt-2' onClick={() => setIsModalOpen(true)}>Change Data</button>
                        <button className='btn btn-info ms-1 mt-2' onClick={() => setIsPasswordModalOpen(true)}>Change Password</button>
                        <Link to="/changeEmail" className='btn btn-info ms-1 mt-2' >Change Email</Link>
                    </div>
                </>
            ) : (
                <LoadingPage />
            )}

            {/* Change Data Modal */}
            <CustomModal className="w-100" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="modal-content w-100">
                    <div className="modal-header">
                        <h5 className="modal-title">Change User Data</h5>
                    </div>
                    <hr />
                    <Formik
                        initialValues={{ name: userData?.name || '', phone: userData?.phone || '' }}
                        validationSchema={dataValidationSchema}
                        onSubmit={handleChangeData}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                                    />
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <Field
                                        type="text"
                                        name="phone"
                                        className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                                    />
                                    <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                                    <button type="submit" className="btn btn-primary ms-2" disabled={isSubmitting}>Submit</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </CustomModal>

            {/* Change Password Modal */}
            <CustomModal className="w-100" isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
                <div className="modal-content w-100">
                    <div className="modal-header">
                        <h5 className="modal-title">Change Password</h5>
                    </div>
                    <hr />
                    <Formik
                        initialValues={{ currentPassword: '', newPassword: '', reNewPassword: '' }}
                        validationSchema={passwordValidationSchema}
                        onSubmit={handleChangePassword}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                    <Field
                                        type="password"
                                        name="currentPassword"
                                        className={`form-control ${touched.currentPassword && errors.currentPassword ? 'is-invalid' : ''}`}
                                    />
                                    <ErrorMessage name="currentPassword" component="div" className="invalid-feedback" />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <Field
                                        type="password"
                                        name="newPassword"
                                        className={`form-control ${touched.newPassword && errors.newPassword ? 'is-invalid' : ''}`}
                                    />
                                    <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="reNewPassword" className="form-label">Re-enter New Password</label>
                                    <Field
                                        type="password"
                                        name="reNewPassword"
                                        className={`form-control ${touched.reNewPassword && errors.reNewPassword ? 'is-invalid' : ''}`}
                                    />
                                    <ErrorMessage name="reNewPassword" component="div" className="invalid-feedback" />
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsPasswordModalOpen(false)}>Close</button>
                                    <button type="submit" className="btn btn-primary ms-2" disabled={isSubmitting}>Submit</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </CustomModal>
        </div>
    );
}
