export type ICreatePostRequest = {
    post_title: string;
    post_content: string;
    img_file: File[];
    tags: string[];
}


export type ICreatePostResposne = {
    user_id: string;
    user_name: string;
    ava_img_path: string;
    tags: string[];
    post_id: string;
    post_title: string;
    post_content: string;
    img_url: string[];
    date_updated: string;
    status: string;
}