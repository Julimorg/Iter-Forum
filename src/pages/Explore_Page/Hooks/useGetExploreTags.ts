import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ExploreTagsResponse } from "../../../interface/Recommend/IExploreTags";
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";
import { IResponse } from "../../../interface/IAPIResponse";


type UseGetExploreTagsOptions = Omit<UseQueryOptions<IResponse<ExploreTagsResponse>, unknown>, 'queryKey' | 'queryFn'>

export const useGetSubscribedTags = (options?: UseGetExploreTagsOptions) => {
    return useQuery ({
        ...options,
        queryKey: [QueryKeys.EXPLORE_TAGS],
        queryFn: docApi.GetExploreTags,
    })
}