import React from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useIsFetching,
  useIsMutating,
} from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { showToastErrors } from "../components/Toast_Notification/toast_error";

interface Props{
    children?: React.ReactNode;
}

function ReactQueryProvider({children}: Props){
    const queryClient = new QueryClient({
        defaultOptions:{
            queries:{
        // refetchOnWindowFocus: false,
            }
        },
        queryCache: new QueryCache({
            onError:(err) => {
                // console.log('QueryCache', err);
                showToastErrors(err);
            }
        }),
        mutationCache: new MutationCache({
            onError: (err) => {
                // console.log('mutationCache', err);
                showToastErrors(err);
            }        })
    })
    return(
        <QueryClientProvider client={queryClient}>
         <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
    );
}

export default ReactQueryProvider;
