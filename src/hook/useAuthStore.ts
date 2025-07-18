
import { AuthState } from "../interface/Auth/AuthState";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

//? Sử dụng Zustand để lưu accessToken và refreshToken và local
//? Zustand chủ yếu dùng presist((set) => {...})
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            access_token: null,
            refresh_token: null,
            ava_img: null,
            user_id: null,
            user_name: null,
            setTokens: (access_token, refresh_token, ava_img, user_id, user_name) =>
                set({access_token, refresh_token, ava_img, user_id, user_name}),
            clearTokens: () => set({access_token: null, refresh_token: null, ava_img: null, user_id: null, user_name: null})
        }),
        {
            name: "iterForum-storage",
        }
    )
);