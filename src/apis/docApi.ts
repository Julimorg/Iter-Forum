
import { LoginRequest, LoginRespsone } from "../interface/Auth/Login";
import axiosClient from "./axiosClient";


export const docApi = {
    Login: async(body: LoginRequest): Promise<LoginRespsone> => {
        const url = '/auth/login'
        const res = await axiosClient.post(url, body)
        return res.data
    }
}