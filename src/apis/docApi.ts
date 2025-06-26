
import { SignUpRequest } from "../interface/Auth/ISignUp";
import { LoginRequest, LoginRespsone } from "../interface/Auth/Login";
import { SubscribedTag } from "../interface/ISubscricedTag";
import axiosClient from "./axiosClient";


export const docApi = {


    Login: async(body: LoginRequest): Promise<LoginRespsone> => {
        const url = '/auth/login'
        const res = await axiosClient.post(url, body)
        return res.data
    },

    SignUp: async(body: SignUpRequest): Promise<void> => {
        const url = '/auth/register';
        const res = await axiosClient.post(url, body);
        return res.data;
    },
    
    GetSubscribedTag: async(): Promise<SubscribedTag[]> => {
        const url = '/recommend';
        const res = await axiosClient.get(url);
        return res.data;
    }

    
}