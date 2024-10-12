import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MyContext } from '../context/context';
import LoadingPage from '../components/LoadingPage';

export default function VerfiyChaneEmail() {
  let { token } = useParams();
  let [status, setStatus] = useState(null);
var[send,setSend]=useState(false);
  const { Host,setToken } = useContext(MyContext);
  const go=useNavigate()
  async function sendVerfiy() {
    if(!send){
try {
      let res = await axios.get(`${Host}/api/v1/ecommerce/auth/verifyChangeEmail/${token}`,{
        headers:{
            token:localStorage.getItem("user_token")
        }
      });
      setSend(true)
      if (res.data.message === 'success') {
        setStatus(true);
        localStorage.setItem("user_token",res.data.token)
        setToken(res.data.token);
      } else {
        setStatus(false);
      }

      console.log(res)
    } catch (error) {
      console.log(error)
        setStatus(false);
    }
    }
    
  }

  useEffect(() => {
    if (!token) {
      setStatus(false);
      go("/home")
    } else {
      sendVerfiy();
    }
  }, [token]);

  
  return (
    <div>
      {status === null ? (
        <LoadingPage />
      ) : (
        <div className='mt-5 mx-auto verfiycont'>
            
          {status ? (
            <h1 className='alert alert-success' >Email Changed Successfully !</h1>
          ) : (
            <h1 className='alert alert-danger' >Invalid token or expired</h1>
          )}
         
        </div>
      )}

    
    </div>
  );
}
