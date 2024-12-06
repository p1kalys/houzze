import axios from 'axios';

const API = axios.create({
  baseURL: 'https://houzze-be.onrender.com/api',
  withCredentials: true,
});

export default API;
