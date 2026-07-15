// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.yourdomain.com', // เปลี่ยนเป็น URL ของ Backend คุณ
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

export default axiosInstance;