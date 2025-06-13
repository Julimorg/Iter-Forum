
import { AuthState } from "../interface/Auth/AuthState";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

//? Sử dụng Zustand để lưu accessToken và refreshToken và local
//? Zustand chủ yếu dùng presist((set) => {...})
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            setTokens: (accessToken, refreshToken) =>
                set({accessToken, refreshToken}),
            clearTokens: () => set({accessToken: null, refreshToken: null})
        }),
        {
            name: "auth-storage",
        }
    )
);