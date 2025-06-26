import axios from 'axios';
import { useAuthStore } from '../hook/useAuthStore';

import { docApi } from './docApi';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

//? Config timeout cho request
axiosClient.defaults.timeout = 1000 * 60 * 10;

//? Tạo 1 promise cho việc gọi api refresh_token
//? Tại sao? -> Mục đích là tạo 1 promise này để khi nhận yêu cầu refreshToken đầu tiên
//? hold lại việc gọi API refresh_token cho tới khi xong xuôi thì mới retry lại những api bị lỗi trước đó
//? thay vì cứ để gọi lại refresh_token leein tục tới mỗi request lỗi
let refreshTokenPromise: Promise<any> | null = null;

//? Config request xuống server
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().access_token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//? Config resposne từ server
axiosClient.interceptors.response.use(
  (resposne) => resposne,
  (error) => {
    // const res = error.response;

    // if (typeof error?.message === 'string' && error.message.includes('status code')) {
    //   error.message = '';
    //   console.log(res);
    // }
    // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      //   console.log('Error 401: Unauthorized');
      //   useAuthStore.getState().logout(); // Gọi hàm logout từ store
      //   window.location.href = '/login';
      //   return Promise.reject(error);
      useAuthStore.getState().clearTokens();
      window.location.href = '/login';
      console.log('expire Token');
    }

    //? Handle 410 Status - RefreshToken Module
    const originalRequest = error.config;
    console.log('originalRequest: ', originalRequest);

    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        const refreshToken = useAuthStore.getState().refresh_token;

        if (refreshToken) {
          refreshTokenPromise = docApi
            .RefreshToken()
            .then((res) => {
              const { access_token } = res.data;

              const refresh_token = useAuthStore.getState().refresh_token;

              //?Update AccessToken-RefreshToken
              useAuthStore.getState().setTokens(access_token, refresh_token);

              //?Update header
              axiosClient.defaults.headers.Authorization = `Bearer ${access_token}`;

              toast.success('Update Access Token');
            })
            .catch((err) => {
              console.log('Refresh token error:', err);
              useAuthStore.getState().clearTokens();
              window.location.href = '/login';
              return Promise.reject(err);
            });
        } else {
          console.log('No refresh token available');
          useAuthStore.getState().clearTokens();
          window.location.href = '/login';
          return Promise.reject(new Error('No refresh token'));
        }
      }

      //? Chờ refresh token hoàn thành và retry request gốc
      return refreshTokenPromise.then(() => {
        return axiosClient(originalRequest);
      });
    }

    // const err = error as AxiosError<{ message: string }>;
    // const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
    // toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default axiosClient;
