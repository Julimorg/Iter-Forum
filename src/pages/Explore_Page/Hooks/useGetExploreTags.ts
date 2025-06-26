import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ExploreTagsResponse } from "../../../interface/IExploreTags";
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


type UseGetExploreTagsOptions = Omit<UseQueryOptions<ExploreTagsResponse, unknown>, 'queryKey' | 'queryFn'>

export const useGetSubscribedTags = (options?: UseGetExploreTagsOptions) => {
    return useQuery ({
        ...options,
        queryKey: [QueryKeys.EXPLORE_TAGS],
        queryFn: docApi.GetExploreTags,
    })
}