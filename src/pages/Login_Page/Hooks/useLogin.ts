import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../hook/useAuthStore"
import { docApi } from "../../../apis/docApi";
import { LoginRequest, LoginRespsone } from "../../../interface/Auth/Login";


export const useLogin = () => {
    const setTokens = useAuthStore((state) => state.setTokens);

    return useMutation({
        mutationFn: (body: LoginRequest) => docApi.Login(body),

        onSuccess:(res: LoginRespsone) => {
            const access_token = res.data?.access_token;
            const refresh_token = res.data?.refresh_token;
            const ava_img = res.data?.ava_img;
            const user_id = res.data?.user_id;
            const user_name = res.data?.user_name;
            
            if(access_token && refresh_token){
                setTokens(access_token, refresh_token, ava_img, user_id, user_name);
                // console.log("Store Token: ", access_token, refresh_token);
            }
        }
    })
}