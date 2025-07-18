import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "../../../interface/IAPIResponse";
import { IGetMyPost } from "../../../interface/Users/IGetMyPosts";
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


type UseGetMyPostOptions = Omit<UseQueryOptions<IResponse<IGetMyPost[]>,[string, string | undefined]>, 'queryKey' | 'queryFn'>;


export const useGetMyPosts = (user_id?: string, options?: UseGetMyPostOptions) => {
    return useQuery<IResponse<IGetMyPost[]>,[string, string | undefined]>({
        queryKey: [QueryKeys.GET_MY_POSTS, user_id],
        queryFn: () => docApi.GetMyPost(user_id),
        enabled: !!user_id,
        ...options

    })
}