import type {ApiExpense, CreateExpensePayload} from "@/types/types.ts";
import axiosInstance from "@/api/axios/axiosInstance.ts";
import {useMutation} from "@tanstack/react-query";
import type {AxiosError} from "axios";
import {queryClient} from "@/main.tsx";

type Request = {
    idGroup: string
    data: CreateExpensePayload
}

const createExpenses = async ({data, idGroup}: Request) => {
    const resp = await axiosInstance.post<ApiExpense>(`/groups/${idGroup}/expenses`, data);
    return resp.data;
}

export const useCreateExpenses = () => {
    return useMutation<ApiExpense, AxiosError, Request>({
        mutationFn: createExpenses,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['group']})
        }
    });
}