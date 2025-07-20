import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "../../../interface/IAPIResponse";
import { IGetUserDetailPosts } from "../../../interface/Users/IGetUserDetail";
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";



type UserGetUserProfilePostOptions = Omit<UseQueryOptions<IResponse<IGetUserDetailPosts[]>>, 'queryKey' | 'queryFn'>;

export const userGetUserProfilePost = (user_id: string, options?:UserGetUserProfilePostOptions) => {
    return useQuery({
        queryKey: [QueryKeys.USER_PROFILE_POSTS, user_id],
        queryFn: () => docApi.GetUserDetailPosts(user_id),
        ...options,
    })
}