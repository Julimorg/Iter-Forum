import { useAuthStore } from '../hook/useAuthStore';
import { LogOutRequest } from '../interface/Auth/ILogOut';
import { RefreshTokenResponse } from '../interface/Auth/IRefreshToken';
import { SignUpRequest } from '../interface/Auth/ISignUp';
import { LoginRequest, LoginRespsone } from '../interface/Auth/Login';
import { ExploreTagsResponse } from '../interface/IExploreTags';
import { SubscribedTag, SubscribedTagResponse } from '../interface/ISubscricedTag';
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
    const res = await axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return res.data;
  },

  SignUp: async (body: SignUpRequest): Promise<void> => {
    const url = '/auth/register';
    const res = await axiosClient.post(url, body);
    return res.data;
  },

  GetSubscribedTag: async (): Promise<SubscribedTagResponse> => {
    const url = '/recommend';
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetExploreTags: async() : Promise<ExploreTagsResponse> => {
    const url = '/recommend/tags';
    const res = await axiosClient.get(url);
    return res.data;
  }
};
