export type ExploreTagsResponse = {
    is_success?: string,
    status_code?: string,
    message?: string,
    data: ExploreTagsData[] | null,
    timestamp: string,
}

export type ExploreTagsData ={
    tag_id: string,
    tag_name: string,
    tag_category: string,
    num_posts: number
}