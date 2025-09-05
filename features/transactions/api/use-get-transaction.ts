import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

//query is used for type safety(check apptype in route.ts) and to handle hono errors
export const useGetTransaction = (id?: string) => {
    const query = useQuery({
        enabled: !!id, /*this id only fetched if we have the id */
        queryKey: ["transaction", { id }], /*queryKey is account and object with id */
        queryFn: async() => {
            const response = await client.api.transactions[":id"].$get({
                param: { id }
            });


            if(!response.ok) {
                throw new Error("Failed to fetch transaction");
            }

            const { data } = await response.json();
            return {
                ...data,
                amount: convertAmountFromMiliunits(data.amount),
            };
        }
    });
    return query;
}
