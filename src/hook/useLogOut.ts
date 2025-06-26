import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { LogOutRequest } from "../interface/Auth/ILogOut";
import { AxiosError } from "axios";
import { docApi } from "../apis/docApi";


type UseLogOutOptions = Omit<UseMutationOptions<unknown, AxiosError<{ message?: string }>, LogOutRequest>, "mutationFn">;



export const useLogOut = (options?: UseLogOutOptions) => {
    return useMutation<unknown, AxiosError<{ message?: string }>, LogOutRequest>({
        ...options,
        mutationFn: (body: LogOutRequest) => docApi.LogOut(body),
    })
}