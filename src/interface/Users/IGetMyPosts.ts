export type IGetMyPost = {
    user_id: string,
    user_name: string,
    ava_img_path: string | null,
    post_id: string,
    post_title: string,
    post_content: string,
    img_url: string[],
    tags: string[],
    upvote: number,
    downvote: number,
    comments_num: number,
    date_updated: string,
}