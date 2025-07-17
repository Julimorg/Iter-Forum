import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "../../../interface/IAPIResponse";
import {IGetHome } from "../../../interface/Recommend/IGetHome"
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


type UseGetHomeOptions = Omit<
  UseQueryOptions<IResponse<IGetHome>, unknown, IResponse<IGetHome>>,
  'queryKey' | 'queryFn'
>;


export const useGetRecommendPosts = (options?: UseGetHomeOptions) => {
    return useQuery({
        queryKey: [QueryKeys.GET_HOME],
        queryFn: docApi.GetHome,
        ...options
    })
}


