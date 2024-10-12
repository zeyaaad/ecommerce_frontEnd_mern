import React, { useContext, useState } from 'react';
import Joi from 'joi';
import axios from 'axios';
import { MyContext } from '../context/context';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import { ToastContainer, toast } from 'react-toastify';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const{Host,token}=useContext(MyContext)
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
    message: Joi.string().required().label('Message')
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validationResult = schema.validate(formData, { abortEarly: false, stripUnknown: true });
      if (validationResult.error) {
        const newErrors = {};
        validationResult.error.details.forEach(detail => {
          newErrors[detail.path[0]] = detail.message;
        });
        setErrors(newErrors);
        return;
      }

      // Clear previous errors if any
      setErrors({});

      // Submit data to API
      const response = await axios.post(`${Host}/api/v1/ecommerce/contact`, {
        message: formData.message
      },{
        headers:{
            token:token
        }
      });

    

      setFormData({
        name: '',
        email: '',
        message: ''
      });

      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message. Please try again later.');
    }
  };

  return (
    <div style={styles.container} className='container'>
        <ToastContainer/>
      <h1 style={styles.heading}>Contact Us</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.name && <span style={styles.error}>{errors.name}</span>}
        </div>
        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.email && <span style={styles.error}>{errors.email}</span>}
        </div>
        <div style={styles.formGroup}>
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            style={styles.textarea}
          />
          {errors.message && <span style={styles.error}>{errors.message}</span>}
        </div>
        <button type="submit" style={styles.button}>Send Message</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: '20px',
    textAlign: 'left',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    fontSize: '0.8rem',
  },
};

export default Contact;
