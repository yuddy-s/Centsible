"use client"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

//query is used for type safety(check apptype in route.ts) and to handle hono errors
export const useGetTransactions = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";


    const query = useQuery({
        //check if params needed in key
        queryKey: ["transactions", { from, to, accountId }],
        queryFn: async() => {
            const response = await client.api.transactions.$get({
                query: {
                    from,
                    to,
                    accountId
                }
            });


            if(!response.ok) {
                throw new Error("Failed to fetch accounts");
            }

            const { data } = await response.json();
            return data.map((transaction) => ({
                ...transaction,
                amount: convertAmountFromMiliunits(transaction.amount),
            }));
        }
    });
    return query;
}
