import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

//? Tạo 1 đối tượng axios để custom và cấu hình cho project

const  authorizedAxiosInstance = axios.create();

//? setTimout cho 1 request : 10 mins
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

//? withCredentials: Sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE
//? Phục vụ trong trường hợp nếu ta sử dụng JWT Tokens(refresh và access token) theo cơ chế httpOnly Cookies
 authorizedAxiosInstance.defaults.withCredentials = true;



//? Sử dụng anxios interceptor

// Can thiệp vào giữa những request API
authorizedAxiosInstance.interceptors.request.use((config) => {
    // Do something before request is sent
    // Lấy accessToken từ localStorage và đính kèm vào header
    const accessToken = localStorage.getItem('accessToken');
    // Tại sao cần Bearer?
    // --> Nên tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng
    // --> Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền, tham khảo các loại token khác như:
    // Basic token , Digest Token, OAuth Token,...vv
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
})

// Can thiệp vào những cái response nhận về từ API
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Lấy accessToken từ localStorage và đính kèm vào header
    // Mọi status  200 -> 299 là oke thì rơi vào đây
    if(response.status >= 200 && response.status <= 299) {
        toast.success(response.data?.message);
    }
    return response;
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Mọi status ngoài 200 -> 299 là error thì rơi vào đây
    if (error.response?.status != 410) {
         const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || err?.message);
    }
    return Promise.reject(error);
})


export default authorizedAxiosInstance