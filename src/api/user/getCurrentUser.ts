import type {ApiUserFull} from "@/types/types.ts";
import axiosInstance from "@/api/axios/axiosInstance.ts";
import {useQuery} from "@tanstack/react-query";
import type {AxiosError} from "axios";

const fetchCurrentUser = async () => {
    const resp = await axiosInstance.get<ApiUserFull>(`/users/me`)
    return resp.data
}

export const useCurrentUser = () => {
    return useQuery<ApiUserFull, AxiosError>({
        queryKey: ["currentUser"],
        queryFn: fetchCurrentUser,
    });
}