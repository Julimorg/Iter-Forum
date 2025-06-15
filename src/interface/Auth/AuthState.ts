export interface AuthState{
    access_token: string | null;
    refresh_token: string | null;
    setTokens: (access_token: string | null , refresh_token: string | null) => void;
    clearTokens: () => void;
}

