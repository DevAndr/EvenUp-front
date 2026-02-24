import type {ApiGroup} from "@/types/types.ts";
import axiosInstance from "@/api/axios/axiosInstance.ts";
import {useQuery} from "@tanstack/react-query";
import type {AxiosError} from "axios";

type Request = {
    id?: string
}

const fetchGroups = ({id}: Request): Promise<ApiGroup> =>
    axiosInstance.get(`/groups/${id}`).then(r => r.data);

export const useGetGroup = (req: Request) => {
    return useQuery<ApiGroup, AxiosError>({
        queryKey: ["group", req.id],
        queryFn: () =>  fetchGroups(req),
    });
}