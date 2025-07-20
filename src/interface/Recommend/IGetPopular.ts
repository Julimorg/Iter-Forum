export type IGetPopular = {
    trending_tags: IGetTrendingTags[];
    trending_posts: IGetTrendingPosts[];
}


export type IGetTrendingTags = {
    tag_id: string;
    tag_name: string;
    tag_category: string;
    num_posts: number;
}

export type IGetTrendingPosts = {
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