import { API_BE } from "../config/configApi";
import authorizedAxiosInstance from "../services/Auth";

export const handleLogOutAPI = async () => {
    //? Trường hợp 1: Xóa localstorage User ở FE
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

export const refreshTokenAPI = async (refreshToken: string) => {
    return await authorizedAxiosInstance.put(`${API_BE}/api/v1/auth/refresh-token`, {refreshToken});
}
