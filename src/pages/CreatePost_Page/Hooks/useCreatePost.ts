import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "../../../apis/docApi";
import { AxiosError } from "axios";
import { ICreatePostRequest } from "../../../interface/Posts/ICreatePost";

type UseCreatePostOptions = Omit<
  UseMutationOptions<unknown, AxiosError<{ message?: string }>, ICreatePostRequest>,
  "mutationFn"
>;

export const useCreatePost = (options?: UseCreatePostOptions) => {
  return useMutation<unknown, AxiosError<{ message?: string }>, ICreatePostRequest>({
    mutationFn: (body: ICreatePostRequest) => docApi.CreatePost(body),
    ...options,
  });
};