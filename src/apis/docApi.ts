import { useAuthStore } from '../hook/useAuthStore';
import { LogOutRequest } from '../interface/Auth/ILogOut';
import { RefreshTokenResponse } from '../interface/Auth/IRefreshToken';
import { SignUpRequest } from '../interface/Auth/ISignUp';
import { ILoginRequest, ILoginResponse } from '../interface/Auth/Login';
import { IResponse } from '../interface/IAPIResponse';
import { ICreatePostRequest, ICreatePostResposne } from '../interface/Posts/ICreatePost';
import { ExploreTagsResponse } from '../interface/Recommend/IExploreTags';
import { IGetHome } from '../interface/Recommend/IGetHome';
import { IGetPopular } from '../interface/Recommend/IGetPopular';
import { IGetTagDetail } from '../interface/Recommend/IGetTagDetail';
import { SubscribedTagResponse } from '../interface/Recommend/ISubscricedTag';
import { IGetMyPost } from '../interface/Users/IGetMyPosts';
import { IGetProfile } from '../interface/Users/IGetProfile';
import { IGetUserDetail, IGetUserDetailPosts } from '../interface/Users/IGetUserDetail';
import { IUpdateProfile, IUpdateProfileResponse } from '../interface/Users/IUpdateProfile';
import axiosClient from './axiosClient';

export const docApi = {
  Login: async (body: ILoginRequest): Promise<IResponse<ILoginResponse>> => {
    try {
      const url = '/auth/login';
      const res = await axiosClient.post<IResponse<ILoginResponse>>(url, body);
      return res.data;
    } catch (error) {
      // console.log("new err: ", error);
      throw error; 
    }
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
      console.log('Bat dau refresh token nha');
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

  GetExploreTags: async (): Promise<IResponse<ExploreTagsResponse[]>> => {
    const url = '/recommend/tags';
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetHome: async (): Promise<IResponse<IGetHome>> => {
    const url = '/recommend/home';
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetMyProfile: async (): Promise<IResponse<IGetProfile>> => {
    const url = '/users/profile';
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetMyPost: async (user_id?: string): Promise<IResponse<IGetMyPost[]>> => {
    const url = `posts/user_posts/${user_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetPopular: async (): Promise<IResponse<IGetPopular>> => {
    const url = 'recommend/popular';
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetTagDetails: async (tag_id: string): Promise<IResponse<IGetTagDetail>> => {
    const url = `recommend/tags/${tag_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetUserDetail: async (user_id: string): Promise<IResponse<IGetUserDetail>> => {
    const url = `users/user-detail/${user_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetUserDetailPosts: async (user_id: string): Promise<IResponse<IGetUserDetailPosts[]>> => {
    const url = `posts/user_posts/${user_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  CreatePost: async (body: ICreatePostRequest): Promise<IResponse<ICreatePostResposne>> => {
    const url = `posts/`;
    const formData = new FormData();
    formData.append('post_title', body.post_title);
    formData.append('post_content', body.post_content);
    body.img_file.forEach((file) => {
      formData.append(`img_file`, file);
    });
    body.tags.forEach((tag) => {
      formData.append(`tags`, tag);
    });
    const res = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  UpdateProfile: async (
    body: IUpdateProfile,
    user_id: string
  ): Promise<IResponse<IUpdateProfileResponse>> => {
    const url = `users/profile/${user_id}`;
    // const formData = new FormData();
    
    // if (body.first_name !== undefined) formData.append('first_name', body.first_name);
    // if (body.last_name !== undefined) formData.append('last_name', body.last_name);
    // if (body.user_name !== undefined) formData.append('user_name', body.user_name);
    // if (body.email !== undefined) formData.append('email', body.email);
    // if (body.phone_num !== undefined) formData.append('phone_num', body.phone_num);
    // if (body.age !== undefined) formData.append('age', body.age.toString());
    // if (body.ava_img_path instanceof File) formData.append('ava_img_path', body.ava_img_path);

    // const res = await axiosClient.put(url, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });

    const res = await axiosClient.patch(url, body);
    return res.data;
  },
};
