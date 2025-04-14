import React, { useState } from 'react';
import { useRegisterMutation } from '../features/api/apiSlice';
import { useDispatch } from 'react-redux';
import { showLogin } from '../../slices/authSlice';
const RegisterPage = () => {
  const dispatch=useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData).unwrap();
      dispatch(showLogin(true));
      console.log('Register success:', res);
    } catch (err) {
      console.error('Error during register:', err);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <button type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : 'Register'}</button>
    </form>
  );
};

export default RegisterPage;
