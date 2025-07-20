import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IGetPopular } from "../../../interface/Recommend/IGetPopular"
import { IResponse } from "../../../interface/IAPIResponse";
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


//TODO: Tìm cách tách 2 fields trending_post / trending_tags thành 2 hook khác nhau để giảm thiểu thời gian fetching

type UseGetPopularTrendingTags = Omit<UseQueryOptions<IResponse<IGetPopular>>, 'queryKey' | 'queryFn'>;


export const useGetPopular = (options?: UseGetPopularTrendingTags) => {
    return useQuery({
        queryKey: [QueryKeys.GET_TRENDING_TAGS],
        queryFn: docApi.GetPopular,
        ...options,
    })
}