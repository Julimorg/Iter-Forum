import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "../../../interface/IAPIResponse";
import { IGetTagDetail } from "../../../interface/Recommend/IGetTagDetail";
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


type UseGetTagDetail = Omit<UseQueryOptions<IResponse<IGetTagDetail>>, 'queryKey' | 'queryFn'>;



export const useGetTagDetail = (tag_id: string, options?: UseGetTagDetail) => {
    return useQuery({
        queryKey: [QueryKeys.TAG_DETAIL, tag_id],
        queryFn: () => docApi.GetTagDetails(tag_id),
        enabled: !!tag_id,
        ...options,
    })
}