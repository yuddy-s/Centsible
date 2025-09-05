"use client";

import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

//query is used for type safety(check apptype in route.ts) and to handle hono errors
export const useGetCategories = () => {
    const query = useQuery({
        queryKey: ["categories"],
        queryFn: async() => {
            const response = await client.api.categories.$get();


            if(!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const { data } = await response.json();
            return data;
        }
    });
    return query;
}
