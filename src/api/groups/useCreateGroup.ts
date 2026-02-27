import type {ApiGroup, CreateGroupPayload} from "@/types/types.ts";
import axiosInstance from "@/api/axios/axiosInstance.ts";
import {useMutation} from "@tanstack/react-query";
import type {AxiosError} from "axios";

type Request = {
    data: CreateGroupPayload
}

const createGroup = async ({data}: Request) => {
    const resp = await axiosInstance.post<ApiGroup>('/groups', data);
    return resp.data;
}

export const useCreateGroup = () => {
    return useMutation<ApiGroup, AxiosError, Request>({
        mutationFn: createGroup,
    });
}