import type {Group} from "@/types/types.ts";
import axiosInstance from "@/api/axios/axiosInstance.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import type {AxiosError} from "axios";


type Request = {
    id?: string
}

const fetchGroups = ({id}: Request): Promise<Group> =>
    axiosInstance.get(`/groups/${id}`).then(r => r.data);

export const useGetGroup = (req: Request) => {
    return useMutation<JumpResponseData, AxiosError, Request>({
        mutationFn: jumpToPlanet,
    });
}