import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const api = axios.create({
  baseURL: process.env.API_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;