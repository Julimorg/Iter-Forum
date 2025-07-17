export type IGetHome = {
    recommend_posts: GetRecommendPostData[],
    recent_posts: GetRecentPostData[],
}


export type GetRecommendPostData = {
    user_id:string,
    user_name: string,
    ava_img_path: string,
    post_id: string,
    post_title: string,
    post_content: string,
    img_url: string[],
    comments_num: number,
    upvote: number,
    downvote: number,
    tags: string[],
    date_updated: string,
}

export type GetRecentPostData = {
    post_id: string,
    downvote: number,
    tags: string[],
    date_updated: string,
    user_id: string
    user_name: string
    ava_img_path: string
    post_title: string
    comments_num: number
    upvote: number
    img_url: string []
}