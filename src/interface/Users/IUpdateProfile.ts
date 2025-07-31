export type IUpdateProfile = {
  user_name?: string ;
  email?: string;
  avatar?: File | null;
  phone_num?: string;
  age?: number;
  first_name?: string | undefined;
  last_name?: string;
};

export type IUpdateProfileResponse = {
  user_name?: string | null;
  email?: string | null;
  ava_img_path?: string | null;
  phone_num?: string | null;
  age?: number | null;
  first_name?: string | null;
  last_name?: string | null;
};
