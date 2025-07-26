export type IGetUserDetail = {
    user_id: string;
    user_name: string;
    age: string;
    ava_img_path: string;
    phone_num: string;
    email: string;
    first_name: string;
    last_name: string;
    status: string;
}


export type IGetUserDetailPosts = {
    user_id: string,
    user_name: string,
    post_id: string,
    ava_img_path: null,
    post_content: string,
    post_title: string,
    upvote: number,
    img_url: string[],
    comments_num: number
    downvote: number,
    date_updated: string;
}