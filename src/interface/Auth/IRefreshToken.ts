export type RefreshTokenResponse = {
  is_success: boolean;
  status_code: number;
  message: string;
  data: {
    access_token: string;
  };
  timestamp: number;
};
