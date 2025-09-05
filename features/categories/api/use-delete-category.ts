"use client";
import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
        >({
            mutationFn: async () => {
                const response = await client.api.categories[":id"]["$delete"]({ 
                    param: { id },
                
                 });
                return await response.json();
            },
            onSuccess: () => {
                toast.success("Category deleted");
                queryClient.invalidateQueries({ queryKey: ["category", { id }] }); 
                queryClient.invalidateQueries({ queryKey: ["categories"] }); /*refetches all categories everytime you create a new category */
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
                queryClient.invalidateQueries({ queryKey: ["summary"] });
            },
            onError: () => {
                toast.error("Failed to delete category");
            }
        })
        return mutation;
}
