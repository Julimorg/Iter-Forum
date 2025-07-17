import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "../../../interface/IAPIResponse";
import { NotificationData, SubscribedTagResponse } from "../../../interface/Recommend/ISubscricedTag";
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


type UseGetSubscribedTags = Omit<
  UseQueryOptions<IResponse<SubscribedTagResponse>, NotificationData[], string[]>,
  'queryKey' | 'queryFn'
>;


export const useGetNotification = (options?: UseGetSubscribedTags) => {
    return useQuery({
        ...options,
        queryKey: [QueryKeys.NOTIFICATIONS],
        queryFn: docApi.GetSubscribedTag,
        select: (response) => response.data.notifications || [],
    })
}