import React, { useContext, useState } from 'react';
import axios from 'axios';
import { MyContext } from '../context/context';
import Loader from '../components/Loader';

const ChangeEmail = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setsuccess] = useState('');
  let[loading,setLoading]=useState(false)
    const{Host,token}=useContext(MyContext)
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChangeEmail = async () => {
    setLoading(true)
    if (!validateEmail(email.trim())) {
        setError('Please enter a valid email address.');
        setLoading(false)
        return;
    }
    
    setError('');
    
    try {
        const response = await axios.patch(`${Host}/api/v1/ecommerce/auth/changeEmail`, {
            email: email.trim(),
        },{
            headers:{
                token:token
            }
        });
        
        if (response.status === 200) {
            setsuccess(`We have sent a verification email to ${email}`);
        }
        setLoading(false)
    } catch (error) {
        if(error.response.data.message=="Email Already Exist") {
            setError(error.response.data.message);
        } else {
            setError('Failed to change email. Please try again.');
        }
        console.error('Error changing email:', error);
        setLoading(false)
    }
    setLoading(false)
  };

  return (
    <>
    {loading&&<Loader/>}
    <div className='changeEmailCont' >
      <h2>Change Email</h2>
      <hr />
      {success && <p className='alert alert-success'>{success}</p>}
      <input
        type="email"
        placeholder="Enter new email"
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className='btn btn-primary mt-2' onClick={handleChangeEmail}>Change Email</button>
    </div>
    </>
  );
};

export default ChangeEmail;
