import axios from 'axios';
import { BASE_URL } from '../constants';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // if you're using cookies/session
});

export default api;
