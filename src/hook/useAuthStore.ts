
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
            setTokens: (access_token, refresh_token) =>
                set({access_token, refresh_token}),
            clearTokens: () => set({access_token: null, refresh_token: null})
        }),
        {
            name: "iterForum-storage",
        }
    )
);