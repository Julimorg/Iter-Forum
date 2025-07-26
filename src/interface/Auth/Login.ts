export type ILoginRequest = {
  email: string;
  password: string;
};

export type ILoginResponse = {
  access_token: string;
  refresh_token: string;
  ava_img: string;
  user_id: string;
  user_name: string;
};
