import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error),
)

export default axiosInstance