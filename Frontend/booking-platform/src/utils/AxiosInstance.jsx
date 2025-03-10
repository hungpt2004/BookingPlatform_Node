import { BASE_URL } from "./Constant";
import axios from 'axios'

const axiosInstance = axios.create({
   baseURL: BASE_URL,
   timeout: 10000,
   headers: {
      "Content-Type":"application/json", //Dữ liệu gửi đi dạng JSON
   }
})

axiosInstance.interceptors.request.use(
   (config) => {
      const accessToken = sessionStorage.getItem('token');
      if(accessToken) {
         config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

export default axiosInstance;