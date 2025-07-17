import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IResponse } from "../../../interface/IAPIResponse";
import {IGetHome } from "../../../interface/Recommend/IGetHome"
import { QueryKeys } from "../../../constant/query-key";
import { docApi } from "../../../apis/docApi";


type RecommendPostResponse = Pick<IGetHome, 'recommend_posts'>;
type RecentPostResponse = Pick<IGetHome, 'recent_posts'>;

type UseGetRecommendPostsOptions = Omit<
  UseQueryOptions<IResponse<RecommendPostResponse>, unknown, IResponse<RecommendPostResponse>>,
  'queryKey' | 'queryFn'
>;

type UseGetRecentPostsOptions = Omit<
  UseQueryOptions<IResponse<RecentPostResponse>, unknown, IResponse<RecentPostResponse>>,
  'queryKey' | 'queryFn'
>;

export const useGetRecommendPosts = (options?: UseGetRecommendPostsOptions) => {
    return useQuery({
        queryKey: [QueryKeys.RECOMMEND_POSTS],
        queryFn: docApi.GetHome,
        ...options
    })
}

export const useGetRecentPosts = (options?: UseGetRecentPostsOptions) => {
  return useQuery({
    queryKey: [QueryKeys.RECENT_POSTS],
    queryFn: docApi.GetHome,
    ...options,
  });
};

