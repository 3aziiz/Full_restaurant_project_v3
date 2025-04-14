// Login.jsx
import React, { useState } from 'react';
import axios from '../lib/axios'; // use your axios instance
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', formData);
      dispatch(loginSuccess(response.data));
      alert('Login successful!');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <div className='w-full flex flex-col mb-2'>
        <h3 className='text-3xl font-semibold mb-2'>Login</h3>
        <p className='text-base mb-2'>Welcome Back! Please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit} className='w-full flex flex-col'>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className='input-class'
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className='input-class'
        />
        <button className='button-class'>
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
