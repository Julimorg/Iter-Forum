export type IGetHome = {
    recommend_post: GetRecommendPostData[],
    recent_post: GetRecentPostData[],
}

export type GetRecommendPostData = {
    user_id:string,
    user_name: string,
    ava_img_path: string,
    post_id: string,
    post_title: string,
    img_url: string[],
    comments_num: string,
    upvote: string,
    downvote: string,
    tags: string[],
    date_updated: string,
}

export type GetRecentPostData = {
    user_id: string
    user_name: string
    ava_img_path: string
    post_title: string
    comments_num: number
    upvote: number
    img_url: string []
}