
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

//query is used for type safety(check apptype in route.ts) and to handle hono errors
export const useGetAccounts = () => {
    const query = useQuery({
        queryKey: ["accounts"],
        queryFn: async() => {
            const response = await client.api.accounts.$get();


            if(!response.ok) {
                throw new Error("Failed to fetch accounts");
            }

            const { data } = await response.json();
            return data;
        }
    });
    return query;
}
