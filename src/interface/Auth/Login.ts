export interface LoginRequest{
    email: string;
    password: string;
}

export interface LoginRespsone{
    data: {
        access_token: string,
        refresh_token: string,
        ava_img: string,
        user_id: string,
        user_name: string,
    }
}  
