"use client";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

//query is used for type safety(check apptype in route.ts) and to handle hono errors
export const useGetCategory = (id?: string) => {
    const query = useQuery({
        enabled: !!id, /*this id only fetched if we have the id */
        queryKey: ["category", { id }], /*queryKey is category and object with id */
        queryFn: async() => {
            const response = await client.api.categories[":id"].$get({
                param: { id }
            });


            if(!response.ok) {
                throw new Error("Failed to fetch category");
            }

            const { data } = await response.json();
            return data;
        }
    });
    return query;
}
