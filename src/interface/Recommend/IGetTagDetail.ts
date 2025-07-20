export type IGetTagDetail = {
        tag_id: string,
        tag_name: string,
        tag_category: string,
        tag_description: string,
        num_posts: number,
        is_subscribed: boolean,
        recommend_posts: RecommendPostDetail[] | undefined
}

export type RecommendPostDetail = {
    user_id: string;
    user_name: string;
    ava_img_path: string;
    post_id: string;
    post_title:string;
    post_content: string;
    img_url: string[];
    data_updated: string;
    upvote: number;
    downvote: number;
    comments_num: number;
    tags: string[]
}