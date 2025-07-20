import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "../../../interface/IAPIResponse";
import { IGetUserDetail } from "../../../interface/Users/IGetUserDetail";
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


type UseGetUserProfileOption = Omit<UseQueryOptions<IResponse<IGetUserDetail>>, 'queryKey' | 'queryFn'>;


export const useGetUserProfile = (user_id: string, options?: UseGetUserProfileOption) => {
    return useQuery({
        queryKey: [QueryKeys.USER_PROFILE, user_id],
        queryFn: () => docApi.GetUserDetail(user_id),
        ...options,
    })
}