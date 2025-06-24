import { useMutation, UseMutationOptions,  } from "@tanstack/react-query";
import { docApi } from "../../../apis/docApi";
import { SignUpRequest } from "../../../interface/Auth/ISignUp";
import { AxiosError } from "axios";

type UseSignUpOptions = Omit<UseMutationOptions<unknown, AxiosError<{message?: string}>, SignUpRequest>, "mutationFn">;



export const useSignUp = (option?: UseSignUpOptions) => {
    return useMutation<unknown, AxiosError<{ message?: string }>, SignUpRequest>({
    mutationFn: (body: SignUpRequest) => docApi.SignUp(body),
    ...option,
  });
}