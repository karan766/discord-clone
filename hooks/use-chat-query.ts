import qs from "query-string";
 import {useInfiniteQuery} from "@tanstack/react-query";

 import{useSocket} from "@/components/providers/socket-provider";

 interface ChatQueryProps{
   queryKey: string;
   apiUrl: string;
   paramKey: "channelId" | "conversationId";
   paramValue: string;
 };

 export const useChatQuery = ({queryKey, apiUrl, paramKey, paramValue}: ChatQueryProps) => {
   const {isConnected} = useSocket();

   const fetchMessages = async ({ pageParam }: { pageParam?: string | null }) => {
     const url = qs.stringifyUrl({
       url: apiUrl,
       query: {
         cursor: pageParam,
         [paramKey]: paramValue,
       },
     }, {skipNull: true});

     const res = await fetch(url);
     return res.json();
   };

   const { data, hasNextPage, isFetchingNextPage, status, fetchNextPage } =
   useInfiniteQuery({
     initialPageParam: null, // or 0 or '' depending on your pagination logic
     queryKey: [queryKey],
     refetchInterval: isConnected ? false : 1000,
     queryFn: fetchMessages,
     getNextPageParam: (lastPage) => lastPage?.nextCursor,
   });

   return {
    data,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
    
   };
 };