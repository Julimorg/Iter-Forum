import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../hook/useAuthStore';
import { docApi } from '../../../apis/docApi';
import { ILoginRequest, ILoginResponse } from '../../../interface/Auth/Login';
import { IResponse } from '../../../interface/IAPIResponse';
import { AxiosError } from 'axios';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (body: ILoginRequest) => docApi.Login(body),

    onSuccess: (res: IResponse<ILoginResponse>) => {
      const access_token = res.data?.access_token;
      const refresh_token = res.data?.refresh_token;
      const ava_img = res.data?.ava_img;
      const user_id = res.data?.user_id;
      const user_name = res.data?.user_name;

      if (access_token && refresh_token) {
        setTokens(access_token, refresh_token, ava_img, user_id, user_name);
        // console.log("Store Token: ", access_token, refresh_token);
      }
    },
    onError: (error: AxiosError<IResponse<ILoginResponse>>) => {
    
      const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng nhập!';
      console.log("errr: ", errorMessage)
      throw new Error(errorMessage);
    },
  });
};
