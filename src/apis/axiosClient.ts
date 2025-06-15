import axios from "axios";
import { useAuthStore } from "../hook/useAuthStore";


const API_URL = process.env.API_URL;

const axiosClient = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    }    
});

//? Config timeout cho request
axiosClient.defaults.timeout = 1000 * 60 * 10;

//? Config request xuống server
axiosClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

//? Config resposne từ server
axiosClient.interceptors.response.use(
    (resposne) => resposne,
    (error) => {
        const res = error.response;

         if(typeof error?.message === "string" && error.message.includes('statu code')){
            error.message = '';
            console.log(res);
         } 

         return Promise.reject(error);
    }
)

export default axiosClient;
