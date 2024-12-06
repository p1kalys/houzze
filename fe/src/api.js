import axios from 'axios';

const API = axios.create({
  baseURL: 'https://houzze.vercel.app/api',
  withCredentials: true,
});

export default API;
