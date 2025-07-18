export interface AuthState{
    access_token: string | null;
    refresh_token: string | null;
    ava_img: string | null;
    user_id: string | null;
    user_name: string | null;
    setTokens: (access_token: string | null , refresh_token: string | null, ava_img: string | null, user_id: string | null, user_name: string | null) => void;
    clearTokens: () => void;
}

