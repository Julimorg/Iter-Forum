export type ExploreTagsResponse = {
    data: ExploreTagsData[] | null,
}

export type ExploreTagsData ={
    tag_id: string,
    tag_name: string,
    tag_category: string,
    num_posts: number
}