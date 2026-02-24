import type {GroupSummary} from "@/types/types.ts";
import axiosInstance from "@/api/axios/axiosInstance.ts";
import {useQuery} from "@tanstack/react-query";


const fetchGroups = (): Promise<GroupSummary[]> =>
    axiosInstance.get("/groups").then(r => r.data);

export const useGetGroups = () => {
    return useQuery<GroupSummary[]>({
        queryKey: ["groups"],
        queryFn: fetchGroups,
    });
}