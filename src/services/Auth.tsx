import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { refreshTokenAPI } from '../apis';
// import { useNavigate } from 'react-router-dom';

//? Tạo 1 đối tượng axios để custom và cấu hình cho project

const authorizedAxiosInstance = axios.create();

//? setTimout cho 1 request : 10 mins
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;


//? Can thiệp vào giữa những request API
authorizedAxiosInstance.interceptors.request.use((config) => {
    // Do something before request is sent
    // Lấy accessToken từ localStorage và đính kèm vào header
    const accessToken = localStorage.getItem('accessToken');
    // const refreshToken = localStorage.getItem('refreshToken');
    // Tại sao cần Bearer?
    // --> Nên tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng
    // --> Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền, tham khảo các loại token khác như:
    // Basic token , Digest Token, OAuth Token,...vv
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
})

//? Tạo 1 promise cho việc gọi api refresh_token
//? Tại sao? -> Mục đích là tạo 1 promise này để khi nhận yêu cầu refreshToken đầu tiên
//? hold lại việc gọi API refresh_token cho tới khi xong xuôi thì mới retry lại những api bị lỗi trước đó
//? thay vì cứ để gọi lại refresh_token leein tục tới mỗi request lỗi
let refreshTokenPromise: any = null;


//? Can thiệp vào những cái response nhận về từ API
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Lấy accessToken từ localStorage và đính kèm vào header
    // Mọi status  200 -> 299 là oke thì rơi vào đây
    if (response.status >= 200 && response.status <= 299) {
        toast.success(response.data?.message);
    }
    return response;
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Xử Lý Refresh Token tự động - Nếu BE response 401 thì logout luôn
    if (error.response?.status === 401) {
        console.log("Error 401");
        // handleLogOutAPI().then(() => {
        //     location.href = '/login';
        // })
    }
    // Xử lý nếu BE response lên 410 -> gọi api refresh Token để làm mới lại Token
    const originalRequest = error.config
    console.log("originalRequest: ", originalRequest);
    if (error.response?.status === 410 && originalRequest) {
        if (!refreshTokenPromise) {
            // Lấy refreshToken từ localStorage (cho trường hợp LocalStorage)
            const refreshToken = localStorage.getItem('refreshToken');
            // Refresh Token thành công thì gọi API refresh token để làm mới lại Token
            if (refreshToken) {
                refreshTokenPromise = refreshTokenAPI(refreshToken)
                    .then((res) => {
                        // Lấy và gán lại access token vào local
                        const { accessToken } = res.data;
                        const {refreshToken} = res.data;
                        console.log("new AccessToken: ", accessToken);
                        console.log("new refreshToken: ", refreshToken);

                        localStorage.setItem('accessToken', accessToken);
                        authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
                    })
                    .catch((_error) => {
                        // Nếu mà refresh token api bị lỗi thì cút cmm lun
                        console.log("API ERROR");
                        // handleLogOutAPI().then(() => {
                        //     location.href = '/login';
                        // })

                        return Promise.reject(_error);
                    })
                    .finally(() => {
                        // Dù API refresh token có thành công hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise về null
                        refreshTokenPromise = null;
                    })
            } else {
                console.log("Refresh token is null");
                // handleLogOutAPI().then(() => {
                //     location.href = '/login';
                // })
            }
        }
        // sau đó thì return cái refreshTokenPromise trong case success ở đây
        return refreshTokenPromise.then(() => {
            //return lại axios instance kết hợp với originalConfig
            // để gọi lại những api bị lỗi
            return authorizedAxiosInstance(originalRequest);
        })
    }

    // Mọi status ngoài 200 -> 299 là error thì rơi vào đây
    if (error.response?.status != 410) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || err?.message);
    }
    return Promise.reject(error);
})


export default authorizedAxiosInstance