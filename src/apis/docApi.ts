import { useAuthStore } from '../hook/useAuthStore';
import { LogOutRequest } from '../interface/Auth/ILogOut';
import { RefreshTokenResponse } from '../interface/Auth/IRefreshToken';
import { SignUpRequest } from '../interface/Auth/ISignUp';
import { LoginRequest, LoginRespsone } from '../interface/Auth/Login';
import { IResponse } from '../interface/IAPIResponse';
import { ExploreTagsResponse } from '../interface/Recommend/IExploreTags';
import { IGetHome } from '../interface/Recommend/IGetHome';
import { IGetPopular } from '../interface/Recommend/IGetPopular';
import { IGetTagDetail } from '../interface/Recommend/IGetTagDetail';
import { SubscribedTagResponse } from '../interface/Recommend/ISubscricedTag';
import { IGetMyPost } from '../interface/Users/IGetMyPosts';
import { IGetProfile } from '../interface/Users/IGetProfile';
import { IGetUserDetail, IGetUserDetailPosts } from '../interface/Users/IGetUserDetail';
import axiosClient from './axiosClient';


export const docApi = {
  Login: async (body: LoginRequest): Promise<LoginRespsone> => {
    const url = '/auth/login';
    const res = await axiosClient.post(url, body);
    return res.data;
  },
  LogOut: async (body: LogOutRequest): Promise<void> => {
    const url = 'auth/log-out';
    const res = await axiosClient.post(url, body);
    return res.data;
  },

  RefreshToken: async (): Promise<RefreshTokenResponse> => {
    const url = '/auth/refresh-token';
    const refreshToken = useAuthStore.getState().refresh_token;

    if (!refreshToken) {
      console.error('Không có refresh token trong store');
      throw new Error('Không có refresh token');
    }

    console.log('Gửi yêu cầu refresh token:', { url, refreshToken });

    try {
      console.log("Bat dau refresh token nha");
      const res = await axiosClient.get<RefreshTokenResponse>(url, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      console.log('Nhận response refresh token:', res.data);
      if (!res.data.is_success || !res.data.data.access_token) {
        throw new Error('Response refresh token không hợp lệ');
      }
      return res.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API refresh token:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  SignUp: async (body: SignUpRequest): Promise<void> => {
    const url = '/auth/register';
    const res = await axiosClient.post(url, body);
    return res.data;
  },

  GetSubscribedTag: async (): Promise<IResponse<SubscribedTagResponse>> => {
    const url = '/recommend';
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetExploreTags: async() : Promise<IResponse<ExploreTagsResponse[]>> => {
    const url = '/recommend/tags';
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetHome: async(): Promise<IResponse<IGetHome>> => {
    const url = '/recommend/home';
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetMyProfile: async(): Promise<IResponse<IGetProfile>> => {
    const url = '/users/profile';
    const res = await axiosClient.get(url);
    return res.data;
  },
  
  GetMyPost: async(user_id?: string): Promise<IResponse<IGetMyPost[]>> => {
    const url = `posts/user_posts/${user_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetPopular: async(): Promise<IResponse<IGetPopular>> => {
    const url = 'recommend/popular';
    const res = await axiosClient.get(url);
    return res.data;
  },
  
  GetTagDetails: async(tag_id: string): Promise<IResponse<IGetTagDetail>> => {
    const url = `recommend/tags/${tag_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetUserDetail: async(user_id: string): Promise<IResponse<IGetUserDetail>> => {
    const url = `users/user-detail/${user_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetUserDetailPosts: async(user_id: string): Promise<IResponse<IGetUserDetailPosts[]>> => {
    const url = `posts/user_posts/${user_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  }
};
