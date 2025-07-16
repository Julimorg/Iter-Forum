import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {SubscribedTag, SubscribedTagResponse } from '../../../interface/Recommend/ISubscricedTag';
import { QueryKeys } from '../../../constant/query-key';
import { docApi } from '../../../apis/docApi';
import { IResponse } from '../../../interface/IAPIResponse';

type UseGetSubscribedTags = Omit<
  UseQueryOptions<IResponse<SubscribedTagResponse>, SubscribedTag[], string[]>,
  'queryKey' | 'queryFn'
>;

export const useGetSubscribedTags = (options?: UseGetSubscribedTags) => {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.SUBSCRIBED_TAGS],
    queryFn: docApi.GetSubscribedTag ,
    select: (response) => response.data.subscribed_tags || [],
  });
};
