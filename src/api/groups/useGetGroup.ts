import type {Group, GroupSummary} from "@/types/types.ts";
import axiosInstance from "@/api/axios/axiosInstance.ts";
import {useQuery} from "@tanstack/react-query";
import type {AxiosError} from "axios";

type Request = {
    id?: string
}

const fetchGroups = ({id}: Request): Promise<Group> =>
    axiosInstance.get(`/groups/${id}`).then(r => r.data);

export const useGetGroup = (req: Request) => {
    return useQuery<Group, AxiosError>({
        queryKey: ["group", req.id],
        queryFn: () =>  fetchGroups(req),
    });
}