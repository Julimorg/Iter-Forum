export interface AuthState{
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (accessToken: string | null , refreshToken: string | null) => void;
    clearTokens: () => void;
}

