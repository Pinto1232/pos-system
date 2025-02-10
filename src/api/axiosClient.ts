import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true, 
});


axiosClient.interceptors.request.use(
  (config) => {
     // store the token in localStorage once authenticated
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
