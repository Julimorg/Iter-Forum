import { API_BE, Login_API } from "../config/configApi";
import authorizedAxiosInstance from "../services/Auth";

export const handleLogOutAPI = async () => {
    //? Trường hợp 1: Xóa localstorage User ở FE
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    // //? Trường hợp 2:  Dùng Http OnlyCookies -> Gọi API xử lý remove Cookies
    // return await authorizedAxiosInstance.delete(`${Login_API}/v1/users/logout`);
}

export const refreshTokenAPI = async (refreshToken: string) => {
    // return await authorizedAxiosInstance.put(`${Login_API}/v1/users/refresh_token`, {refreshToken});
    return await authorizedAxiosInstance.put(`${API_BE}/api/v1/auth/refresh-token`, {refreshToken});

}