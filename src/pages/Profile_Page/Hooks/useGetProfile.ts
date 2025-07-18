import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { IResponse } from "../../../interface/IAPIResponse"
import { IGetProfile } from "../../../interface/Users/IGetProfile"
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


type GetProfileOptions =  Omit<UseQueryOptions<IResponse<IGetProfile>, unknown>, 'queryKey' | 'queryFn'>;

export const useGetProfile = (options?: GetProfileOptions) => {
    return useQuery({
        queryKey: [QueryKeys.GET_PROFILE],
        queryFn: docApi.GetMyProfile,
        ...options,
    })
}