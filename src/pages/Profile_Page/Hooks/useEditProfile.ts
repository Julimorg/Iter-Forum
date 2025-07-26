import {  useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IUpdateProfile, IUpdateProfileResponse } from "../../../interface/Users/IUpdateProfile";
import { docApi } from "../../../apis/docApi";

type UseEditProfileOption = Omit<
  UseMutationOptions<unknown, AxiosError<{ message?: string }>, IUpdateProfile, IUpdateProfileResponse>,
  "mutationFn"
>;


export const useUpdateProfile = (user_id: string, options?: UseEditProfileOption) => {
    return useMutation<unknown, AxiosError<{ message?: string }>, IUpdateProfile, IUpdateProfileResponse>({
        mutationFn: (body: IUpdateProfile) => docApi.UpdateProfile(body, user_id),
        ...options,
    })
}